// Theme toggle — default is light, html.dark-mode is the alternate. Shared across all pages
// via the same localStorage key so the preference persists site-wide. The class is applied
// to <html> early by an inline script in each page's <head> (see the head-theme block in
// scripts/shell.template.html) so dark pages don't flash light on load.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const root = document.documentElement;
  toggle.checked = root.classList.contains('dark-mode');

  toggle.addEventListener('change', () => {
    root.classList.toggle('dark-mode', toggle.checked);
    try {
      localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
    } catch (err) {
      // Storage can be blocked (private mode); the toggle still works for this page view.
    }
  });
});
