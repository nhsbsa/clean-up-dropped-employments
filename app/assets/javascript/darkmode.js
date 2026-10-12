function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    return;
  }

  const setTheme = function (theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggle.querySelector('.theme-toggle__label').textContent =
      theme === 'dark' ? 'Light mode' : 'Dark mode';
    themeToggle.querySelector('.theme-toggle__indicator').textContent =
      theme === 'dark' ? '☀' : '◐';

    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      // The theme still applies for this page when storage is unavailable.
    }
  };

  setTheme(document.documentElement.dataset.theme || 'light');
  themeToggle.addEventListener('click', function () {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
}

initThemeToggle();