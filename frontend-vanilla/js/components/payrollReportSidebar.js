import { showToast } from './toast.js';

let sidebarEl = null;
let backdropEl = null;

function fmt(num) {
  if (isNaN(num) || num === null || num === '') return '0';
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function injectStyles() {
  if (document.getElementById('payroll-report-sidebar-styles')) return;
  const s = document.createElement('style');
  s.id = 'payroll-report-sidebar-styles';
  s.textContent = `
    @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
    #payroll-report-sidebar .dl-btn {
      display:flex;align-items:center;gap:10px;padding:10px 14px;
      background:#fff;border:1px solid #e2e8f0;border-radius:10px;
      cursor:pointer;font-family:inherit;font-size:0.875rem;color:#1e293b;
      transition:background 0.2s,border-color 0.2s;width:100%;text-align:left;
    }
    #payroll-report-sidebar .dl-btn:hover { background:#f8fafc; border-color:#c7d2fe; }
    #payroll-report-sidebar .dl-btn:disabled { opacity:0.55; cursor:not-allowed; }
    #payroll-report-sidebar .dl-icon {
      width:34px;height:34px;border-radius:8px;
      display:flex;align-items:center;justify-content:center;flex-shrink:0;
    }
  `;
  document.head.appendChild(s);
}

function removeSidebar() {
  sidebarEl?.remove(); sidebarEl = null;
  backdropEl?.remove(); backdropEl = null;
}

/**
 * @param {object} opts
 * @param {string}   opts.periodName
 * @param {string}   opts.classroomName
 * @param {number}   opts.rowCount
 * @param {number}   opts.totalAmount
 * @param {Array}    opts.teacherRows   – [{teacherName, teacherInitial, subjectName, teaching, amount}]
 * @param {Function} opts.onDownloadPdf
 * @param {Function} opts.onDownloadExcel
 * @param {Function} opts.onDownloadImage
 */
export function openPayrollReportSidebar({
  periodName, classroomName, rowCount, totalAmount,
  teacherRows, onDownloadPdf, onDownloadExcel, onDownloadImage,
}) {
  removeSidebar();
  injectStyles();

  backdropEl = document.createElement('div');
  backdropEl.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:1199;';
  backdropEl.addEventListener('click', removeSidebar);

  sidebarEl = document.createElement('div');
  sidebarEl.id = 'payroll-report-sidebar';
  sidebarEl.style.cssText = [
    'position:fixed;top:0;right:0;height:100vh;width:380px;',
    'background:#fff;box-shadow:-4px 0 30px rgba(0,0,0,0.15);',
    'z-index:1200;display:flex;flex-direction:column;',
    'animation:slideInRight 0.25s ease;',
  ].join('');

  sidebarEl.innerHTML = `
    <!-- Header -->
    <div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#4f46e5,#818cf8);color:#fff;flex-shrink:0;">
      <div>
        <h3 style="margin:0;font-family:'Moul',serif;font-size:1rem;">របាយការណ៍ប្រាក់បៀវត្ស</h3>
        <p style="margin:4px 0 0;font-size:0.8rem;opacity:0.85;">${periodName || 'មិនទាន់ជ្រើសរើសវគ្គ'}</p>
      </div>
      <button id="prs-close" style="background:rgba(255,255,255,0.2);border:none;border-radius:8px;width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
        <i data-lucide="x" style="width:16px;height:16px;color:#fff;"></i>
      </button>
    </div>

    <!-- Summary -->
    <div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;flex-shrink:0;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <div style="background:#f0f9ff;border-radius:10px;padding:14px;">
          <div style="font-size:0.7rem;color:#0369a1;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;">ថ្នាក់រៀន</div>
          <div style="font-size:0.95rem;font-weight:700;color:#0c4a6e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${classroomName}</div>
        </div>
        <div style="background:#f0fdf4;border-radius:10px;padding:14px;">
          <div style="font-size:0.7rem;color:#15803d;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:4px;">ចំនួនជួរ</div>
          <div style="font-size:1.4rem;font-weight:800;color:#14532d;">${rowCount}</div>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:10px;padding:16px;text-align:center;">
        <div style="font-size:0.72rem;color:#064e3b;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:6px;">ប្រាក់សរុបទាំងអស់</div>
        <div style="font-size:1.7rem;font-weight:800;color:#059669;">៛${fmt(totalAmount)}</div>
      </div>
    </div>

    <!-- Downloads -->
    <div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;flex-shrink:0;">
      <div style="font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">ទាញយករបាយការណ៍</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <button id="prs-dl-pdf" class="dl-btn">
          <div class="dl-icon" style="background:#fee2e2;"><i data-lucide="file-text" style="width:17px;height:17px;color:#ef4444;"></i></div>
          <div><div style="font-weight:600;">ទាញយក PDF</div><div style="font-size:0.72rem;color:#64748b;">A4 Landscape</div></div>
          <i data-lucide="download" style="width:15px;height:15px;color:#94a3b8;margin-left:auto;"></i>
        </button>
        <button id="prs-dl-excel" class="dl-btn">
          <div class="dl-icon" style="background:#dcfce7;"><i data-lucide="table" style="width:17px;height:17px;color:#16a34a;"></i></div>
          <div><div style="font-weight:600;">ទាញយក Excel</div><div style="font-size:0.72rem;color:#64748b;">.xlsx</div></div>
          <i data-lucide="download" style="width:15px;height:15px;color:#94a3b8;margin-left:auto;"></i>
        </button>
        <button id="prs-dl-image" class="dl-btn">
          <div class="dl-icon" style="background:#f3e8ff;"><i data-lucide="image" style="width:17px;height:17px;color:#9333ea;"></i></div>
          <div><div style="font-weight:600;">ទាញយករូបភាព</div><div style="font-size:0.72rem;color:#64748b;">.png</div></div>
          <i data-lucide="download" style="width:15px;height:15px;color:#94a3b8;margin-left:auto;"></i>
        </button>
      </div>
    </div>

    <!-- Teacher breakdown -->
    <div style="flex:1;overflow-y:auto;padding:20px 24px;">
      <div style="font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">សង្ខេបគ្រូបង្រៀន</div>
      ${teacherRows.length > 0 ? teacherRows.map(r => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;">
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#818cf8);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">${r.teacherInitial}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.teacherName}</div>
            <div style="font-size:0.72rem;color:#64748b;">${r.subjectName} · ${fmt(r.teaching)} ម៉ោង</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-weight:700;color:#059669;font-size:0.85rem;">៛${fmt(r.amount)}</div>
          </div>
        </div>
      `).join('') : `<div style="text-align:center;color:#64748b;padding:32px 0;font-size:0.875rem;">មិនមានទិន្នន័យ</div>`}
    </div>
  `;

  // Wire events
  sidebarEl.querySelector('#prs-close').addEventListener('click', removeSidebar);

  async function withLoading(btn, fn) {
    btn.disabled = true;
    const orig = btn.innerHTML;
    btn.innerHTML = btn.innerHTML.replace(/<i data-lucide="download"[^>]*><\/i>/, '<i data-lucide="loader-2" style="width:15px;height:15px;color:#94a3b8;margin-left:auto;animation:spin 1s linear infinite;"></i>');
    if (window.lucide) window.lucide.createIcons({ nodes: btn.querySelectorAll('[data-lucide]') });
    try { await fn(); }
    catch (err) { console.error(err); showToast('បរាជ័យក្នុងការទាញយក', 'danger'); }
    finally { btn.disabled = false; btn.innerHTML = orig; if (window.lucide) window.lucide.createIcons({ nodes: btn.querySelectorAll('[data-lucide]') }); }
  }

  sidebarEl.querySelector('#prs-dl-pdf').addEventListener('click', e =>
    withLoading(e.currentTarget, onDownloadPdf));
  sidebarEl.querySelector('#prs-dl-excel').addEventListener('click', e =>
    withLoading(e.currentTarget, onDownloadExcel));
  sidebarEl.querySelector('#prs-dl-image').addEventListener('click', e =>
    withLoading(e.currentTarget, onDownloadImage));

  document.body.appendChild(backdropEl);
  document.body.appendChild(sidebarEl);
  if (window.lucide) window.lucide.createIcons({ nodes: sidebarEl.querySelectorAll('[data-lucide]') });
}

export function closePayrollReportSidebar() {
  removeSidebar();
}
