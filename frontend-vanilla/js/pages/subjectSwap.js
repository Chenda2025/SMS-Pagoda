// Ports pages/SubjectSwap.jsx.
// Originally talked to the legacy Node/Express backend (port 5000, /api/subject-swaps
// etc.), which no longer exists in this project. Migrated to the Django
// schedule-substitutions API, the same backing store the monitor's
// substitute-teacher flow already uses (js/pages/monitorSchedule.js).

import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';
import { api } from '../api.js';
import { createSearchSelect } from '../components/searchSelect.js';
import { showToast } from '../components/toast.js';
import { onLiveInput } from '../utils/dom.js';

function toKhmerNumerals(num) {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().replace(/\d/g, d => khmerDigits[d]);
}

function calculateTotalHours(start, end) {
  if (!start || !end) return 'N/A';
  try {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const diffInMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffInMinutes <= 0) return '0 ម៉ោង';
    const hours = Math.floor(diffInMinutes / 60);
    const mins = diffInMinutes % 60;
    return mins === 0 ? `${hours} ម៉ោង` : `${hours} ម៉ោង ${mins} នាទី`;
  } catch {
    return 'N/A';
  }
}

function parseSwapDate(dateStr) {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  if (!isNaN(d)) return d;
  return new Date();
}
function getWeekOfMonth(dateStr) {
  const d = parseSwapDate(dateStr);
  return Math.min(4, Math.ceil(d.getDate() / 7));
}
function isoWeekOf(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}
function formatHM(timeStr) {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

const STATUS_LABEL = { pending: 'រង់ចាំអនុម័ត', approved: 'បានជំនួស', rejected: 'បានបដិសេធ' };

const defaultHeaderConfig = {
  leftLine1: 'មន្ទីរធម្មការនិងសាសនារាជធានី', leftLine2: 'ភ្នំពេញ', leftLine3: 'សាលា ព.អ.វ.ខ.រ.',
  rightLine1: 'ព្រះរាជាណាចក្រកម្ពុជា', rightLine2: 'ជាតិ សាសនា ព្រះមហាក្សត្រ', rightLine3: 'ធម្មចក្រ',
  centerTitle1: 'របាយការណ៍ប្រវត្តិប្តូរមុខវិជ្ជា និងគ្រូជំនួស', centerTitle2: 'នៃសាលាពុទ្ធិកអនុវិទ្យាល័យ សម្ដេចព្រះមហាសង្ឃរាជ ទេព វង្ស វត្តរាជបូរណ៍',
  signatureLocation: 'វត្តរាជបូរណ៍', signatureRole: 'នាយកសាលា',
};

const emptyForm = { classroom: null, date: new Date().toISOString().slice(0, 10), timeSlot: null, originalSubject: null, originalTeacher: null, replacementSubject: null, replacementTeacher: null, reason: '' };

let root = null;
const itemsPerPage = 10;
let state = {
  swaps: [], classesList: [], subjectsList: [], teachersList: [], timeSlotsList: [], formData: { ...emptyForm },
  editingSwapId: null, selectedSwaps: [], currentPage: 1,
  showPreviewModal: false, showHeaderModal: false, isSendingReport: false,
  headerConfig: JSON.parse(localStorage.getItem('exportHeaderConfigSwap')) || defaultHeaderConfig,
  khmerDate: (() => { try { return toKhmerLunarDate(new Date()).lunarDateText || ''; } catch { return ''; } })(),
  filterType: 'week', filterValue: isoWeekOf(new Date()),
};

function persistHeaderConfig() { localStorage.setItem('exportHeaderConfigSwap', JSON.stringify(state.headerConfig)); }

// --- Lookups (the API returns raw FK ids; resolve display text client-side,
// same convention as schedule.js / classSubjects.js). ---
function classroomName(id) { return state.classesList.find(c => String(c.id) === String(id))?.class_name || ''; }
function subjectName(id) { return state.subjectsList.find(s => String(s.id) === String(id))?.subject_name || ''; }
function teacherName(id) {
  const t = state.teachersList.find(t => String(t.id) === String(id));
  return t ? `${t.last_name || ''} ${t.first_name || ''}`.trim() : '';
}
function timeSlotOf(id) { return state.timeSlotsList.find(t => String(t.id) === String(id)); }
function timeSlotLabel(id) {
  const ts = timeSlotOf(id);
  if (!ts) return '';
  return `${ts.session === 'morning' ? 'ព្រឹក' : 'រសៀល'} ${formatHM(ts.start_time)}-${formatHM(ts.end_time)}`;
}

async function fetchData() {
  try {
    const [swapsRes, classesRes, subjectsRes, teachersRes, timeSlotsRes] = await Promise.all([
      api.get('/api/core/schedule-substitutions/'),
      api.get('/api/core/classrooms/'),
      api.get('/api/core/subjects/'),
      api.get('/api/users/teachers/'),
      api.get('/api/core/time-slots/'),
    ]);
    state = {
      ...state,
      swaps: swapsRes.ok ? (swapsRes.data || []) : [],
      classesList: classesRes.ok ? (classesRes.data || []) : [],
      subjectsList: subjectsRes.ok ? (subjectsRes.data || []) : [],
      teachersList: teachersRes.ok ? (teachersRes.data || []) : [],
      timeSlotsList: timeSlotsRes.ok ? (timeSlotsRes.data || []).sort((a, b) => a.slot_no - b.slot_no) : [],
    };
  } catch (err) {
    console.error('Error loading subject-swap data:', err);
    showToast('បរាជ័យក្នុងការទាញយកទិន្នន័យ', 'danger');
  }
  update();
}

function getFilteredSwaps() {
  return state.swaps.filter(swap => {
    if (state.filterType === 'all') return true;
    const dateStr = swap.change_date;
    if (!dateStr || !state.filterValue) return true;
    const swapDate = parseSwapDate(dateStr);
    if (state.filterType === 'day') return `${swapDate.getFullYear()}-${String(swapDate.getMonth() + 1).padStart(2, '0')}-${String(swapDate.getDate()).padStart(2, '0')}` === state.filterValue;
    if (state.filterType === 'month') return `${swapDate.getFullYear()}-${String(swapDate.getMonth() + 1).padStart(2, '0')}` === state.filterValue;
    if (state.filterType === 'year') return swapDate.getFullYear().toString() === state.filterValue;
    if (state.filterType === 'week') return isoWeekOf(swapDate) === state.filterValue;
    return true;
  }).sort((a, b) => (b.change_date || '').localeCompare(a.change_date || ''));
}

function groupSwaps(paginatedSwaps) {
  const groupedSwaps = {};
  if (state.filterType === 'month') {
    paginatedSwaps.forEach(swap => {
      const weekNum = swap.change_date ? getWeekOfMonth(swap.change_date) : 1;
      (groupedSwaps[weekNum] = groupedSwaps[weekNum] || []).push(swap);
    });
  } else if (state.filterType === 'year') {
    paginatedSwaps.forEach(swap => {
      const monthIdx = parseSwapDate(swap.change_date).getMonth() + 1;
      (groupedSwaps[monthIdx] = groupedSwaps[monthIdx] || []).push(swap);
    });
  } else {
    groupedSwaps[1] = paginatedSwaps;
  }
  return groupedSwaps;
}

function handleEditClick(swap) {
  state = {
    ...state, editingSwapId: swap.id,
    formData: {
      classroom: swap.classroom, date: swap.change_date, timeSlot: swap.time_slot,
      originalSubject: swap.original_subject, originalTeacher: swap.original_teacher,
      replacementSubject: swap.new_subject, replacementTeacher: swap.new_teacher,
      reason: swap.reason || '',
    },
  };
  update();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleDeleteSwap(id) {
  if (!window.confirm('តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?')) return;
  try {
    const res = await api.del(`/api/core/schedule-substitutions/${id}/`);
    if (!res.ok) throw new Error();
    state = { ...state, swaps: state.swaps.filter(s => s.id !== id), selectedSwaps: state.selectedSwaps.filter(sid => sid !== id) };
    showToast('លុបទិន្នន័យជោគជ័យ');
    update();
  } catch {
    showToast('បរាជ័យក្នុងការលុប', 'danger');
  }
}

async function handleBulkDelete() {
  if (state.selectedSwaps.length === 0) return;
  if (!window.confirm(`តើអ្នកពិតជាចង់លុបទិន្នន័យចំនួន ${state.selectedSwaps.length} នេះមែនទេ?`)) return;
  try {
    const results = await Promise.all(state.selectedSwaps.map(id => api.del(`/api/core/schedule-substitutions/${id}/`)));
    const failed = results.some(r => !r.ok);
    state = { ...state, swaps: state.swaps.filter(s => !state.selectedSwaps.includes(s.id)), selectedSwaps: [] };
    update();
    showToast(failed ? 'ការលុបខ្លះមិនបានជោគជ័យ' : `លុបទិន្នន័យចំនួន ${state.selectedSwaps.length} ជោគជ័យ`, failed ? 'danger' : 'success');
  } catch {
    showToast('បរាជ័យក្នុងការលុប', 'danger');
  }
}

async function handleAddSwap(e) {
  e.preventDefault();
  const f = state.formData;
  if (!f.classroom || !f.date || !f.timeSlot || !f.originalSubject || !f.replacementSubject) {
    showToast('សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់', 'danger');
    return;
  }
  const payload = {
    classroom: f.classroom, change_date: f.date, time_slot: f.timeSlot,
    original_subject: f.originalSubject, original_teacher: f.originalTeacher || null,
    new_subject: f.replacementSubject, new_teacher: f.replacementTeacher || null,
    reason: f.reason || 'មិនមានបញ្ជាក់មូលហេតុ',
  };
  try {
    if (state.editingSwapId) {
      const res = await api.put(`/api/core/schedule-substitutions/${state.editingSwapId}/`, { ...payload, status: state.swaps.find(s => s.id === state.editingSwapId)?.status || 'pending' });
      if (!res.ok) throw new Error();
      state = { ...state, swaps: state.swaps.map(s => s.id === state.editingSwapId ? res.data : s), editingSwapId: null };
      showToast('ការកែប្រែត្រូវបានរក្សាទុក!');
    } else {
      const res = await api.post('/api/core/schedule-substitutions/', { ...payload, status: 'pending' });
      if (!res.ok) throw new Error();
      state = { ...state, swaps: [res.data, ...state.swaps] };
      showToast('ការស្នើសុំប្តូរមុខវិជ្ជាត្រូវបានរក្សាទុក!');
    }
    state.formData = { ...emptyForm };
    update();
  } catch (err) {
    console.error('Error adding/updating swap:', err);
    showToast('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ', 'danger');
  }
}

async function handleUpdateStatus(id, newStatus) {
  try {
    const res = await api.patch(`/api/core/schedule-substitutions/${id}/`, { status: newStatus });
    if (!res.ok) throw new Error();
    state = { ...state, swaps: state.swaps.map(s => s.id === id ? res.data : s) };
    showToast('ស្ថានភាពត្រូវបានផ្លាស់ប្តូរ!');
    update();
  } catch (err) {
    console.error('Error updating status:', err);
    showToast('មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព', 'danger');
  }
}

function handleSendRowTelegram(swap) {
  const tgConfigStr = localStorage.getItem('tgConfig');
  if (!tgConfigStr) { showToast('សូមកំណត់ Telegram Bot ជាមុនសិន!', 'danger'); return; }
  const tgConfig = JSON.parse(tgConfigStr);
  if (!tgConfig.token || !tgConfig.chatId) { showToast('សូមកំណត់ Telegram Bot ជាមុនសិន!', 'danger'); return; }

  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const parsedD = parseSwapDate(swap.change_date);
  const realDate = `ថ្ងៃទី ${String(parsedD.getDate()).padStart(2, '0')} ខែ ${months[parsedD.getMonth()]} ឆ្នាំ ${parsedD.getFullYear()}`;
  const ts = timeSlotOf(swap.time_slot);
  const amPm = ts ? (ts.session === 'morning' ? ' (ព្រឹក)' : ' (រសៀល)') : '';

  const msg = `----- សូមប្រគេនដំណឹង -----\nកាលបរិច្ឆេទ៖ ${realDate}\nសិក្សា៖ ${classroomName(swap.classroom)} ម៉ោង៖ ${ts ? `${formatHM(ts.start_time)} - ${formatHM(ts.end_time)}` : '...'}${amPm}\n--- មុខវិជ្ជា៖ ${subjectName(swap.original_subject)} គ្រូ៖ ${teacherName(swap.original_teacher) || '...'} ---\nប្តូរមក\n--- មុខវិជ្ជា៖ ${subjectName(swap.new_subject)} គ្រូ៖ ${teacherName(swap.new_teacher) || '...'} ---\nអាស្រ័យហេតុដូចបានប្រគេនខាងលើ សូមសមណសិស្សគ្រប់អង្គជ្រាបជាដំណឹង។`;

  fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: tgConfig.chatId, text: msg }) })
    .then(res => showToast(res.ok ? 'បានផ្ញើសារចូល Telegram ជោគជ័យ! 🎉' : 'បរាជ័យក្នុងការផ្ញើ សូមពិនិត្យការកំណត់ឡើងវិញ', res.ok ? 'success' : 'danger'))
    .catch(() => showToast('មានបញ្ហាភ្ជាប់ទៅកាន់ Telegram', 'danger'));
}

