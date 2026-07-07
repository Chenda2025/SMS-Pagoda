// Ports pages/ActivityLogs.jsx (mock data, fully client-side, no API calls).

import { withFocusPreserved, onLiveInput } from '../utils/dom.js';

const mockLogs = [
  { id: 'LOG-88401', user: 'កុប ចិន្តា', role: 'គ្រូបន្ទុកថ្នាក់ / គណៈគ្រប់គ្រង', action: 'បានកែសម្រួលកាលវិភាគសិក្សា និងតារាងគ្រូបង្រៀនប្រចាំខែ', category: 'សិក្សាធិការ', status: 'ជោគជ័យ', time: '១០ នាទីមុន', exactTime: 'ថ្ងៃទី២៤ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១៨:៣០:១២', ip: '192.168.1.15', device: 'Chrome លើ macOS (Mac Studio)', isDeleted: false, details: { action_code: 'SCHED_UPDATE_CONF', module: 'គ្រប់គ្រងកាលវិភាគសិក្សា', payload: { modified_fields: ['គ្រូបន្ទុកថ្នាក់', 'បញ្ជីគ្រូបង្រៀន'], reindexed_items: 14 } } },
  { id: 'LOG-88398', user: 'យឹម ចន្ទផល', role: 'គ្រូបង្រៀន / សាស្ត្រាចារ្យបាលី', action: 'បានបញ្ចូលពិន្ទុឆមាសទី២ មុខវិជ្ជាភាសាបាលី ថ្នាក់ទី ១ (ក)', category: 'សិក្សាធិការ', status: 'ជោគជ័យ', time: '២៥ នាទីមុន', exactTime: 'ថ្ងៃទី២៤ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១៨:១៥:៤៥', ip: '192.168.1.24', device: 'Safari លើ iPad Pro', isDeleted: false, details: { action_code: 'GRADE_ENTRY_SUCCESS', module: 'បញ្ចូលពិន្ទុសិស្ស', payload: { classroom: 'ថ្នាក់ទី ១ (ក)', subject: 'ភាសាបាលី', students_count: 28 } } },
  { id: 'LOG-88395', user: 'ហួត សារិទ្ធ', role: 'គណនេយ្យករ / ផ្នែកហិរញ្ញវត្ថុ', action: 'បានបង្កើតរបាយការណ៍ទូទាត់ប្រាក់ម៉ោងគ្រូបង្រៀនប្រចាំខែឧសភា', category: 'ហិរញ្ញវត្ថុ', status: 'ព័ត៌មាន', time: '៤៥ នាទីមុន', exactTime: 'ថ្ងៃទី២៤ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១៧:៥៥:០២', ip: '192.168.1.8', device: 'Edge លើ Windows 11 Desktop', isDeleted: false, details: { action_code: 'PAYROLL_REPORT_GEN', module: 'គណនេយ្យប្រាក់ម៉ោង', payload: { total_payout: '$៤,៨៥០.០០', approved_by: 'ព្រះនាយក' } } },
  { id: 'LOG-88391', user: 'ខាត់ ហុងលី', role: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ IT', action: 'បាននាំចូលទិន្នន័យសិស្សថ្មី ចំនួន ២៥ នាក់ ពីប្រព័ន្ធ Excel', category: 'ប្រព័ន្ធ', status: 'ជោគជ័យ', time: '២ ម៉ោងមុន', exactTime: 'ថ្ងៃទី២៤ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១៦:៤០:១៨', ip: '192.168.1.10', device: 'Firefox លើ Linux Enterprise', isDeleted: false, details: { action_code: 'SYS_IMPORT_EXCEL', module: 'មជ្ឈមណ្ឌលផ្ទុកទិន្នន័យ', payload: { file_name: 'new_students_batch_2026.xlsx', records_created: 25 } } },
  { id: 'LOG-88385', user: 'រស់ ត្រដេក', role: 'ប្រធានផ្នែកដឹកនាំ / ព្រះវិន័យធរ', action: 'ការប៉ុនប៉ងចូលគណនីបរាជ័យ (បញ្ចូលលេខសម្ងាត់ខុស ៣ ដង)', category: 'សុវត្ថិភាព', status: 'គ្រោះថ្នាក់', time: '៤ ម៉ោងមុន', exactTime: 'ថ្ងៃទី២៤ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១៤:១២:០៩', ip: '203.144.92.105', device: 'Mobile Safari លើ iPhone 15', isDeleted: false, details: { action_code: 'AUTH_LOGIN_FAILED', module: 'ប្រព័ន្ធការពារសុវត្ថិភាព', payload: { failed_attempts: 3, temporary_lockout: '15 Minutes' } } },
  { id: 'LOG-88380', user: 'គឹម នីរ', role: 'បុគ្គលិករដ្ឋបាល / សិក្សាធិការ', action: 'បានកែប្រែស្ថានភាពសិស្ស "គង់ ពិសិដ្ឋ" ទៅជា "ផ្អាកការសិក្សាជាបណ្តោះអាសន្ន"', category: 'សិក្សាធិការ', status: 'ការព្រមាន', time: '៦ ម៉ោងមុន', exactTime: 'ថ្ងៃទី២៤ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១២:២៨:៣៣', ip: '192.168.1.12', device: 'Chrome លើ macOS', isDeleted: false, details: { action_code: 'STUDENT_STATUS_MOD', module: 'រដ្ឋបាលគ្រប់គ្រងសិស្ស', payload: { student_name: 'គង់ ពិសិដ្ឋ', student_id: 'STU-99042', previous_status: 'Active', new_status: 'Suspended' } } },
  { id: 'LOG-88374', user: 'ខាត់ ហុងលី', role: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ IT', action: 'បានដំណើរការចម្លងទុកទិន្នន័យប្រព័ន្ធប្រចាំសប្តាហ៍ (Full Backup)', category: 'ប្រព័ន្ធ', status: 'ជោគជ័យ', time: '១ ថ្ងៃមុន', exactTime: 'ថ្ងៃទី២៣ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ២៣:០០:០០', ip: '127.0.0.1 (Localhost)', device: 'កម្មវិធីដំណើរការប្រព័ន្ធស្វ័យប្រវត្តិ (Cron Job)', isDeleted: false, details: { action_code: 'SYS_BACKUP_FULL', module: 'សេវាកម្មចម្លងទុកទិន្នន័យស្វ័យប្រវត្តិ', payload: { backup_size: '1.24 GB', encryption: 'AES-256 Enabled' } } },
  { id: 'LOG-88370', user: 'កុប ចិន្តា', role: 'គ្រូបន្ទុកថ្នាក់ / គណៈគ្រប់គ្រង', action: 'បានបន្ថែមសិស្សថ្មី "ម៉ៅ សុខា" ទៅក្នុងបញ្ជីរាយនាមថ្នាក់ទី ១ (ក)', category: 'សិក្សាធិការ', status: 'ជោគជ័យ', time: '១ ថ្ងៃមុន', exactTime: 'ថ្ងៃទី២៣ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១៥:២០:១០', ip: '192.168.1.15', device: 'Chrome លើ macOS', isDeleted: false, details: { action_code: 'STUDENT_ADD_SUCCESS', module: 'រដ្ឋបាលគ្រប់គ្រងសិស្ស', payload: { student_name: 'ម៉ៅ សុខា', student_id: 'STU-99045' } } },
  { id: 'LOG-88365', user: 'ហួត សារិទ្ធ', role: 'គណនេយ្យករ / ផ្នែកហិរញ្ញវត្ថុ', action: 'បានបញ្ជូនសំណើសុំទូទាត់ថវិកាទិញសម្ភារៈសិក្សាសម្រាប់ឆមាសថ្មី', category: 'ហិរញ្ញវត្ថុ', status: 'ព័ត៌មាន', time: '២ ថ្ងៃមុន', exactTime: 'ថ្ងៃទី២២ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១០:១២:៥៥', ip: '192.168.1.8', device: 'Edge លើ Windows 11 Desktop', isDeleted: false, details: { action_code: 'FIN_PURCHASE_REQ', module: 'គណនេយ្យហិរញ្ញវត្ថុ', payload: { item: 'សៀវភៅបាលីដីកា', amount: '$៣៥០.០០', requester: 'ហួត សារិទ្ធ' } } },
  { id: 'LOG-88360', user: 'ខាត់ ហុងលី', role: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ IT', action: 'បានដំឡើងទំហំផ្ទុកទិន្នន័យប្រព័ន្ធទូទៅ (System Storage Upscaling)', category: 'ប្រព័ន្ធ', status: 'ជោគជ័យ', time: '២ ថ្ងៃមុន', exactTime: 'ថ្ងៃទី២២ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ០៩:០០:០០', ip: '192.168.1.10', device: 'Firefox លើ Linux Enterprise', isDeleted: false, details: { action_code: 'SYS_STORAGE_SCALE', module: 'មជ្ឈមណ្ឌលផ្ទុកទិន្នន័យ', payload: { previous_limit: '100 GB', new_limit: '250 GB' } } },
  { id: 'LOG-88355', user: 'រស់ ត្រដេក', role: 'ប្រធានផ្នែកដឹកនាំ / ព្រះវិន័យធរ', action: 'បានផ្លាស់ប្ដូរពាក្យសម្ងាត់គណនីរដ្ឋបាលផ្ទាល់ខ្លួន', category: 'សុវត្ថិភាព', status: 'ជោគជ័យ', time: '៣ ថ្ងៃមុន', exactTime: 'ថ្ងៃទី២១ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១៦:៤៥:១២', ip: '192.168.1.5', device: 'Chrome លើ Windows 11 Desktop', isDeleted: false, details: { action_code: 'AUTH_PASSWORD_CHANGE', module: 'សុវត្ថិភាពគណនី', payload: { status: 'Password Successfully Changed', trigger: 'User Action' } } },
  { id: 'LOG-88350', user: 'គឹម នីរ', role: 'បុគ្គលិករដ្ឋបាល / សិក្សាធិការ', action: 'បានបោះពុម្ពបញ្ជីរាយនាមសិស្សថ្នាក់ទី ១ (ក) សម្រាប់ការប្រឡង', category: 'សិក្សាធិការ', status: 'ជោគជ័យ', time: '៣ ថ្ងៃមុន', exactTime: 'ថ្ងៃទី២១ ខែឧសភា ឆ្នាំ២០២៦ ម៉ោង ១១:៣០:០២', ip: '192.168.1.12', device: 'Chrome លើ macOS', isDeleted: false, details: { action_code: 'STUDENT_LIST_PRINT', module: 'សិក្សាធិការរដ្ឋបាល', payload: { classroom: 'ថ្នាក់ទី ១ (ក)', reason: 'ប្រឡងប្រចាំខែ' } } },
];

function toKhmerNumerals(num) {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().split('').map(d => { const p = parseInt(d, 10); return isNaN(p) ? d : khmerDigits[p]; }).join('');
}

const CATEGORY_META = {
  'សិក្សាធិការ': { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: 'user-check' },
  'ហិរញ្ញវត្ថុ': { color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: 'credit-card' },
  'ប្រព័ន្ធ': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', icon: 'database' },
  'សុវត្ថិភាព': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: 'shield-alert' },
};
function getCategoryMeta(category) { return CATEGORY_META[category] || { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', icon: 'info' }; }
function getStatusColor(status) { return { 'ជោគជ័យ': '#10b981', 'ការព្រមាន': '#f59e0b', 'គ្រោះថ្នាក់': '#ef4444', 'ព័ត៌មាន': '#3b82f6' }[status] || '#6b7280'; }

let root = null;
let intervalId = null;
let state = {
  logs: mockLogs, searchQuery: '', categoryFilter: 'All', statusFilter: 'All', selectedLog: null, isRefreshing: false,
  autoRefresh: false, currentPage: 1, itemsPerPage: 5, showDeleteModal: false, logToDelete: null, showDeletedLogs: false,
};

function handleRefresh() {
  state = { ...state, isRefreshing: true };
  update();
  setTimeout(() => { state = { ...state, isRefreshing: false }; update(); }, 800);
}

function toggleAutoRefresh() {
  state = { ...state, autoRefresh: !state.autoRefresh };
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  if (state.autoRefresh) intervalId = setInterval(handleRefresh, 10000);
  update();
}

function executeSoftDelete() {
  if (!state.logToDelete) return;
  state = { ...state, logs: state.logs.map(l => l.id === state.logToDelete.id ? { ...l, isDeleted: true } : l), showDeleteModal: false, logToDelete: null, selectedLog: null };
  update();
}

function handleRecoverLog(logId) {
  state = { ...state, logs: state.logs.map(l => l.id === logId ? { ...l, isDeleted: false } : l) };
  update();
}

function getFilteredLogs() {
  return state.logs.filter(log => {
    if (!state.showDeletedLogs && log.isDeleted) return false;
    const q = state.searchQuery.toLowerCase();
    const matchesSearch = log.user.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.ip.toLowerCase().includes(q);
    const matchesCategory = state.categoryFilter === 'All' || log.category === state.categoryFilter;
    const matchesStatus = state.statusFilter === 'All' || log.status === state.statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function renderDetailDrawer() {
  const log = state.selectedLog;
  if (!log) return '';
  const cat = getCategoryMeta(log.category);
  return `
    <div data-action="close-detail" style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(15,23,42,0.15);backdrop-filter:blur(4px);z-index:1000;"></div>
    <div data-stop class="glass-panel" style="position:fixed;top:0;right:0;height:100vh;width:460px;max-width:100vw;background-color:rgba(255,255,255,0.98);box-shadow:-10px 0 40px rgba(0,0,0,0.08);padding:30px;z-index:1001;overflow-y:auto;display:flex;flex-direction:column;gap:24px;border-top-right-radius:0;border-bottom-right-radius:0;border-left:1px solid var(--border);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span style="font-family:monospace;font-size:0.8rem;font-weight:700;color:var(--primary);background-color:var(--primary-light);padding:3px 8px;border-radius:4px;">${log.id}</span>
          <h3 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin-top:8px;">ព័ត៌មានលម្អិតសកម្មភាព</h3>
        </div>
        <button data-action="close-detail" style="width:32px;height:32px;border-radius:50%;background-color:#f3f4f6;display:flex;align-items:center;justify-content:center;color:var(--text-primary);cursor:pointer;border:none;"><i data-lucide="x" style="width:16px;height:16px"></i></button>
      </div>
      <div style="display:flex;align-items:center;gap:12px;background-color:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:16px;">
        <div class="avatar" style="width:40px;height:40px;font-size:0.95rem;font-weight:700;background-color:${cat.color};">${log.user.split(' ').map(n => n[0]).join('')}</div>
        <div><div style="font-weight:600;color:var(--text-primary);font-size:0.9rem;">${log.user}</div><div style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px;">${log.role}</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="detail-item">
          <span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;">ប្រភេទប្រតិបត្តិការ</span>
          <span style="align-self:flex-start;display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border-radius:6px;font-size:0.72rem;font-weight:600;color:${cat.color};background-color:${cat.bg};margin-top:4px;"><i data-lucide="${cat.icon}" style="width:12px;height:12px"></i> ${log.category}</span>
        </div>
        <div class="detail-item"><span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;">សកម្មភាពប្រតិបត្តិការ</span><span style="font-size:0.85rem;font-weight:600;color:var(--text-primary);margin-top:4px;line-height:1.4;">${log.action}</span></div>
        <div class="detail-item">
          <span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;">ស្ថានភាពប្រតិបត្តិការ</span>
          <span style="align-self:flex-start;display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;color:${getStatusColor(log.status)};background-color:${log.status === 'ជោគជ័យ' ? 'rgba(16,185,129,0.08)' : log.status === 'គ្រោះថ្នាក់' ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)'};margin-top:4px;"><i data-lucide="${log.status === 'ជោគជ័យ' ? 'shield-check' : 'alert-triangle'}" style="width:12px;height:12px"></i> ${log.status.toUpperCase()}</span>
        </div>
        <div class="detail-item"><span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;">កាលបរិច្ឆេទ និងម៉ោងពិតប្រាកដ</span><span style="font-size:0.82rem;font-weight:600;color:var(--text-primary);margin-top:4px;">${log.exactTime} (${log.time})</span></div>
        <div class="detail-item"><span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;">អាសយដ្ឋាន IP</span><span style="font-family:monospace;font-size:0.82rem;font-weight:600;color:var(--text-primary);margin-top:4px;">${log.ip}</span></div>
        <div class="detail-item"><span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;">ឧបករណ៍ដំណើរការ</span><span style="font-size:0.82rem;font-weight:600;color:var(--text-primary);display:flex;align-items:center;gap:6px;margin-top:4px;"><i data-lucide="laptop" style="width:14px;height:14px;color:var(--text-secondary)"></i> ${log.device}</span></div>
      </div>
      <div>
        <span style="font-size:0.75rem;color:var(--text-secondary);font-weight:500;display:block;margin-bottom:8px;">ទិន្នន័យបច្ចេកទេសប្រព័ន្ធ (JSON)</span>
        <pre style="margin:0;background-color:#1e1e2f;color:#abb2bf;padding:16px;border-radius:10px;font-family:monospace;font-size:0.78rem;overflow-x:auto;line-height:1.5;">${JSON.stringify(log.details, null, 2)}</pre>
      </div>
      <div style="margin-top:auto;padding-top:16px;">
        <button data-action="open-delete-modal" class="btn" style="width:100%;background-color:rgba(239,68,68,0.08);color:var(--danger);display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;border-radius:10px;font-weight:600;"><i data-lucide="trash-2" style="width:16px;height:16px"></i> លុបកំណត់ហេតុជាបណ្តោះអាសន្ន (Soft Delete)</button>
      </div>
    </div>
  `;
}

function renderDeleteModal() {
  if (!state.showDeleteModal || !state.logToDelete) return '';
  return `
    <div data-action="close-delete-modal" style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(15,23,42,0.3);backdrop-filter:blur(6px);z-index:1100;"></div>
    <div data-stop class="glass-panel" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:480px;max-width:90vw;background-color:#fff;padding:28px;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,0.15);z-index:1101;display:flex;flex-direction:column;gap:20px;">
      <div style="display:flex;gap:14px;align-items:flex-start;">
        <div style="width:40px;height:40px;border-radius:50%;background-color:rgba(239,68,68,0.1);color:var(--danger);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i data-lucide="alert-circle" style="width:22px;height:22px"></i></div>
        <div>
          <h3 style="font-size:1.1rem;font-weight:700;color:var(--text-primary);">លុបកំណត់ហេតុកំណត់ទុកជាបណ្ដោះអាសន្ន?</h3>
          <span style="font-size:0.82rem;color:var(--text-secondary);display:block;margin-top:4px;">កំណត់ហេតុលេខ៖ <strong style="font-family:monospace;">${state.logToDelete.id}</strong></span>
        </div>
      </div>
      <div style="background-color:#fef2f2;border:1px solid rgba(239,68,68,0.15);border-radius:10px;padding:16px;font-size:0.85rem;line-height:1.6;color:#991b1b;">
        <strong style="display:block;margin-bottom:6px;font-size:0.88rem;">Soft Delete (Recommended)</strong>
        Keep the log record in the database but mark it as deleted. The admin can still recover it if needed. Best for medical systems where audit trails matter.
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end;">
        <button data-action="close-delete-modal" class="btn" style="border:1px solid var(--border);background-color:#fff;color:var(--text-primary);padding:8px 20px;border-radius:8px;font-weight:600;">បោះបង់</button>
        <button data-action="confirm-delete" class="btn" style="background-color:var(--danger);color:#fff;padding:8px 24px;border-radius:8px;font-weight:600;border:none;">យល់ព្រមលុប</button>
      </div>
    </div>
  `;
}

function update() {
  if (!root) return;
  const filteredLogs = getFilteredLogs();
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / state.itemsPerPage));
  const safePage = Math.min(state.currentPage, totalPages);
  const paginatedLogs = filteredLogs.slice((safePage - 1) * state.itemsPerPage, safePage * state.itemsPerPage);

  root.innerHTML = `
    <div class="animate-fade-in" style="position:relative;min-height:80vh;padding-bottom:40px;">
      <style>
        .log-row { cursor: pointer; transition: all 0.2s ease; }
        .log-row:hover td { background-color: rgba(79,70,229,0.03) !important; }
        .deleted-row { opacity: 0.6; background-color: #f9fafb !important; }
        .detail-item { display: flex; flex-direction: column; gap: 4px; border-bottom: 1px dashed var(--border); padding-bottom: 10px; }
        .detail-item:last-child { border-bottom: none; }
        @keyframes countdownProgress { from { width: 100%; } to { width: 0%; } }
        .countdown-bar { position: absolute; top: 0; left: 0; height: 100%; background-color: var(--primary); width: 100%; animation: countdownProgress 10s linear infinite; }
      </style>

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">កំណត់ហេតុសកម្មភាពប្រព័ន្ធ</h1>
          <p style="color:var(--text-secondary);font-size:0.85rem;">ពិនិត្យឡើងវិញ និងតាមដានរាល់ការកែប្រែទិន្នន័យ ហិរញ្ញវត្ថុ និងប្រតិបត្តិការសុវត្ថិភាព</p>
        </div>
        <div style="display:flex;gap:12px;align-items:center;">
          <button data-action="toggle-auto-refresh" class="btn ${state.autoRefresh ? 'btn-primary' : ''}" style="border:${state.autoRefresh ? 'none' : '1px solid var(--border)'};background-color:${state.autoRefresh ? 'var(--primary)' : '#fff'};color:${state.autoRefresh ? '#fff' : 'var(--text-primary)'};display:flex;align-items:center;gap:6px;">
            <i data-lucide="${state.autoRefresh ? 'pause' : 'play'}" style="width:15px;height:15px"></i> ${state.autoRefresh ? 'បិទការទាញស្វ័យប្រវត្ត' : 'បើកការទាញស្វ័យប្រវត្ត (១០វិ)'}
          </button>
          <button data-action="refresh" class="btn" style="border:1px solid var(--border);background-color:#fff;display:flex;align-items:center;gap:8px;">
            <i data-lucide="refresh-cw" class="${state.isRefreshing ? 'animate-spin' : ''}" style="width:16px;height:16px"></i> ${state.isRefreshing ? 'កំពុងធ្វើបច្ចុប្បន្នភាព...' : 'ធ្វើបច្ចុប្បន្នភាព'}
          </button>
        </div>
      </div>

      <div class="dashboard-grid" style="margin-bottom:24px;">
        <div class="glass-panel hover-card" style="padding:20px;display:flex;align-items:center;gap:16px;">
          <div style="width:48px;height:48px;border-radius:12px;background-color:rgba(79,70,229,0.08);color:var(--primary);display:flex;align-items:center;justify-content:center;"><i data-lucide="database" style="width:22px;height:22px"></i></div>
          <div><div style="font-size:0.8rem;color:var(--text-secondary);font-weight:500;">សកម្មភាពសរុបប្រចាំថ្ងៃ</div><div style="font-size:1.45rem;font-weight:700;color:var(--text-primary);margin-top:2px;">${toKhmerNumerals(state.logs.filter(l => !l.isDeleted).length)} ករណី</div></div>
        </div>
        <div class="glass-panel hover-card" style="padding:20px;display:flex;align-items:center;gap:16px;">
          <div style="width:48px;height:48px;border-radius:12px;background-color:rgba(16,185,129,0.08);color:var(--success);display:flex;align-items:center;justify-content:center;"><i data-lucide="user-check" style="width:22px;height:22px"></i></div>
          <div><div style="font-size:0.8rem;color:var(--text-secondary);font-weight:500;">អ្នកគ្រប់គ្រងសកម្មភាព</div><div style="font-size:1.45rem;font-weight:700;color:var(--text-primary);margin-top:2px;">${toKhmerNumerals(5)} នាក់</div></div>
        </div>
        <div class="glass-panel hover-card" style="padding:20px;display:flex;align-items:center;gap:16px;">
          <div style="width:48px;height:48px;border-radius:12px;background-color:rgba(239,68,68,0.08);color:var(--danger);display:flex;align-items:center;justify-content:center;"><i data-lucide="alert-triangle" style="width:22px;height:22px"></i></div>
          <div><div style="font-size:0.8rem;color:var(--text-secondary);font-weight:500;">ការព្រមានផ្នែកសុវត្ថិភាព</div><div style="font-size:1.45rem;font-weight:700;color:var(--danger);margin-top:2px;">${toKhmerNumerals(1)} ករណី</div></div>
        </div>
        <div class="glass-panel hover-card" style="padding:20px;display:flex;align-items:center;gap:16px;">
          <div style="width:48px;height:48px;border-radius:12px;background-color:rgba(107,114,128,0.08);color:#6b7280;display:flex;align-items:center;justify-content:center;"><i data-lucide="trash-2" style="width:22px;height:22px"></i></div>
          <div><div style="font-size:0.8rem;color:var(--text-secondary);font-weight:500;">កំណត់ហេតុដែលបានលុប</div><div style="font-size:1.45rem;font-weight:700;color:#6b7280;margin-top:2px;">${toKhmerNumerals(state.logs.filter(l => l.isDeleted).length)} ករណី</div></div>
        </div>
      </div>

      <div class="glass-panel" style="padding:16px 20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;background-color:#fff;border:1px solid var(--border);border-radius:10px;padding:6px 14px;width:280px;gap:8px;">
            <i data-lucide="search" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <input type="text" data-role="search" placeholder="ស្វែងរកតាម ឈ្មោះ, សកម្មភាព, IP..." value="${state.searchQuery}" style="border:none;outline:none;font-size:0.85rem;width:100%;font-family:inherit;" />
            ${state.searchQuery ? `<button data-action="clear-search" style="color:var(--text-secondary);"><i data-lucide="x" style="width:14px;height:14px"></i></button>` : ''}
          </div>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.85rem;color:var(--text-primary);">
            <input type="checkbox" data-action="toggle-deleted" ${state.showDeletedLogs ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--primary);" /> បង្ហាញកំណត់ហេតុដែលបានលុប
          </label>
        </div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:6px;">
            <i data-lucide="filter" style="width:14px;height:14px;color:var(--text-secondary)"></i>
            <span style="font-size:0.85rem;color:var(--text-secondary);">ប្រភេទ៖</span>
            <select class="filter-select" data-f="category" style="padding:6px 12px;border-radius:8px;">
              <option value="All" ${state.categoryFilter === 'All' ? 'selected' : ''}>គ្រប់ប្រភេទទាំងអស់</option>
              <option value="សិក្សាធិការ" ${state.categoryFilter === 'សិក្សាធិការ' ? 'selected' : ''}>ពាក់ព័ន្ធសិក្សាធិការ</option>
              <option value="ហិរញ្ញវត្ថុ" ${state.categoryFilter === 'ហិរញ្ញវត្ថុ' ? 'selected' : ''}>ហិរញ្ញវត្ថុ / ម៉ោងបង្រៀន</option>
              <option value="ប្រព័ន្ធ" ${state.categoryFilter === 'ប្រព័ន្ធ' ? 'selected' : ''}>ប្រតិបត្តិការប្រព័ន្ធ</option>
              <option value="សុវត្ថិភាព" ${state.categoryFilter === 'សុវត្ថិភាព' ? 'selected' : ''}>ផ្នែកសន្តិសុខ / សុវត្ថិភាព</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:0.85rem;color:var(--text-secondary);">ស្ថានភាព៖</span>
            <select class="filter-select" data-f="status" style="padding:6px 12px;border-radius:8px;">
              <option value="All" ${state.statusFilter === 'All' ? 'selected' : ''}>គ្រប់ស្ថានភាពទាំងអស់</option>
              <option value="ជោគជ័យ" ${state.statusFilter === 'ជោគជ័យ' ? 'selected' : ''}>ជោគជ័យ</option>
              <option value="ការព្រមាន" ${state.statusFilter === 'ការព្រមាន' ? 'selected' : ''}>ការព្រមាន</option>
              <option value="គ្រោះថ្នាក់" ${state.statusFilter === 'គ្រោះថ្នាក់' ? 'selected' : ''}>គ្រោះថ្នាក់</option>
              <option value="ព័ត៌មាន" ${state.statusFilter === 'ព័ត៌មាន' ? 'selected' : ''}>ព័ត៌មាន</option>
            </select>
          </div>
        </div>
      </div>

      <div class="glass-panel animate-slide-up" style="padding:16px;overflow:hidden;position:relative;">
        ${state.autoRefresh ? `<div style="position:absolute;top:0;left:0;right:0;height:3px;background-color:rgba(79,70,229,0.05);overflow:hidden;"><div class="countdown-bar"></div></div>` : ''}
        <div class="table-container" style="border:none;background-color:transparent;margin-top:${state.autoRefresh ? '4px' : '0'};">
          <table style="border-collapse:separate;border-spacing:0 6px;">
            <thead><tr style="background-color:transparent;">
              <th style="background:transparent;padding:12px 16px;font-size:0.75rem;">អ្នកប្រើប្រាស់</th>
              <th style="background:transparent;padding:12px 16px;font-size:0.75rem;">ប្រភេទ</th>
              <th style="background:transparent;padding:12px 16px;font-size:0.75rem;">សកម្មភាពប្រតិបត្តិការ</th>
              <th style="background:transparent;padding:12px 16px;font-size:0.75rem;">ពេលវេលា</th>
              <th style="background:transparent;padding:12px 16px;font-size:0.75rem;">អាសយដ្ឋាន IP</th>
              <th style="background:transparent;padding:12px 16px;width:120px;"></th>
            </tr></thead>
            <tbody>
              ${paginatedLogs.length > 0 ? paginatedLogs.map(log => {
                const cat = getCategoryMeta(log.category);
                const statusCol = getStatusColor(log.status);
                return `
                  <tr data-log="${log.id}" class="log-row ${log.isDeleted ? 'deleted-row' : ''}" style="background-color:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.01);border-radius:10px;">
                    <td style="padding:14px 16px;border-top-left-radius:10px;border-bottom-left-radius:10px;border-bottom:none;">
                      <div style="display:flex;align-items:center;gap:10px;">
                        <div class="avatar" style="width:32px;height:32px;font-size:0.8rem;font-weight:700;background-color:${log.isDeleted ? '#9ca3af' : cat.color};">${log.user.split(' ').map(n => n[0]).join('')}</div>
                        <div><div style="font-weight:600;color:var(--text-primary);">${log.user}</div><div style="font-size:0.75rem;color:var(--text-secondary);margin-top:1px;">${log.role}</div></div>
                      </div>
                    </td>
                    <td style="padding:14px 16px;border-bottom:none;">
                      ${log.isDeleted
                        ? `<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;font-size:0.72rem;font-weight:600;color:#4b5563;background-color:#e5e7eb;"><i data-lucide="alert-octagon" style="width:12px;height:12px"></i> បានលុប</span>`
                        : `<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:8px;font-size:0.72rem;font-weight:600;color:${cat.color};background-color:${cat.bg};"><i data-lucide="${cat.icon}" style="width:14px;height:14px"></i> ${log.category}</span>`}
                    </td>
                    <td style="padding:14px 16px;border-bottom:none;">
                      <div style="display:flex;align-items:center;gap:8px;">
                        <span style="width:6px;height:6px;border-radius:50%;background-color:${log.isDeleted ? '#9ca3af' : statusCol};display:inline-block;flex-shrink:0;"></span>
                        <span style="color:${log.isDeleted ? 'var(--text-secondary)' : 'var(--text-primary)'};font-weight:500;font-size:0.82rem;text-decoration:${log.isDeleted ? 'line-through' : 'none'};">${log.action}</span>
                      </div>
                    </td>
                    <td style="padding:14px 16px;border-bottom:none;"><div style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:0.8rem;"><i data-lucide="clock" style="width:13px;height:13px"></i> ${log.time}</div></td>
                    <td style="padding:14px 16px;border-bottom:none;"><span style="font-family:monospace;font-size:0.75rem;color:var(--text-muted);background-color:#f3f4f6;padding:2px 6px;border-radius:4px;">${log.ip}</span></td>
                    <td style="padding:14px 16px;border-top-right-radius:10px;border-bottom-right-radius:10px;border-bottom:none;text-align:right;">
                      ${log.isDeleted
                        ? `<button data-action="recover" data-id="${log.id}" class="btn" style="padding:4px 10px;background-color:rgba(16,185,129,0.1);color:var(--success);font-size:0.75rem;border-radius:6px;border:none;display:inline-flex;align-items:center;gap:4px;"><i data-lucide="rotate-ccw" style="width:12px;height:12px"></i> ស្ដារឡើងវិញ</button>`
                        : `<div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;color:var(--text-secondary);"><i data-lucide="chevron-right" style="width:16px;height:16px"></i></div>`}
                    </td>
                  </tr>
                `;
              }).join('') : `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--text-secondary);border-bottom:none;"><div style="display:flex;flex-direction:column;align-items:center;gap:8px;"><i data-lucide="alert-triangle" style="width:36px;height:36px;color:var(--text-secondary)"></i><span style="font-weight:600;">រកមិនឃើញប្រវត្តិសកម្មភាពដែលត្រូវគ្នាឡើយ</span><span style="font-size:0.8rem;">សូមសាកល្បងស្វែងរកឡើងវិញជាមួយនឹងពាក្យគន្លឹះផ្សេងទៀត</span></div></td></tr>`}
            </tbody>
          </table>
        </div>
        ${filteredLogs.length > 0 ? `
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
            <div style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary);">
              <span>បង្ហាញកំណត់ហេតុ</span>
              <select class="filter-select" data-f="items-per-page" style="padding:6px 12px;border-radius:8px;font-weight:600;">
                ${[5, 10, 50, 100, 200].map(n => `<option value="${n}" ${state.itemsPerPage === n ? 'selected' : ''}>${toKhmerNumerals(n)} ករណី / ទំព័រ</option>`).join('')}
              </select>
              <span>ក្នុងមួយទំព័រ</span>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <button data-action="prev-page" ${safePage === 1 ? 'disabled' : ''} class="btn" style="padding:6px 10px;border:1px solid var(--border);background-color:#fff;cursor:${safePage === 1 ? 'not-allowed' : 'pointer'};opacity:${safePage === 1 ? 0.5 : 1};"><i data-lucide="chevron-left" style="width:16px;height:16px"></i></button>
              ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `<button data-page="${p}" style="width:32px;height:32px;border-radius:8px;border:1px solid ${safePage === p ? 'var(--primary)' : 'var(--border)'};background-color:${safePage === p ? 'var(--primary)' : '#fff'};color:${safePage === p ? '#fff' : 'var(--text-primary)'};font-weight:600;font-size:0.85rem;cursor:pointer;">${p}</button>`).join('')}
              <button data-action="next-page" ${safePage === totalPages ? 'disabled' : ''} class="btn" style="padding:6px 10px;border:1px solid var(--border);background-color:#fff;cursor:${safePage === totalPages ? 'not-allowed' : 'pointer'};opacity:${safePage === totalPages ? 0.5 : 1};"><i data-lucide="chevron-right" style="width:16px;height:16px"></i></button>
            </div>
          </div>
        ` : ''}
      </div>

      ${renderDetailDrawer()}
      ${renderDeleteModal()}
    </div>
  `;

  root.querySelector('[data-action="toggle-auto-refresh"]').addEventListener('click', toggleAutoRefresh);
  root.querySelector('[data-action="refresh"]').addEventListener('click', handleRefresh);
  const searchInput = root.querySelector('[data-role="search"]');
  onLiveInput(searchInput, () => { state = { ...state, searchQuery: searchInput.value, currentPage: 1 }; withFocusPreserved(root, update); });
  const clearSearchBtn = root.querySelector('[data-action="clear-search"]');
  if (clearSearchBtn) clearSearchBtn.addEventListener('click', () => { state = { ...state, searchQuery: '', currentPage: 1 }; update(); });
  root.querySelector('[data-action="toggle-deleted"]').addEventListener('change', (e) => { state = { ...state, showDeletedLogs: e.target.checked, currentPage: 1 }; update(); });
  root.querySelector('[data-f="category"]').addEventListener('change', (e) => { state = { ...state, categoryFilter: e.target.value, currentPage: 1 }; update(); });
  root.querySelector('[data-f="status"]').addEventListener('change', (e) => { state = { ...state, statusFilter: e.target.value, currentPage: 1 }; update(); });
  const itemsPerPageSel = root.querySelector('[data-f="items-per-page"]');
  if (itemsPerPageSel) itemsPerPageSel.addEventListener('change', (e) => { state = { ...state, itemsPerPage: Number(e.target.value), currentPage: 1 }; update(); });
  const prevBtn = root.querySelector('[data-action="prev-page"]');
  if (prevBtn) prevBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.max(1, safePage - 1) }; update(); });
  const nextBtn = root.querySelector('[data-action="next-page"]');
  if (nextBtn) nextBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.min(totalPages, safePage + 1) }; update(); });
  root.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => { state = { ...state, currentPage: Number(btn.dataset.page) }; update(); }));

  root.querySelectorAll('[data-log]').forEach(row => row.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="recover"]')) return;
    const log = state.logs.find(l => l.id === row.dataset.log);
    if (!log.isDeleted) { state = { ...state, selectedLog: log }; update(); }
  }));
  root.querySelectorAll('[data-action="recover"]').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); handleRecoverLog(btn.dataset.id); }));

  root.querySelectorAll('[data-action="close-detail"]').forEach(el => el.addEventListener('click', () => { state = { ...state, selectedLog: null }; update(); }));
  const openDeleteModalBtn = root.querySelector('[data-action="open-delete-modal"]');
  if (openDeleteModalBtn) openDeleteModalBtn.addEventListener('click', () => { state = { ...state, logToDelete: state.selectedLog, showDeleteModal: true }; update(); });
  root.querySelectorAll('[data-action="close-delete-modal"]').forEach(el => el.addEventListener('click', () => { state = { ...state, showDeleteModal: false }; update(); }));
  const confirmDeleteBtn = root.querySelector('[data-action="confirm-delete"]');
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', executeSoftDelete);

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { logs: mockLogs, searchQuery: '', categoryFilter: 'All', statusFilter: 'All', selectedLog: null, isRefreshing: false, autoRefresh: false, currentPage: 1, itemsPerPage: 5, showDeleteModal: false, logToDelete: null, showDeletedLogs: false };
  update();
}

export function destroy() {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  root = null;
}
