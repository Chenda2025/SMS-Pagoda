// Ports pages/Grades.jsx.

import { withFocusPreserved, onLiveInput } from '../utils/dom.js';
import { api } from '../api.js';

// Term list is no longer hardcoded -- it's built from the real
// `academic_periods` table (see loadAcademicPeriods/buildTermsFromPeriods)
// so the dropdown reflects whatever periods actually exist for the
// selected academic year, gaps and all.

let root = null;
let state = {
  subjects: [],
  allSubjects: [],
  classrooms: [],
  academicYears: [],
  selectedAcademicYear: null,
  students: [],
  allEnrollments: [],
  terms: [],
  loading: true,
  entryMode: 'by_subject',
  selectedClassroom: null,
  selectedSubject: '',
  selectedStudent: '',
  selectedTerm: '',
  scores: {},
};

async function loadInitialData() {
  try {
    const [subRes, clsRes, ayRes] = await Promise.all([
      api.get('/api/subjects'),
      api.get('/api/core/classrooms/'),
      api.get('/api/core/academic-years/'),
    ]);
    if (subRes.ok) {
      state.allSubjects = subRes.data || [];
    }
    if (clsRes.ok) {
      state.classrooms = (clsRes.data || []).slice().sort((a, b) => a.id - b.id);
      if (state.classrooms.length > 0 && !state.selectedClassroom) state.selectedClassroom = state.classrooms[0].id;
    }
    if (ayRes.ok) {
      state.academicYears = ayRes.data || [];
      const current = state.academicYears.find(y => y.is_current);
      state.selectedAcademicYear = current ? current.id : (state.academicYears[0]?.id ?? null);
    }
  } catch (error) {
    console.error('Error loading grades page data:', error);
  }
  state.loading = false;
  update();
  loadStudents();
  loadSubjectsForClassroom();
  loadAcademicPeriods();
}

// Turns the flat, real academic_periods rows (id/parent/period_type)
// into the nested month -> quarter -> semester -> year shape the scoring
// functions below walk. The seed data has gaps (missing months/quarters,
// some parent links that don't line up chronologically) -- rather than
// paper over that, orphaned months/quarters that aren't wired to a
// semester still show up standalone so nothing silently disappears.
function buildTermsFromPeriods(periods) {
  const gradable = periods.filter(p => ['ប្រចាំខែ', 'ត្រីមាស', 'ឆមាស'].includes(p.period_type));
  const byNumber = (a, b) => (a.period_number || 0) - (b.period_number || 0);
  const childrenOf = (id, type) => gradable.filter(p => p.period_type === type && String(p.parent) === String(id)).sort(byNumber);

  const months = gradable.filter(p => p.period_type === 'ប្រចាំខែ').sort(byNumber);
  const quarters = gradable.filter(p => p.period_type === 'ត្រីមាស').sort(byNumber);
  const semesters = gradable.filter(p => p.period_type === 'ឆមាស').sort(byNumber);

  const terms = [];
  const seenMonthIds = new Set();
  const seenQuarterIds = new Set();

  semesters.forEach(sem => {
    childrenOf(sem.id, 'ត្រីមាស').forEach(q => {
      const qMonths = childrenOf(q.id, 'ប្រចាំខែ');
      qMonths.forEach(m => {
        terms.push({ id: String(m.id), label: m.name, type: 'month' });
        seenMonthIds.add(m.id);
      });
      terms.push({ id: String(q.id), label: q.name, type: 'exam', dependsOn: qMonths.map(m => String(m.id)) });
      seenQuarterIds.add(q.id);
    });
    const semQuarterIds = childrenOf(sem.id, 'ត្រីមាស').map(q => String(q.id));
    terms.push({ id: String(sem.id), label: sem.name, type: 'report', dependsOn: semQuarterIds });
  });

  quarters.filter(q => !seenQuarterIds.has(q.id)).forEach(q => {
    const qMonths = childrenOf(q.id, 'ប្រចាំខែ');
    qMonths.forEach(m => {
      if (!seenMonthIds.has(m.id)) { terms.push({ id: String(m.id), label: m.name, type: 'month' }); seenMonthIds.add(m.id); }
    });
    terms.push({ id: String(q.id), label: q.name, type: 'exam', dependsOn: qMonths.map(m => String(m.id)) });
  });

  months.filter(m => !seenMonthIds.has(m.id)).forEach(m => {
    terms.push({ id: String(m.id), label: m.name, type: 'month' });
  });

  if (semesters.length > 0) {
    terms.push({ id: 'year', label: 'របាយការណ៍ប្រចាំឆ្នាំ (សរុបគ្រប់ឆមាស)', type: 'report', dependsOn: semesters.map(s => String(s.id)) });
  }

  return terms;
}

