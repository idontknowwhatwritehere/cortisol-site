'use strict';
// Замените на утверждённое название проекта. Текст title и метатеги — в index.html.
const PROJECT_NAME = 'Название проекта';
// ВАЖНО: укажите реальный email Виктории. Пока строка пустая, отправка отключена.
const CONTACT_EMAIL = '';

document.querySelectorAll('[data-project-name]').forEach(el => { el.textContent = PROJECT_NAME; });
document.title = `${PROJECT_NAME} — кортизол в слюне`;
document.querySelector('#year').textContent = new Date().getFullYear();
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const validContact = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(CONTACT_EMAIL);
form.querySelector('button').disabled = !validContact;
if (validContact) {
  document.querySelectorAll('[data-contact]').forEach(el => { const link = document.createElement('a'); link.href = `mailto:${CONTACT_EMAIL}`; link.textContent = CONTACT_EMAIL; el.replaceChildren(link); });
  status.textContent = '';
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validContact) { status.textContent = 'Email ещё не настроен. Подготовка письма недоступна.'; return; }
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = `Имя: ${data.get('name')}\nEmail для ответа: ${data.get('email')}\n\n${data.get('message')}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Обращение с сайта ${PROJECT_NAME}`)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Запрошено открытие почтового приложения. Проверьте письмо и отправьте его самостоятельно. Если приложение не открылось, воспользуйтесь контактным email.';
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
  document.querySelectorAll('.steps li, .technology-panel, .benefit-list li').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
}
