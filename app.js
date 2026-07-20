const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');
const submitButton = form?.querySelector('button[type="submit"]');
const leadEndpoint = 'https://mekong-district-leads.nautilusmarketingvn.workers.dev/lead';

if (form) {
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.tabIndex = -1;
  honeypot.autocomplete = 'off';
  honeypot.setAttribute('aria-hidden', 'true');
  honeypot.style.position = 'absolute';
  honeypot.style.left = '-10000px';
  form.append(honeypot);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  status.className = '';
  status.textContent = 'Đang gửi thông tin…';
  submitButton.disabled = true;

  try {
    const response = await fetch(leadEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, source: 'Landing page' })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || 'Request failed');
    status.className = 'ok';
    status.textContent = 'Cảm ơn bạn! Thông tin đã được ghi nhận. Đội ngũ Long Xuyên Land sẽ sớm liên hệ.';
    form.reset();
  } catch (error) {
    status.className = 'error';
    status.textContent = 'Chưa thể gửi thông tin. Vui lòng thử lại hoặc liên hệ trực tiếp với Long Xuyên Land.';
  } finally {
    submitButton.disabled = false;
  }
});
