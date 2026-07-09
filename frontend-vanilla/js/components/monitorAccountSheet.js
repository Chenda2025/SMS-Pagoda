// Ports components/MonitorAccountSheet.jsx: bottom-sheet modal showing the
// monitor's profile + logout, used by the monitor mobile shell.

import { getUser, logout } from '../auth.js';
import { navigate } from '../router.js';
import { openModal } from './modal.js';
import { showToast } from './toast.js';

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
    <button data-action="configure-tg" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;border:1px solid #e5e7eb;background-color:#f9fafb;color:#374151;font-family:inherit;font-size:14px;font-weight:bold;cursor:pointer;margin-bottom:12px;">
      <i data-lucide="send" style="width:18px;height:18px;color:#0088cc;"></i> ការកំណត់ Telegram Bot
    </button>
    <button data-action="logout" style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;border:1px solid #fecaca;background-color:#fef2f2;color:#ef4444;font-family:inherit;font-size:14px;font-weight:bold;cursor:pointer;">
      <i data-lucide="log-out" style="width:18px;height:18px"></i> ចាកចេញ
    </button>
  `;

  function closeSheet() { overlay.remove(); }

  overlay.addEventListener('click', closeSheet);
  sheet.addEventListener('click', (e) => e.stopPropagation());
  sheet.querySelector('[data-action="close"]').addEventListener('click', closeSheet);
  
  sheet.querySelector('[data-action="configure-tg"]').addEventListener('click', () => {
    closeSheet();
    openTelegramConfigModal();
  });

  sheet.querySelector('[data-action="logout"]').addEventListener('click', () => {
    logout();
    navigate('/login');
  });

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
  if (window.lucide) window.lucide.createIcons();
}

function openTelegramConfigModal() {
  const existing = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:1.1rem;font-weight:700;margin:0;display:flex;align-items:center;gap:8px;">
        <i data-lucide="send" style="width:18px;height:18px;color:#0088cc;"></i>ការកំណត់ Telegram Bot
      </h2>
      <button data-action="close" style="background:none;border:none;cursor:pointer;padding:4px;">
        <i data-lucide="x" style="width:18px;height:18px;color:var(--text-secondary);"></i>
      </button>
    </div>
    <form style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.85rem;">Bot Token <span style="color:#dc2626;">*</span></label>
        <input type="text" data-f="token" class="form-input" placeholder="1234567890:ABC..." />
      </div>
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.85rem;">Chat ID <span style="color:#dc2626;">*</span></label>
        <input type="text" data-f="chatId" class="form-input" placeholder="-100123456789" />
      </div>
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.85rem;">ឈ្មោះវត្ត <span style="font-weight:400;color:var(--text-muted);">(បង្ហាញក្នុងសារ)</span></label>
        <input type="text" data-f="pagodaName" class="form-input" placeholder="ឧ. វត្តនិរោធរង្សី..." />
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:14px;border-top:1px solid var(--border);">
        <button type="button" data-action="cancel" class="btn" style="border:1px solid var(--border);">បោះបង់</button>
        <button type="submit" class="btn btn-primary">រក្សាទុក</button>
      </div>
    </form>`;
  wrap.querySelector('[data-f="token"]').value = existing.token || '';
  wrap.querySelector('[data-f="chatId"]').value = existing.chatId || '';
  wrap.querySelector('[data-f="pagodaName"]').value = existing.pagodaName || '';
  const handle = openModal(wrap);
  if (window.lucide) window.lucide.createIcons();
  wrap.querySelector('[data-action="close"]').addEventListener('click', () => handle.close());
  wrap.querySelector('[data-action="cancel"]').addEventListener('click', () => handle.close());
  wrap.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const token      = wrap.querySelector('[data-f="token"]').value.trim();
    const chatId     = wrap.querySelector('[data-f="chatId"]').value.trim();
    const pagodaName = wrap.querySelector('[data-f="pagodaName"]').value.trim();
    if (!token || !chatId) { showToast('សូមបញ្ចូល Token និង Chat ID', 'error'); return; }
    localStorage.setItem('tgConfig', JSON.stringify({ token, chatId, pagodaName }));
    showToast('បានរក្សាទុក Telegram Config ✅', 'success');
    handle.close();
  });
}
