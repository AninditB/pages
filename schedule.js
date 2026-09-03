// Set this to your Cal.com event link (e.g. 'your-username/intro-call') to go live.
const CAL_LINK = '';

function loadCalEmbed(calLink) {
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  window.Cal('init', { origin: 'https://cal.com' });
  window.Cal('inline', {
    elementOrSelector: '#cal-embed',
    calLink,
    config: { layout: 'month_view', theme: 'auto' }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const isDark = localStorage.getItem('theme') === 'dark';

  if (isDark) {
    document.body.classList.add('dark-mode');
    toggle.textContent = '🌞';
    toggle.setAttribute('aria-label', 'Switch to light mode');
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkNow = document.body.classList.contains('dark-mode');
    toggle.textContent = isDarkNow ? '🌞' : '🌙';
    toggle.setAttribute('aria-label', isDarkNow ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
  });

  if (CAL_LINK) {
    loadCalEmbed(CAL_LINK);
  } else {
    document.getElementById('cal-embed').innerHTML =
      '<p class="schedule-placeholder">Scheduling isn\'t set up yet — add a Cal.com event link to <code>CAL_LINK</code> in schedule.js to enable booking here.</p>';
  }
});
