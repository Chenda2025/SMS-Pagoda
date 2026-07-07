// uiHelpers.js – utility functions for Attendance page UI
export function createBadge(status) {
  const map = {
    present: { label: 'វត្តមាន', color: '#16a34a', icon: 'check-circle' },
    absent: { label: 'អវត្តមាន', color: '#dc2626', icon: 'x-circle' },
    permission: { label: 'ឈប់មានច្បាប់', color: '#ea580c', icon: 'file-check' }
  };
  const cfg = map[status] || { label: 'មិនទាន់កត់ត្រា', color: '#94a3b8', icon: '' };
  return `<span class="badge" style="background:${cfg.color};">
    ${cfg.icon ? `<i data-lucide="${cfg.icon}" class="badge-icon"></i>` : ''}
    ${cfg.label}
  </span>`;
}

export function createIconButton(icon, action, title) {
  return `<button class="icon-btn" data-action="${action}" title="${title}" aria-label="${title}">
    <i data-lucide="${icon}" style="width:15px;height:15px;"></i>
  </button>`;
}

export function applyDarkMode() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
}
