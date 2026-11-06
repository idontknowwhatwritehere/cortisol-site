(()=>{let t;try{t=localStorage.getItem('rapid-theme')}catch(_){}document.documentElement.dataset.theme=['light','dark'].includes(t)?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')})();

// При перезагрузке начинаем с верха, сохраняя переходы по прямым ссылкам.
(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!navigation || navigation.type !== 'reload') return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  window.addEventListener('pageshow', () => {
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, { once: true });
})();
