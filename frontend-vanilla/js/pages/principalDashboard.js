// Ports pages/PrincipalDashboard.jsx.

import { getUser, logout } from '../auth.js';
import { navigate } from '../router.js';

const cards = [
  { icon: '📊', color: '#3b82f6', bg: '#dbeafe', title: 'របាយការណ៍សាលា', desc: 'ស្ថិតិវត្តមាន និងការសិក្សា' },
  { icon: '👥', color: '#10b981', bg: '#d1fae5', title: 'បុគ្គលិកសិក្សា', desc: 'បញ្ជីឈ្មោះគ្រូបង្រៀន និងបុគ្គលិក' },
  { icon: '✉️', color: '#f59e0b', bg: '#fef3c7', title: 'អនុម័តច្បាប់ឈប់សម្រាក', desc: 'ពិនិត្យ និងអនុម័តពាក្យសុំច្បាប់' },
  { icon: '📢', color: '#8b5cf6', bg: '#ede9fe', title: 'សេចក្តីជូនដំណឹង', desc: 'ប្រកាសព័ត៌មានទូទាំងសាលា' },
];

export function render(container) {
  const user = getUser();
  container.innerHTML = `
    <div style="min-height:100vh;background-color:#f8fafc;font-family:'Khmer OS Battambang','Battambang',sans-serif;display:flex;justify-content:center;">
      <div style="width:100%;max-width:480px;padding-bottom:80px;">
        <div style="background-color:#0f172a;color:white;padding:20px 20px 40px;border-bottom-left-radius:24px;border-bottom-right-radius:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h1 style="font-size:20px;font-weight:bold;margin:0;">តារាងគ្រប់គ្រង (នាយកសាលា)</h1>
            <button data-action="logout" style="background:rgba(255,255,255,0.15);border:none;color:white;padding:8px 12px;border-radius:8px;font-family:inherit;cursor:pointer;">ចាកចេញ</button>
          </div>
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="width:60px;height:60px;background-color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;">🏛️</div>
            <div>
              <div style="font-size:18px;font-weight:bold;">${user?.username || 'នាយកសាលា'}</div>
              <div style="font-size:14px;opacity:0.9;">ការគ្រប់គ្រងទូទៅ</div>
            </div>
          </div>
        </div>
        <div style="padding:20px;margin-top:-20px;">
          ${cards.map(c => `
            <div style="background-color:white;border-radius:16px;padding:20px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);margin-bottom:16px;display:flex;align-items:center;gap:16px;cursor:pointer;border-left:4px solid ${c.color};">
              <div style="width:48px;height:48px;background-color:${c.bg};color:${c.color};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">${c.icon}</div>
              <div style="flex:1;">
                <div style="font-size:16px;font-weight:bold;color:#111827;">${c.title}</div>
                <div style="font-size:12px;color:#6b7280;">${c.desc}</div>
              </div>
              <div style="color:#9ca3af;">➔</div>
            </div>
          `).join('')}
        </div>
        <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background-color:white;border-top:1px solid #e5e7eb;display:flex;justify-content:space-around;padding:12px 0 20px;box-shadow:0 -4px 6px -1px rgba(0,0,0,0.05);">
          <div style="display:flex;flex-direction:column;align-items:center;color:#0f172a;cursor:pointer;"><div style="font-size:20px;margin-bottom:4px;">🏠</div><div style="font-size:10px;font-weight:bold;">ទំព័រដើម</div></div>
          <div style="display:flex;flex-direction:column;align-items:center;color:#9ca3af;cursor:pointer;"><div style="font-size:20px;margin-bottom:4px;">🔔</div><div style="font-size:10px;font-weight:bold;">ដំណឹង</div></div>
          <div style="display:flex;flex-direction:column;align-items:center;color:#9ca3af;cursor:pointer;"><div style="font-size:20px;margin-bottom:4px;">👤</div><div style="font-size:10px;font-weight:bold;">គណនី</div></div>
        </div>
      </div>
    </div>
  `;
  container.querySelector('[data-action="logout"]').addEventListener('click', () => { logout(); navigate('/login'); });
}

export function destroy() {}
