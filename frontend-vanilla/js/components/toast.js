// Replaces the addToast/toasts-state pattern copy-pasted into every page
// (e.g. Subjects.jsx, AcademicYears.jsx, Attendance.jsx). One shared
// container, one shared implementation.

let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * @param {string} message
 * @param {'success'|'info'|'warning'|'danger'|'error'} type
 * @param {number} duration ms before auto-dismiss
 */
let lastMessage = null;
let lastShownAt = 0;

export function showToast(message, type = 'success', duration = 4000) {
  const now = Date.now();
  if (message === lastMessage && now - lastShownAt < 1500) return null;
  lastMessage = message;
  lastShownAt = now;

  const isError = type === 'error' || type === 'warning';
  const el = document.createElement('div');
  el.className = `toast ${isError ? 'warning' : type}`;
  el.innerHTML = `
    <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;
      background:${type === 'success' ? 'rgba(16,185,129,0.1)' : isError ? 'rgba(239,68,68,0.1)' : type === 'danger' ? 'rgba(245,158,11,0.1)' : 'rgba(79,70,229,0.1)'};
      color:${type === 'success' ? '#10b981' : isError ? '#ef4444' : type === 'danger' ? '#f59e0b' : '#4f46e5'};">
      <i data-lucide="${isError ? 'alert-circle' : 'check-circle-2'}" style="width:16px;height:16px"></i>
    </div>
    <div style="font-size:0.85rem;font-weight:600;color:var(--text-primary);">${message}</div>
  `;
  getContainer().appendChild(el);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => el.remove(), duration);
  return el;
}
