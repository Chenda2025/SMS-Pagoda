// Ports pages/Dashboard.jsx (the admin home page -- static/dummy data, no API calls).

import { withFocusPreserved, onLiveInput } from '../utils/dom.js';

const timetableSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TimetableConfiguration",
  "type": "object",
  "properties": {
    "class_id": { "type": "string", "description": "អត្តសញ្ញាណថ្នាក់រៀន" },
    "subject_id": { "type": "string", "description": "អត្តសញ្ញាណមុខវិជ្ជា" },
    "teacher_id": { "type": "string", "description": "អត្តសញ្ញាណគ្រូបង្រៀន" },
    "day_of_week": {
      "type": "string",
      "enum": ["ថ្ងៃ១ ក~រ", "ថ្ងៃ២ ក~រ", "ថ្ងៃ៣ ក~រ", "ថ្ងៃ៤ ក~រ", "ថ្ងៃ៥ ក~រ", "ថ្ងៃ៦ ក~រ", "ថ្ងៃ៧ ក~រ", "ថ្ងៃ៨ ក~រ", "ថ្ងៃ៩ ក~រ", "ថ្ងៃ១០ ក~រ", "ថ្ងៃ១១ ក~រ", "ថ្ងៃ១២ ក~រ", "ថ្ងៃ១៣ ក~រ", "ថ្ងៃ១៤ ក~រ", "ថ្ងៃ១៥ ក~រ"]
    },
    "period_number": { "type": "integer", "minimum": 1, "maximum": 5 },
    "respect_khmer_lunar_holidays": { "type": "boolean", "default": true }
  },
  "required": ["class_id", "subject_id", "teacher_id", "day_of_week", "period_number"]
};

const scheduleGrid = [
  { period: 'ម៉ោងទី ១', t1: 'គណិតវិទ្យា (ថ្នាក់ ក)', t2: 'រូបវិទ្យា (ថ្នាក់ ខ)', t3: 'គណិតវិទ្យា', t4: 'រូបវិទ្យា', t5: 'គីមីវិទ្យា', t6: 'កីឡា', t7: 'សម្រាក', t8: 'ថ្ងៃសីល', t9: 'ជីវវិទ្យា', t10: 'ប្រវត្តិវិទ្យា', t11: 'ភាសាអង់គ្លេស', t12: 'គីមីវិទ្យា', t13: 'សិល្បៈ', t14: 'គណិតវិទ្យា', t15: 'ថ្ងៃសីល' },
  { period: 'ម៉ោងទី ២', t1: 'អក្សរសាស្ត្រខ្មែរ', t2: 'ភាសាអង់គ្លេស', t3: 'ភ្ជុំបិណ្ឌ', t4: 'ភាសាអង់គ្លេស', t5: 'ប្រវត្តិវិទ្យា', t6: 'គីមីវិទ្យា', t7: 'សម្រាក', t8: 'ថ្ងៃសីល', t9: 'គណិតវិទ្យា', t10: 'ភាសាអង់គ្លេស', t11: 'អក្សរសាស្ត្រខ្មែរ', t12: 'ព័ត៌មានវិទ្យា', t13: 'ផែនដីវិទ្យា', t14: 'រូបវិទ្យា', t15: 'ថ្ងៃសីល' },
  { period: 'ម៉ោងទី ៣', t1: 'គីមីវិទ្យា', t2: 'ជីវវិទ្យា', t3: 'ភ្ជុំបិណ្ឌ', t4: 'ជីវវិទ្យា', t5: 'ព័ត៌មានវិទ្យា', t6: 'អក្សរសាស្ត្រខ្មែរ', t7: 'សម្រាក', t8: 'ថ្ងៃសីល', t9: 'រូបវិទ្យា', t10: 'សីលធម៌ពលរដ្ឋ', t11: 'គណិតវិទ្យា', t12: 'កីឡា', t13: 'តន្ត្រី', t14: 'គីមីវិទ្យា', t15: 'ថ្ងៃសីល' },
];

const absentStudents = [
  { name: 'សុខ វិបុល', class: 'ថ្នាក់ទី ១០A', reason: 'គ្រុនក្តៅ (មានច្បាប់)' },
  { name: 'ឡុង ស្រីនាង', class: 'ថ្នាក់ទី ១២B', reason: 'រវល់គ្រួសារ (មានច្បាប់)' },
  { name: 'ចាន់ វាសនា', class: 'ថ្នាក់ទី ១១C', reason: 'គ្មានមូលហេតុ (អត់ច្បាប់)' },
];

