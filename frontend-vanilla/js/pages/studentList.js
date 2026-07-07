import { api } from '../api.js';
import { withFocusPreserved } from '../utils/dom.js';
import { paginate } from '../components/table.js';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import * as XLSX from 'xlsx';
import { buildStandardReportElement } from '../components/reportTemplate.js';

let root = null;
let state = {
  enrollments: [],
  academicYears: [],
  classrooms: [],
  loading: true,

  search: '',
  academicYearFilter: '',
  classroomFilter: '',
  genderFilter: '',
  sortFilter: '',

  page: 1,
  perPage: 15,
};

// ── Data ─────────────────────────────────────────────────────────────────────

async function loadData() {
  state.loading = true;
  update();
  const [ayRes, crRes] = await Promise.all([
    api.get('/api/core/academic-years/'),
    api.get('/api/core/classrooms/'),
  ]);
  if (ayRes.ok) state.academicYears = ayRes.data || [];
  if (crRes.ok) state.classrooms = crRes.data || [];
  await fetchEnrollments();
}

async function fetchEnrollments() {
  state.loading = true;
  update();
  let url = '/api/students/enrollments/students';
  const params = [];
  if (state.academicYearFilter) params.push(`academic_year=${state.academicYearFilter}`);
  if (state.classroomFilter) params.push(`classroom=${state.classroomFilter}`);
  if (params.length) url += '?' + params.join('&');
  const res = await api.get(url);
  state.enrollments = res.ok ? (res.data || []) : [];
  state.loading = false;
  state.page = 1;
  update();
}

function filtered() {
  const q = state.search.trim().toLowerCase();
  let result = state.enrollments.filter(e => {
    if (q && !e.student_name?.toLowerCase().includes(q) && !e.student_code?.toLowerCase().includes(q)) return false;
    if (state.genderFilter && e.gender !== state.genderFilter) return false;
    return true;
  });

  if (state.sortFilter === 'asc') {
    result.sort((a, b) => (a.student_name || '').localeCompare(b.student_name || '', 'km'));
  } else if (state.sortFilter === 'desc') {
    result.sort((a, b) => (b.student_name || '').localeCompare(a.student_name || '', 'km'));
  }

  return result;
}

// ── Render ────────────────────────────────────────────────────────────────────

function init(container) {
  root = container;
  root.innerHTML = '';
  injectStyles();
  update();
}

function update() {
  if (!root) return;
  withFocusPreserved(root, () => {
    root.innerHTML = buildHtml();
    bindEvents();
    if (window.lucide) window.lucide.createIcons();
  });
}

