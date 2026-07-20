const ALLOWED_ORIGIN = 'https://nautilusmarketingvn-star.github.io';
const ALLOWED_NEEDS = new Set([
  'Nhận bảng giá & chính sách',
  'Tư vấn đầu tư',
  'Tìm hiểu để an cư',
  'Đặt lịch tham quan dự án'
]);

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(body, status, origin = ALLOWED_ORIGIN) {
  return Response.json(body, { status, headers: cors(origin) });
}

function clean(value, maxLength) {
  return String(value ?? '').trim().slice(0, maxLength);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true, service: 'mekong-district-leads' }, 200);
    }

    if (origin !== ALLOWED_ORIGIN) {
      return json({ ok: false, message: 'Origin not allowed' }, 403);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST' || url.pathname !== '/lead') {
      return json({ ok: false, message: 'Not found' }, 404, origin);
    }

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > 8192) {
      return json({ ok: false, message: 'Payload too large' }, 413, origin);
    }

    let raw;
    try {
      raw = await request.json();
    } catch {
      return json({ ok: false, message: 'Invalid JSON' }, 400, origin);
    }

    if (clean(raw.website, 200)) {
      return json({ ok: true }, 200, origin);
    }

    const lead = {
      name: clean(raw.name, 100),
      phone: clean(raw.phone, 20).replace(/[\s.-]/g, ''),
      email: clean(raw.email, 160).toLowerCase(),
      need: clean(raw.need, 100),
      source: 'Landing page'
    };

    if (lead.name.length < 2 || !/^\+?\d{9,15}$/.test(lead.phone)) {
      return json({ ok: false, message: 'Thông tin chưa hợp lệ' }, 400, origin);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) || !ALLOWED_NEEDS.has(lead.need)) {
      return json({ ok: false, message: 'Thông tin chưa hợp lệ' }, 400, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rate = await env.LEAD_RATE_LIMITER.limit({ key: `${ip}:${lead.phone}` });
    if (!rate.success) {
      return json({ ok: false, message: 'Bạn đã gửi quá nhanh. Vui lòng thử lại sau.' }, 429, origin);
    }

    const upstream = await fetch(env.SHEETS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(lead)
    });

    if (!upstream.ok) {
      return json({ ok: false, message: 'Không thể lưu thông tin' }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  }
};
