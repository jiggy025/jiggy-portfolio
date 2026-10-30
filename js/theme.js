/**
 * Light and dark mode.
 *
 * The page follows the visitor's device setting (prefers-color-scheme in tokens.css) until they press
 * the Dark mode key in the nav. Their choice is then kept in this browser (localStorage) and set as
 * data-theme on <html>, which tokens.css reads. The inline script in <head> applies a saved choice
 * before the first paint, so a returning visitor never sees the wrong colours flash.
 *
 * Other scripts (the hero field) listen for the 'themechange' event to pick up the new colours.
 */
(() => {
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  // The browser bar colour, one per mode (the paper token as hex, since not every browser reads oklch here)
  const BAR = { light: '#f7f9fc', dark: '#0f1218' };

  // An explicit choice wins; otherwise the device decides
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : media.matches);

  const sync = () => {
    const dark = isDark();
    if (button) button.setAttribute('aria-pressed', String(dark));
    if (root.dataset.theme) metas.forEach((m) => m.setAttribute('content', BAR[root.dataset.theme]));
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
  };

  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Storage blocked (private mode): the choice still applies until the page closes
      }
      sync();
    });
  }

  // The device switching modes only matters while the visitor has not chosen
  media.addEventListener('change', () => {
    if (!root.dataset.theme) sync();
  });

  sync();
})();
