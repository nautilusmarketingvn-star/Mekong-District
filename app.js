const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');
const submitButton = form?.querySelector('button[type="submit"]');
const leadEndpoint = 'https://script.google.com/macros/s/AKfycbw2erIk2a1-NCT-ktCryBxw0UryOmVjB-RnWKeXUiiJHc01ngdNUG2g7kKHfM_AM1H6/exec';

const assetHost = 'https://mekong-district-long-xuyen-land.nautilusmarketingvn.chatgpt.site/';
document.querySelectorAll('img[src^="assets/"]').forEach((image) => {
  image.src = assetHost + image.getAttribute('src').replace('assets/', '');
});

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
    await fetch(leadEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...data, source: 'Landing page' })
    });
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