async function loadAcademicPeriods() {
  if (!state.selectedAcademicYear) { state.terms = []; update(); return; }
  try {
    const res = await api.get(`/api/academic-periods/?academic_year=${state.selectedAcademicYear}`);
    state.terms = buildTermsFromPeriods(res.ok ? res.data || [] : []);
  } catch (error) {
    console.error('Error loading academic periods:', error);
    state.terms = [];
  }
  if (!state.terms.some(t => t.id === state.selectedTerm)) {
    const firstMonth = state.terms.find(t => t.type === 'month');
    state.selectedTerm = firstMonth ? firstMonth.id : (state.terms[0]?.id || '');
  }
  update();
}

// A subject only belongs in the picker for a classroom once it's actually
// configured there: assigned via class-subjects with a teacher, and present
// in that classroom's timetable. Otherwise the dropdown lists subjects no
// one can enter scores against (no teacher/schedule to attribute them to).
async function loadSubjectsForClassroom() {
  if (!state.selectedClassroom) { state.subjects = []; update(); return; }
  try {
    const [csRes, ttRes] = await Promise.all([
      api.get(`/api/class-subjects/?classroom=${state.selectedClassroom}`),
      api.get(`/api/timetable/?classroom=${state.selectedClassroom}`),
    ]);
    const scheduledSubjectIds = new Set((ttRes.ok ? ttRes.data || [] : []).map(t => String(t.subject)));
    const assignedSubjectIds = new Set(
      (csRes.ok ? csRes.data || [] : [])
        .filter(cs => cs.teacher != null)
        .map(cs => String(cs.subject))
    );
    state.subjects = state.allSubjects.filter(s =>
      assignedSubjectIds.has(String(s.id)) && scheduledSubjectIds.has(String(s.id))
    );
  } catch (error) {
    console.error('Error loading subjects for classroom:', error);
    state.subjects = [];
  }
  if (!state.subjects.some(s => String(s.id) === String(state.selectedSubject))) {
    state.selectedSubject = state.subjects.length > 0 ? state.subjects[0].id.toString() : '';
  }
  update();
}

async function loadStudents() {
  if (!state.selectedClassroom) { state.students = []; update(); return; }
  try {
    const [enRes, stuRes] = await Promise.all([
      api.get('/api/students/enrollments/'),
      api.get('/api/students/list/'),
    ]);
    if (!enRes.ok || !stuRes.ok) throw new Error('បរាជ័យក្នុងការទាញយកទិន្នន័យសិស្ស');

    state.allEnrollments = enRes.data || [];

    const studentMap = {};
    (stuRes.data || []).forEach(s => { studentMap[s.id] = s; });

    const classEnrollments = state.allEnrollments.filter(e =>
      String(e.classroom) === String(state.selectedClassroom) &&
      (!state.selectedAcademicYear || String(e.academic_year) === String(state.selectedAcademicYear))
    );

    state.students = classEnrollments
      .map(e => studentMap[e.student])
      .filter(Boolean)
      .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'km'));

    state.selectedStudent = state.students.length > 0 ? String(state.students[0].id) : '';
  } catch (error) {
    console.error('Error loading students for classroom:', error);
    state.students = [];
    state.selectedStudent = '';
  }
  update();
}

function getScore(studentId, subjectId, termId) {
  return state.scores[studentId]?.[subjectId]?.[termId] || { activity: '', attendance: '', kudi: '', exam: '' };
}

// Whether any student in the currently loaded class already has a value
// entered for this subject at the selected term -- used to split the
// subject dropdown into "not yet entered" vs "already entered" groups.
function subjectHasAnyScore(subjectId, termId) {
  return state.students.some(student => {
    const s = getScore(student.id, subjectId, termId);
    return s.activity !== '' || s.attendance !== '' || s.kudi !== '' || s.exam !== '';
  });
}

