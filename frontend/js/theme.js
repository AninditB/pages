// Theme toggle — default is light, .dark-mode is the alternate. Shared across all pages
// via the same localStorage key so the preference persists site-wide.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const isDark = localStorage.getItem('theme') === 'dark';

  if (isDark) {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  }

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', toggle.checked);
    localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
  });
});