function buildPager(page, totalPages) {
  if (totalPages <= 1) return '';
  return `
    <div class="sl-pager">
      <span class="sl-pager-info">ទំព័រ ${page} / ${totalPages}</span>
      <div class="sl-pager-btns">
        <button class="sl-pager-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹ មុន</button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
          <button class="sl-pager-btn ${p === page ? 'sl-pager-active' : ''}" data-page="${p}">${p}</button>
        `).join('')}
        <button class="sl-pager-btn" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>បន្ទាប់ ›</button>
      </div>
    </div>
  `;
}

function buildHtml() {
  const rows = filtered();
  const { items, totalPages, page: safePage, rangeStart, rangeEnd } = paginate(rows, state.page, state.perPage);
  const activeFilters = [state.academicYearFilter, state.classroomFilter, state.genderFilter, state.sortFilter].filter(Boolean).length;

  const ayOptions = state.academicYears.map(a =>
    `<option value="${a.id}" ${String(a.id) === String(state.academicYearFilter) ? 'selected' : ''}>${a.year_name || a.name}</option>`
  ).join('');
  const crOptions = state.classrooms.map(c =>
    `<option value="${c.id}" ${String(c.id) === String(state.classroomFilter) ? 'selected' : ''}>${c.class_name || c.name}</option>`
  ).join('');

  return `
    <div class="sl-page">
      <div class="sl-header">
        <div>
          <h1 class="sl-title">បញ្ជីសិស្ស</h1>
          <p class="sl-subtitle">សិស្សដែលបានចុះឈ្មោះ${rows.length > 0 ? ` · ${rows.length} នាក់` : ''}</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
        <button data-action="send-template" type="button" class="btn btn-outline" style="display:flex;align-items:center;gap:7px;background:#1e3a8a;color:#fff;border:none;">
          <i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ ទម្រង់
        </button>
        <div data-role="telegram-wrapper" style="position:relative;">
          <button type="button" class="btn btn-outline" style="display:flex;align-items:center;gap:7px;background:#0088cc;color:#fff;border:none;">
            <i data-lucide="send" style="width:16px;height:16px;"></i> ផ្ញើ Telegram <i data-lucide="chevron-down" style="width:14px;height:14px;"></i>
          </button>
          <div data-role="export-panel" style="display:none;position:absolute;top:100%;right:0;background:#fff;border:1px solid var(--border);border-radius:0 0 8px 8px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:220px;overflow:hidden;">
            <button data-action="export-pdf" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate">
              <i data-lucide="file-text" style="width:16px;height:16px;color:#ef4444;"></i> ផ្ញើ PDF ចូល Telegram
            </button>
            <button data-action="export-excel" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate">
              <i data-lucide="table" style="width:16px;height:16px;color:#10b981;"></i> ផ្ញើ Excel ចូល Telegram
            </button>
            <button data-action="export-image" style="width:100%;padding:10px 14px;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:10px;color:var(--text-primary);font-weight:500;font-size:0.875rem;" class="hover-bg-slate">
              <i data-lucide="image" style="width:16px;height:16px;color:#a855f7;"></i> ផ្ញើរូបភាពចូល Telegram
            </button>
           
          </div>
        </div>
        </div>
      </div>

      <div class="sl-toolbar">
        <div class="sl-search-wrap">
          <i data-lucide="search" class="sl-search-icon"></i>
          <input id="sl-search" class="sl-search" type="text" placeholder="ស្វែងរកឈ្មោះ ឬលេខសិស្ស…" value="${state.search}" />
        </div>
        <div class="sl-filter-wrap" data-role="filter-wrapper">
          <button id="sl-filter-btn" class="btn btn-outline" style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:10px;">
            <i data-lucide="filter" style="width:16px;height:16px;"></i> ត្រង
            ${activeFilters ? `<span style="background:var(--primary);color:#fff;border-radius:999px;width:18px;height:18px;font-size:0.7rem;display:flex;align-items:center;justify-content:center;">${activeFilters}</span>` : ''}
          </button>
          ${buildFilterDropdown(ayOptions, crOptions)}
        </div>
      </div>

      ${state.loading ? `
        <div class="sl-loading"><i data-lucide="loader-circle" class="sl-spin"></i> កំពុងទាញទិន្នន័យ…</div>
      ` : `
        <div class="sl-table-wrap">
          <table class="sl-table">
            <thead>
              <tr>
                <th style="width:44px;">#</th>
                <th>សិស្ស</th>
                <th>លេខសិស្ស</th>
                <th>ភេទ</th>
                <th>ថ្នាក់</th>
                <th>ឆ្នាំសិក្សា</th>
                <th>ថ្ងៃចុះឈ្មោះ</th>
                <th style="width:260px;text-align:center;">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              ${items.length === 0 ? `
                <tr><td colspan="8" class="sl-empty">
                  <i data-lucide="users" style="width:32px;height:32px;opacity:0.3;display:block;margin:0 auto 8px;"></i>
                  គ្មានទិន្នន័យ
                </td></tr>
              ` : items.map((e, i) => `
                <tr class="sl-row">
                  <td class="sl-num">${(safePage - 1) * state.perPage + i + 1}</td>
                  <td>
                    <div class="sl-student">
                      <div class="sl-avatar">${(e.student_name || '?')[0]}</div>
                      <div style="display:flex; flex-direction:column;">
                        <span class="sl-name">${e.student_name || '—'}</span>
                        ${e.monitor_role === 'monitor' ? '<span style="font-size:0.7rem;color:#10b981;font-weight:600;"><i data-lucide="shield-check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i>ប្រធានថ្នាក់</span>' : ''}
                        ${e.monitor_role === 'deputy' ? '<span style="font-size:0.7rem;color:#3b82f6;font-weight:600;"><i data-lucide="shield" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i>អនុប្រធានថ្នាក់</span>' : ''}
                      </div>
                    </div>
                  </td>
                  <td class="sl-code">${e.student_code || '—'}</td>
                  <td>${genderBadge(e.gender)}</td>
                  <td>${e.classroom_name || '—'}</td>
                  <td>${e.academic_year_name || '—'}</td>
                  <td class="sl-date">${e.enrollment_date || '—'}</td>
                  <td>
                    <div class="sl-actions">
                      <button class="sl-icon-btn sl-view-btn" data-id="${e.id}" title="មើល">
                        <i data-lucide="eye" style="width:15px;height:15px;"></i>
                      </button>
                      <button class="sl-icon-btn sl-edit-btn" data-id="${e.id}" title="កែប្រែ">
                        <i data-lucide="pencil" style="width:15px;height:15px;"></i>
                      </button>
                      <button class="sl-icon-btn sl-delete-btn" data-id="${e.id}" title="លុប">
                        <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${rows.length > 0 ? `
          <div class="sl-pager-bar">
            <span class="sl-pager-info">បង្ហាញ ${rangeStart}–${rangeEnd} នៃ ${rows.length} នាក់</span>
            ${buildPager(safePage, totalPages)}
          </div>
        ` : ''}
      `}
      <div id="sl-print-template" style="display:none;">
        <div style="font-family:'Battambang','Kantumruy Pro',sans-serif;padding:24px 30px;max-width:1100px;margin:0 auto;color:#1e293b;">
          <div style="text-align:center;margin-bottom:16px;font-family:'Moul',cursive;color:#1e3a8a;">
            <div style="font-size:1.1rem;margin-bottom:4px;">មន្ទីរធម្មការ និងសាសនារាជធានី</div>
            <div style="font-size:0.95rem;margin-bottom:4px;">ភ្នំពេញ</div>
            <div style="font-size:0.95rem;">សាលា ពុ.អ.វិ.ស.ព្រ.ទ.វ.និ</div>
          </div>
          <div style="text-align:center;margin-bottom:20px;">
            <h2 style="font-family:'Moul',cursive;color:#1e3a8a;font-size:1.15rem;margin:0 0 4px 0;">ទម្រង់ចុះឈ្មោះសិស្សថ្មី</h2>
            <div style="font-size:0.8rem;color:#64748b;">សូមបំពេញព័ត៌មានខាងក្រោមដោយប្រើអក្សរពុម្ពច្បាស់លាស់</div>
          </div>
          <div style="float:right;width:80px;height:100px;border:1px solid #94a3b8;display:flex;align-items:center;justify-content:center;margin:0 0 12px 12px;"><span style="font-size:0.65rem;color:#94a3b8;text-align:center;">រូបថត<br/>3x4</span></div>
          <div style="margin-bottom:16px;">
            <div style="font-weight:700;font-size:0.9rem;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:3px;margin-bottom:10px;">១. ព័ត៌មានផ្ទាល់ខ្លួន</div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px;">
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">នាមត្រកូល:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">នាមខ្លួន:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">ឈ្មោះឡាតាំង:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px;">
              <div style="width:120px;"><span style="font-weight:600;font-size:0.85rem;">ភេទ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:70px;">&nbsp;</span></div>
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">ថ្ងៃខែឆ្នាំកំណើត:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
              <div style="flex:1;min-width:160px;"><span style="font-weight:600;font-size:0.85rem;">ទូរស័ព្ទ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:160px;"><span style="font-weight:600;font-size:0.85rem;">សញ្ជាតិ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
            </div>
            <div style="display:flex;gap:16px;">
              <div style="flex:1;"><span style="font-weight:600;font-size:0.85rem;">កម្រិតវប្បធម៌:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
            </div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-weight:700;font-size:0.9rem;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:3px;margin-bottom:10px;">២. ព័ត៌មានព្រះសង្ឃ</div>
            <div style="display:flex;gap:16px;margin-bottom:10px;">
              <span style="font-weight:600;font-size:0.85rem;">ឋានៈព្រះសង្ឃ:</span>
              <label style="display:flex;align-items:center;gap:3px;"><span style="display:inline-block;width:13px;height:13px;border:1px solid #64748b;"></span> គ្រហស្ថ</label>
              <label style="display:flex;align-items:center;gap:3px;"><span style="display:inline-block;width:13px;height:13px;border:1px solid #64748b;"></span> សាមណេរ</label>
              <label style="display:flex;align-items:center;gap:3px;"><span style="display:inline-block;width:13px;height:13px;border:1px solid #64748b;"></span> ភិក្ខុ</label>
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px;">
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">លេខសង្ឃាដិក:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">ឈ្មោះឆាយា:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">លេខឆាយា:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">ថ្ងៃបួស:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:2;min-width:300px;"><span style="font-weight:600;font-size:0.85rem;">ឈ្មោះព្រះឧបជ្ឈាយ៍:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:250px;">&nbsp;</span></div>
            </div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-weight:700;font-size:0.9rem;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:3px;margin-bottom:10px;">៣. ទីកន្លែងកំណើត</div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:180px;"><span style="font-weight:600;font-size:0.85rem;">ខេត្ត/រាជធានី:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:180px;"><span style="font-weight:600;font-size:0.85rem;">ស្រុក/ខណ្ឌ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:180px;"><span style="font-weight:600;font-size:0.85rem;">ឃុំ/សង្កាត់:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:180px;"><span style="font-weight:600;font-size:0.85rem;">ភូមិ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
            </div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-weight:700;font-size:0.9rem;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:3px;margin-bottom:10px;">៤. ព័ត៌មានវត្ត និងកុដិ</div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">វត្តកំពុងស្នាក់:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">កុដិ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
              <div style="flex:1;min-width:200px;"><span style="font-weight:600;font-size:0.85rem;">វត្តកំណើត:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:160px;">&nbsp;</span></div>
            </div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-weight:700;font-size:0.9rem;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:3px;margin-bottom:10px;">៥. ការចុះឈ្មោះចូលរៀន</div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:180px;"><span style="font-weight:600;font-size:0.85rem;">ថ្នាក់រៀន:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:180px;"><span style="font-weight:600;font-size:0.85rem;">ឆ្នាំសិក្សា:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:180px;"><span style="font-weight:600;font-size:0.85rem;">ថ្ងៃចុះឈ្មោះ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:130px;">&nbsp;</span></div>
              <div style="flex:1;min-width:120px;"><span style="font-weight:600;font-size:0.85rem;">លេខតុ:</span> <span style="border-bottom:1px dotted #64748b;display:inline-block;min-width:80px;">&nbsp;</span></div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:30px;font-size:0.85rem;">
            <div style="text-align:center;width:35%;">
              <div style="margin-bottom:50px;">ហត្ថលេខាអ្នកចុះឈ្មោះ</div>
              <div style="border-top:1px solid #64748b;padding-top:4px;">ឈ្មោះ: ..........................</div>
            </div>
            <div style="text-align:center;width:35%;">
              <div style="margin-bottom:50px;">ថ្ងៃខែឆ្នាំ: ........./........./.........</div>
              <div style="border-top:1px solid #64748b;padding-top:4px;">ហត្ថលេខាព្រះនាយក</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildFilterDropdown(ayOptions, crOptions) {
  return `
    <div id="sl-filter-drop" data-role="filter-panel" style="position:absolute;top:100%;right:0;background:#fff;border:1px solid var(--border);border-radius:0 0 12px 12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:50;min-width:240px;padding:16px;display:none;flex-direction:column;gap:14px;">
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">ឆ្នាំសិក្សា</label>
        <select id="sl-ay" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
          <option value="">— ទាំងអស់ —</option>
          ${ayOptions}
        </select>
      </div>
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">ថ្នាក់រៀន</label>
        <select id="sl-cr" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
          <option value="">— ទាំងអស់ —</option>
          ${crOptions}
        </select>
      </div>
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">ភេទ</label>
        <select id="sl-gender" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
          <option value="" ${!state.genderFilter ? 'selected' : ''}>— ទាំងអស់ —</option>
          <option value="ប្រុស" ${state.genderFilter === 'ប្រុស' ? 'selected' : ''}>ប្រុស</option>
          <option value="ស្រី" ${state.genderFilter === 'ស្រី' ? 'selected' : ''}>ស្រី</option>
        </select>
      </div>
      <div>
        <label style="display:block;margin-bottom:6px;font-weight:600;font-size:0.8rem;color:var(--text-secondary);">តម្រៀបតាមឈ្មោះ</label>
        <select id="sl-sort" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px solid #d1d5db;">
          <option value="" ${!state.sortFilter ? 'selected' : ''}>— មិនតម្រៀប —</option>
          <option value="asc" ${state.sortFilter === 'asc' ? 'selected' : ''}>ក-អ</option>
          <option value="desc" ${state.sortFilter === 'desc' ? 'selected' : ''}>អ-ក</option>
        </select>
      </div>
      <button id="sl-clear-btn" style="background:none;border:none;color:var(--primary);font-weight:600;font-size:0.85rem;cursor:pointer;padding:4px 0;text-align:left;">សម្អាតការត្រង</button>
    </div>
  `;
}

// ── View Modal ────────────────────────────────────────────────────────────────

function openViewModal(e) {
  const row = (label, value) => `
    <div class="sl-detail-row">
      <span class="sl-detail-label">${label}</span>
      <span class="sl-detail-value">${value || '—'}</span>
    </div>`;

  const { panel, close } = openModal(`
    <div class="sl-modal-header">
      <div class="sl-modal-avatar">${(e.student_name || '?')[0]}</div>
      <div>
        <div class="sl-modal-name">${e.student_name || '—'}</div>
        <div class="sl-modal-sub">${e.student_code || ''}</div>
      </div>
      <button data-close class="sl-modal-close"><i data-lucide="x" style="width:18px;height:18px;"></i></button>
    </div>
    <div class="sl-modal-body">
      <div class="sl-detail-section">ព័ត៌មានសិស្ស</div>
      ${row('ភេទ', genderBadge(e.gender))}
      ${row('ថ្ងៃខែឆ្នាំកំណើត', e.date_of_birth)}
      <div class="sl-detail-section" style="margin-top:16px;">ព័ត៌មានការចុះឈ្មោះ</div>
      ${row('ថ្នាក់រៀន', e.classroom_name)}
      ${row('ឆ្នាំសិក្សា', e.academic_year_name)}
      ${row('ថ្ងៃចុះឈ្មោះ', e.enrollment_date)}
      ${row('លេខតុ', e.desk_number)}
    </div>
  `);
  panel.classList.add('sl-modal');
  panel.querySelector('[data-close]')?.addEventListener('click', close);
  if (window.lucide) window.lucide.createIcons();
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

function openEditModal(e) {
  const crOpts = state.classrooms.map(c =>
    `<option value="${c.id}" ${c.id === e.classroom_id ? 'selected' : ''}>${c.class_name || c.name}</option>`
  ).join('');
  const ayOpts = state.academicYears.map(a =>
    `<option value="${a.id}" ${a.id === e.academic_year_id ? 'selected' : ''}>${a.year_name || a.name}</option>`
  ).join('');

  const { panel, close } = openModal(`
    <div class="sl-modal-header">
      <div class="sl-modal-avatar" style="background:#f59e0b;">${(e.student_name || '?')[0]}</div>
      <div>
        <div class="sl-modal-name">កែប្រែការចុះឈ្មោះ</div>
        <div class="sl-modal-sub">${e.student_name || ''}</div>
      </div>
      <button data-close class="sl-modal-close"><i data-lucide="x" style="width:18px;height:18px;"></i></button>
    </div>
    <div class="sl-modal-body">
      <div class="sl-form-group">
        <label class="sl-label">ថ្នាក់រៀន</label>
        <select id="edit-cr" class="sl-select">${crOpts}</select>
      </div>
      <div class="sl-form-group">
        <label class="sl-label">ឆ្នាំសិក្សា</label>
        <select id="edit-ay" class="sl-select">${ayOpts}</select>
      </div>
      <div class="sl-form-group">
        <label class="sl-label">តួនាទីក្នុងថ្នាក់ (ប្រធានថ្នាក់)</label>
        <select id="edit-monitor" class="sl-select">
          <option value="" ${!e.monitor_role ? 'selected' : ''}>សិស្សធម្មតា</option>
          <option value="monitor" ${e.monitor_role === 'monitor' ? 'selected' : ''}>ប្រធានថ្នាក់</option>
          <option value="deputy" ${e.monitor_role === 'deputy' ? 'selected' : ''}>អនុប្រធានថ្នាក់</option>
        </select>
      </div>
      <div class="sl-form-group">
        <label class="sl-label">ថ្ងៃចុះឈ្មោះ</label>
        <input id="edit-date" type="date" class="sl-select" value="${e.enrollment_date || ''}" />
      </div>
      <div class="sl-form-group">
        <label class="sl-label">លេខតុ</label>
        <input id="edit-desk" type="number" class="sl-select" placeholder="—" value="${e.desk_number ?? ''}" min="1" />
      </div>
      <div class="sl-modal-footer">
        <button data-close class="sl-btn sl-btn-ghost-border" style="flex:1;">បោះបង់</button>
        <button id="save-btn" class="sl-btn sl-btn-primary" style="flex:1;">រក្សាទុក</button>
      </div>
    </div>
  `, { closeOnBackdrop: false });

  panel.classList.add('sl-modal');
  panel.querySelector('[data-close]')?.addEventListener('click', close);

  panel.querySelector('#save-btn')?.addEventListener('click', async () => {
    const btn = panel.querySelector('#save-btn');
    btn.disabled = true;
    btn.textContent = 'កំពុងរក្សាទុក…';
    const deskVal = panel.querySelector('#edit-desk').value;
    const res = await api.put(`/api/students/enrollments/${e.id}`, {
      student: e.student_id,
      classroom: parseInt(panel.querySelector('#edit-cr').value),
      academic_year: parseInt(panel.querySelector('#edit-ay').value),
      enrollment_date: panel.querySelector('#edit-date').value,
      desk_number: deskVal ? parseInt(deskVal) : null,
      monitor_role: panel.querySelector('#edit-monitor').value,
    });
    if (res.ok) {
      showToast('រក្សាទុកបានជោគជ័យ');
      close();
      await fetchEnrollments();
    } else {
      showToast('មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'error');
      btn.disabled = false;
      btn.textContent = 'រក្សាទុក';
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function openDeleteConfirm(e) {
  const { panel, close } = openModal(`
    <div class="sl-modal-header" style="border-bottom:none;padding-bottom:8px;">
      <div class="sl-modal-avatar" style="background:#ef4444;">
        <i data-lucide="trash-2" style="width:20px;height:20px;color:#fff;"></i>
      </div>
      <div>
        <div class="sl-modal-name">លុបការចុះឈ្មោះ</div>
        <div class="sl-modal-sub">${e.student_name || ''}</div>
      </div>
      <button data-close class="sl-modal-close"><i data-lucide="x" style="width:18px;height:18px;"></i></button>
    </div>
    <div class="sl-modal-body">
      <p style="color:var(--text-muted,#6b7280);font-size:0.88rem;margin:0 0 20px;line-height:1.6;">
        តើអ្នកប្រាកដជាចង់លុបការចុះឈ្មោះរបស់
        <strong style="color:var(--text-primary,#111);">${e.student_name}</strong>
        ចេញពី <strong>${e.classroom_name}</strong> មែនទេ?
        សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
      </p>
      <div class="sl-modal-footer">
        <button data-close class="sl-btn sl-btn-ghost-border" style="flex:1;">បោះបង់</button>
        <button id="del-btn" class="sl-btn" style="flex:1;background:#ef4444;color:#fff;border-color:#ef4444;">លុប</button>
      </div>
    </div>
  `, { closeOnBackdrop: false });

  panel.classList.add('sl-modal');
  panel.querySelector('[data-close]')?.addEventListener('click', close);

  panel.querySelector('#del-btn')?.addEventListener('click', async () => {
    const btn = panel.querySelector('#del-btn');
    btn.disabled = true;
    btn.textContent = 'កំពុងលុប…';
    const res = await api.del(`/api/students/enrollments/${e.id}`);
    if (res.ok || res.status === 204) {
      showToast('លុបបានជោគជ័យ');
      close();
      await fetchEnrollments();
    } else {
      showToast('មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'error');
      btn.disabled = false;
      btn.textContent = 'លុប';
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function printTemplate() {
  const templateEl = root.querySelector('#sl-print-template');
  if (!templateEl) return;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap');
      body { margin: 0; padding: 0; }
      @media print { @page { size: A4 portrait; margin: 10mm; } }
    </style></head>
    <body>${templateEl.innerHTML}<script>setTimeout(()=>{window.print();window.close();},500);<\/script></body></html>
  `);
  printWindow.document.close();
}