// Same idea as subjectHasAnyScore but at the classroom level -- looks across
// every enrolled student in that classroom (not just the currently loaded
// one) so switching classrooms doesn't lose track of what's been entered.
function classroomHasAnyScore(classroomId, termId) {
  const studentIds = state.allEnrollments
    .filter(e => String(e.classroom) === String(classroomId))
    .map(e => String(e.student));
  return studentIds.some(studentId => {
    const bySubject = state.scores[studentId];
    if (!bySubject) return false;
    return Object.values(bySubject).some(byTerm => {
      const s = byTerm[termId];
      return s && (s.activity !== '' || s.attendance !== '' || s.kudi !== '' || s.exam !== '');
    });
  });
}

// Same idea again, at the term/period level -- true once any student, any
// subject, any classroom has a value recorded for that period.
function termHasAnyScore(termId) {
  return Object.values(state.scores).some(bySubject =>
    Object.values(bySubject).some(byTerm => {
      const s = byTerm[termId];
      return s && (s.activity !== '' || s.attendance !== '' || s.kudi !== '' || s.exam !== '');
    })
  );
}

function getMonthTotal(studentId, subjectId, termId) {
  const s = getScore(studentId, subjectId, termId);
  if (s.activity === '' && s.attendance === '' && s.kudi === '') return '';
  return (Number(s.activity) || 0) + (Number(s.attendance) || 0) + (Number(s.kudi) || 0);
}

function getQuarterTotal(studentId, subjectId, quarterId) {
  const term = state.terms.find(t => t.id === quarterId);
  if (!term || !term.dependsOn) return '';
  if (getScore(studentId, subjectId, quarterId).exam === '') return '';
  const monthsTotal = term.dependsOn.reduce((sum, depId) => sum + (getMonthTotal(studentId, subjectId, depId) || 0), 0);
  const examScore = Number(getScore(studentId, subjectId, quarterId).exam) || 0;
  return monthsTotal + examScore;
}

function getSemesterTotal(studentId, subjectId, termId) {
  const term = state.terms.find(t => t.id === termId);
  if (!term || !term.dependsOn) return '';
  let total = 0, hasValue = false;
  term.dependsOn.forEach(depId => {
    const depTerm = state.terms.find(t => t.id === depId);
    let val = '';
    if (depTerm?.type === 'exam') val = getQuarterTotal(studentId, subjectId, depId);
    else if (depTerm?.type === 'report') val = getSemesterTotal(studentId, subjectId, depId);
    if (val !== '') { total += val; hasValue = true; }
  });
  return hasValue ? total : '';
}

function handleScoreChange(studentId, subjectId, termId, field, value) {
  const subject = state.subjects.find(s => s.id.toString() === subjectId.toString());
  const maxScore = subject ? subject.max_score || 100 : 100;
  let numericValue = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
  if (numericValue !== '' && numericValue > maxScore) {
    alert(`សុំទោស! ពិន្ទុមិនអាចលើសពីពិន្ទុអតិបរមា (${maxScore}) ទេ!`);
    numericValue = maxScore;
  }
  const prevStudent = state.scores[studentId] || {};
  const prevSubject = prevStudent[subjectId] || {};
  const prevTerm = prevSubject[termId] || { activity: '', attendance: '', kudi: '', exam: '' };
  state = {
    ...state,
    scores: {
      ...state.scores,
      [studentId]: { ...prevStudent, [subjectId]: { ...prevSubject, [termId]: { ...prevTerm, [field]: numericValue } } },
    },
  };
  withFocusPreserved(root, update);
}

function shortLabel(term) {
  return term ? term.label.replace(/ \(.+\)/, '') : '';
}