let root = null;
let state = {
  respectLunarHolidays: true,
  structureNodes: {
    principal: { name: 'ចាន់ សុផល', avatarColor: '#4f46e5', title: 'នាយកសាលា' },
    deputyTech: { name: 'សួង ណារិន', avatarColor: '#10b981', title: 'នាយករងបច្ចេកទេស' },
    deputyAdmin: { name: 'គង់ សំអាត', avatarColor: '#3b82f6', title: 'នាយករងរដ្ឋបាល' },
    office: { name: 'ការិយាល័យរដ្ឋបាល', avatarColor: '#6b7280', title: 'បុគ្គលិកការិយាល័យ' },
    t1: { name: 'ម៉ៅ សុខា', avatarColor: '#f59e0b', title: 'គ្រូបន្ទុកថ្នាក់ទី១ (ក-ខ)' },
    t2: { name: 'លឹម គីមហួរ', avatarColor: '#ec4899', title: 'គ្រូបន្ទុកថ្នាក់ទី២ (ក-ខ)' },
    t3: { name: 'អ៊ូច សុផាត', avatarColor: '#8b5cf6', title: 'គ្រូបន្ទុកថ្នាក់ទី៣' },
  },
};

function nodeCard(key, node, opts = {}) {
  const { size = 40, width = 240, fontSize = '0.85rem' } = opts;
  return `
    <div class="glass-panel" style="padding:16px;width:${width}px;border-radius:12px;text-align:center;${opts.border || ''}">
      <div style="width:${size}px;height:${size}px;border-radius:50%;background-color:${node.avatarColor};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;margin:0 auto 10px;">${(node.name[0] || 'N')}</div>
      <strong style="display:block;font-size:${fontSize};color:${opts.titleColor || 'var(--text-secondary)'};">${node.title}</strong>
      <input type="text" data-node="${key}" value="${node.name}" style="width:100%;padding:6px;border:1px solid var(--border);border-radius:6px;margin-top:8px;text-align:center;font-size:0.8rem;outline:none;" />
    </div>
  `;
}

