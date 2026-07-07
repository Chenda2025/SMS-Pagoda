// Vanilla History-API router. Mirrors the route table in frontend/src/App.jsx.
// Each route maps to a page module exported as { render(container), destroy() }.

import { checkAccess } from './auth.js';

const routes = [
  { path: '/login', loader: () => import('./pages/login.js'), public: true },
  { path: '/apply', loader: () => import('./pages/publicApply.js'), public: true },
  { path: '/apply-teacher', loader: () => import('./pages/publicApplyTeacher.js'), public: true },

  { path: '/monitor-dashboard', loader: () => import('./pages/monitorDashboard.js'), roles: ['monitor'] },
  { path: '/monitor-attendance', loader: () => import('./pages/monitorAttendance.js'), roles: ['monitor'] },
  { path: '/monitor-attendance-report', loader: () => import('./pages/monitorAttendanceReport.js'), roles: ['monitor'] },

  { path: '/monitor-schedule', loader: () => import('./pages/monitorSchedule.js'), roles: ['monitor'] },
  { path: '/monitor-leave', loader: () => import('./pages/monitorLeaveRequest.js'), roles: ['monitor'] },
  { path: '/monitor-students', loader: () => import('./pages/monitorStudentList.js'), roles: ['monitor'] },
  { path: '/monitor-student-info', loader: () => import('./pages/monitorStudentInfo.js'), roles: ['monitor'] },

  { path: '/teacher-dashboard', loader: () => import('./pages/teacherDashboard.js'), roles: ['teacher'] },
  { path: '/principal-dashboard', loader: () => import('./pages/principalDashboard.js'), roles: ['principal'] },

  // Admin shell routes (wrapped in Layout: sidebar + header)
  { path: '/', loader: () => import('./pages/dashboard.js'), roles: ['admin'], admin: true },
  { path: '/students', loader: () => import('./pages/students.js'), roles: ['admin'], admin: true },
  { path: '/enrollments', loader: () => import('./pages/enrollments.js'), roles: ['admin'], admin: true },
  { path: '/student-list', loader: () => import('./pages/studentList.js'), roles: ['admin'], admin: true },
  { path: '/pending-applications', loader: () => import('./pages/pendingApplications.js'), roles: ['admin'], admin: true },
  { path: '/teachers', loader: () => import('./pages/teachers.js'), roles: ['admin'], admin: true },
  { path: '/pending-teacher-applications', loader: () => import('./pages/pendingTeacherApplications.js'), roles: ['admin'], admin: true },
  { path: '/subjects', loader: () => import('./pages/subjects.js'), roles: ['admin'], admin: true },
  { path: '/class-subjects', loader: () => import('./pages/classSubjects.js'), roles: ['admin'], admin: true },
  { path: '/subject-swap', loader: () => import('./pages/subjectSwap.js'), roles: ['admin'], admin: true },
  { path: '/classrooms', loader: () => import('./pages/classrooms.js'), roles: ['admin'], admin: true },
  { path: '/schedule', loader: () => import('./pages/schedule.js'), roles: ['admin'], admin: true },
  { path: '/attendance', loader: () => import('./pages/attendance.js?v=44'), roles: ['admin'], admin: true },
  { path: '/attendance-report', loader: () => import('./pages/attendanceReport.js'), roles: ['admin'], admin: true },
  { path: '/grades', loader: () => import('./pages/grades.js'), roles: ['admin'], admin: true },
  { path: '/reports', loader: () => import('./pages/reports.js'), roles: ['admin'], admin: true },
  { path: '/achievements', loader: () => import('./pages/achievements.js'), roles: ['admin'], admin: true },
  { path: '/structure', loader: () => import('./pages/structure.js'), roles: ['admin'], admin: true },
  { path: '/academic-years', loader: () => import('./pages/academicYears.js'), roles: ['admin'], admin: true },
  { path: '/lesson-plans', loader: () => import('./pages/lessonPlans.js'), roles: ['admin'], admin: true },
  { path: '/calendar', loader: () => import('./pages/calendar.js'), roles: ['admin'], admin: true },
  { path: '/memories', loader: () => import('./pages/memories.js'), roles: ['admin'], admin: true },
  { path: '/notifications', loader: () => import('./pages/notifications.js'), roles: ['admin'], admin: true },
  { path: '/users', loader: () => import('./pages/users.js'), roles: ['admin'], admin: true },
  { path: '/payroll', loader: () => import('./pages/payroll.js?v=37'), roles: ['admin'], admin: true },
  { path: '/payroll-report', loader: () => import('./pages/payrollReport.js'), roles: ['admin'], admin: true },
  { path: '/import', loader: () => import('./pages/import.js'), roles: ['admin'], admin: true },
  { path: '/activity-logs', loader: () => import('./pages/activityLogs.js'), roles: ['admin'], admin: true },
  { path: '/db-test', loader: () => import('./pages/databaseTest.js'), roles: ['admin'], admin: true },
  { path: '/pagodas', loader: () => import('./pages/pagodas.js'), roles: ['admin'], admin: true },
];

let currentPage = null;
let onAdminRouteChange = null; // callback set by main.js to (re)render the admin shell

export function setAdminRouteHandler(fn) {
  onAdminRouteChange = fn;
}

function matchRoute(path) {
  return routes.find(r => r.path === path);
}

export async function navigate(path, { replace = false } = {}) {
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  await renderCurrentRoute();
}

export async function renderCurrentRoute() {
  const path = window.location.pathname;
  const route = matchRoute(path);

  if (!route) {
    document.getElementById('app').innerHTML = '<div class="p-5">404 — Page not found</div>';
    return;
  }

  if (!route.public) {
    const redirect = checkAccess(route.roles);
    if (redirect) {
      await navigate(redirect, { replace: true });
      return;
    }
  }

  if (currentPage && currentPage.destroy) {
    try { currentPage.destroy(); } catch { /* page already torn down */ }
  }

  const mod = await route.loader();

  if (route.admin && onAdminRouteChange) {
    const contentArea = onAdminRouteChange(path);
    currentPage = mod;
    mod.render(contentArea);
  } else {
    if (onAdminRouteChange) onAdminRouteChange(null); // tear down admin shell if leaving it
    const app = document.getElementById('app');
    app.innerHTML = '';
    currentPage = mod;
    mod.render(app);
  }
}

export function initRouter() {
  window.addEventListener('popstate', renderCurrentRoute);
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (!link) return;
    e.preventDefault();
    navigate(link.getAttribute('href'));
  });
  return renderCurrentRoute();
}