function renderHeaders(currentTerm) {
  if (currentTerm.type === 'month') {
    return `<th style="width:15%">សកម្មភាព</th><th style="width:15%">វត្តមាន</th><th style="width:15%">កិច្ចការកុដិ</th><th style="width:15%;background:rgba(59,130,246,0.05)">សរុបប្រចាំខែ</th>`;
  }
  if (currentTerm.type === 'exam') {
    const deps = currentTerm.dependsOn || [];
    const depWidth = deps.length > 0 ? Math.floor(60 / deps.length) : 0;
    const depThs = deps.map(depId => `<th style="width:${depWidth}%">សរុប ${shortLabel(state.terms.find(t => t.id === depId))}</th>`).join('');
    return `${depThs}<th style="width:20%;color:var(--primary)">ពិន្ទុប្រឡង</th><th style="width:15%;background:rgba(16,185,129,0.05)">សរុបត្រីមាស</th>`;
  }
  return (currentTerm.dependsOn || []).map(depId => `<th style="width:20%">សរុប ${shortLabel(state.terms.find(t => t.id === depId))}</th>`).join('') +
    `<th style="width:20%;background:rgba(245,158,11,0.05)">${currentTerm.label}</th>`;
}

function renderCells(studentId, subjectId, currentTerm, selectedTerm) {
  const score = getScore(studentId, subjectId, selectedTerm);
  const inputStyle = `width:80px;padding:8px;border:1px solid var(--border);border-radius:6px;text-align:center;outline:none;font-weight:600;`;

  if (currentTerm.type === 'month') {
    return `
      <td><input type="number" data-score data-student="${studentId}" data-subject="${subjectId}" data-term="${selectedTerm}" data-field="activity" value="${score.activity}" style="${inputStyle}" placeholder="-" /></td>
      <td><input type="number" data-score data-student="${studentId}" data-subject="${subjectId}" data-term="${selectedTerm}" data-field="attendance" value="${score.attendance}" style="${inputStyle}" placeholder="-" /></td>
      <td><input type="number" data-score data-student="${studentId}" data-subject="${subjectId}" data-term="${selectedTerm}" data-field="kudi" value="${score.kudi}" style="${inputStyle}" placeholder="-" /></td>
      <td style="font-weight:800;color:var(--primary);background:rgba(59,130,246,0.05)">${getMonthTotal(studentId, subjectId, selectedTerm)}</td>
    `;
  }
  if (currentTerm.type === 'exam') {
    const depTds = (currentTerm.dependsOn || []).map(depId => {
      const val = getMonthTotal(studentId, subjectId, depId);
      return `<td style="font-weight:600;color:var(--text-secondary)">${val !== '' ? val : '-'}</td>`;
    }).join('');
    return `
      ${depTds}
      <td><input type="number" data-score data-student="${studentId}" data-subject="${subjectId}" data-term="${selectedTerm}" data-field="exam" value="${score.exam}" style="${inputStyle};border-color:var(--primary);color:var(--primary);" placeholder="-" /></td>
      <td style="font-weight:800;color:#059669;background:rgba(16,185,129,0.05)">${getQuarterTotal(studentId, subjectId, selectedTerm)}</td>
    `;
  }
  return (currentTerm.dependsOn || []).map(depId => {
    const depTerm = state.terms.find(t => t.id === depId);
    let val = '';
    if (depTerm?.type === 'exam') val = getQuarterTotal(studentId, subjectId, depId);
    else if (depTerm?.type === 'report') val = getSemesterTotal(studentId, subjectId, depId);
    return `<td style="font-weight:600;color:var(--text-secondary)">${val !== '' ? val : '-'}</td>`;
  }).join('') + `<td style="font-weight:800;color:#d97706;background:rgba(245,158,11,0.05)">${getSemesterTotal(studentId, subjectId, selectedTerm)}</td>`;
}

