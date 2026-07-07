// Ports pages/Login.jsx.

import { api } from '../api.js';
import { login, roleHome } from '../auth.js';
import { navigate } from '../router.js';

export function render(container) {
  container.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background-color:#f3f4f6;padding:20px;">
      <div style="width:100%;max-width:400px;background-color:#ffffff;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.05);padding:32px 24px;text-align:center;">
        <div style="width:80px;height:80px;background-color:#ffffff;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          <img src="/logo.jpg" alt="School Logo" style="width:100%;height:100%;object-fit:contain;" />
        </div>
        <h2 style="font-size:24px;font-weight:bold;color:#111827;margin-bottom:8px;font-family:'Khmer OS Battambang','Battambang',sans-serif;">
          ប្រព័ន្ធគ្រប់គ្រងសាលាអនុវិទ្យាល័យ
        </h2>
        <p style="color:#6b7280;font-size:14px;margin-bottom:32px;font-family:'Khmer OS Battambang','Battambang',sans-serif;">
          សម្តេចព្រះសង្ឃរាជ ទេព វង្ស និរោធរង្សី
        </p>
        <div data-role="error" style="display:none;background-color:#fee2e2;color:#b91c1c;padding:12px;border-radius:8px;margin-bottom:20px;font-size:14px;font-family:'Khmer OS Battambang','Battambang',sans-serif;"></div>
        <form data-role="form" style="display:flex;flex-direction:column;gap:16px;">
          <input type="text" name="username" placeholder="ឈ្មោះគណនី (Username)" required
            style="width:100%;padding:14px 16px;border-radius:8px;border:1px solid #d1d5db;font-size:16px;outline:none;font-family:'Khmer OS Battambang','Battambang',sans-serif;" />
          <input type="password" name="password" placeholder="លេខសម្ងាត់ (Password)" required
            style="width:100%;padding:14px 16px;border-radius:8px;border:1px solid #d1d5db;font-size:16px;outline:none;font-family:'Khmer OS Battambang','Battambang',sans-serif;" />
          <button type="submit" data-role="submit"
            style="margin-top:10px;width:100%;padding:14px;background-color:#4f46e5;color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;font-family:'Khmer OS Battambang','Battambang',sans-serif;transition:background-color 0.2s;">
            ចូលគណនី (Login)
          </button>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('[data-role="form"]');
  const errorBox = container.querySelector('[data-role="error"]');
  const submitBtn = container.querySelector('[data-role="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
    submitBtn.textContent = 'កំពុងចូល...';

    const username = form.username.value;
    const password = form.password.value;

    try {
      const res = await api.post('/api/login', { username, password });
      const data = res.data;
      if (!res.ok) throw new Error((data && data.error) || 'Login failed');

      login(data.token, data.user);
      navigate(roleHome(data.user.role), { replace: true });
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      submitBtn.textContent = 'ចូលគណនី (Login)';
    }
  });
}

export function destroy() {}
