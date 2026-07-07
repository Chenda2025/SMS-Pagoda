// Ports AuthContext.jsx + ProtectedRoute.jsx: same localStorage keys ('token', 'user')
// so this app can coexist with the React app during the migration/cutover window.

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    logout();
    return null;
  }
}

export function login(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const ROLE_HOME = {
  monitor: '/monitor-dashboard',
  teacher: '/teacher-dashboard',
  principal: '/principal-dashboard',
  admin: '/'
};

export function roleHome(role) {
  return ROLE_HOME[role] || '/';
}

/**
 * Returns the path to redirect to if access should be denied, or null if allowed.
 * Mirrors ProtectedRoute.jsx: no user -> /login; wrong role -> that role's home.
 */
export function checkAccess(allowedRoles) {
  const user = getUser();
  if (!user) return '/login';
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return roleHome(user.role);
  }
  return null;
}
