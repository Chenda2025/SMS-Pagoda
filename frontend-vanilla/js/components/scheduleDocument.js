// Ports components/ScheduleDocument.jsx: read-only "official document"
// rendering of a class timetable, returned as an HTML string for direct
// innerHTML insertion (used by html2canvas exports, so no event handlers needed).

export function renderScheduleDocument(data) {
  const half = Math.ceil(data.teachers.length / 2);
  const col1 = data.teachers.slice(0, half);
  const col2 = data.teachers.slice(half);
  const cols = [col1, col2];

  const dayHeaders = data.lunarDays.map(day => `<th style="border:1px solid #cbd5e1;padding:10px 2px;font-weight:bold;min-width:60px;font-size:0.8rem;font-family:Moul;color:#050754;">${day.label}</th>`).join('');

  function rowCells(periodIdx, section) {
    const rowSpan = section === 'morning' ? 2 : 3;
    return data.lunarDays.map((day, dayIdx) => {
      if (dayIdx === 7) {
        if (periodIdx === 0) {
          return `<td rowspan="${rowSpan}" style="border:1px solid #cbd5e1;background:linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(245,158,11,0.12) 100%);color:#d97706;vertical-align:middle;border-right:1px solid #cbd5e1;text-align:center;">
            <div style="transform:rotate(90deg);white-space:nowrap;font-weight:700;letter-spacing:6px;font-size:0.9rem;display:inline-block;">សីល</div>
          </td>`;
        }
        return '';
      }
      return `<td style="border:1px solid #cbd5e1;padding:8px 2px;font-size:0.75rem;font-weight:600;color:#000;">${data.matrix[section][periodIdx].slots[dayIdx]}</td>`;
    }).join('');
  }

  return `
    <div class="print-container official-mode" style="padding:40px;background-color:#fff;color:#000;min-width:1000px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;padding-bottom:8px;color:#050754;">
        <div style="width:38%;display:flex;flex-direction:column;align-items:flex-start;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div style="text-align:center;font-family:Moul;font-size:0.8rem;line-height:1.8;transform:translateY(15%);">
              <div>${data.ministry}</div>
              <div>${data.ministryLocation}</div>
              <div style="letter-spacing:0.5px;">${data.associationCode}</div>
            </div>
          </div>
        </div>
        <div style="width:38%;display:flex;flex-direction:column;align-items:flex-end;">
          <div style="text-align:center;font-family:Moul;font-size:0.9rem;line-height:1.8;">
            <div>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          </div>
        </div>
      </div>

      <div style="text-align:center;margin-bottom:5px;margin-top:-80px;">
        <h2 style="font-family:Moul;font-size:0.8rem;font-weight:500;margin-bottom:5px;color:#0E13AD;">កាលវិភាគសិក្សាមុខវិជ្ជាប្រចាំខែ</h2>
        <h3 style="font-family:Moul;font-size:0.8rem;font-weight:500;color:#0E13AD;margin:0;">${data.className} នៃ ${data.schoolName}</h3>
      </div>

      <div style="display:flex;justify-content:flex-end;margin-bottom:8px;padding-right:2px;margin-top:-24px;margin-right:30px;">
        <span style="font-size:0.9rem;font-weight:700;color:#0E13AD;font-family:'Khmer Os Battambang';">ឆ្នាំសិក្សា ${data.academicYear}</span>
      </div>

      <div style="display:flex;justify-content:flex-start;align-items:center;gap:8px;margin-top:-35px;margin-left:20px;margin-bottom:10px;">
        <strong style="font-family:Battambang;font-size:0.8rem;color:#050754;">គ្រូបន្ទុកថ្នាក់ :</strong>
        <span style="font-family:Moul;font-size:0.8rem;color:#050754;">${data.homeroomTeacher}</span>
      </div>

      <div class="table-container" style="overflow-x:auto;margin-bottom:24px;margin-top:24px;">
        <table style="width:100%;border-collapse:collapse;border:2.5px solid #cbd5e1;text-align:center;">
          <thead>
            <tr style="background-color:#f8fafc;border-bottom:2.5px solid #cbd5e1;">
              <th style="border:1px solid #cbd5e1;padding:10px 4px;font-weight:bold;width:70px;color:#050754;font-size:0.8rem;font-family:Moul;">ម៉ោង</th>
              ${dayHeaders}
            </tr>
          </thead>
          <tbody>
            <tr style="background-color:#f1f5f9;border-bottom:1.5px solid #cbd5e1;">
              <td colspan="15" style="border:1px solid #cbd5e1;padding:4px;font-weight:700;font-size:0.9rem;letter-spacing:4px;text-decoration:underline;font-family:Moul;">ពេលព្រឹក</td>
            </tr>
            <tr><td style="border:1px solid #cbd5e1;padding:10px 4px;font-weight:700;">${data.matrix.morning[0].time}</td>${rowCells(0, 'morning')}</tr>
            <tr><td style="border:1px solid #cbd5e1;padding:10px 4px;font-weight:700;">${data.matrix.morning[1].time}</td>${rowCells(1, 'morning')}</tr>
            <tr style="background-color:#f1f5f9;border-bottom:1.5px solid #cbd5e1;border-top:2.5px solid #cbd5e1;">
              <td colspan="15" style="border:1px solid #cbd5e1;padding:6px;font-weight:700;font-size:0.9rem;letter-spacing:4px;text-decoration:underline;font-family:Moul;">ពេលល្ងាច</td>
            </tr>
            <tr><td style="border:1px solid #cbd5e1;padding:10px 4px;font-weight:700;">${data.matrix.afternoon[0].time}</td>${rowCells(0, 'afternoon')}</tr>
            <tr><td style="border:1px solid #cbd5e1;padding:10px 4px;font-weight:700;">${data.matrix.afternoon[1].time}</td>${rowCells(1, 'afternoon')}</tr>
            <tr><td style="border:1px solid #cbd5e1;padding:10px 4px;font-weight:700;">${data.matrix.afternoon[2].time}</td>${rowCells(2, 'afternoon')}</tr>
          </tbody>
        </table>
      </div>

      <div style="overflow-x:auto;margin-bottom:15px;font-family:Battambang;margin-top:0px;">
        <div style="min-width:800px;padding-top:0px;display:flex;justify-content:flex-start;padding-left:3%;padding-right:5%;">
          <div style="display:flex;gap:0;flex-wrap:wrap;width:100%;">
            ${cols.map((col, colIdx) => `
              <div style="width:${colIdx === 0 ? '35%' : '55%'};display:flex;flex-direction:column;gap:2px;border-right:${colIdx === 0 ? '2px dashed #cbd5e1' : 'none'};padding-right:${colIdx === 0 ? '24px' : '0'};padding-left:${colIdx === 1 ? '70px' : '0'};">
                ${col.map(item => `
                  <div style="display:flex;padding:2px 2px;font-size:0.65rem;align-items:center;">
                    <span style="font-weight:700;width:140px;display:inline-block;flex-shrink:0;font-family:Moul;">${item.index}. ${item.subject}</span>
                    <span style="width:120px;display:inline-block;flex-shrink:0;text-align:left;padding-left:12px;color:#4f46e5;font-size:0.8rem;">${item.teacher}</span>
                    <span style="font-weight:700;color:#080589;font-family:Battambang;font-size:0.75rem;flex-shrink:0;margin-left:12px;display:inline-block;text-align:left;">${item.hours}</span>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