function openTelegramConfigModal() {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <h2 style="font-size:1.15rem;font-weight:bold;margin:0 0 16px 0;">កំណត់ Telegram Bot</h2>
    <form style="display:flex;flex-direction:column;gap:12px;">
      <div><label style="display:block;margin-bottom:4px;font-weight:500;font-size:0.85rem;">Bot Token</label><input type="text" data-f="token" style="width:100%;padding:9px;border-radius:8px;border:1px solid #d1d5db;box-sizing:border-box;" value="${tgConfig.token || ''}" /></div>
      <div><label style="display:block;margin-bottom:4px;font-weight:500;font-size:0.85rem;">Chat ID</label><input type="text" data-f="chatId" style="width:100%;padding:9px;border-radius:8px;border:1px solid #d1d5db;box-sizing:border-box;" value="${tgConfig.chatId || ''}" /></div>
      <button type="submit" style="padding:10px;background:#0088cc;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;">រក្សាទុក</button>
    </form>`;
  const handle = openModal(wrap);
  wrap.querySelector('form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    localStorage.setItem('tgConfig', JSON.stringify({ token: wrap.querySelector('[data-f="token"]').value.trim(), chatId: wrap.querySelector('[data-f="chatId"]').value.trim() }));
    showToast('រក្សាទុកបានជោគជ័យ', 'success');
    handle.close();
  });
}

function getListReportElement(rows) {
  const ROWS_PER_PAGE = 15;
  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE) || 1;

  const hiddenHost = document.createElement('div');
  hiddenHost.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex;flex-direction:column;gap:20px;';

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    const chunk = rows.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE);
    const table = document.createElement('table');
    table.innerHTML = `
      <thead><tr>
        <th>ល.រ</th><th>លេខសិស្ស</th><th>ឈ្មោះសិស្ស</th>
        <th>ភេទ</th><th>ថ្នាក់</th><th>ឆ្នាំសិក្សា</th><th>ថ្ងៃចុះឈ្មោះ</th>
      </tr></thead>
      <tbody>${chunk.map((e, j) => `<tr>
        <td>${i * ROWS_PER_PAGE + j + 1}</td>
        <td>${e.student_code || '—'}</td>
        <td style="text-align:left;">${e.student_name || '—'}</td>
        <td>${e.gender || '—'}</td>
        <td>${e.classroom_name || '—'}</td>
        <td>${e.academic_year_name || '—'}</td>
        <td>${e.enrollment_date || '—'}</td>
      </tr>`).join('')}</tbody>`;
    const pageContainer = buildStandardReportElement('បញ្ជីឈ្មោះសិស្សចុះឈ្មោះ', table, null, 'portrait', `${i + 1}/${totalPages}`);
    if (i < totalPages - 1) pageContainer.style.pageBreakAfter = 'always';
    wrapper.appendChild(pageContainer);
    pages.push(pageContainer);
  }

  hiddenHost.appendChild(wrapper);
  document.body.appendChild(hiddenHost);
  return { container: wrapper, hiddenHost, pages };
}

async function handleSendTemplate() {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  const templateEl = root.querySelector('#sl-print-template');
  if (!templateEl) { showToast('មិនអាចរកទម្រង់បានទេ', 'error'); return; }

  const tplBtn = root?.querySelector('[data-action="send-template"]');
  let tplBtnOrigHTML = null;
  if (tplBtn) {
    tplBtnOrigHTML = tplBtn.innerHTML;
    tplBtn.disabled = true;
    if (!document.getElementById('tg-spin-style')) {
      const s = document.createElement('style');
      s.id = 'tg-spin-style';
      s.textContent = '@keyframes tg-spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }
    tplBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2.5px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:tg-spin 0.75s linear infinite;flex-shrink:0;"></span> កំពុងផ្ញើ...';
  }
  const restoreBtn = () => { if (tplBtn && tplBtnOrigHTML !== null) { tplBtn.disabled = false; tplBtn.innerHTML = tplBtnOrigHTML; } };

  templateEl.style.display = 'block';
  const innerEl = templateEl.firstElementChild;
  const fullWidth = innerEl.scrollWidth || 1100;

  try {
    const blob = await html2pdf().set({
      margin: 5,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: fullWidth },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' },
    }).from(innerEl).outputPdf('blob');

    const fd = new FormData();
    fd.append('chat_id', tgConfig.chatId);
    fd.append('document', blob, 'student_template.pdf');
    fd.append('caption', '📋 ទម្រង់បញ្ជីឈ្មោះសិស្ស');
    const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendDocument`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Telegram API Error ' + res.status);
    showToast('បានផ្ញើទម្រង់ចូល Telegram ដោយជោគជ័យ', 'success');
  } catch (err) {
    console.error(err);
    showToast('បរាជ័យក្នុងការផ្ញើទម្រង់', 'error');
  } finally {
    templateEl.style.display = 'none';
    restoreBtn();
  }
}

