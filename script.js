'use strict';
// Название продукта и контакт команды.
const PROJECT_NAME = 'Rapid Cortisol';
// Текущий контактный адрес проекта.
const CONTACT_EMAIL = 'varombaeva@mail.ru';

document.querySelectorAll('[data-project-name]').forEach(el => { el.textContent = PROJECT_NAME; });
document.title = `${PROJECT_NAME} для определения кортизола в слюне`;
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
form.elements.message.addEventListener('input', () => form.elements.message.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validContact) { status.textContent = 'Email ещё не настроен. Подготовка письма недоступна.'; return; }
  if (!form.reportValidity()) return;
  const message = form.elements.message;
  if (!message.value.trim()) { message.setCustomValidity('Введите сообщение.'); message.reportValidity(); return; }
  const data = new FormData(form);
  const body = `Имя: ${data.get('name')}\nEmail для ответа: ${data.get('email')}\n\n${data.get('message')}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Обращение с сайта ${PROJECT_NAME}`)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Запрошено открытие почтового приложения. Проверьте письмо и отправьте его самостоятельно. Если приложение не открылось, воспользуйтесь контактным email.';
});
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  const blocks = document.querySelectorAll('.hero-copy, .hero-art, .section-heading, #product .product-layout, .steps li, .technology-panel, .specs, .research-note, .benefits > div, .benefit-list li, .analyzer-layout > div, #support > .eyebrow, #support > h2, .grant-text, .official-logo, .contact-layout > div, #contact-form');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0 });
  function configureMotion() {
    observer.disconnect();
    blocks.forEach(el => {
      el.classList.remove('reveal-ready', 'visible');
      if (!motionPreference.matches) {
        el.classList.add('reveal-ready');
        observer.observe(el);
      }
    });
  }
  configureMotion();
  motionPreference.addEventListener('change', configureMotion);
}

// Тема сохраняется только в браузере посетителя. Без доступа к хранилищу переключение также работает.
const themeToggle = document.querySelector('.theme-toggle');
const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
let themeSelected = false;
try { themeSelected = ['dark', 'light'].includes(localStorage.getItem('rapid-theme')); } catch (_) {}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('.brand-logo').forEach(logo => { logo.src = theme === 'dark' ? 'assets/project-logo-dark.svg?v=17' : 'assets/project-logo.svg?v=17'; });
  const dark = theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
  themeToggle.querySelector('.theme-label').textContent = dark ? 'Светлая тема' : 'Тёмная тема';
  themeToggle.querySelector('.theme-icon').textContent = dark ? '☀' : '◐';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#101b27' : '#f8fbfa';
}
applyTheme(document.documentElement.dataset.theme || (themePreference.matches ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  themeSelected = true;
  applyTheme(next);
  try { localStorage.setItem('rapid-theme', next); } catch (_) {}
});
themePreference.addEventListener('change', event => { if (!themeSelected) applyTheme(event.matches ? 'dark' : 'light'); });

// Концепция компонентов: последовательная смена и ручное управление.
const productGallery = document.querySelector('.product-gallery');
if (productGallery) {
  const slides = Array.from(productGallery.querySelectorAll('.gallery-slide'));
  const dots = Array.from(productGallery.querySelectorAll('.gallery-dots button'));
  const playback = productGallery.querySelector('.gallery-playback');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0;
  let paused = reduceMotion.matches;
  let timer;
  function showProductSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = false;
      slide.classList.toggle('is-active', i === currentSlide);
      slide.setAttribute('aria-hidden', String(i !== currentSlide));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === currentSlide)));
    productGallery.querySelector('.gallery-status').textContent = `${currentSlide + 1} / ${slides.length} · ${slides[currentSlide].querySelector('strong').textContent}`;
  }
  function scheduleSlides() {
    clearInterval(timer);
    const stopped = paused || document.hidden;
    productGallery.querySelector('.gallery-status').setAttribute('aria-live', stopped ? 'polite' : 'off');
    if (!stopped) timer = setInterval(() => showProductSlide(currentSlide + 1), 5000);
    playback.textContent = paused ? 'Продолжить' : 'Пауза';
    playback.setAttribute('aria-label', paused ? 'Продолжить смену слайдов' : 'Приостановить смену слайдов');
  }
  function chooseSlide(index) { showProductSlide(index); scheduleSlides(); }
  productGallery.querySelector('.gallery-prev').addEventListener('click', () => chooseSlide(currentSlide - 1));
  productGallery.querySelector('.gallery-next').addEventListener('click', () => chooseSlide(currentSlide + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => chooseSlide(i)));
  playback.addEventListener('click', () => { paused = !paused; scheduleSlides(); });
  productGallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); chooseSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  document.addEventListener('visibilitychange', scheduleSlides);
  reduceMotion.addEventListener('change', () => { paused = reduceMotion.matches; scheduleSlides(); });
  showProductSlide(0);
  scheduleSlides();
}

// Подсветка раздела, который сейчас читает посетитель.
const sectionLinks = Array.from(navigation.querySelectorAll('a[href^="#"]'));
const pageSections = Array.from(document.querySelectorAll('main > section[id]'));
let navigationFrame = false;
function updateCurrentSection() {
  navigationFrame = false;
  const readingLine = document.querySelector('.header').getBoundingClientRect().height + 80;
  let activeId = '';
  pageSections.forEach(section => {
    if (section.getBoundingClientRect().top <= readingLine) activeId = section.id;
  });
  sectionLinks.forEach(link => {
    if (link.getAttribute('href') === `#${activeId}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleNavigationUpdate() {
  if (!navigationFrame) { navigationFrame = true; requestAnimationFrame(updateCurrentSection); }
}
window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleNavigationUpdate);
window.addEventListener('pageshow', scheduleNavigationUpdate);
updateCurrentSection();

// Точная высота первого экрана с учётом реальной высоты шапки.
const siteHeader = document.querySelector('.header');
function syncHeaderHeight() {
  document.documentElement.style.setProperty('--header-height', `${siteHeader.getBoundingClientRect().height}px`);
}
syncHeaderHeight();
if ('ResizeObserver' in window) new ResizeObserver(syncHeaderHeight).observe(siteHeader);
else window.addEventListener('resize', syncHeaderHeight);

const demoToggle = document.querySelector('.demo-toggle');
if (demoToggle) demoToggle.addEventListener('click', () => {
  const demo = demoToggle.closest('.app-demo');
  const paused = demo.dataset.paused !== 'true';
  demo.dataset.paused = String(paused);
  demoToggle.setAttribute('aria-pressed', String(paused));
  demoToggle.textContent = paused ? 'Продолжить' : 'Пауза';
});
