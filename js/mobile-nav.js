// Mobile nav toggle — shared across all pages
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
    if (e.key !== 'Tab') return;
    const focusable = panel.querySelectorAll('a[href]');
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function onOutsideClick(e) {
    if (!panel.contains(e.target) && e.target !== toggle) closeMenu({ restoreFocus: false });
  }

  toggle.addEventListener('click', () => panel.hidden ? openMenu() : closeMenu());
  panel.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeMenu({ restoreFocus: false }); });
});
