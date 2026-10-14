// Mobile nav toggle — shared across all pages. Escape and the focus trap are bound only
// while the menu is open.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  function openMenu() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    panel.querySelector('a')?.focus();
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick);
  }
  function closeMenu({ restoreFocus = true } = {}) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutsideClick);
    if (restoreFocus) toggle.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    trapTabKey(e, panel);
  }
  function onOutsideClick(e) {
    if (!panel.contains(e.target) && e.target !== toggle) closeMenu({ restoreFocus: false });
  }

  toggle.addEventListener('click', () => panel.hidden ? openMenu() : closeMenu());
  panel.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeMenu({ restoreFocus: false }); });
});