function handleExportExcel() {
  const wsData = [['កាលបរិច្ឆេទ & ថ្នាក់', 'មុខវិជ្ជា/គ្រូដើម', 'មុខវិជ្ជា/គ្រូជំនួស', 'មូលហេតុ', 'ស្ថានភាព']];
  state.swaps.forEach(swap => wsData.push([
    `${classroomName(swap.classroom)} | ${swap.change_date}`,
    `${subjectName(swap.original_subject)} (${teacherName(swap.original_teacher)})`,
    `${subjectName(swap.new_subject)} (${teacherName(swap.new_teacher)})`,
    swap.reason, STATUS_LABEL[swap.status] || swap.status,
  ]));
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Subject_Swaps');
  XLSX.writeFile(wb, `ប្រវត្តិប្តូរមុខវិជ្ជា_${Date.now()}.xlsx`);
}

function handleExportPDF() {
  const el = document.getElementById('report-content');
  if (!el) return;
  html2pdf().set({ margin: 10, filename: `Subject_Swaps_Export_${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(el).save();
}

function handleExportWord() {
  const el = document.getElementById('report-content');
  if (!el) return;
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export</title><style>body{font-family:'Khmer OS Battambang',sans-serif;font-size:12pt;}table{border-collapse:collapse;width:100%;margin-top:20px;}th,td{border:1px solid black;padding:8px;}th{background-color:#f8fafc;}</style></head><body>${el.innerHTML}</body></html>`;
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `Subject_Swaps_Export_${Date.now()}.doc`;
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

async function handleSendTelegramReport() {
  const tgConfigStr = localStorage.getItem('tgConfig');
  if (!tgConfigStr) { showToast('សូមកំណត់ Telegram Bot ជាមុនសិន!', 'danger'); return; }
  const tgConfig = JSON.parse(tgConfigStr);
  if (!tgConfig.token || !tgConfig.chatId) { showToast('សូមកំណត់ Telegram Bot ជាមុនសិន!', 'danger'); return; }
  state = { ...state, isSendingReport: true };
  update();
  try {
    const el = document.getElementById('report-content');
    if (!el) throw new Error('Report content not found');
    const pdfBlob = await html2pdf().set({ margin: 10, filename: `Subject_Swaps_Export_${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(el).output('blob');
    const captionText = `---- ប្រគេនដំណឹងនាយក ----\nរបាយការណ៍ប្រវត្តិប្តូរមុខវិជ្ជា និងគ្រូជំនួស៖\n----- សរុបចំនួន ${toKhmerNumerals(state.swaps.length)} ដង -----\n`;
    const fd = new FormData();
    fd.append('chat_id', tgConfig.chatId);
    fd.append('document', pdfBlob, `Subject_Swaps_${Date.now()}.pdf`);
    fd.append('caption', captionText);
    const res = await fetch(`https://api.telegram.org/bot${tgConfig.token.replace(/^bot/i, "")}/sendDocument`, { method: 'POST', body: fd });
    showToast(res.ok ? 'បានផ្ញើឯកសារចូល Telegram ជោគជ័យ! 🎉' : 'បរាជ័យក្នុងការផ្ញើចូល Telegram សូមពិនិត្យការកំណត់ឡើងវិញ', res.ok ? 'success' : 'danger');
  } catch {
    showToast('មានបញ្ហាភ្ជាប់ទៅកាន់ Telegram', 'danger');
  } finally {
    state = { ...state, isSendingReport: false };
    update();
  }
}

function getOptions() {
  const classOptions = state.classesList.map(c => ({ value: String(c.id), label: c.class_name }));
  const subjectOptions = state.subjectsList.map(s => ({ value: String(s.id), label: s.subject_name }));
  const teacherOptions = state.teachersList.map(t => ({ value: String(t.id), label: `${t.last_name || ''} ${t.first_name || ''}`.trim() }));
  const timeSlotOptions = state.timeSlotsList.map(ts => ({ value: String(ts.id), label: `${ts.session === 'morning' ? 'ព្រឹក' : 'រសៀល'} ម៉ោង ${ts.slot_no} (${formatHM(ts.start_time)}-${formatHM(ts.end_time)})` }));
  return { classOptions, subjectOptions, teacherOptions, timeSlotOptions };
}

function renderPreviewModal(groupedSwaps, filteredSwaps) {
  if (!state.showPreviewModal) return '';
  const hc = state.headerConfig;
  return `
    <div data-stop style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(15,23,42,0.75);z-index:999999;backdrop-filter:blur(8px);display:flex;flex-direction:column;padding:100px 32px 32px;">
      <div class="animate-scale-in" style="flex:1;width:100%;max-width:1200px;margin:0 auto;background-color:#f8fafc;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
        <div class="no-print" style="padding:20px 32px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background-color:white;">
          <h2 style="font-family:Moul;font-size:1.2rem;color:var(--primary);margin:0;">មើលរបាយការណ៍ និង នាំចេញទិន្នន័យ</h2>
          <div style="display:flex;gap:12px;align-items:center;">
            <button data-action="open-header-modal" class="btn btn-secondary" style="display:flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:10px;"><i data-lucide="edit-3" style="width:16px;height:16px;color:#8b5cf6"></i> កំណត់ក្បាលឯកសារ</button>
            <button data-action="window-print" class="btn btn-secondary" style="display:flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:10px;"><i data-lucide="printer" style="width:16px;height:16px"></i> បោះពុម្ព</button>
            <div style="display:flex;border:1px solid var(--border);border-radius:10px;overflow:hidden;">
              <button data-action="export-pdf" class="btn btn-secondary" style="border-radius:0;border:none;display:flex;align-items:center;gap:6px;padding:8px 16px;"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444"></i> PDF</button>
              <button data-action="export-word" class="btn btn-secondary" style="border-radius:0;border:none;display:flex;align-items:center;gap:6px;padding:8px 16px;"><i data-lucide="file-text" style="width:16px;height:16px;color:#2563eb"></i> Word</button>
              <button data-action="export-excel" class="btn btn-secondary" style="border-radius:0;border:none;display:flex;align-items:center;gap:6px;padding:8px 16px;"><i data-lucide="download" style="width:16px;height:16px;color:#10b981"></i> Excel</button>
              <button data-action="export-telegram" ${state.isSendingReport ? 'disabled' : ''} class="btn btn-secondary" style="border-radius:0;border:none;display:flex;align-items:center;gap:6px;padding:8px 16px;"><i data-lucide="send" style="width:16px;height:16px;color:#3b82f6"></i> ${state.isSendingReport ? 'កំពុងផ្ញើ...' : 'Telegram'}</button>
            </div>
            <button data-action="close-preview" style="width:40px;height:40px;border-radius:50%;margin-left:12px;display:flex;align-items:center;justify-content:center;border:none;background:#f1f5f9;cursor:pointer;color:var(--text-secondary);"><i data-lucide="x" style="width:20px;height:20px"></i></button>
          </div>
        </div>
        <div style="padding:40px;overflow-y:auto;flex:1;display:flex;justify-content:center;background-color:#e2e8f0;">
          <div id="report-content" class="a4-paper print-container" style="background-color:white;width:210mm;min-height:297mm;padding:20mm;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);position:relative;">
            <div style="color:#00008b;font-family:Moul;font-size:0.9rem;">
              <table style="width:100%;border:none;margin-bottom:20px;"><tbody><tr>
                <td style="width:40%;text-align:center;vertical-align:top;border:none;">
                  <div style="line-height:1.6;white-space:nowrap;">${hc.leftLine1}<br/>${hc.leftLine2}${hc.leftLine3 ? `<br/>${hc.leftLine3}` : ''}</div>
                  <div style="border-bottom:1.5px solid #00008b;width:40%;margin:6px auto 0;"></div>
                </td>
                <td style="width:20%;text-align:center;vertical-align:top;border:none;"><div style="width:80px;height:80px;margin:0 auto;display:flex;align-items:center;justify-content:center;overflow:hidden;"><img src="/logo.png" style="width:100%;height:100%;object-fit:contain;" alt="Logo" onerror="this.style.display='none'" /></div></td>
                <td style="width:40%;text-align:center;vertical-align:top;border:none;"><div style="line-height:1.6;white-space:nowrap;">${hc.rightLine1}<br/>${hc.rightLine2}${hc.rightLine3 ? `<br/><span style="${hc.rightLine3.trim() === 'ធម្មចក្រ' ? 'font-family:sans-serif;font-size:32px;display:inline-block;line-height:0.8;margin-top:8px;color:#00008b;' : ''}">${hc.rightLine3.trim() === 'ធម្មចក្រ' ? '☸' : hc.rightLine3}</span>` : ''}</div></td>
              </tr></tbody></table>
            </div>
            <div style="text-align:center;margin-bottom:15px;color:#00008b;"><h3 style="font-family:Moul;font-size:16px;margin:0;">${hc.centerTitle1}</h3><div style="font-family:Moul;font-size:14px;margin-top:6px;">${hc.centerTitle2}</div></div>
            <div style="text-align:right;font-size:12px;color:#1e3a8a;margin-bottom:20px;">${state.khmerDate}</div>
            <table style="width:100%;border-collapse:collapse;font-size:12px;color:#1e3a8a;">
              <thead><tr>
                <th style="border:1px solid #1e3a8a;padding:8px;background-color:#f8fafc;">ល.រ</th>
                <th style="border:1px solid #1e3a8a;padding:8px;background-color:#f8fafc;">កាលបរិច្ឆេទ & ថ្នាក់</th>
                <th style="border:1px solid #1e3a8a;padding:8px;background-color:#f8fafc;">មុខវិជ្ជា/គ្រូដើម</th>
                <th style="border:1px solid #1e3a8a;padding:8px;background-color:#f8fafc;">មុខវិជ្ជា/គ្រូជំនួស</th>
                <th style="border:1px solid #1e3a8a;padding:8px;background-color:#f8fafc;">មូលហេតុ</th>
                <th style="border:1px solid #1e3a8a;padding:8px;background-color:#f8fafc;">ស្ថានភាព</th>
              </tr></thead>
              <tbody>
                ${filteredSwaps.length === 0 ? `<tr><td colspan="6" style="border:1px solid #1e3a8a;padding:20px;text-align:center;">មិនទាន់មានទិន្នន័យ</td></tr>` : Object.keys(groupedSwaps).sort().flatMap(week => {
                  const rows = [];
                  if (state.filterType === 'month' && groupedSwaps[week].length > 0) rows.push(`<tr style="background-color:#f8fafc;"><td colspan="6" style="border:1px solid #1e3a8a;padding:6px 12px;font-weight:600;color:#00008b;text-align:center;">សប្ដាហ៍ទី ${toKhmerNumerals(week)}</td></tr>`);
                  groupedSwaps[week].forEach((swap, idx) => rows.push(`
                    <tr>
                      <td style="border:1px solid #1e3a8a;padding:8px;text-align:center;">${toKhmerNumerals(idx + 1)}</td>
                      <td style="border:1px solid #1e3a8a;padding:8px;"><div>${classroomName(swap.classroom)}</div><div style="font-size:10px;">${swap.change_date}</div></td>
                      <td style="border:1px solid #1e3a8a;padding:8px;"><div>${subjectName(swap.original_subject)}</div><div style="font-size:10px;">${teacherName(swap.original_teacher)}</div></td>
                      <td style="border:1px solid #1e3a8a;padding:8px;"><div>${subjectName(swap.new_subject)}</div><div style="font-size:10px;">${teacherName(swap.new_teacher)}</div></td>
                      <td style="border:1px solid #1e3a8a;padding:8px;">${swap.reason || ''}</td>
                      <td style="border:1px solid #1e3a8a;padding:8px;text-align:center;">${STATUS_LABEL[swap.status] || swap.status}</td>
                    </tr>
                  `));
                  return rows;
                }).join('')}
              </tbody>
            </table>
            <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:12px;color:#00008b;padding:0 20px;">
              <div style="text-align:center;line-height:1.8;">${state.khmerDate}<br/>${hc.signatureLocation}<div style="margin-top:4px;">បានឃើញ និងឯកភាព</div><div style="font-family:Moul;margin-top:15px;">នាយកសាលា</div></div>
              <div style="text-align:center;line-height:1.8;">${state.khmerDate}<br/>${hc.signatureLocation}<div style="font-family:Moul;margin-top:33px;">${hc.signatureRole}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHeaderModal() {
  if (!state.showHeaderModal) return '';
  const hc = state.headerConfig;
  return `
    <div data-stop style="position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(15,23,42,0.4);z-index:1000000;backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:40px;">
      <div class="animate-scale-in" style="width:100%;max-width:800px;max-height:90vh;background-color:#fff;border-radius:24px;overflow-y:auto;display:flex;flex-direction:column;padding:32px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
          <div><h3 style="font-family:Moul;margin:0 0 8px 0;color:#4338ca;font-size:1.4rem;">កំណត់ក្បាលឯកសារ (Header Settings)</h3><p style="margin:0;font-size:0.9rem;color:var(--text-secondary);">ផ្លាស់ប្ដូរអក្សរសម្រាប់ក្បាលខាងលើ និងចំណងជើង</p></div>
          <button data-action="close-header-modal" style="width:40px;height:40px;border-radius:50%;background:#f1f5f9;border:none;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;"><i data-lucide="x" style="width:20px;height:20px"></i></button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          <div style="display:flex;flex-direction:column;gap:16px;">
            <h4 style="margin:0;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">អក្សរឆ្វេង</h4>
            <div><label class="form-label">ជួរទី១</label><input type="text" class="form-input" data-hc="leftLine1" value="${hc.leftLine1}" /></div>
            <div><label class="form-label">ជួរទី២</label><input type="text" class="form-input" data-hc="leftLine2" value="${hc.leftLine2}" /></div>
            <div><label class="form-label">ជួរទី៣</label><input type="text" class="form-input" data-hc="leftLine3" value="${hc.leftLine3 || ''}" /></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <h4 style="margin:0;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">អក្សរស្តាំ</h4>
            <div><label class="form-label">ជួរទី១</label><input type="text" class="form-input" data-hc="rightLine1" value="${hc.rightLine1}" /></div>
            <div><label class="form-label">ជួរទី២</label><input type="text" class="form-input" data-hc="rightLine2" value="${hc.rightLine2}" /></div>
            <div><label class="form-label">ជួរទី៣</label><input type="text" class="form-input" data-hc="rightLine3" value="${hc.rightLine3 || ''}" /></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;margin-top:24px;">
          <h4 style="margin:0;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">ចំណងជើងកណ្តាល និងហត្ថលេខា</h4>
          <div><label class="form-label">ចំណងជើងធំ (ជួរទី១)</label><input type="text" class="form-input" data-hc="centerTitle1" value="${hc.centerTitle1}" /></div>
          <div><label class="form-label">ចំណងជើងរង (ជួរទី២)</label><input type="text" class="form-input" data-hc="centerTitle2" value="${hc.centerTitle2}" /></div>
          <div style="display:flex;gap:20px;">
            <div style="flex:1;"><label class="form-label">ទីកន្លែងចុះហត្ថលេខា</label><input type="text" class="form-input" data-hc="signatureLocation" value="${hc.signatureLocation}" /></div>
            <div style="flex:1;"><label class="form-label">តួនាទីហត្ថលេខា</label><input type="text" class="form-input" data-hc="signatureRole" value="${hc.signatureRole}" /></div>
          </div>
          <div><label class="form-label">កាលបរិច្ឆេទចន្ទគតិ</label><input type="text" class="form-input" data-role="khmer-date" value="${state.khmerDate}" /></div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:32px;"><button data-action="close-header-modal" class="btn btn-primary" style="padding:12px 32px;border-radius:16px;font-weight:800;">រក្សាទុក / បិទ</button></div>
      </div>
    </div>
  `;
}

function update() {
  if (!root) return;
  const f = state.formData;
  const filteredSwaps = getFilteredSwaps();
  const totalPages = Math.max(1, Math.ceil(filteredSwaps.length / itemsPerPage));
  const safePage = Math.min(state.currentPage, totalPages);
  const paginatedSwaps = filteredSwaps.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);
  const groupedSwaps = groupSwaps(paginatedSwaps);
  const groupedAll = groupSwaps(filteredSwaps);
  const opts = getOptions();
  const monthsKh = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

  root.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:40px;position:relative;">
      <h1 class="page-title">ប្រព័ន្ធប្តូរមុខវិជ្ជា និងគ្រូបង្រៀនជំនួស</h1>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div class="glass-panel" style="flex:1;min-width:320px;padding:24px;height:fit-content;">
          <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <i data-lucide="${state.editingSwapId ? 'edit-3' : 'plus'}" style="width:20px;height:20px;color:var(--primary)"></i> ${state.editingSwapId ? 'កែប្រែការប្តូរមុខវិជ្ជា' : 'បង្កើតការប្តូរមុខវិជ្ជាថ្មី'}
          </h3>
          <form data-role="swap-form" style="display:flex;flex-direction:column;gap:16px;">
            <div><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">ថ្នាក់រៀន</label><div data-mount="class-select"></div></div>
            <div style="display:flex;gap:16px;">
              <div style="flex:1;"><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">កាលបរិច្ឆេទ</label><input type="date" data-f="swap-date" value="${f.date || ''}" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;outline:none;" required /></div>
              <div style="flex:1;"><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">ម៉ោង</label><div data-mount="timeslot-select"></div></div>
            </div>
            <div style="display:flex;gap:16px;"><div style="flex:1;"><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">មុខវិជ្ជាដើម</label><div data-mount="orig-subject-select"></div></div><div style="flex:1;"><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">គ្រូដើម</label><div data-mount="orig-teacher-select"></div></div></div>
            <div style="display:flex;align-items:center;justify-content:center;"><div style="background:#f1f5f9;padding:8px;border-radius:50%;"><i data-lucide="arrow-left-right" style="width:18px;height:18px;color:var(--text-muted)"></i></div></div>
            <div style="display:flex;gap:16px;"><div style="flex:1;"><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">មុខវិជ្ជាជំនួស</label><div data-mount="repl-subject-select"></div></div><div style="flex:1;"><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">គ្រូជំនួស</label><div data-mount="repl-teacher-select"></div></div></div>
            <div><label style="font-size:0.8rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px;display:block;">មូលហេតុនៃការប្តូរ</label><textarea data-f="reason" placeholder="ឧ. គ្រូរវល់សម្រាកព្យាបាល" rows="3" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;outline:none;resize:vertical;">${f.reason}</textarea></div>
            <div style="display:flex;gap:12px;">
              <button type="submit" class="btn btn-primary" style="flex:1;justify-content:center;padding:12px;">${state.editingSwapId ? 'កែប្រែទិន្នន័យ' : 'បញ្ជូនសំណើរប្តូរមុខវិជ្ជា'}</button>
              ${state.editingSwapId ? `<button type="button" data-action="cancel-edit" class="btn btn-secondary" style="padding:12px;">បោះបង់</button>` : ''}
            </div>
          </form>
        </div>

        <div class="glass-panel" style="flex:2;min-width:400px;padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
            <h3 style="font-size:1.1rem;font-weight:700;margin:0;display:flex;align-items:center;gap:8px;"><i data-lucide="calendar" style="width:20px;height:20px;color:var(--success)"></i> ប្រវត្តិការប្តូរមុខវិជ្ជាសិក្សា</h3>
            <div style="display:flex;gap:12px;align-items:center;">
              <select class="form-input" data-f="filter-type" style="width:auto;padding:6px 12px;">
                <option value="day" ${state.filterType === 'day' ? 'selected' : ''}>ថ្ងៃ</option>
                <option value="week" ${state.filterType === 'week' ? 'selected' : ''}>សប្ដាហ៍</option>
                <option value="month" ${state.filterType === 'month' ? 'selected' : ''}>ខែ</option>
                <option value="year" ${state.filterType === 'year' ? 'selected' : ''}>ឆ្នាំ</option>
                <option value="all" ${state.filterType === 'all' ? 'selected' : ''}>ទាំងអស់</option>
              </select>
              ${state.filterType !== 'all' ? `<input type="${state.filterType === 'year' ? 'number' : state.filterType}" class="form-input" data-f="filter-value" style="width:auto;padding:6px 12px;" value="${state.filterValue}" />` : ''}
              ${state.selectedSwaps.length > 0 ? `<button data-action="bulk-delete" class="btn" style="display:flex;align-items:center;gap:6px;padding:6px 12px;font-size:0.85rem;background-color:var(--danger);color:white;border:none;"><i data-lucide="trash-2" style="width:16px;height:16px"></i> លុប (${state.selectedSwaps.length})</button>` : ''}
              <button data-action="open-preview" class="btn btn-primary" style="display:flex;align-items:center;gap:6px;padding:6px 12px;font-size:0.85rem;"><i data-lucide="file-text" style="width:16px;height:16px"></i> របាយការណ៍</button>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead><tr>
                <th style="width:40px;text-align:center;"><input type="checkbox" data-action="select-all" ${paginatedSwaps.length > 0 && state.selectedSwaps.length === paginatedSwaps.length ? 'checked' : ''} style="cursor:pointer;" /></th>
                <th>កាលបរិច្ឆេទ & ថ្នាក់</th><th>មុខវិជ្ជា/គ្រូដើម</th><th>មុខវិជ្ជា/គ្រូជំនួស</th><th>ម៉ោងបង្រៀន</th><th>មូលហេតុ</th><th>ស្ថានភាព</th><th style="text-align:center;">សកម្មភាព</th>
              </tr></thead>
              <tbody>
                ${paginatedSwaps.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:20px;">មិនទាន់មានប្រវត្តិប្តូរមុខវិជ្ជាទេ</td></tr>` : Object.keys(groupedSwaps).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).flatMap(groupKey => {
                  const rows = [];
                  if ((state.filterType === 'month' || state.filterType === 'year') && groupedSwaps[groupKey].length > 0) {
                    rows.push(`<tr style="background-color:#f8fafc;"><td colspan="8" style="padding:8px 16px;font-weight:600;color:var(--primary);border-top:1px solid var(--border);border-bottom:1px solid var(--border);font-size:0.9rem;">${state.filterType === 'month' ? `សប្ដាហ៍ទី ${groupKey}` : `ខែ ${monthsKh[parseInt(groupKey, 10) - 1]}`}</td></tr>`);
                  }
                  groupedSwaps[groupKey].forEach(swap => {
                    const ts = timeSlotOf(swap.time_slot);
                    const statusBadge = swap.status === 'approved'
                      ? `<span class="badge success" data-status-toggle="${swap.id}" data-next="pending" style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;"><i data-lucide="check-circle" style="width:12px;height:12px"></i> ${STATUS_LABEL.approved}</span>`
                      : swap.status === 'rejected'
                      ? `<span class="badge danger" data-status-toggle="${swap.id}" data-next="pending" style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;background-color:#fee2e2;color:#ef4444;"><i data-lucide="x-circle" style="width:12px;height:12px"></i> ${STATUS_LABEL.rejected}</span>`
                      : `<span class="badge warning" data-status-toggle="${swap.id}" data-next="approved" style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;"><i data-lucide="clock" style="width:12px;height:12px"></i> ${STATUS_LABEL.pending}</span>`;
                    rows.push(`
                      <tr>
                        <td style="text-align:center;"><input type="checkbox" data-select-swap="${swap.id}" ${state.selectedSwaps.includes(swap.id) ? 'checked' : ''} style="cursor:pointer;" /></td>
                        <td><div style="font-weight:600;">${classroomName(swap.classroom)}</div><div style="font-size:0.75rem;color:var(--text-secondary);">${swap.change_date}</div></td>
                        <td style="font-size:0.85rem;"><div style="font-weight:500;color:var(--danger);">${subjectName(swap.original_subject)}</div><div style="font-size:0.75rem;color:var(--text-secondary);">${teacherName(swap.original_teacher)}</div></td>
                        <td style="font-size:0.85rem;"><div style="font-weight:500;color:var(--success);">${subjectName(swap.new_subject)}</div><div style="font-size:0.75rem;color:var(--text-secondary);">${teacherName(swap.new_teacher)}</div></td>
                        <td><div style="font-weight:500;">${ts ? `${formatHM(ts.start_time)} - ${formatHM(ts.end_time)}` : 'N/A'}</div><div style="font-size:0.75rem;color:var(--primary);">(${ts ? calculateTotalHours(ts.start_time, ts.end_time) : 'N/A'})</div></td>
                        <td style="font-size:0.85rem;color:var(--text-secondary);">${swap.reason || ''}</td>
                        <td>${statusBadge}</td>
                        <td style="text-align:center;"><div style="display:flex;gap:8px;justify-content:center;">
                          ${swap.status !== 'rejected' ? `<button data-action="reject-swap" data-id="${swap.id}" class="btn btn-secondary" style="padding:6px;border-radius:6px;" title="បដិសេធ"><i data-lucide="x-circle" style="width:14px;height:14px;color:#ef4444"></i></button>` : ''}
                          <button data-action="send-row-telegram" data-id="${swap.id}" class="btn btn-secondary" style="padding:6px;border-radius:6px;" title="ផ្ញើសារចូល Telegram"><i data-lucide="send" style="width:14px;height:14px;color:#3b82f6"></i></button>
                          <button data-action="edit-swap" data-id="${swap.id}" class="btn btn-secondary" style="padding:6px;border-radius:6px;" title="កែប្រែ"><i data-lucide="edit-3" style="width:14px;height:14px;color:var(--primary)"></i></button>
                          <button data-action="delete-swap" data-id="${swap.id}" class="btn btn-secondary" style="padding:6px;border-radius:6px;" title="លុប"><i data-lucide="trash-2" style="width:14px;height:14px;color:var(--danger)"></i></button>
                        </div></td>
                      </tr>
                    `);
                  });
                  return rows;
                }).join('')}
              </tbody>
            </table>
            ${totalPages > 1 ? `
              <div style="display:flex;justify-content:center;align-items:center;gap:16px;padding:20px;">
                <button data-action="prev-page" ${safePage === 1 ? 'disabled' : ''} class="btn btn-secondary" style="padding:8px 16px;border-radius:8px;">ទំព័រមុន</button>
                <span style="font-size:0.9rem;font-weight:600;color:var(--text-secondary);">ទំព័រទី ${safePage} នៃ ${totalPages}</span>
                <button data-action="next-page" ${safePage === totalPages ? 'disabled' : ''} class="btn btn-secondary" style="padding:8px 16px;border-radius:8px;">ទំព័របន្ទាប់</button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      ${renderPreviewModal(groupedAll, filteredSwaps)}
      ${renderHeaderModal()}
    </div>
  `;

  // Searchable selects
  const mountSelect = (selector, options, value, onChange) => {
    const mount = root.querySelector(selector);
    const select = createSearchSelect({ options, value: value != null ? String(value) : '', placeholder: 'ស្វែងរក...', onChange });
    mount.appendChild(select.el);
  };
  mountSelect('[data-mount="class-select"]', opts.classOptions, f.classroom, (v) => { state.formData.classroom = v; });
  mountSelect('[data-mount="timeslot-select"]', opts.timeSlotOptions, f.timeSlot, (v) => { state.formData.timeSlot = v; });
  mountSelect('[data-mount="orig-subject-select"]', opts.subjectOptions, f.originalSubject, (v) => { state.formData.originalSubject = v; });
  mountSelect('[data-mount="orig-teacher-select"]', opts.teacherOptions, f.originalTeacher, (v) => { state.formData.originalTeacher = v; });
  mountSelect('[data-mount="repl-subject-select"]', opts.subjectOptions, f.replacementSubject, (v) => { state.formData.replacementSubject = v; });
  mountSelect('[data-mount="repl-teacher-select"]', opts.teacherOptions, f.replacementTeacher, (v) => { state.formData.replacementTeacher = v; });

  root.querySelector('[data-role="swap-form"]').addEventListener('submit', handleAddSwap);
  root.querySelector('[data-f="swap-date"]').addEventListener('input', (e) => { state.formData.date = e.target.value; });
  root.querySelector('[data-f="reason"]').addEventListener('input', (e) => { state.formData.reason = e.target.value; });
  const cancelEditBtn = root.querySelector('[data-action="cancel-edit"]');
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => { state = { ...state, editingSwapId: null, formData: { ...emptyForm } }; update(); });

  root.querySelector('[data-f="filter-type"]').addEventListener('change', (e) => {
    const val = e.target.value;
    const today = new Date();
    let filterValue = '';
    if (val === 'month') filterValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    else if (val === 'day') filterValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    else if (val === 'year') filterValue = today.getFullYear().toString();
    else if (val === 'week') filterValue = isoWeekOf(today);
    state = { ...state, filterType: val, filterValue, currentPage: 1 };
    update();
  });
  const filterValueInput = root.querySelector('[data-f="filter-value"]');
  if (filterValueInput) onLiveInput(filterValueInput, () => { state = { ...state, filterValue: filterValueInput.value, currentPage: 1 }; update(); });

  const bulkDeleteBtn = root.querySelector('[data-action="bulk-delete"]');
  if (bulkDeleteBtn) bulkDeleteBtn.addEventListener('click', handleBulkDelete);
  root.querySelector('[data-action="open-preview"]').addEventListener('click', () => { state = { ...state, showPreviewModal: true }; update(); });

  root.querySelector('[data-action="select-all"]').addEventListener('change', (e) => { state = { ...state, selectedSwaps: e.target.checked ? paginatedSwaps.map(s => s.id) : [] }; update(); });
  root.querySelectorAll('[data-select-swap]').forEach(cb => cb.addEventListener('change', (e) => {
    const id = Number(cb.dataset.selectSwap);
    state = { ...state, selectedSwaps: e.target.checked ? [...state.selectedSwaps, id] : state.selectedSwaps.filter(sid => sid !== id) };
    update();
  }));
  root.querySelectorAll('[data-status-toggle]').forEach(el => el.addEventListener('click', () => handleUpdateStatus(Number(el.dataset.statusToggle), el.dataset.next)));
  root.querySelectorAll('[data-action="reject-swap"]').forEach(btn => btn.addEventListener('click', () => handleUpdateStatus(Number(btn.dataset.id), 'rejected')));
  root.querySelectorAll('[data-action="send-row-telegram"]').forEach(btn => btn.addEventListener('click', () => handleSendRowTelegram(state.swaps.find(s => s.id === Number(btn.dataset.id)))));
  root.querySelectorAll('[data-action="edit-swap"]').forEach(btn => btn.addEventListener('click', () => handleEditClick(state.swaps.find(s => s.id === Number(btn.dataset.id)))));
  root.querySelectorAll('[data-action="delete-swap"]').forEach(btn => btn.addEventListener('click', () => handleDeleteSwap(Number(btn.dataset.id))));

  const prevBtn = root.querySelector('[data-action="prev-page"]');
  if (prevBtn) prevBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.max(1, safePage - 1) }; update(); });
  const nextBtn = root.querySelector('[data-action="next-page"]');
  if (nextBtn) nextBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.min(totalPages, safePage + 1) }; update(); });

  // Preview modal
  const closePreviewBtn = root.querySelector('[data-action="close-preview"]');
  if (closePreviewBtn) closePreviewBtn.addEventListener('click', () => { state = { ...state, showPreviewModal: false }; update(); });
  const openHeaderModalBtn = root.querySelector('[data-action="open-header-modal"]');
  if (openHeaderModalBtn) openHeaderModalBtn.addEventListener('click', () => { state = { ...state, showHeaderModal: true }; update(); });
  const windowPrintBtn = root.querySelector('[data-action="window-print"]');
  if (windowPrintBtn) windowPrintBtn.addEventListener('click', () => window.print());
  const exportPdfBtn = root.querySelector('[data-action="export-pdf"]');
  if (exportPdfBtn) exportPdfBtn.addEventListener('click', handleExportPDF);
  const exportWordBtn = root.querySelector('[data-action="export-word"]');
  if (exportWordBtn) exportWordBtn.addEventListener('click', handleExportWord);
  const exportExcelBtn = root.querySelector('[data-action="export-excel"]');
  if (exportExcelBtn) exportExcelBtn.addEventListener('click', handleExportExcel);
  const exportTgBtn = root.querySelector('[data-action="export-telegram"]');
  if (exportTgBtn) exportTgBtn.addEventListener('click', handleSendTelegramReport);

  // Header modal
  const closeHeaderModalBtns = root.querySelectorAll('[data-action="close-header-modal"]');
  closeHeaderModalBtns.forEach(btn => btn.addEventListener('click', () => { state = { ...state, showHeaderModal: false }; update(); }));
  root.querySelectorAll('[data-hc]').forEach(input => input.addEventListener('input', (e) => { state.headerConfig = { ...state.headerConfig, [input.dataset.hc]: e.target.value }; persistHeaderConfig(); }));
  const khmerDateInput = root.querySelector('[data-role="khmer-date"]');
  if (khmerDateInput) khmerDateInput.addEventListener('input', (e) => { state.khmerDate = e.target.value; });

  // Stop propagation on modal panels so backdrop clicks elsewhere don't close
  root.querySelectorAll('[data-stop]').forEach(el => el.addEventListener('click', (e) => e.stopPropagation()));

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = {
    swaps: [], classesList: [], subjectsList: [], teachersList: [], timeSlotsList: [], formData: { ...emptyForm },
    editingSwapId: null, selectedSwaps: [], currentPage: 1, showPreviewModal: false, showHeaderModal: false, isSendingReport: false,
    headerConfig: JSON.parse(localStorage.getItem('exportHeaderConfigSwap')) || defaultHeaderConfig,
    khmerDate: (() => { try { return toKhmerLunarDate(new Date()).lunarDateText || ''; } catch { return ''; } })(),
    filterType: 'week', filterValue: isoWeekOf(new Date()),
  };
  update();
  fetchData();
}

export function destroy() { root = null; }
