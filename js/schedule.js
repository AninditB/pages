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
  if (CAL_LINK) {
    loadCalEmbed(CAL_LINK);
  } else {
    document.getElementById('cal-embed').innerHTML = `
      <div class="schedule-placeholder">
        <div class="schedule-placeholder-badge">Coming soon</div>
        <h3>Scheduling isn't live yet</h3>
        <p>Direct booking will be available here shortly. In the meantime, reach out by email below and I'll follow up to find a time.</p>
      </div>`;
  }
});