function update() {
  if (!root) return;
  const { subjects, students, classrooms, terms, entryMode, selectedClassroom, selectedSubject, selectedStudent, selectedTerm } = state;

  if (terms.length === 0) {
    root.innerHTML = `<div class="glass-panel" style="padding:24px;text-align:center;color:var(--text-secondary)">មិនទាន់មានកាលបរិច្ឆេទសិក្សា (academic periods) កំណត់សម្រាប់ឆ្នាំសិក្សានេះទេ</div>`;
    return;
  }
  const currentTerm = terms.find(t => t.id === selectedTerm) || terms[0];

  const noStudentsRow = `<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--text-secondary)">មិនទាន់មានសិស្សចុះឈ្មោះក្នុងថ្នាក់នេះទេ</td></tr>`;

  const rows = entryMode === 'by_subject'
    ? (students.length > 0 ? students.map((student, idx) => `
        <tr style="border-bottom:1px solid var(--border);background:${idx % 2 === 0 ? '#fff' : '#f8fafc'}">
          <td style="text-align:left;padding-left:24px;font-weight:600;color:var(--text-primary)">${idx + 1}. ${student.name}</td>
          ${renderCells(student.id, selectedSubject, currentTerm, selectedTerm)}
        </tr>
      `).join('') : noStudentsRow)
    : subjects.map((subject, idx) => `
        <tr style="border-bottom:1px solid var(--border);background:${idx % 2 === 0 ? '#fff' : '#f8fafc'}">
          <td style="text-align:left;padding-left:24px;font-weight:600;color:var(--text-primary)">${idx + 1}. ${subject.name}</td>
          ${renderCells(selectedStudent, subject.id, currentTerm, selectedTerm)}
        </tr>
      `).join('');

  root.innerHTML = `
    <div class="animate-fade-in">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
        <div>
          <h1 class="page-title" style="margin-bottom:8px;">បញ្ចូលពិន្ទុ និងលទ្ធផលសិក្សា</h1>
          <div style="display:inline-flex;background:var(--bg-card);padding:4px;border-radius:12px;border:1px solid var(--border);">
            <button data-mode="by_subject" style="padding:8px 16px;display:flex;align-items:center;gap:8px;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer;background:${entryMode === 'by_subject' ? 'var(--primary)' : 'transparent'};color:${entryMode === 'by_subject' ? '#fff' : 'var(--text-secondary)'};">
              <i data-lucide="book-open" style="width:16px;height:16px"></i> បញ្ចូលតាមមុខវិជ្ជា
            </button>
            <button data-mode="by_student" style="padding:8px 16px;display:flex;align-items:center;gap:8px;border-radius:8px;font-weight:600;font-size:0.9rem;border:none;cursor:pointer;background:${entryMode === 'by_student' ? 'var(--primary)' : 'transparent'};color:${entryMode === 'by_student' ? '#fff' : 'var(--text-secondary)'};">
              <i data-lucide="user" style="width:16px;height:16px"></i> បញ្ចូលតាមសិស្ស
            </button>
          </div>
        </div>
        <button class="btn btn-primary" style="padding:12px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(79,70,229,0.3);">
          <i data-lucide="save" style="width:18px;height:18px"></i> រក្សាទុកពិន្ទុ
        </button>
      </div>

      <div class="glass-panel animate-slide-up" style="padding:24px;">
        <div style="display:flex;flex-wrap:wrap;gap:20px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px dashed var(--border);">
          <div style="flex:1;min-width:200px;">
            <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">ថ្នាក់រៀន</label>
            <select data-f="class" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:10px;outline:none;font-weight:500;background:#f8fafc;">
              ${(() => {
                const pending = classrooms.filter(c => !classroomHasAnyScore(c.id, selectedTerm));
                const done = classrooms.filter(c => classroomHasAnyScore(c.id, selectedTerm));
                const opt = (c) => `<option value="${c.id}" ${String(c.id) === String(selectedClassroom) ? 'selected' : ''}>${c.class_name}</option>`;
                return `
                  ${pending.length > 0 ? `<optgroup label="មិនទាន់បញ្ចូលពិន្ទុ">${pending.map(opt).join('')}</optgroup>` : ''}
                  ${done.length > 0 ? `<optgroup label="បញ្ចូលពិន្ទុរួចហើយ">${done.map(opt).join('')}</optgroup>` : ''}
                `;
              })()}
            </select>
          </div>
          ${entryMode === 'by_subject' ? `
            <div style="flex:1;min-width:200px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">មុខវិជ្ជា</label>
              <select data-f="subject" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:10px;outline:none;font-weight:500;background:#fff;border-color:var(--primary);color:var(--primary);">
                ${(() => {
                  const pending = subjects.filter(s => !subjectHasAnyScore(s.id, selectedTerm));
                  const done = subjects.filter(s => subjectHasAnyScore(s.id, selectedTerm));
                  const opt = (s) => `<option value="${s.id}" ${String(s.id) === String(selectedSubject) ? 'selected' : ''}>${s.name}</option>`;
                  return `
                    ${pending.length > 0 ? `<optgroup label="មិនទាន់បញ្ចូលពិន្ទុ">${pending.map(opt).join('')}</optgroup>` : ''}
                    ${done.length > 0 ? `<optgroup label="បញ្ចូលពិន្ទុរួចហើយ">${done.map(opt).join('')}</optgroup>` : ''}
                  `;
                })()}
              </select>
            </div>
          ` : `
            <div style="flex:1;min-width:200px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">ឈ្មោះសិស្ស / Student</label>
              <select data-f="student" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:10px;outline:none;font-weight:500;background:#fff;border-color:var(--primary);color:var(--primary);">
                ${students.map(s => `<option value="${s.id}" ${String(s.id) === String(selectedStudent) ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>
          `}
          <div style="flex:1;min-width:200px;">
            <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">ប្រឡងប្រចាំ</label>
            <select data-f="term" style="width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:10px;outline:none;font-weight:500;background:#fff;">
              ${(() => {
                const pending = terms.filter(t => !termHasAnyScore(t.id));
                const done = terms.filter(t => termHasAnyScore(t.id));
                const opt = (t) => `<option value="${t.id}" ${t.id === selectedTerm ? 'selected' : ''}>${t.label}</option>`;
                return `
                  ${pending.length > 0 ? `<optgroup label="មិនទាន់បញ្ចូលពិន្ទុ">${pending.map(opt).join('')}</optgroup>` : ''}
                  ${done.length > 0 ? `<optgroup label="បញ្ចូលពិន្ទុរួចហើយ">${done.map(opt).join('')}</optgroup>` : ''}
                `;
              })()}
            </select>
          </div>
        </div>

        <div class="table-container" style="border-radius:12px;border:1px solid var(--border);overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;text-align:center;">
            <thead>
              <tr style="background:var(--bg-body);">
                <th style="text-align:left;width:30%;padding-left:24px;">${entryMode === 'by_subject' ? 'ឈ្មោះសិស្ស (Student)' : 'មុខវិជ្ជា (Subject)'}</th>
                ${renderHeaders(currentTerm)}
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          ${currentTerm.type !== 'report' ? `
            <div style="padding:16px 24px;background:var(--bg-body);border-top:1px solid var(--border);display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:0.9rem;">
              <i data-lucide="calculator" style="width:16px;height:16px"></i>
              <span>ចំណាំ៖ ប្រអប់ដែលមានពណ៌ស្រាលៗ គឺជាពិន្ទុដែលប្រព័ន្ធបូកសរុបដោយស្វ័យប្រវត្តិ។</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  root.querySelector('[data-mode="by_subject"]').addEventListener('click', () => { state = { ...state, entryMode: 'by_subject' }; update(); });
  root.querySelector('[data-mode="by_student"]').addEventListener('click', () => { state = { ...state, entryMode: 'by_student' }; update(); });
  root.querySelector('[data-f="class"]').addEventListener('change', (e) => { state = { ...state, selectedClassroom: e.target.value }; update(); loadStudents(); loadSubjectsForClassroom(); });
  const subjectSel = root.querySelector('[data-f="subject"]');
  if (subjectSel) subjectSel.addEventListener('change', (e) => { state = { ...state, selectedSubject: e.target.value }; update(); });
  const studentSel = root.querySelector('[data-f="student"]');
  if (studentSel) studentSel.addEventListener('change', (e) => { state = { ...state, selectedStudent: e.target.value }; update(); });
  root.querySelector('[data-f="term"]').addEventListener('change', (e) => { state = { ...state, selectedTerm: e.target.value }; update(); });
  root.querySelectorAll('[data-score]').forEach(input => {
    input.addEventListener('focus', () => input.select());
    onLiveInput(input, () => {
      handleScoreChange(input.dataset.student, input.dataset.subject, input.dataset.term, input.dataset.field, input.value);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

export function render(container) {
  root = container;
  state = { ...state, loading: true };
  update();
  loadInitialData();
}

export function destroy() { root = null; }
