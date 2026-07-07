// Ports pages/AttendanceReport.jsx.

import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { toKhmerLunarDate } from 'khmer-chhankitek-calendar';
import { navigate } from '../router.js';
import { withFocusPreserved, onLiveInput } from '../utils/dom.js';

function toKhmerNumerals(numStr) {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return numStr.toString().split('').map(d => khmerDigits[d] || d).join('');
}

function formatDatesKhmer(datesArray) {
  if (!datesArray || datesArray.length === 0) return '';
  const monthsKhmer = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const sortedDates = [...datesArray].sort((a, b) => new Date(a) - new Date(b));
  const groups = {};
  sortedDates.forEach(dateStr => {
    const [year, month, day] = dateStr.split('-');
    const key = `${year}-${month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(day);
  });
  return Object.entries(groups).map(([key, days]) => {
    const [year, month] = key.split('-');
    const monthName = monthsKhmer[parseInt(month, 10) - 1];
    const daysStr = days.map(d => toKhmerNumerals(parseInt(d, 10))).join(', ');
    return `${daysStr} ${monthName} ${toKhmerNumerals(year)}`;
  }).join(' និង ');
}

let root = null;
let state = {
  studentDetails: [], isLoading: true, classOptions: [], subjectOptions: [],
  listReportType: 'daily', filterStatus: 'all', isTablePrintMode: false,
  selectedClass: 'ទាំងអស់', selectedReportDate: new Date().toISOString().split('T')[0], selectedSubject: 'ទាំងអស់',
  isSendingTg: false, currentPage: 1, itemsPerPage: 10, searchQuery: '',
};

async function loadData() {
  try {
    const [studentsData, enrollmentsData, reportData, classroomsData, subjectsData, kutisData] = await Promise.all([
      fetch('/api/students/list/').then(r => r.json()),
      fetch('/api/students/enrollments/').then(r => r.json()),
      fetch('/api/attendance/attendance/report-data/').then(r => r.json()),
      fetch('/api/classrooms/').then(r => r.json()),
      fetch('/api/subjects/').then(r => r.json()),
      fetch('/api/kutis/').then(r => r.json()),
    ]);

    const classroomMap = {};
    classroomsData.forEach(c => { classroomMap[c.id] = c.class_name; });
    const kutiMap = {};
    kutisData.forEach(k => { kutiMap[k.id] = k.kuti_name; });
    const enrollmentMap = {};
    enrollmentsData.forEach(e => { enrollmentMap[e.student] = e.classroom; });

    state.classOptions = classroomsData.map(c => c.class_name).sort((a, b) => a.localeCompare(b, 'km'));
    state.subjectOptions = subjectsData.map(s => s.subject_name);

    const mapped = studentsData
      .filter(s => s.status === 'active')
      .map(s => {
        const sData = reportData[s.id] || { absentDates: [], permissionDates: [], lateDates: [] };
        const classroomId = enrollmentMap[s.id];
        return {
          id: s.id,
          studentId: s.student_code || `S${String(s.id).padStart(3, '0')}`,
          name: `${s.last_name || ''} ${s.first_name || ''}`.trim(),
          grade: classroomId ? (classroomMap[classroomId] || 'មិនមានថ្នាក់') : 'មិនមានថ្នាក់',
          residence: s.monk_status === 'ព្រះសង្ឃ' ? 'ក្នុង' : 'ក្រៅ',
          kudi: s.kuti ? (kutiMap[s.kuti] || '-') : '-',
          subject: 'ទាំងអស់', bySubject: sData.bySubject || {},
          totalAbsent: sData.absentDates?.length || 0, absentDates: sData.absentDates || [],
          totalPermission: sData.permissionDates?.length || 0, permissionDates: sData.permissionDates || [],
          totalLate: sData.lateDates?.length || 0, lateDates: sData.lateDates || [], status: 'present',
        };
      });
    mapped.sort((a, b) => a.name.localeCompare(b.name, 'km'));
    state = { ...state, studentDetails: mapped, isLoading: false };
  } catch (err) {
    console.error('Failed to fetch report data:', err);
    state = { ...state, isLoading: false };
  }
  update();
}

function getReportTitle() {
  const map = { daily: 'របាយការណ៍វត្តមានប្រចាំថ្ងៃ', monthly: 'របាយការណ៍វត្តមានប្រចាំខែ', tri1: 'របាយការណ៍វត្តមានប្រចាំត្រីមាសទី១', tri2: 'របាយការណ៍វត្តមានប្រចាំត្រីមាសទី២', sem1: 'របាយការណ៍វត្តមានប្រចាំឆមាសទី១', sem2: 'របាយការណ៍វត្តមានប្រចាំឆមាសទី២', all: 'របាយការណ៍វត្តមានសរុបប្រចាំឆ្នាំ' };
  return map[state.listReportType] || 'របាយការណ៍វត្តមាន';
}
function getPeriodLabel() {
  const map = { daily: 'ថ្ងៃ ', monthly: 'ខែ ', tri1: 'ត្រីមាសទី១ ', tri2: 'ត្រីមាសទី២ ', sem1: 'ឆមាសទី១ ', sem2: 'ឆមាសទី២ ' };
  return map[state.listReportType] || '................ ';
}
function getDateRangeStr() {
  const d = new Date(state.selectedReportDate);
  const year = d.getFullYear(), month = d.getMonth(), date = d.getDate();
  const acaYearStart = month < 4 ? year - 1 : year;
  const acaYearStartKhmer = toKhmerNumerals(acaYearStart), acaYearEndKhmer = toKhmerNumerals(acaYearStart + 1);
  const monthsKhmer = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  const monthName = monthsKhmer[month], yearKhmer = toKhmerNumerals(year), dateKhmer = toKhmerNumerals(date);
  switch (state.listReportType) {
    case 'daily': return `(ថ្ងៃទី ${dateKhmer} ខែ ${monthName} ឆ្នាំ${yearKhmer})`;
    case 'monthly': { const lastDay = new Date(year, month + 1, 0).getDate(); return `(${toKhmerNumerals(1)} - ${toKhmerNumerals(lastDay)} ខែ ${monthName} ឆ្នាំ${yearKhmer})`; }
    case 'tri1': return `(០១ ឧសភា - ៣១ កក្កដា ឆ្នាំ${acaYearStartKhmer})`;
    case 'tri2': return `(០១ សីហា - ៣១ តុលា ឆ្នាំ${acaYearStartKhmer})`;
    case 'sem1': return `(០១ ឧសភា - ៣០ កញ្ញា ឆ្នាំ${acaYearStartKhmer})`;
    case 'sem2': return `(០១ តុលា ឆ្នាំ${acaYearStartKhmer} - ២៨ កុម្ភៈ ឆ្នាំ${acaYearEndKhmer})`;
    default: return '';
  }
}

function buildDateFilter() {
  const targetDateObj = new Date(state.selectedReportDate);
  const targetYear = targetDateObj.getFullYear(), targetMonthInt = targetDateObj.getMonth() + 1;
  const acaYearStart = targetMonthInt < 5 ? targetYear - 1 : targetYear;
  return (dateStr) => {
    const [yStr, mStr] = dateStr.split('-');
    const y = parseInt(yStr, 10), m = parseInt(mStr, 10);
    if (state.listReportType === 'all') {
      if (y === acaYearStart && m >= 5) return true;
      if (y === acaYearStart + 1 && m <= 2) return true;
      return false;
    }
    switch (state.listReportType) {
      case 'daily': return dateStr === state.selectedReportDate;
      case 'monthly': return y === targetYear && m === targetMonthInt;
      case 'tri1': return y === acaYearStart && m >= 5 && m <= 7;
      case 'tri2': return y === acaYearStart && m >= 8 && m <= 10;
      case 'sem1': return y === acaYearStart && m >= 5 && m <= 9;
      case 'sem2': if (y === acaYearStart && m >= 10 && m <= 12) return true; if (y === acaYearStart + 1 && m <= 2) return true; return false;
      default: return true;
    }
  };
}

function passesStatusFilter(aDates, pDates, lDates) {
  if (state.filterStatus === 'absent') return aDates.length > 0;
  if (state.filterStatus === 'permission') return pDates.length > 0;
  return aDates.length > 0 || pDates.length > 0 || lDates.length > 0;
}

function getFilteredStudentDetails() {
  const filterByDate = buildDateFilter();
  let students = state.studentDetails;
  if (state.selectedClass !== 'ទាំងអស់') students = students.filter(s => s.grade === state.selectedClass);
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.trim().toLowerCase();
    students = students.filter(s => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q));
  }

  const rows = [];
  for (const student of students) {
    if (state.selectedSubject !== 'ទាំងអស់') {
      const sd = student.bySubject?.[state.selectedSubject] || { absentDates: [], permissionDates: [], lateDates: [] };
      const aDates = (sd.absentDates || []).filter(filterByDate);
      const pDates = (sd.permissionDates || []).filter(filterByDate);
      const lDates = (sd.lateDates || []).filter(filterByDate);
      if (passesStatusFilter(aDates, pDates, lDates)) {
        rows.push({ ...student, subject: state.selectedSubject, absentDates: aDates, permissionDates: pDates, lateDates: lDates, totalAbsent: aDates.length, totalPermission: pDates.length, totalLate: lDates.length });
      }
    } else {
      const subjects = Object.keys(student.bySubject || {});
      if (subjects.length === 0) {
        const aDates = (student.absentDates || []).filter(filterByDate);
        const pDates = (student.permissionDates || []).filter(filterByDate);
        const lDates = (student.lateDates || []).filter(filterByDate);
        if (passesStatusFilter(aDates, pDates, lDates)) {
          rows.push({ ...student, subject: 'ទាំងអស់', absentDates: aDates, permissionDates: pDates, lateDates: lDates, totalAbsent: aDates.length, totalPermission: pDates.length, totalLate: lDates.length });
        }
      } else {
        for (const subj of subjects) {
          const sd = student.bySubject[subj];
          const aDates = (sd.absentDates || []).filter(filterByDate);
          const pDates = (sd.permissionDates || []).filter(filterByDate);
          const lDates = (sd.lateDates || []).filter(filterByDate);
          if (passesStatusFilter(aDates, pDates, lDates)) {
            rows.push({ ...student, subject: subj, absentDates: aDates, permissionDates: pDates, lateDates: lDates, totalAbsent: aDates.length, totalPermission: pDates.length, totalLate: lDates.length });
          }
        }
      }
    }
  }
  return rows;
}

function getTotalSummary(filtered) {
  return filtered.reduce((acc, c) => { acc.permission += c.totalPermission || 0; acc.absent += c.totalAbsent || 0; acc.late += c.totalLate || 0; return acc; }, { permission: 0, absent: 0, late: 0 });
}

function getDynamicStats(filtered, totalSummary) {
  const totalStudents = state.studentDetails.filter(s => state.selectedClass === 'ទាំងអស់' || s.grade === state.selectedClass).length || 1;
  let daysInPeriod = 1;
  switch (state.listReportType) { case 'monthly': daysInPeriod = 22; break; case 'tri1': case 'tri2': daysInPeriod = 66; break; case 'sem1': case 'sem2': daysInPeriod = 110; break; case 'all': daysInPeriod = 220; break; default: daysInPeriod = 1; }
  const totalPossible = totalStudents * daysInPeriod;
  const totalPresent = Math.max(0, totalPossible - totalSummary.absent - totalSummary.permission);
  const attendanceRate = totalPossible === 0 ? 100 : Math.round((totalPresent / totalPossible) * 100);
  return { attendanceRate };
}

function getAcademicYearKhmer() {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${currentYear + 1}`.replace(/[0-9]/g, m => toKhmerNumerals(m));
}
function getSolarDateKhmerFull() {
  const date = new Date();
  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
  return `ថ្ងៃទី ${toKhmerNumerals(date.getDate().toString().padStart(2, '0'))} ខែ ${months[date.getMonth()]} ឆ្នាំ ${toKhmerNumerals(date.getFullYear())}`;
}

function handleClearFilters() {
  state = { ...state, selectedClass: 'ទាំងអស់', selectedSubject: 'ទាំងអស់', selectedReportDate: new Date().toISOString().split('T')[0], listReportType: 'daily', filterStatus: 'all', searchQuery: '', currentPage: 1 };
  update();
}

async function handleSendTelegram(type = 'image') {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) { alert('សូមកំណត់ Telegram Bot និង Group ID ជាមុនសិន នៅក្នុងទំព័រ "វត្តមានសិស្ស"!'); return; }
  state = { ...state, isSendingTg: true };
  update();
  try {
    const printEl = document.getElementById('print-container');
    const periodLabel = getPeriodLabel();
    let fd = new FormData();
    fd.append('chat_id', tgConfig.chatId);
    let endpoint = `https://api.telegram.org/bot${tgConfig.token}/sendDocument`;

    if (type === 'image') {
      const canvas = await html2canvas(printEl, { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: -window.scrollY, windowWidth: printEl.scrollWidth, windowHeight: printEl.scrollHeight });
      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      fd.append('photo', imageBlob, `របាយការណ៍_វត្តមាន_${periodLabel}.png`);
      endpoint = `https://api.telegram.org/bot${tgConfig.token}/sendPhoto`;
    } else if (type === 'pdf') {
      const pdfBlob = await html2pdf().set({ margin: 5, filename: `របាយការណ៍_វត្តមាន_${periodLabel}.pdf`, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true, letterRendering: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, pagebreak: { mode: 'css', avoid: 'tr' } }).from(printEl).output('blob');
      fd.append('document', pdfBlob, `របាយការណ៍_វត្តមាន_${periodLabel}.pdf`);
    } else if (type === 'excel') {
      const filtered = getFilteredStudentDetails();
      const wsData = filtered.map((s, i) => ({ 'ល.រ': i + 1, 'អត្តលេខ': s.studentId, 'ឈ្មោះ': s.name, 'ថ្នាក់': s.grade || state.selectedClass, 'វត្តស្នាក់នៅ': s.residence, 'កុដិ': s.kudi, 'មុខវិជ្ជា': s.subject, 'ច្បាប់': s.totalPermission || 0, 'អវត្តមាន': s.totalAbsent || 0, 'យឺត': s.totalLate || 0 }));
      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fd.append('document', excelBlob, `របាយការណ៍_វត្តមាន_${periodLabel}.xlsx`);
    }

    const res = await fetch(endpoint, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Failed to send');
    alert('ឯកសារត្រូវបានផ្ញើចូល Telegram ដោយជោគជ័យ! 🎉');
  } catch (error) {
    console.error(error);
    alert('បរាជ័យក្នុងការផ្ញើឯកសារចូល Telegram! សូមពិនិត្យមើលអុីនធឺណិត និងការកំណត់ឡើងវិញ។');
  } finally {
    state = { ...state, isSendingTg: false };
    update();
  }
}

function handleDownloadExcel(filtered) {
  const wsData = filtered.map((s, i) => ({ 'ល.រ': i + 1, 'អត្តលេខ': s.studentId, 'ឈ្មោះ': s.name, 'ថ្នាក់': s.grade || state.selectedClass, 'វត្តស្នាក់នៅ': s.residence, 'កុដិ': s.kudi, 'មុខវិជ្ជា': s.subject, 'ច្បាប់': s.totalPermission || 0, 'អវត្តមាន': s.totalAbsent || 0, 'យឺត': s.totalLate || 0 }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
  XLSX.writeFile(wb, `របាយការណ៍_វត្តមាន_${getPeriodLabel()}.xlsx`);
}

function handleDownloadPDF() {
  state = { ...state, isTablePrintMode: true };
  update();
  setTimeout(() => {
    const printEl = document.getElementById('print-container');
    if (!printEl) return;
    html2pdf().set({ margin: 5, filename: `របាយការណ៍_វត្តមាន_${getPeriodLabel()}.pdf`, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true, letterRendering: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, pagebreak: { mode: 'css', avoid: 'tr' } }).from(printEl).save();
  }, 500);
}

function handleDownloadWord() {
  state = { ...state, isTablePrintMode: true };
  update();
  setTimeout(() => {
    const printEl = document.getElementById('print-container');
    if (!printEl) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    const blob = new Blob(['﻿', header + printEl.innerHTML + '</body></html>'], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `របាយការណ៍_វត្តមាន_${getPeriodLabel()}.doc`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 500);
}

async function handleDownloadImage() {
  state = { ...state, isTablePrintMode: true };
  update();
  setTimeout(async () => {
    const printEl = document.getElementById('print-container');
    if (!printEl) return;
    const canvas = await html2canvas(printEl, { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: -window.scrollY, windowWidth: printEl.scrollWidth, windowHeight: printEl.scrollHeight });
    const link = document.createElement('a');
    link.download = `របាយការណ៍_វត្តមាន_${getPeriodLabel()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    state = { ...state, isTablePrintMode: false };
    update();
  }, 500);
}

function renderPrintMode(filtered) {
  const thStyle = `padding:7px 8px;border:1px solid #333;font-weight:700;text-align:center;background:#f0f0f0;font-size:13px;white-space:nowrap;`;
  const tdStyle = `padding:6px 8px;border:1px solid #333;font-size:13px;vertical-align:middle; font-family:Battambang; `;
  const tdCenter = `${tdStyle}text-align:center;`;

  function rowHtml(student, index) {
    return `
      <tr>
        <td style="${tdCenter}">${toKhmerNumerals(index + 1)}</td>
        <td style="${tdStyle}font-weight:600;font-size:15px;font-family:Battambang">${student.name}</td>
        <td style="${tdCenter}font-family:Battambang">${(student.grade || state.selectedClass).replace('ថ្នាក់ទី ', '')}</td>
        <td style="${tdStyle}font-family:Battambang">${student.residence || '-'}</td>
        <td style="${tdCenter}white-space:nowrap;font-family:Battambang">${student.kudi || '-'}</td>
        <td style="${tdStyle}font-family:Battambang">${student.subject}</td>
        <td style="${tdCenter}font-family:Battambang">${student.totalPermission > 0 ? toKhmerNumerals(student.totalPermission) : '-'}</td>
        <td style="${tdCenter}font-family:Battambang">${student.totalAbsent > 0 ? toKhmerNumerals(student.totalAbsent) : '-'}</td>
        <td style="${tdCenter}font-family:Battambang">${student.totalLate > 0 ? toKhmerNumerals(student.totalLate) : '-'}</td>
        <td style="${tdStyle}font-size:12px;line-height:1.6;">
          ${student.permissionDates?.length > 0 ? `<div style="color:#b45309;font-weight:600;"><span style="background:#fef3c7;padding:1px 5px;border-radius:3px;margin-right:4px;">ច្បាប់</span>${formatDatesKhmer(student.permissionDates)}</div>` : ''}
          ${student.absentDates?.length > 0 ? `<div style="color:#b91c1c;font-weight:600;margin-top:4px;"><span style="background:#fee2e2;padding:1px 5px;border-radius:3px;margin-right:4px;">អវត្តមាន</span>${formatDatesKhmer(student.absentDates)}</div>` : ''}
          ${student.lateDates?.length > 0 ? `<div style="color:#0369a1;font-weight:600;margin-top:4px;"><span style="background:#e0f2fe;padding:1px 5px;border-radius:3px;margin-right:4px;">យឺត</span>${formatDatesKhmer(student.lateDates)}</div>` : ''}
        </td>
      </tr>
    `;
  }

  const rows = filtered.slice(0, -1).map((s, i) => rowHtml(s, i)).join('');
  const lastRow = filtered.length > 0 ? rowHtml(filtered[filtered.length - 1], filtered.length - 1) : '';

  root.innerHTML = `
    <div style="background:#e8e8e8;min-height:100vh;font-family:'Khmer OS Siemreap',sans-serif;">
      <style>
        @media print {
          @page { size: A4 landscape; margin: 8mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; }
          .no-print { display: none !important; }
          .no-print-bg { background: white !important; padding: 0 !important; }
          .print-page { padding: 0 !important; box-shadow: none !important; margin: 0 !important; width: 100% !important; }
        }
        .print-page { background: #fff; width: 287mm; min-height: 190mm; margin: 0 auto; padding: 10mm 5mm; box-shadow: 0 4px 24px rgba(0,0,0,0.18); box-sizing: border-box; color: #000; }
        .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; }
        .print-table tr { page-break-inside: avoid; break-inside: avoid; }
        .moul-text { font-family: "Khmer OS Muol Light", "Moul", serif; }
      </style>
      <div class="no-print" style="padding:16px 24px;display:flex;gap:10px;align-items:center;background:#1e293b;">
        <button data-action="exit-print" style="padding:9px 18px;border-radius:7px;background:#334155;color:#fff;border:none;cursor:pointer;font-weight:600;">← ត្រឡប់ក្រោយ</button>
        <div style="position:relative;" onmouseenter="this.querySelector('#tg-menu').style.display='block'" onmouseleave="this.querySelector('#tg-menu').style.display='none'">
          <button style="padding:9px 18px;border-radius:7px;background:#0ea5e9;color:#fff;border:none;cursor:${state.isSendingTg ? 'not-allowed' : 'default'};font-weight:600;display:flex;align-items:center;gap:7px;opacity:${state.isSendingTg ? 0.7 : 1};">
            <i data-lucide="send" style="width:16px;height:16px"></i> ${state.isSendingTg ? 'កំពុងផ្ញើ...' : 'ផ្ញើចូល Telegram'} <i data-lucide="chevron-down" style="width:14px;height:14px"></i>
          </button>
          <div id="tg-menu" style="display:none;position:absolute;top:100%;left:0;margin-top:4px;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10;min-width:180px;overflow:hidden;">
            <button data-action="tg-send-image" style="width:100%;text-align:left;padding:10px 16px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-weight:600;display:flex;align-items:center;gap:10px;color:#334155;border-bottom:1px solid #f1f5f9;"><i data-lucide="image" style="width:16px;height:16px;color:#0ea5e9;"></i> ជាទម្រង់ រូបភាព</button>
            <button data-action="tg-send-pdf" style="width:100%;text-align:left;padding:10px 16px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-weight:600;display:flex;align-items:center;gap:10px;color:#334155;border-bottom:1px solid #f1f5f9;"><i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> ជាទម្រង់ PDF</button>
            <button data-action="tg-send-excel" style="width:100%;text-align:left;padding:10px 16px;border:none;background:transparent;cursor:pointer;font-family:inherit;font-weight:600;display:flex;align-items:center;gap:10px;color:#334155;"><i data-lucide="table" style="width:16px;height:16px;color:#10b981;"></i> ជាទម្រង់ Excel</button>
          </div>
        </div>

       
      </div>
      <div class="no-print-bg" style="padding:20px;background:#e8e8e8; font-family:Battambang">
        <div class="print-page" id="print-container">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2mm;gap:8px;">
            <div style="text-align:center;margin-left:40px;">
              <img src="/logo.jpg" alt="Logo" style="width:60px;height:60px;object-fit:contain;display:block;margin:0 auto 8px;" />
              <div class="moul-text" style="font-size:14px;line-height:1.6;color:#071F85;">មន្ទីរធម្មការ និងសាសនា រាជធានី</div>
              <div class="moul-text" style="font-size:14px;line-height:1.6;color:#071F85;">ភ្នំពេញ</div>
              <div class="moul-text" style="font-size:14px;line-height:1.6;color:#071F85;">សាលា ពុ.អ.វិ.ស.ទ.ន.រ.</div>
            </div>
            <div style="text-align:center;margin-right:40px;">
              <div class="moul-text" style="font-size:15px;line-height:1.6;color:#071F85;">ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div class="moul-text" style="font-size:15px;line-height:1.6;color:#071F85;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div style="display:flex;justify-content:center;margin-top:2px;"><span style="font-family:Tacteing;font-size:32px;color:#071F85;line-height:0.5;">3</span></div>
            </div>
          </div>
          <div style="text-align:center;margin-bottom:6mm;margin-top:-15px;">
            <div class="moul-text" style="font-size:13px;line-height:1.8;color:#0921AB;">បញ្ជីវត្តមានប្រចាំ${getPeriodLabel()}របស់សមណសិស្ស${state.selectedClass !== 'ទាំងអស់' ? `ថ្នាក់ទី ${state.selectedClass.replace('ថ្នាក់ទី ', '')}` : 'ទាំងអស់'}</div>
            ${state.selectedSubject !== 'ទាំងអស់' ? `<div class="moul-text" style="font-size:14px;line-height:1.8;color:#0921AB;">មុខវិជ្ជា៖ ${state.selectedSubject}</div>` : ''}
            <div class="moul-text" style="font-size:14px;line-height:1.8;color:#0921AB;">នៃសាលាពុទ្ធិកអនុវិទ្យាល័យ សម្តេចព្រះមហាសង្ឃរាជ ទេព វង្ស និរោធរង្សី</div>
            <div class="moul-text" style="font-size:13px;margin-top:4px;color:#0921AB;">សម្រាប់ឆ្នាំសិក្សា ${getAcademicYearKhmer()}</div>
            <div class="moul-text" style="text-align:right;font-size:12px;color:#0921AB;margin-top:-5px;font-weight:bold;">${getDateRangeStr()}</div>
          </div>
          <table class="print-table" style="margin-top:-20px;">
            <thead><tr>
              <th style="${thStyle}width:4%;">ល.រ</th><th style="${thStyle}width:15%;">ឈ្មោះសិស្ស</th><th style="${thStyle}width:5%;">ថ្នាក់</th>
              <th style="${thStyle}width:10%;">វត្តស្នាក់នៅ</th><th style="${thStyle}width:5%;">កុដិ</th><th style="${thStyle}width:10%;">មុខវិជ្ជា</th>
              <th style="${thStyle}width:5%;">ច្បាប់ (ថ្ងៃ)</th><th style="${thStyle}width:5%;">អវត្តមាន (ថ្ងៃ)</th><th style="${thStyle}width:4%;">យឺត (ដង)</th><th style="${thStyle}">កាលបរិច្ឆេទបញ្ជាក់</th>
            </tr></thead>
            <tbody>${rows}</tbody>
            <tbody style="page-break-inside:avoid;break-inside:avoid;">
              ${lastRow}
              <tr style="font-weight:700;background:#f8fafc;">
                <td colspan="6" style="${tdStyle}text-align:right;">សរុបរួម៖</td>
                <td style="${tdCenter}">${getTotalSummary(filtered).permission > 0 ? toKhmerNumerals(getTotalSummary(filtered).permission) : '-'}</td>
                <td style="${tdCenter}">${getTotalSummary(filtered).absent > 0 ? toKhmerNumerals(getTotalSummary(filtered).absent) : '-'}</td>
                <td style="${tdCenter}">${getTotalSummary(filtered).late > 0 ? toKhmerNumerals(getTotalSummary(filtered).late) : '-'}</td>
                <td style="${tdStyle}"></td>
              </tr>
              <tr><td colspan="10" style="border:none;padding:15mm 0 0 0;">
                <div style="display:flex;justify-content:space-between;padding:0 30px;margin-top:-2.5rem;">
                  <div style="text-align:center;width:350px;">
                    <p class="moul-text" style="margin:0 0 20px;font-size:14px;line-height:1.8;">បានឃើញ និងឯកភាព</p>
                    <p class="moul-text" style="margin:0 0 40px 0;font-size:12px;line-height:1.8;">សាលាពុទ្ធិកអនុវិទ្យាល័យ<br/>សម្តេចព្រះមហាសង្ឃរាជ ទេព វង្ស និរោធរង្សី</p>
                    <p class="moul-text" style="margin:0 0 15px 0;font-size:14px;line-height:1;">នាយកសាលា</p>
                    <div style="border-bottom:1px dotted #666;width:180px;margin:0 auto;"></div>
                  </div>
                  <div style="text-align:center;width:300px;font-family:'Battambang',sans-serif;">
                    <p style="margin:0 0 12px 0;font-size:13px;line-height:1.8;">${toKhmerLunarDate(new Date(state.selectedReportDate)).lunarDateText.replace('ពុទ្ធសករាជ', 'ព.ស.')}</p>
                    <p style="margin:0 0 16px 0;font-size:13px;line-height:1.8;">ភ្នំពេញ, ${getSolarDateKhmerFull()}</p>
                    <p style="margin:0 0 50px 0;font-size:13px;line-height:1.8;">គ្រូបន្ទុកថ្នាក់</p>
                    <div style="border-bottom:1px dotted #666;width:180px;margin:0 auto;"></div>
                  </div>
                </div>
              </td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  root.querySelector('[data-action="exit-print"]').addEventListener('click', () => { state = { ...state, isTablePrintMode: false }; update(); });
  const btnTgImg = root.querySelector('[data-action="tg-send-image"]');
  if (btnTgImg) btnTgImg.addEventListener('click', () => handleSendTelegram('image'));
  const btnTgPdf = root.querySelector('[data-action="tg-send-pdf"]');
  if (btnTgPdf) btnTgPdf.addEventListener('click', () => handleSendTelegram('pdf'));
  const btnTgExcel = root.querySelector('[data-action="tg-send-excel"]');
  if (btnTgExcel) btnTgExcel.addEventListener('click', () => handleSendTelegram('excel'));

  const btnPrint = root.querySelector('[data-action="print-browser"]');
  if (btnPrint) btnPrint.addEventListener('click', () => { window.print(); });
  if (window.lucide) window.lucide.createIcons();
}

function update() {
  if (!root) return;
  if (state.isLoading) {
    root.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;min-height:60vh;flex-direction:column;gap:16px;"><i data-lucide="loader-2" class="animate-spin" style="width:40px;height:40px;color:var(--primary)"></i><h3 style="color:var(--text-secondary);">កំពុងទាញយកទិន្នន័យសិស្ស...</h3></div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const filtered = getFilteredStudentDetails();
  if (state.isTablePrintMode) { renderPrintMode(filtered); return; }

  const totalSummary = getTotalSummary(filtered);
  const dynamicStats = getDynamicStats(filtered, totalSummary);
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.itemsPerPage));
  const safePage = Math.min(state.currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * state.itemsPerPage, safePage * state.itemsPerPage);

  root.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:60px;">
      <div class="glass-panel" style="position:relative;z-index:100;padding:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <button data-action="back" style="padding:10px;border-radius:12px;background:#f1f5f9;border:none;cursor:pointer;color:var(--text-secondary);"><i data-lucide="arrow-left" style="width:20px;height:20px"></i></button>
          <div>
            <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);margin:0 0 4px 0;">${getReportTitle()}</h2>
            <p style="margin:0;color:var(--text-secondary);font-size:0.9rem;">ទិដ្ឋភាពទូទៅនៃស្ថិតិវត្តមានសិស្ស</p>
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:#fff;border:1px solid var(--border);border-radius:14px;padding:14px 18px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:9px 14px;flex:1;min-width:220px;">
          <i data-lucide="search" style="width:16px;height:16px;color:var(--text-muted)"></i>
          <input type="text" data-f="search" placeholder="ស្វែងរកតាមឈ្មោះ ឬ អត្តលេខ..." value="${state.searchQuery}" style="border:none;outline:none;background:transparent;width:100%;font-family:inherit;font-size:0.9rem;color:var(--text-primary);" />
        </div>
        <div style="display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:9px 14px;">
          <i data-lucide="users" style="width:16px;height:16px;color:var(--primary)"></i>
          <select data-f="class" style="border:none;background:transparent;outline:none;font-family:inherit;font-weight:600;color:var(--text-primary);cursor:pointer;">
            <option value="ទាំងអស់" ${state.selectedClass === 'ទាំងអស់' ? 'selected' : ''}>ទាំងអស់ថ្នាក់</option>
            ${state.classOptions.map(name => `<option value="${name}" ${state.selectedClass === name ? 'selected' : ''}>${name}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:9px 14px;">
          <i data-lucide="book-open" style="width:16px;height:16px;color:var(--primary)"></i>
          <select data-f="subject" style="border:none;background:transparent;outline:none;font-family:inherit;font-weight:600;color:var(--text-primary);cursor:pointer;">
            <option value="ទាំងអស់" ${state.selectedSubject === 'ទាំងអស់' ? 'selected' : ''}>គ្រប់មុខវិជ្ជា</option>
            ${state.subjectOptions.map(name => `<option value="${name}" ${state.selectedSubject === name ? 'selected' : ''}>${name}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:9px 14px;">
          <i data-lucide="calendar" style="width:16px;height:16px;color:var(--primary)"></i>
          <input type="date" data-f="report-date" value="${state.selectedReportDate}" style="border:none;background:transparent;outline:none;font-family:inherit;font-weight:600;color:var(--text-primary);cursor:pointer;" />
        </div>
        <div style="display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:9px 14px;">
          <i data-lucide="calendar" style="width:16px;height:16px;color:var(--primary)"></i>
          <select data-f="report-type" style="border:none;background:transparent;outline:none;font-family:inherit;font-weight:600;color:var(--text-primary);cursor:pointer;">
            ${['all', 'daily', 'monthly', 'tri1', 'tri2', 'sem1', 'sem2'].map(v => `<option value="${v}" ${state.listReportType === v ? 'selected' : ''}>${{ all: 'ទាំងអស់', daily: 'ថ្ងៃ', monthly: 'ខែ', tri1: 'ត្រីមាសទី១', tri2: 'ត្រីមាសទី២', sem1: 'ឆមាសទី១', sem2: 'ឆមាសទី២' }[v]}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid var(--border);border-radius:10px;padding:9px 14px;">
          <i data-lucide="filter" style="width:16px;height:16px;color:var(--primary)"></i>
          <select data-f="filter-status" style="border:none;background:transparent;outline:none;font-family:inherit;font-weight:600;color:var(--text-primary);cursor:pointer;">
            <option value="all" ${state.filterStatus === 'all' ? 'selected' : ''}>ទាំងអស់</option>
            <option value="permission" ${state.filterStatus === 'permission' ? 'selected' : ''}>ច្បាប់</option>
            <option value="absent" ${state.filterStatus === 'absent' ? 'selected' : ''}>អវត្តមាន</option>
          </select>
        </div>
        <button data-action="clear-filters" style="display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:10px;font-weight:600;background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;cursor:pointer;font-size:0.9rem;"><i data-lucide="x" style="width:16px;height:16px"></i> សម្អាត</button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:20px;margin-bottom:24px;">
        ${[
          { icon: 'check-circle-2', bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'អត្រាវត្តមាន', value: `${toKhmerNumerals(dynamicStats.attendanceRate)}%` },
          { icon: 'alert-triangle', bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'អវត្តមានសរុប', value: `${toKhmerNumerals(totalSummary.absent)} ថ្ងៃ` },
          { icon: 'calendar', bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'ច្បាប់សរុប', value: `${toKhmerNumerals(totalSummary.permission)} ថ្ងៃ` },
          { icon: 'clock', bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9', label: 'យឺតសរុប', value: `${toKhmerNumerals(totalSummary.late)} ដង` },
        ].map(c => `
          <div style="background:#fff;border-radius:16px;padding:20px;display:flex;align-items:center;gap:16px;border:1px solid var(--border);">
            <div style="width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${c.bg};color:${c.color};"><i data-lucide="${c.icon}" style="width:26px;height:26px"></i></div>
            <div><p style="margin:0 0 4px 0;color:var(--text-secondary);font-size:0.85rem;font-weight:600;">${c.label}</p><h3 style="margin:0;font-size:1.7rem;font-weight:800;color:var(--text-primary);">${c.value}</h3></div>
          </div>
        `).join('')}
      </div>

      <div class="glass-panel" style="padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin:0;color:var(--text-primary);">បញ្ជីវត្តមានសិស្ស</h3>
          <button data-action="export-telegram" ${state.isSendingTg ? 'disabled' : ''} style="display:flex;align-items:center;justify-content:center;gap:6px;padding:8px 14px;border-radius:8px;font-weight:600;background:#0ea5e9;color:#fff;border:none;cursor:${state.isSendingTg ? 'not-allowed' : 'pointer'};opacity:${state.isSendingTg ? 0.7 : 1};">
            <i data-lucide="send" style="width:16px;height:16px"></i>
            ${state.isSendingTg ? 'កំពុងផ្ញើ...' : 'Telegram'}
          </button>
        </div>
        <div style="overflow-x:auto;border-radius:14px;border:1px solid var(--border);">
          <table style="width:100%;border-collapse:collapse;white-space:nowrap;">
            <thead><tr style="background:#f8fafc;">
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">ល.រ</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">ឈ្មោះសិស្ស</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">ថ្នាក់</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">វត្តស្នាក់នៅ</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">កុដិ</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">មុខវិជ្ជា</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">ច្បាប់ (ថ្ងៃ)</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">អវត្តមាន (ថ្ងៃ)</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">យឺត (ដង)</th>
              <th style="padding:14px 16px;font-size:0.78rem;font-weight:700;color:var(--text-secondary);border-bottom:2px solid var(--border);">កាលបរិច្ឆេទបញ្ជាក់</th>
            </tr></thead>
            <tbody>
              ${filtered.length === 0 ? `<tr><td colspan="10" style="padding:32px;text-align:center;color:var(--text-secondary);">មិនមានទិន្នន័យសម្រាប់ជម្រើសនេះទេ</td></tr>` : paginated.map((student, index) => `
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${toKhmerNumerals((safePage - 1) * state.itemsPerPage + index + 1)}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);font-weight:600;font-size:1rem;">${student.name}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${(student.grade || state.selectedClass).replace('ថ្នាក់ទី ', '')}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${student.residence}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${student.kudi}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${student.subject}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${student.totalPermission > 0 ? `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:32px;padding:4px 10px;border-radius:999px;font-weight:700;font-size:0.85rem;background:rgba(217,119,6,0.12);color:#d97706;">${toKhmerNumerals(student.totalPermission)}</span>` : '-'}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${student.totalAbsent > 0 ? `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:32px;padding:4px 10px;border-radius:999px;font-weight:700;font-size:0.85rem;background:rgba(239,68,68,0.12);color:#ef4444;">${toKhmerNumerals(student.totalAbsent)}</span>` : '-'}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);">${student.totalLate > 0 ? `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:32px;padding:4px 10px;border-radius:999px;font-weight:700;font-size:0.85rem;background:rgba(14,165,233,0.12);color:#0ea5e9;">${toKhmerNumerals(student.totalLate)}</span>` : '-'}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid var(--border);font-size:0.85rem;">
                    ${student.permissionDates?.length > 0 ? `<div style="display:inline-flex;padding:3px 10px;border-radius:999px;font-size:0.78rem;font-weight:600;margin:2px 4px 2px 0;background:rgba(217,119,6,0.1);color:#d97706;">ច្បាប់៖ ${formatDatesKhmer(student.permissionDates)}</div>` : ''}
                    ${student.absentDates?.length > 0 ? `<div style="display:inline-flex;padding:3px 10px;border-radius:999px;font-size:0.78rem;font-weight:600;margin:2px 4px 2px 0;background:rgba(239,68,68,0.1);color:#ef4444;">អវត្តមាន៖ ${formatDatesKhmer(student.absentDates)}</div>` : ''}
                    ${(!student.permissionDates?.length && !student.absentDates?.length) ? '-' : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot><tr style="background:#f8fafc;border-top:2px solid var(--border);font-weight:700;">
              <td colspan="7" style="padding:16px;text-align:right;color:var(--text-primary);">សរុបរួម៖</td>
              <td style="padding:16px;color:#d97706;">${totalSummary.permission > 0 ? `${toKhmerNumerals(totalSummary.permission)} ថ្ងៃ` : '-'}</td>
              <td style="padding:16px;color:#ef4444;">${totalSummary.absent > 0 ? `${toKhmerNumerals(totalSummary.absent)} ថ្ងៃ` : '-'}</td>
              <td style="padding:16px;color:#0ea5e9;">${totalSummary.late > 0 ? `${toKhmerNumerals(totalSummary.late)} ដង` : '-'}</td>
              <td></td>
            </tr></tfoot>
          </table>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;border-top:1px solid var(--border);flex-wrap:wrap;gap:16px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:14px;color:var(--text-secondary);">បង្ហាញ</span>
            <select data-f="items-per-page" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);outline:none;background:#fff;">
              ${[10, 20, 50, 100].map(n => `<option value="${n}" ${state.itemsPerPage === n ? 'selected' : ''}>${n}</option>`).join('')}
            </select>
            <span style="font-size:14px;color:var(--text-secondary);">ជួរ</span>
          </div>
          <div style="display:flex;align-items:center;gap:16px;">
            <span style="font-size:14px;color:var(--text-secondary);">ទំព័រ ${toKhmerNumerals(safePage)} នៃ ${toKhmerNumerals(totalPages)}</span>
            <div style="display:flex;gap:8px;">
              <button data-action="prev-page" ${safePage === 1 ? 'disabled' : ''} style="padding:6px 12px;border:1px solid var(--border);background:${safePage === 1 ? '#f1f5f9' : '#fff'};color:${safePage === 1 ? '#94a3b8' : 'var(--text-primary)'};border-radius:6px;cursor:${safePage === 1 ? 'not-allowed' : 'pointer'};">ថយក្រោយ</button>
              <button data-action="next-page" ${safePage === totalPages ? 'disabled' : ''} style="padding:6px 12px;border:1px solid var(--border);background:${safePage === totalPages ? '#f1f5f9' : '#fff'};color:${safePage === totalPages ? '#94a3b8' : 'var(--text-primary)'};border-radius:6px;cursor:${safePage === totalPages ? 'not-allowed' : 'pointer'};">បន្ទាប់</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  root.querySelector('[data-action="back"]').addEventListener('click', () => navigate('/attendance'));
  const searchInput = root.querySelector('[data-f="search"]');
  onLiveInput(searchInput, () => { state = { ...state, searchQuery: searchInput.value, currentPage: 1 }; withFocusPreserved(root, update); });
  root.querySelector('[data-f="class"]').addEventListener('change', (e) => { state = { ...state, selectedClass: e.target.value, currentPage: 1 }; update(); });
  root.querySelector('[data-f="subject"]').addEventListener('change', (e) => { state = { ...state, selectedSubject: e.target.value, currentPage: 1 }; update(); });
  root.querySelector('[data-f="report-date"]').addEventListener('change', (e) => { state = { ...state, selectedReportDate: e.target.value, currentPage: 1 }; update(); });
  root.querySelector('[data-f="report-type"]').addEventListener('change', (e) => { state = { ...state, listReportType: e.target.value, currentPage: 1 }; update(); });
  root.querySelector('[data-f="filter-status"]').addEventListener('change', (e) => { state = { ...state, filterStatus: e.target.value, currentPage: 1 }; update(); });
  root.querySelector('[data-action="clear-filters"]').addEventListener('click', handleClearFilters);
  root.querySelector('[data-action="export-telegram"]').addEventListener('click', () => { state = { ...state, isTablePrintMode: true }; update(); });

  const itemsPerPageSel = root.querySelector('[data-f="items-per-page"]');
  if (itemsPerPageSel) itemsPerPageSel.addEventListener('change', (e) => { state = { ...state, itemsPerPage: Number(e.target.value), currentPage: 1 }; update(); });
  const prevBtn = root.querySelector('[data-action="prev-page"]');
  if (prevBtn) prevBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.max(1, safePage - 1) }; update(); });
  const nextBtn = root.querySelector('[data-action="next-page"]');
  if (nextBtn) nextBtn.addEventListener('click', () => { state = { ...state, currentPage: Math.min(totalPages, safePage + 1) }; update(); });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { studentDetails: [], isLoading: true, classOptions: [], subjectOptions: [], listReportType: 'daily', filterStatus: 'all', isTablePrintMode: false, selectedClass: 'ទាំងអស់', selectedReportDate: new Date().toISOString().split('T')[0], selectedSubject: 'ទាំងអស់', isSendingTg: false, currentPage: 1, itemsPerPage: 10, searchQuery: '' };
  update();
  loadData();
}

export function destroy() { root = null; }
