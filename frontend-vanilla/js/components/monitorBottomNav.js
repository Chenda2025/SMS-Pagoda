// Ports components/MonitorBottomNav.jsx: fixed bottom tab bar for the
// monitor mobile shell (home/attendance/leave/account).

import { navigate } from '../router.js';

export function createMonitorBottomNav({ active, onAccountClick }) {
  const tabs = [
    { key: 'home', label: 'ទំព័រដើម', icon: 'home', onClick: () => navigate('/monitor-dashboard') },
    { key: 'attendance', label: 'វត្តមាន', icon: 'calendar-check-2', onClick: () => navigate('/monitor-attendance') },
    { key: 'leave', label: 'ច្បាប់', icon: 'file-text', onClick: () => navigate('/monitor-leave') },
    { key: 'account', label: 'គណនី', icon: 'user', onClick: onAccountClick },
  ];

  const el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.bottom = '0';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.width = '100%';
  el.style.maxWidth = '480px';
  el.style.backgroundColor = 'white';
  el.style.borderTop = '1px solid #e5e7eb';
  el.style.display = 'flex';
  el.style.justifyContent = 'space-around';
  el.style.padding = '12px 0 20px';
  el.style.boxShadow = '0 -4px 6px -1px rgba(0, 0, 0, 0.05)';
  el.style.zIndex = '20';

  tabs.forEach(tab => {
    const isActive = active === tab.key;
    const color = isActive ? '#4f46e5' : '#9ca3af';
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.flexDirection = 'column';
    item.style.alignItems = 'center';
    item.style.color = color;
    item.style.cursor = 'pointer';
    item.innerHTML = `
      <i data-lucide="${tab.icon}" style="width:20px;height:20px;margin-bottom:4px;"></i>
      <div style="font-size:10px;font-weight:bold;">${tab.label}</div>
    `;
    item.addEventListener('click', tab.onClick);
    el.appendChild(item);
  });

  return { el };
}
