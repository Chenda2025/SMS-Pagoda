// Shared Telegram send helpers. localStorage can hold a stale/corrupted
// tgConfig value from an older build (or manual edits), so every read goes
// through getTgConfig() instead of a raw JSON.parse.

export function getTgConfig() {
  try { return JSON.parse(localStorage.getItem('tgConfig') || '{}'); } catch { return {}; }
}

// Fetches an image URL and forwards its bytes to Telegram as a sendPhoto
// upload (rather than passing the URL as the `photo` param directly) so this
// also works when the app is served from a host Telegram's servers can't
// reach, e.g. localhost during development.
// Captions are capped at 1024 chars by Telegram; falls back to a follow-up
// sendMessage if the caption is too long. Returns false (never throws) so
// callers can fall back to a plain sendMessage on any failure.
export async function sendTelegramPhoto(tgConfig, imageUrl, caption) {
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return false;
    const blob = await imgRes.blob();
    const fd = new FormData();
    fd.append('chat_id', tgConfig.chatId);
    fd.append('photo', blob, 'photo.jpg');
    if (caption.length <= 1024) fd.append('caption', caption);
    const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendPhoto`, { method: 'POST', body: fd });
    if (!res.ok) return false;
    if (caption.length > 1024) {
      await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgConfig.chatId, text: caption }),
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function sendTelegramMessage(tgConfig, text) {
  const res = await fetch(`https://api.telegram.org/bot${tgConfig.token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: tgConfig.chatId, text }),
  });
  if (!res.ok) throw new Error('Telegram error ' + res.status);
}

// Wraps a Telegram-send call with a button loading state: disables the
// button and swaps its icon for a spinner while `fn` runs, restoring the
// original icon afterward regardless of success/failure. `btn` may be
// null/undefined (no element reference available) -- fn still runs, just
// without the visual.
export async function withSendingSpinner(btn, fn) {
  const originalHtml = btn?.innerHTML;
  if (btn) {
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
    btn.innerHTML = '<i data-lucide="loader-2" style="width:15px;height:15px;animation:spin 1s linear infinite;pointer-events:none;"></i>';
    if (window.lucide) window.lucide.createIcons();
  }
  try {
    return await fn();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      btn.innerHTML = originalHtml;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}
