// Centralizes the Node(:5000)<->Django(:8000) routing/translation rules that
// frontend/src/api/djangoAdapter.js applied via a global fetch monkey-patch.
// Pages call api.get/post/put/del(path) instead of raw fetch.

import { getToken } from './auth.js';

const NODE_PORT = 5000;
const DJANGO_PORT = 8000;

// Set at build time (Render static site env var) to the deployed Django
// service's full origin, e.g. https://sms-pagoda-backend.onrender.com --
// Render services are plain HTTPS with no custom port, unlike local dev
// where the Django/Node backends run on fixed ports on the same host.
// Unset locally, so dev keeps using the hardcoded-port behavior below.
let API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
if (!API_BASE_URL && import.meta.env.PROD) {
  API_BASE_URL = 'https://sms-pagoda-backend.onrender.com';
}

// Endpoints not yet migrated to Django -- stay on the Node backend, same as
// djangoAdapter.js's bypass list.
const NODE_ONLY_PREFIXES = [
  '/api/upload', '/api/settings', '/api/subject-swaps',
  '/api/dashboard', '/api/degrees', '/api/classrooms/rollover',
  '/api/schedules', '/api/period-types'
];

function isNodeOnly(path) {
  return NODE_ONLY_PREFIXES.some(p => path.startsWith(p));
}

function backendBase(path) {
  if (API_BASE_URL) return API_BASE_URL;
  const port = isNodeOnly(path) ? NODE_PORT : DJANGO_PORT;
  return `http://${window.location.hostname}:${port}`;
}

// For the handful of pages that still use raw fetch() with a relative
// '/api/...' path instead of the api.get/post/etc. wrapper above -- those
// only work locally because Vite's dev server proxies '/api' to Django.
// There's no such proxy once frontend and backend are separate deployed
// origins, so those call sites need this prefix too.
export function apiOrigin() {
  return API_BASE_URL || `http://${window.location.hostname}:${DJANGO_PORT}`;
}

// Path rewrites applied before hitting Django (mirrors djangoAdapter.js).
function rewritePath(path) {
  if (path.startsWith('/api/address/provinces')) return path.replace('/api/address/provinces', '/api/provinces');
  if (path.startsWith('/api/address/districts')) return path.replace('/api/address/districts', '/api/districts');
  if (path.startsWith('/api/address/communes')) return path.replace('/api/address/communes', '/api/communes');
  if (path.startsWith('/api/address/villages')) return path.replace('/api/address/villages', '/api/villages');
  if ((path === '/api/students' || path === '/api/students/') && !isNodeOnly(path)) return path.replace('/api/students', '/api/students/list');
  if (path.startsWith('/api/teachers') && !isNodeOnly(path)) return path.replace('/api/teachers', '/api/users/teachers');
  return path;
}

function buildUrl(rawPath) {
  if (isNodeOnly(rawPath)) {
    // Node backend keeps its original REST shape, no DRF trailing-slash/rewrite rules.
    return `${backendBase(rawPath)}${rawPath}`;
  }
  let path = rewritePath(rawPath);
  let method = null;
  if (path.includes('/soft-delete')) {
    path = path.replace('/soft-delete', '');
    method = 'DELETE';
  }
  const queryIndex = path.indexOf('?');
  const pathOnly = queryIndex === -1 ? path : path.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : path.slice(queryIndex);
  path = (pathOnly.endsWith('/') ? pathOnly : pathOnly + '/') + query;
  return { url: `${backendBase(rawPath)}${path}`, methodOverride: method };
}

// The attendance table's session check constraint only accepts these two
// English values, but the UI offers Khmer labels (including a "night"
// session the DB has no slot for).

// Request payload translation (Django field-name differences), mirrors djangoAdapter.js.
function translateRequestBody(path, body) {
  if (!body) return body;
  const isStudentRecordPath = path.startsWith('/api/students/list') || path === '/api/students' || path === '/api/students/';
  if (isStudentRecordPath) {
    const names = (body.name || '').split(' ');
    return {
      ...body,
      first_name: names[0] || '',
      last_name: names.slice(1).join(' ') || names[0] || '',
      latin_name: body.name_en || '',
      gender: body.sex || 'ប្រុស',
      monk_status: body.monk_status || 'គ្រហស្ថ',
      date_of_birth: body.dob || null,
      enrollment_date: body.enrollment_date || null,
      status: body.status || 'សកម្ម',
      current_pagoda: body.pagoda || null,
      kuti: body.kodi || null,
      nationality: body.nationality || null,
    };
  }
  if (path.includes('/api/teachers') || path.includes('/api/users/teachers')) {
    const names = (body.name || '').split(' ');
    return {
      ...body,
      first_name: names[0] || '',
      last_name: names.slice(1).join(' ') || names[0] || '',
      gender: body.sex || 'ប្រុស',
      monk_status: body.type || 'គ្រហស្ថ',
      status: body.status || 'active',
    };
  }
  return body;
}

