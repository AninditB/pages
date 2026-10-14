// Keeps Tab / Shift+Tab focus inside `container` while it is open.
// Call from a keydown handler; does nothing for other keys or when there is no container.
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function trapTabKey(event, container) {
  if (event.key !== 'Tab' || !container) return;
  const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
