// Ports components/MonitorAccountSheet.jsx: bottom-sheet modal showing the
// monitor's profile + logout, used by the monitor mobile shell.

import { getUser, logout } from '../auth.js';
import { navigate } from '../router.js';

export function openMonitorAccountSheet() {
  const user = getUser();
  const monitorInfo = user?.monitorInfo || {};

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.4)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'flex-end';
  overlay.style.zIndex = '30';

  const sheet = document.createElement('div');
  sheet.style.width = '100%';
  sheet.style.maxWidth = '480px';
  sheet.style.backgroundColor = 'white';
  sheet.style.borderTopLeftRadius = '24px';
  sheet.style.borderTopRightRadius = '24px';
  sheet.style.padding = '12px 20px 28px';
  sheet.style.boxShadow = '0 -4px 20px rgba(0,0,0,0.1)';
  sheet.style.fontFamily = "'Khmer OS Battambang', 'Battambang', sans-serif";
  sheet.innerHTML = `
    <div style="display:flex;justify-content:center;margin-bottom:12px;">
      <div style="width:40px;height:4px;border-radius:2px;background-color:#e5e7eb;"></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div style="font-size:16px;font-weight:bold;color:#111827;">គណនីរបស់ខ្ញុំ</div>
      <button data-action="close" style="background:#f3f4f6;border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6b7280;" aria-label="បិទ">
        <i data-lucide="x" style="width:16px;height:16px"></i>
      </button>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
      <div style="width:56px;height:56px;flex-shrink:0;background-color:#eef2ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden;">
        ${monitorInfo.student_image ? `<img src="${monitorInfo.student_image}" alt="${monitorInfo.student_name || ''}" style="width:100%;height:100%;object-fit:cover;" />` : '👨‍🎓'}
      </div>
      <div style="min-width:0;flex:1;">
        <div style="font-size:16px;font-weight:bold;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${monitorInfo.student_name || 'មិនមានឈ្មោះ'}</div>
        <div style="font-size:13px;color:#6b7280;">${monitorInfo.role || 'ប្រធានថ្នាក់'} • ថ្នាក់ ${monitorInfo.classroom_name || 'N/A'}</div>
      </div>
    </div>
    <button data-action="logout" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;border:1px solid #fecaca;background-color:#fef2f2;color:#ef4444;font-family:inherit;font-size:14px;font-weight:bold;cursor:pointer;">
      <i data-lucide="log-out" style="width:18px;height:18px"></i> ចាកចេញ
    </button>
  `;

  function close() { overlay.remove(); }

  overlay.addEventListener('click', close);
  sheet.addEventListener('click', (e) => e.stopPropagation());
  sheet.querySelector('[data-action="close"]').addEventListener('click', close);
  sheet.querySelector('[data-action="logout"]').addEventListener('click', () => {
    logout();
    navigate('/login');
  });

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
  if (window.lucide) window.lucide.createIcons();

  return { close };
}
