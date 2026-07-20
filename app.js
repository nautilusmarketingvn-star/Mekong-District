const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');

const assetHost = 'https://mekong-district-long-xuyen-land.nautilusmarketingvn.chatgpt.site/';
document.querySelectorAll('img[src^="assets/"]').forEach((image) => {
  image.src = assetHost + image.getAttribute('src').replace('assets/', '');
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  status.className = 'ok';
  status.textContent = 'Cảm ơn bạn! Thông tin đã được ghi nhận. Đội ngũ Long Xuyên Land sẽ sớm liên hệ.';
  form.reset();
});