async function handleExport(kind) {
  const tgConfig = JSON.parse(localStorage.getItem('tgConfig') || '{}');
  if (!tgConfig.token || !tgConfig.chatId) {
    showToast('សូមកំណត់ Telegram Bot ជាមុនសិន', 'error');
    openTelegramConfigModal();
    return;
  }

  const rows = filtered();
  if (!rows.length) { showToast('គ្មានទិន្នន័យសម្រាប់ផ្ញើ', 'error'); return; }

  // Loading state on the Telegram button
  const tgBtn = root?.querySelector('[data-role="telegram-wrapper"] > button');
  let tgBtnOrigHTML = null;
  if (tgBtn) {
    tgBtnOrigHTML = tgBtn.innerHTML;
    tgBtn.disabled = true;
    if (!document.getElementById('tg-spin-style')) {
      const s = document.createElement('style');
      s.id = 'tg-spin-style';
      s.textContent = '@keyframes tg-spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }
    tgBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2.5px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:tg-spin 0.75s linear infinite;flex-shrink:0;"></span> កំពុងផ្ញើ...';
  }
  const restoreTgBtn = () => {
    if (tgBtn && tgBtnOrigHTML !== null) {
      tgBtn.disabled = false;
      tgBtn.innerHTML = tgBtnOrigHTML;
    }
  };

  if (kind === 'excel') {
    try {
      const data = rows.map((e, idx) => ({
        'ល.រ': idx + 1,
        'លេខសិស្ស': e.student_code || '',
        'ឈ្មោះ': e.student_name || '',
        'ភេទ': e.gender || '',
        'ថ្នាក់': e.classroom_name || '',
        'ឆ្នាំសិក្សា': e.academic_year_name || '',
        'ថ្ងៃចុះឈ្មោះ': e.enrollment_date ? new Date(e.enrollment_date).toLocaleDateString('en-GB') : '',
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'StudentList');
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fd = new FormData();
      fd.append('chat_id', tgConfig.chatId);
      fd.append('document', blob, 'student_list.xlsx');
      fd.append('caption', '📋 បញ្ជីសិស្សដែលបានចុះឈ្មោះ (Excel)');
      const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendDocument`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Telegram API Error ' + res.status);
      showToast('បានផ្ញើ Excel ចូល Telegram ដោយជោគជ័យ', 'success');
    } catch (err) {
      console.error(err);
      showToast('បរាជ័យក្នុងការផ្ញើ Excel', 'error');
    } finally {
      restoreTgBtn();
    }
    return;
  }

  const { container, hiddenHost, pages } = getListReportElement(rows);

  try {
    if (kind === 'pdf') {
      const pdfBlob = await html2pdf().set({
        margin: 10,
        filename: 'student_list.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(container).output('blob');
      const fd = new FormData();
      fd.append('chat_id', tgConfig.chatId);
      fd.append('document', pdfBlob, 'student_list.pdf');
      fd.append('caption', '📋 បញ្ជីឈ្មោះសិស្សចុះឈ្មោះ (PDF)');
      const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendDocument`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Telegram API Error ' + res.status);
      showToast('បានផ្ញើ PDF ចូល Telegram ដោយជោគជ័យ', 'success');

    } else if (kind === 'image') {
      const blobs = [];
      for (const pg of pages) {
        const canvas = await html2canvas(pg, { scale: 2, useCORS: true });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.98));
        if (blob) blobs.push(blob);
      }
      const fd = new FormData();
      fd.append('chat_id', tgConfig.chatId);
      if (blobs.length === 1) {
        fd.append('photo', blobs[0], 'student_list.png');
        fd.append('caption', '📋 បញ្ជីឈ្មោះសិស្សចុះឈ្មោះ');
        const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendPhoto`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Telegram API Error ' + res.status);
      } else {
        const mediaArray = blobs.map((b, i) => {
          fd.append(`photo${i}`, b, `student_list_p${i + 1}.png`);
          return { type: 'photo', media: `attach://photo${i}`, caption: i === 0 ? `📋 បញ្ជីឈ្មោះសិស្ស (${blobs.length} ទំព័រ)` : '' };
        });
        fd.append('media', JSON.stringify(mediaArray));
        const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendMediaGroup`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Telegram API Error ' + res.status);
      }
      showToast(`បានផ្ញើរូបភាព (${blobs.length} ទំព័រ) ចូល Telegram ជោគជ័យ`, 'success');
    }

  } catch (err) {
    console.error(err);
    showToast('បរាជ័យ: ' + (err.message || err), 'error');
  } finally {
    if (hiddenHost && hiddenHost.parentNode) document.body.removeChild(hiddenHost);
    restoreTgBtn();
  }
}

function genderBadge(gender) {
  const male = gender === 'ប្រុស';
  return `<span style="background:${male ? '#eff6ff' : '#fdf2f8'};color:${male ? '#2563eb' : '#db2777'};padding:2px 10px;border-radius:12px;font-size:0.78rem;font-weight:600;">${gender || '—'}</span>`;
}

function findById(id) {
  return state.enrollments.find(e => String(e.id) === String(id));
}

// ── Events ────────────────────────────────────────────────────────────────────

function bindEvents() {
  root.querySelector('#sl-search')?.addEventListener('input', ev => {
    state.search = ev.target.value;
    state.page = 1;
    update();
  });

  const filterWrapper = root.querySelector('[data-role="filter-wrapper"]');
  const filterPanel = root.querySelector('[data-role="filter-panel"]');
  if (filterWrapper && filterPanel) {
    filterWrapper.addEventListener('mouseenter', () => { filterPanel.style.display = 'flex'; });
    filterWrapper.addEventListener('mouseleave', () => { filterPanel.style.display = 'none'; });
  }

  root.querySelector('#sl-clear-btn')?.addEventListener('click', () => {
    state.academicYearFilter = '';
    state.classroomFilter = '';
    state.genderFilter = '';
    state.sortFilter = '';
    fetchEnrollments();
  });


  // Auto-apply when any filter select changes
  root.querySelector('#sl-ay')?.addEventListener('change', ev => {
    state.academicYearFilter = ev.target.value;
    fetchEnrollments();
  });
  root.querySelector('#sl-cr')?.addEventListener('change', ev => {
    state.classroomFilter = ev.target.value;
    fetchEnrollments();
  });
  root.querySelector('#sl-gender')?.addEventListener('change', ev => {
    state.genderFilter = ev.target.value;
    state.page = 1;
    update();
  });
  root.querySelector('#sl-sort')?.addEventListener('change', ev => {
    state.sortFilter = ev.target.value;
    state.page = 1;
    update();
  });

  // Export menu hover dropdown
  const telegramWrapper = root.querySelector('[data-role="telegram-wrapper"]');
  const exportPanel = root.querySelector('[data-role="export-panel"]');
  if (telegramWrapper && exportPanel) {
    telegramWrapper.addEventListener('mouseenter', () => { exportPanel.style.display = 'block'; });
    telegramWrapper.addEventListener('mouseleave', () => { exportPanel.style.display = 'none'; });
  }

  root.querySelector('[data-action="send-template"]')?.addEventListener('click', () => handleSendTemplate());
  root.querySelector('[data-action="export-pdf"]')?.addEventListener('click', () => { if (exportPanel) exportPanel.style.display = 'none'; handleExport('pdf'); });
  root.querySelector('[data-action="export-excel"]')?.addEventListener('click', () => { if (exportPanel) exportPanel.style.display = 'none'; handleExport('excel'); });
  root.querySelector('[data-action="export-image"]')?.addEventListener('click', () => { if (exportPanel) exportPanel.style.display = 'none'; handleExport('image'); });

  root.querySelectorAll('.sl-view-btn').forEach(btn =>
    btn.addEventListener('click', ev => { ev.stopPropagation(); const e = findById(btn.dataset.id); if (e) openViewModal(e); })
  );
  root.querySelectorAll('.sl-edit-btn').forEach(btn =>
    btn.addEventListener('click', ev => { ev.stopPropagation(); const e = findById(btn.dataset.id); if (e) openEditModal(e); })
  );
  root.querySelectorAll('.sl-delete-btn').forEach(btn =>
    btn.addEventListener('click', ev => { ev.stopPropagation(); const e = findById(btn.dataset.id); if (e) openDeleteConfirm(e); })
  );

  root.querySelectorAll('.sl-pager-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page);
      if (!isNaN(p) && p >= 1) { state.page = p; update(); }
    });
  });
  


}

// ── Styles ────────────────────────────────────────────────────────────────────

function injectStyles() {
  if (document.getElementById('sl-styles')) return;
  const s = document.createElement('style');
  s.id = 'sl-styles';
  s.textContent = `
    .sl-page { padding: 24px; max-width: 1200px; }
    .sl-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
    .sl-title { font-size: 1.4rem; font-weight: 700; color: var(--text-primary, #111); margin: 0; }
    .sl-subtitle { font-size: 0.85rem; color: var(--text-muted, #6b7280); margin: 4px 0 0; }
    .sl-toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; }
    .sl-search-wrap { position: relative; flex: 1; min-width: 0; }
    .sl-filter-wrap { position: relative; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
    .sl-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #9ca3af; pointer-events: none; }
    .sl-search { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid var(--border, #e5e7eb); border-radius: 8px; font-size: 0.9rem; background: var(--card-bg, #fff); color: var(--text-primary, #111); box-sizing: border-box; }
    .sl-search:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.15); }
    .sl-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid var(--border, #e5e7eb); border-radius: 8px; background: var(--card-bg, #fff); color: var(--text-primary, #374151); font-size: 0.88rem; cursor: pointer; white-space: nowrap; }
    .sl-btn:hover { background: var(--hover-bg, #f9fafb); }
    .sl-btn-active { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
    .sl-btn-ghost { border-color: transparent; background: transparent; color: #ef4444; }
    .sl-btn-ghost:hover { background: #fef2f2; }
    .sl-btn-ghost-border { border-color: var(--border, #e5e7eb); background: transparent; color: var(--text-primary, #374151); }
    .sl-btn-ghost-border:hover { background: var(--hover-bg, #f9fafb); }
    .sl-btn-primary { background: #6366f1; color: #fff; border-color: #6366f1; }
    .sl-btn-primary:hover { background: #4f46e5; }
    .sl-filter-dropdown { position: absolute; top: calc(100% + 6px); right: 0; background: var(--card-bg, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 12px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100; min-width: 280px; }
    .sl-filter-title { font-weight: 700; font-size: 0.9rem; color: var(--text-primary, #111); margin-bottom: 14px; }
    .sl-filter-group { margin-bottom: 12px; }
    .sl-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted, #6b7280); margin-bottom: 4px; }
    .sl-select { width: 100%; padding: 8px 10px; border: 1px solid var(--border, #e5e7eb); border-radius: 8px; font-size: 0.88rem; background: var(--card-bg, #fff); color: var(--text-primary, #111); cursor: pointer; box-sizing: border-box; }
    .sl-select:focus { outline: none; border-color: #6366f1; }
    .sl-filter-actions { display: flex; gap: 8px; margin-top: 14px; }
    .sl-table-wrap { border: 1px solid var(--border, #e5e7eb); border-radius: 10px; overflow: hidden; background: var(--card-bg, #fff); }
    .sl-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .sl-table thead tr { background: var(--hover-bg, #f9fafb); }
    .sl-table th { padding: 11px 14px; text-align: left; font-weight: 600; font-size: 0.8rem; color: var(--text-muted, #6b7280); border-bottom: 1px solid var(--border, #e5e7eb); white-space: nowrap; }
    .sl-table td { padding: 11px 14px; border-bottom: 1px solid var(--border, #e5e7eb); color: var(--text-primary, #374151); }
    .sl-row:last-child td { border-bottom: none; }
    .sl-row:hover { background: var(--hover-bg, #f9fafb); }
    .sl-num { color: var(--text-muted, #9ca3af); font-size: 0.82rem; text-align: center; }
    .sl-student { display: flex; align-items: center; gap: 10px; }
    .sl-avatar { width: 34px; height: 34px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }
    .sl-name { font-weight: 500; }
    .sl-code { font-family: monospace; font-size: 0.82rem; color: var(--text-muted, #6b7280); }
    .sl-date { font-size: 0.82rem; color: var(--text-muted, #6b7280); }
    .sl-empty { text-align: center; padding: 48px 16px !important; color: var(--text-muted, #9ca3af); font-size: 0.9rem; }
    .sl-loading { display: flex; align-items: center; gap: 10px; justify-content: center; padding: 60px 0; color: var(--text-muted, #6b7280); font-size: 0.9rem; }
    .sl-spin { animation: sl-spin 1s linear infinite; }
    @keyframes sl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* Pagination */
    .sl-pager-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 14px 4px 4px; }
    .sl-pager-info { font-size: 0.82rem; color: var(--text-muted, #6b7280); }
    .sl-pager { display: flex; align-items: center; gap: 4px; }
    .sl-pager-btns { display: flex; gap: 4px; align-items: center; }
    .sl-pager-btn { padding: 5px 11px; border: 1px solid var(--border, #e5e7eb); border-radius: 7px; background: var(--card-bg, #fff); color: var(--text-primary, #374151); font-size: 0.82rem; cursor: pointer; }
    .sl-pager-btn:hover:not(:disabled) { background: var(--hover-bg, #f3f4f6); }
    .sl-pager-btn:disabled { opacity: 0.4; cursor: default; }
    .sl-pager-active { background: #6366f1 !important; color: #fff !important; border-color: #6366f1 !important; font-weight: 600; }

    /* Action buttons */
    .sl-actions { display: flex; gap: 4px; justify-content: center; }
    .sl-icon-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border, #e5e7eb); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted, #6b7280); transition: all 0.15s; }
    .sl-view-btn:hover { color: #6366f1; border-color: #6366f1; background: #eef2ff; }
    .sl-edit-btn:hover { color: #f59e0b; border-color: #f59e0b; background: #fffbeb; }
    .sl-delete-btn:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }

    /* Modal */
    .sl-modal { border-radius: 14px; padding: 0; overflow: hidden; min-width: 340px; max-width: 460px; width: 90vw; }
    .sl-modal-header { display: flex; align-items: center; gap: 14px; padding: 20px 20px 16px; border-bottom: 1px solid var(--border, #e5e7eb); }
    .sl-modal-avatar { width: 44px; height: 44px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }
    .sl-modal-name { font-weight: 700; font-size: 1rem; color: var(--text-primary, #111); }
    .sl-modal-sub { font-size: 0.8rem; color: var(--text-muted, #9ca3af); margin-top: 2px; }
    .sl-modal-close { margin-left: auto; width: 30px; height: 30px; border: none; background: var(--hover-bg, #f3f4f6); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted, #6b7280); flex-shrink: 0; }
    .sl-modal-close:hover { background: #e5e7eb; }
    .sl-modal-body { padding: 16px 20px 20px; }
    .sl-modal-footer { display: flex; gap: 8px; margin-top: 20px; }
    .sl-detail-section { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-muted, #9ca3af); margin-bottom: 6px; }
    .sl-detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border, #f3f4f6); }
    .sl-detail-row:last-child { border-bottom: none; }
    .sl-detail-label { font-size: 0.82rem; color: var(--text-muted, #6b7280); }
    .sl-detail-value { font-size: 0.88rem; font-weight: 500; color: var(--text-primary, #111); }
    .sl-form-group { margin-bottom: 14px; }

    @media (max-width: 640px) {
      .sl-page { padding: 16px; }
      .sl-table th:nth-child(6), .sl-table td:nth-child(6),
      .sl-table th:nth-child(7), .sl-table td:nth-child(7) { display: none; }
      .sl-pager-btn { padding: 4px 8px; }
    }
  `;
  document.head.appendChild(s);
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function render(container) {
  state = { ...state, loading: true, enrollments: [], page: 1 };
  init(container);
  loadData();
}

export function destroy() {
  root = null;
}