function update() {
  if (!root) return;
  const { respectLunarHolidays, structureNodes } = state;

  root.innerHTML = `
    <div class="animate-fade-in" style="padding-bottom:60px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <div>
          <h1 class="page-title" style="margin-bottom:4px;">ផ្ទាំងគ្រប់គ្រងទូទៅ</h1>
          <p style="color:var(--primary);font-size:0.9rem;font-weight:600;">🌙 ប្រតិទិនចន្ទគតិ៖ ថ្ងៃអាទិត្យ ៩កើត ខែជេស្ឋ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០</p>
        </div>
        <div class="glass-panel" style="padding:10px 16px;display:flex;align-items:center;gap:12px;">
          <label style="font-size:0.85rem;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" data-action="toggle-lunar" ${respectLunarHolidays ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;" />
            គោរពថ្ងៃឈប់សម្រាកបុណ្យចន្ទគតិខ្មែរ
          </label>
        </div>
      </div>

      <div class="dashboard-grid" style="margin-bottom:24px;">
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">សិស្សសរុប</span><div class="stat-icon primary"><i data-lucide="users" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">1,248</div>
          <div style="font-size:0.875rem;color:var(--success);"><i data-lucide="trending-up" style="width:14px;height:14px;display:inline;margin-right:4px;"></i>+12% ធៀបនឹងខែមុន</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">គ្រូសរុប</span><div class="stat-icon success"><i data-lucide="graduation-cap" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">84</div>
          <div style="font-size:0.875rem;color:var(--success);"><i data-lucide="trending-up" style="width:14px;height:14px;display:inline;margin-right:4px;"></i>+2% ធៀបនឹងខែមុន</div>
        </div>
        <div class="glass-panel stat-card">
          <div class="stat-header"><span class="stat-label">វត្តមានថ្ងៃនេះ</span><div class="stat-icon warning"><i data-lucide="calendar" style="width:24px;height:24px"></i></div></div>
          <div class="stat-value">94.2%</div>
          <div style="font-size:0.875rem;color:var(--danger);">-1.5% ធៀបនឹងម្សិលមិញ</div>
        </div>
      </div>

      <div class="dashboard-grid" style="margin-bottom:32px;">
        <div class="glass-panel stat-card" style="min-height:160px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <span style="font-size:0.875rem;font-weight:700;color:var(--text-secondary);">មុខវិជ្ជាបង្រៀនថ្ងៃនេះ</span>
            <div class="stat-icon primary"><i data-lucide="calendar" style="width:20px;height:20px"></i></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:0.875rem;">
            <div>📐 គណិតវិទ្យា (ថ្នាក់ទី១២A) - ០៨:០០</div>
            <div>🔬 រូបវិទ្យា (ថ្នាក់ទី១០B) - ០៩:៤៥</div>
            <div>💻 ព័ត៌មានវិទ្យា (ថ្នាក់ទី១១C) - ១៣:០០</div>
          </div>
        </div>
        <div class="glass-panel stat-card" style="min-height:160px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <span style="font-size:0.875rem;font-weight:700;color:var(--danger);">បញ្ជីសិស្សអវត្តមាន</span>
            <div class="stat-icon danger"><i data-lucide="users" style="width:20px;height:20px"></i></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:0.85rem;">
            ${absentStudents.map(st => `
              <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:4px;">
                <strong style="color:var(--text-primary);">${st.name} (${st.class})</strong>
                <span style="color:${st.reason.includes('អត់ច្បាប់') ? 'var(--danger)' : 'var(--warning)'};">${st.reason}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="glass-panel animate-slide-up" style="padding:24px;margin-bottom:32px;">
        <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:16px;">តារាងកាលវិភាគសិក្សា (ចន្ទគតិ ១កើត ~ ១៥កើត)</h2>
        ${respectLunarHolidays ? `
          <div style="padding:12px 16px;border-radius:8px;background-color:rgba(239,68,68,0.08);border:1px solid var(--danger);color:var(--danger);font-size:0.85rem;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <i data-lucide="alert-triangle" style="width:18px;height:18px"></i>
            ប្រព័ន្ធសម្គាល់៖ មានថ្ងៃឈប់សម្រាកបុណ្យជាតិចន្ទគតិ (ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី៣ និងថ្ងៃសីលធម៌ ថ្ងៃទី៨ ព្រមទាំងថ្ងៃទី១៥) នៅក្នុងកាលវិភាគនេះ!
          </div>
        ` : ''}
        <div class="table-container" style="overflow-x:auto;">
          <table style="min-width:1500px;">
            <thead>
              <tr>
                <th style="min-width:100px;position:sticky;left:0;background-color:#f9fafb;z-index:5;">ម៉ោងសិក្សា</th>
                ${Array.from({ length: 15 }, (_, i) => `<th>ថ្ងៃ${i + 1} ក~រ</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${scheduleGrid.map(row => {
    const isPchum = respectLunarHolidays && row.t3.includes('ភ្ជុំបិណ្ឌ');
    const isSil8 = respectLunarHolidays && row.t8.includes('ថ្ងៃសីល');
    const isSil15 = respectLunarHolidays && row.t15.includes('ថ្ងៃសីល');
    return `
                  <tr>
                    <td style="font-weight:700;color:var(--primary);position:sticky;left:0;background-color:#fff;z-index:5;border-right:1px solid var(--border);">${row.period}</td>
                    <td>${row.t1}</td><td>${row.t2}</td>
                    <td style="background-color:${isPchum ? 'rgba(239,68,68,0.08)' : 'transparent'};color:${isPchum ? 'var(--danger)' : 'inherit'};font-weight:${isPchum ? 700 : 500};">${row.t3}</td>
                    <td>${row.t4}</td><td>${row.t5}</td><td>${row.t6}</td><td>${row.t7}</td>
                    <td style="background-color:${isSil8 ? 'rgba(245,158,11,0.08)' : 'transparent'};color:${isSil8 ? 'var(--warning)' : 'inherit'};font-weight:${isSil8 ? 700 : 500};">${row.t8}</td>
                    <td>${row.t9}</td><td>${row.t10}</td><td>${row.t11}</td><td>${row.t12}</td><td>${row.t13}</td><td>${row.t14}</td>
                    <td style="background-color:${isSil15 ? 'rgba(245,158,11,0.08)' : 'transparent'};color:${isSil15 ? 'var(--warning)' : 'inherit'};font-weight:${isSil15 ? 700 : 500};">${row.t15}</td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
        <details style="margin-top:16px;cursor:pointer;">
          <summary style="font-size:0.85rem;font-weight:600;color:var(--primary);">មើលគ្រោងទិន្នន័យ JSON Schema នៃកាលវិភាគ</summary>
          <pre style="margin-top:12px;padding:16px;border-radius:8px;background-color:#1e1e2d;color:#a9b7c6;font-size:0.75rem;overflow-x:auto;text-align:left;font-family:monospace;">${JSON.stringify(timetableSchema, null, 2)}</pre>
        </details>
      </div>

      <div class="glass-panel animate-slide-up" style="padding:24px;margin-bottom:32px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
          <h2 style="font-size:1.25rem;font-weight:700;">សកម្មភាពថ្មីៗ</h2>
          <button class="btn btn-primary">មើលទាំងអស់</button>
        </div>
        <div class="table-container">
          <table>
            <thead><tr><th>សិស្ស</th><th>សកម្មភាព</th><th>កាលបរិច្ឆេទ</th><th>ស្ថានភាព</th></tr></thead>
            <tbody>
              <tr><td>Alice Freeman</td><td>បង់ថ្លៃសិក្សា</td><td>២៤ ឧសភា ២០២៦</td><td><span class="badge success">បានបញ្ចប់</span></td></tr>
              <tr><td>Michael Chang</td><td>ដាក់ពាក្យសុំច្បាប់ឈប់សម្រាក</td><td>២៤ ឧសភា ២០២៦</td><td><span class="badge warning">កំពុងពិនិត្យ</span></td></tr>
              <tr><td>Sarah Johnson</td><td>បញ្ចូលពិន្ទុប្រឡងរួចរាល់</td><td>២៣ ឧសភា ២០២៦</td><td><span class="badge success">បានបញ្ចប់</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="glass-panel animate-slide-up" style="padding:32px;">
        <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:24px;text-align:center;">រចនាសម្ព័ន្ធគ្រប់គ្រងសាលារៀន (កែសម្រួលឌីណាមិក)</h2>
        <div style="display:flex;flex-direction:column;align-items:center;gap:32px;position:relative;">
          ${nodeCard('principal', structureNodes.principal, { size: 48, width: 280, fontSize: '0.9rem', titleColor: 'var(--primary)', border: 'border:2px solid var(--primary);' })}
          <div style="width:2px;height:32px;background-color:var(--border);"></div>
          <div style="display:flex;gap:40px;justify-content:center;width:100%;flex-wrap:wrap;">
            ${nodeCard('deputyTech', structureNodes.deputyTech, { titleColor: 'var(--success)' })}
            ${nodeCard('deputyAdmin', structureNodes.deputyAdmin, { titleColor: 'var(--primary)' })}
          </div>
          <div style="width:2px;height:32px;background-color:var(--border);"></div>
          <div class="glass-panel" style="padding:16px;width:220px;border-radius:12px;text-align:center;">
            <strong style="display:block;font-size:0.85rem;color:var(--text-secondary);">${structureNodes.office.title}</strong>
            <input type="text" data-node="office" value="${structureNodes.office.name}" style="width:100%;padding:6px;border:1px solid var(--border);border-radius:6px;margin-top:8px;text-align:center;font-size:0.8rem;outline:none;" />
          </div>
          <div style="width:2px;height:32px;background-color:var(--border);"></div>
          <div style="display:flex;gap:20px;justify-content:center;width:100%;flex-wrap:wrap;">
            ${nodeCard('t1', structureNodes.t1, { size: 36, width: 220, fontSize: '0.8rem', titleColor: 'var(--warning)' })}
            ${nodeCard('t2', structureNodes.t2, { size: 36, width: 220, fontSize: '0.8rem', titleColor: '#ec4899' })}
            ${nodeCard('t3', structureNodes.t3, { size: 36, width: 220, fontSize: '0.8rem', titleColor: '#8b5cf6' })}
          </div>
        </div>
      </div>
    </div>
  `;

  root.querySelector('[data-action="toggle-lunar"]').addEventListener('change', (e) => {
    state = { ...state, respectLunarHolidays: e.target.checked };
    update();
  });
  root.querySelectorAll('[data-node]').forEach(input => {
    onLiveInput(input, () => {
      const key = input.dataset.node;
      state = { ...state, structureNodes: { ...state.structureNodes, [key]: { ...state.structureNodes[key], name: input.value } } };
      withFocusPreserved(root, update);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  update();
}

export function destroy() { root = null; }
