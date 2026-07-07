// Ports pages/LessonPlans.jsx (static table, no API calls).

const plans = [
  { title: 'កិច្ចតែងការបង្រៀនគណិតវិទ្យា ថ្នាក់ទី១២ - មេរៀនព្រំដែន', creator: 'ចាន់ ដារ៉ាវី', date: '២៤ ឧសភា ២០២៦', status: 'បានអនុម័ត' },
  { title: 'កិច្ចតែងការបង្រៀនរូបវិទ្យា ថ្នាក់ទី១០ - ច្បាប់ញូតុន', creator: 'កែវ សុភាព', date: '២២ ឧសភា ២០២៦', status: 'រង់ចាំពិនិត្យ' },
  { title: 'កិច្ចតែងការបង្រៀនអក្សរសាស្ត្រខ្មែរ ថ្នាក់ទី១១ - អក្សរសិល្ប៍ទំនើប', creator: 'សុខ មាន', date: '១៨ ឧសភា ២០២៦', status: 'បានអនុម័ត' },
];

export function render(container) {
  container.innerHTML = `
    <div class="animate-fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <h1 class="page-title" style="margin-bottom:0;">កិច្ចតែងការបង្រៀន</h1>
        <button class="btn btn-primary"><i data-lucide="plus" style="width:18px;height:18px"></i> បញ្ចូលកិច្ចតែងការ</button>
      </div>
      <div class="glass-panel animate-slide-up" style="padding:24px;">
        <div class="table-container">
          <table>
            <thead>
              <tr><th>ចំណងជើងកិច្ចតែងការ</th><th>គ្រូបង្រៀន</th><th>កាលបរិច្ឆេទបញ្ជូន</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr>
            </thead>
            <tbody>
              ${plans.map(plan => `
                <tr>
                  <td><div style="display:flex;align-items:center;gap:8px;font-weight:600;"><i data-lucide="file-text" style="width:18px;height:18px;color:var(--primary)"></i> ${plan.title}</div></td>
                  <td>${plan.creator}</td>
                  <td>${plan.date}</td>
                  <td><span class="badge ${plan.status === 'បានអនុម័ត' ? 'success' : 'warning'}">${plan.status}</span></td>
                  <td>
                    <div style="display:flex;gap:12px;">
                      <button style="color:var(--primary);display:flex;align-items:center;gap:4px;font-weight:500;"><i data-lucide="eye" style="width:14px;height:14px"></i> មើល</button>
                      <button style="color:var(--success);display:flex;align-items:center;gap:4px;font-weight:500;"><i data-lucide="download" style="width:14px;height:14px"></i> ទាញយក</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

export function destroy() {}
