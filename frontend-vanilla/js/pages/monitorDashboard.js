// Ports pages/MonitorDashboard.jsx.

import { api } from '../api.js';
import { getUser } from '../auth.js';
import { navigate } from '../router.js';
import { createMonitorBottomNav } from '../components/monitorBottomNav.js';
import { openMonitorAccountSheet } from '../components/monitorAccountSheet.js';

let root = null;
let state = { summary: null, loadingSummary: true };

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'អរុណសួស្តី', icon: '🌅' };
  if (hour < 18) return { text: 'ទិវាសួស្តី', icon: '☀️' };
  return { text: 'សាយណ្ហសួស្តី', icon: '🌙' };
}

async function loadSummary() {
  const monitorInfo = getUser()?.monitorInfo || {};
  if (!monitorInfo.classroom_id) { state = { ...state, loadingSummary: false }; update(); return; }
  try {
    const res = await api.get(`/api/monitor/summary?classroom_id=${monitorInfo.classroom_id}`);
    state = { ...state, summary: res.data };
  } catch {
    state = { ...state, summary: null };
  }
  state = { ...state, loadingSummary: false };
  update();
}

function update() {
  if (!root) return;
  const monitorInfo = getUser()?.monitorInfo || {};
  const greeting = getGreeting();
  const { summary, loadingSummary } = state;

  const stats = [
    { label: 'វត្តមាន', value: summary?.attendance_rate != null ? `${summary.attendance_rate}%` : '-', color: '#10b981' },
    { label: 'សិស្សសរុប', value: summary?.total_students ?? '-', color: '#3b82f6' },
    { label: 'សុំច្បាប់', value: summary?.on_leave_today ?? '-', color: '#f59e0b' },
  ];

  const actions = [
    { icon: '👥', title: 'បញ្ជីសិស្ស', desc: 'ឈ្មោះ វត្ត កុដិ និងវត្តមានសិស្ស', color: '#8b5cf6', bg: '#ede9fe', path: '/monitor-students' },
    { icon: '📝', title: 'ស្រង់វត្តមាន', desc: 'កត់ត្រាអវត្តមានសិស្សប្រចាំថ្ងៃ', color: '#10b981', bg: '#d1fae5', path: '/monitor-attendance' },
    { icon: '📅', title: 'កាលវិភាគ', desc: 'មើលម៉ោងរៀន និងមុខវិជ្ជា', color: '#3b82f6', bg: '#dbeafe', path: '/monitor-schedule' },
    { icon: '✉️', title: 'សុំច្បាប់', desc: 'បញ្ជូនពាក្យសុំច្បាប់ទៅគ្រូ', color: '#f59e0b', bg: '#fef3c7', path: '/monitor-leave' },
    { icon: '📋', title: 'បំពេញព័ត៌មាន', desc: 'វត្ត កុដិ ទូរស័ព្ទ និងរូបថត', color: '#ec4899', bg: '#fce7f3', path: '/monitor-student-info' },
  ];

  root.innerHTML = `
    <div style="min-height:100vh;background-color:#f3f4f6;font-family:'Khmer OS Battambang','Battambang',sans-serif;display:flex;justify-content:center;">
      <div style="width:100%;max-width:480px;padding-bottom:80px;">
        <div style="background-color:#4f46e5;background-image:linear-gradient(135deg, #4f46e5, #6366f1);color:white;padding:16px 20px;display:flex;align-items:center;gap:12px;border-bottom-left-radius:24px;border-bottom-right-radius:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="width:40px;height:40px;flex-shrink:0;background-color:white;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;">
            <img src="/logo.jpg" alt="School Logo" style="width:100%;height:100%;object-fit:contain;" />
          </div>
          <div style="display:flex;flex-direction:column;min-width:0;flex:1;">
            <div style="font-family:'Moul', cursive;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:20px;">ពុទ្ធិកមធ្យមសិក្សាបឋមភូមិ</div>
        <div style="font-family:'Khmer OS Battambang', 'Battambang', sans-serif;font-size:14px;opacity:0.9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:80px;">សម្តេចព្រះសង្ឃរាជ ទេព វង្ស និរោធរង្សី</div>
          </div>
          <div style="width:40px;height:40px;flex-shrink:0;background-color:white;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;">
            <img src="/logo_1.png" alt="Second Logo" style="width:100%;height:100%;object-fit:contain;" />
          </div>
        </div>

        <div style="padding:20px 20px 0;">
          <div style="background-color:white;border-radius:16px;padding:16px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);display:flex;align-items:center;gap:14px;">
            <div style="width:56px;height:56px;flex-shrink:0;background-color:#eef2ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden;">
              ${monitorInfo.student_image ? `<img src="${monitorInfo.student_image}" alt="${monitorInfo.student_name || ''}" style="width:100%;height:100%;object-fit:cover;" />` : '👨‍🎓'}
            </div>
            <div style="min-width:0;flex:1;">
              <div style="font-size:12px;color:#6b7280;font-weight:bold;margin-bottom:2px;">${greeting.icon} ${greeting.text}</div>
              <div style="font-size:16px;font-weight:bold;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${monitorInfo.student_name || 'មិនមានឈ្មោះ'}</div>
              <div style="font-size:13px;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${monitorInfo.role || 'ប្រធាន'} • ${monitorInfo.classroom_name || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div style="padding:20px 20px 0;">
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:12px;">
            ${stats.map(s => `
              <div style="background-color:white;border-radius:16px;padding:14px 8px;text-align:center;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="font-size:20px;font-weight:bold;color:${s.color};margin-bottom:4px;min-height:24px;">${loadingSummary ? '···' : s.value}</div>
                <div style="font-size:11px;color:#6b7280;font-weight:bold;">${s.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="padding:20px;">
          ${actions.map(a => `
            <div data-nav="${a.path}" style="background-color:white;border-radius:16px;padding:20px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);margin-bottom:16px;display:flex;align-items:center;gap:16px;cursor:pointer;border-left:4px solid ${a.color};">
              <div style="width:48px;height:48px;flex-shrink:0;background-color:${a.bg};color:${a.color};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">${a.icon}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:16px;font-weight:bold;color:#111827;">${a.title}</div>
                <div style="font-size:12px;color:#6b7280;">${a.desc}</div>
              </div>
              <div style="color:#9ca3af;">➔</div>
            </div>
          `).join('')}
        </div>
        <div data-role="bottom-nav-mount"></div>
      </div>
    </div>
  `;

  root.querySelectorAll('[data-nav]').forEach(card => card.addEventListener('click', () => navigate(card.dataset.nav)));
  const bottomNavMount = root.querySelector('[data-role="bottom-nav-mount"]');
  const bottomNav = createMonitorBottomNav({ active: 'home', onAccountClick: () => openMonitorAccountSheet() });
  bottomNavMount.replaceWith(bottomNav.el);
  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { summary: null, loadingSummary: true };
  update();
  loadSummary();
}

export function destroy() { root = null; }