// Response shape translation back to the frontend's expected fields.
function formatSubject(s) { return { ...s, code: s.subject_code, name: s.subject_name, type: 'ចំណេះដឹងទូទៅ', classes: 1, teachers: 1, hours: s.total_hours || 4, max_score: s.total_score || 100, duration: 60, isDeleted: false }; }
function formatTeacher(t) { return { ...t, custom_id: t.teacher_code, name: `${t.last_name || ''} ${t.first_name || ''}`.trim() || 'គ្មានឈ្មោះ', sex: t.gender, type: t.monk_status, image: t.image_url || '/placeholder-profile.png' }; }
function formatStudent(st) { return { ...st, dbId: st.id, custom_id: st.student_code, name: `${st.last_name || ''} ${st.first_name || ''}`.trim() || 'គ្មានឈ្មោះ', name_en: st.latin_name, sex: st.gender, dob: st.date_of_birth, image: st.image_url || '/placeholder-profile.png', classroom: 'មិនទាន់មាន', academic_year: st.academic_year, nationality: st.nationality, pagoda: st.current_pagoda, kuti: st.kuti }; }
function formatPagoda(p) { return { id: p.id, name: p.name }; }
function formatKuti(k) { return { id: k.id, name: k.kuti_name, pagoda: k.pagoda }; }
function formatAcademicYear(a) { return { ...a, name: a.year_name }; }
function formatNationality(n) { return { id: n.id, name: n.name }; }

function translateResponseBody(path, data) {
  let formatted = data && data.results !== undefined ? data.results : data;
  const map = (fn) => Array.isArray(formatted) ? formatted.map(fn) : fn(formatted);
  if (path.includes('/api/subjects')) formatted = map(formatSubject);
  else if (path.includes('/api/users/teachers')) formatted = map(formatTeacher);
  else if (path.includes('/api/students/list')) formatted = map(formatStudent);
  else if (path.includes('/api/core/pagodas')) formatted = map(formatPagoda);
  else if (path.includes('/api/core/kutis')) formatted = map(formatKuti);
  else if (path.includes('/api/core/academic-years')) formatted = map(formatAcademicYear);
  else if (path.includes('/api/core/nationalities')) formatted = map(formatNationality);
  else if (/\/api\/(provinces|districts|communes|villages)/.test(path) && Array.isArray(formatted)) {
    formatted = formatted.map(p => ({ ...p, province_kh: p.name_kh || p.name_en, district_kh: p.name_kh || p.name_en, commune_kh: p.name_kh || p.name_en, village_kh: p.name_kh || p.name_en, province_code: p.province_code || p.id, district_code: p.district_code || p.id, commune_code: p.commune_code || p.id, village_code: p.village_code || p.id }));
  }
  return formatted;
}

// Caches GET responses on-device (localStorage) so re-opening a page shows
// data instantly instead of re-fetching. A write (POST/PUT/PATCH/DELETE)
// clears the whole cache since we don't track which GETs it affects.
const CACHE_PREFIX = 'apiCache:';
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(url) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + url);
    if (!raw) return undefined;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function setCached(url, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage full or unavailable (e.g. private browsing) -- skip caching.
  }
}

function clearCache() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

async function request(method, path, body, opts = {}) {
  const resolved = isNodeOnly(path) ? { url: buildUrl(path) } : buildUrl(path);
  const url = resolved.url;
  const finalMethod = resolved.methodOverride || method;
  const isForm = body instanceof FormData;
  const sentBody = isForm ? body : (body ? translateRequestBody(path, body) : undefined);

  if (finalMethod === 'GET' && !opts.noCache) {
    const cached = getCached(url);
    if (cached !== undefined) return { ok: true, status: 200, json: async () => cached, data: cached };
  }

  const token = getToken();
  const headers = isForm ? (opts.headers || {}) : { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Token ${token}`;

  const config = {
    method: finalMethod,
    headers: headers,
    body: sentBody !== undefined ? (isForm ? sentBody : JSON.stringify(sentBody)) : undefined,
    cache: 'no-store'
  };

  const res = await fetch(url, config);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return { ok: res.ok, status: res.status, json: async () => null, data: null };
  }

  const data = await res.json().catch(() => null);
  const formatted = isNodeOnly(path) ? data : translateResponseBody(path, data);
  if (res.ok) {
    if (finalMethod === 'GET') setCached(url, formatted);
    else clearCache();
  }
  return { ok: res.ok, status: res.status, json: async () => formatted, data: formatted };
}

export const api = {
  get: (path, opts) => request('GET', path, undefined, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  put: (path, body, opts) => request('PUT', path, body, opts),
  patch: (path, body, opts) => request('PATCH', path, body, opts),
  del: (path, opts) => request('DELETE', path, undefined, opts),
};
