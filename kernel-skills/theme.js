(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { preference = localStorage.getItem('kernel-skills-theme'); } catch {}
  if (!['light', 'dark'].includes(preference)) preference = null;
  function apply(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    button.textContent = dark ? '浅色' : '深色';
    button.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
    button.setAttribute('aria-pressed', String(dark));
    button.title = dark ? '切换到浅色模式' : '切换到深色模式';
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  button.addEventListener('click', () => {
    preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('kernel-skills-theme', preference); } catch {}
    apply(preference);
  });
  system.addEventListener('change', event => {
    if (!preference) apply(event.matches ? 'dark' : 'light');
  });
})();
