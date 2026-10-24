/**
 * 登入狀態的「顯示用」本地資訊。
 *
 * 真正的憑證是後端種的 HttpOnly cookie，前端讀不到也不該存。這裡只保存 UI 需要的：
 *   super  — 是否為超級管理員（決定導覽列顯示哪些項目；權限仍由後端判定）
 *   expiry — 預估 cookie 到期的 Unix 秒數，讓導覽列能提早提示重新登入
 */
export const SESSION_SECONDS = 3 * 60 * 60; // 後端 SIMPLE_JWT ACCESS_TOKEN_LIFETIME = 3 小時

const KEYS = ['super', 'issuedAt', 'expiry', 'jwt'];

export function saveSession({ isSuper }) {
  const issuedAt = Math.floor(Date.now() / 1000);
  window.localStorage.setItem('super', String(!!isSuper));
  window.localStorage.setItem('issuedAt', String(issuedAt));
  window.localStorage.setItem('expiry', String(issuedAt + SESSION_SECONDS));
  window.localStorage.removeItem('jwt'); // 清掉舊版殘留（含字串 'undefined' / 'None'）
}

/** whoami 回 200 時同步本地顯示資訊；到期時間未知，沿用既有值，沒有或已過期才重設。 */
export function syncSession({ isSuper }) {
  const now = Math.floor(Date.now() / 1000);
  const expiry = Number(window.localStorage.getItem('expiry'));
  window.localStorage.setItem('super', String(!!isSuper));
  if (!expiry || expiry <= now) {
    window.localStorage.setItem('issuedAt', String(now));
    window.localStorage.setItem('expiry', String(now + SESSION_SECONDS));
  }
  window.localStorage.removeItem('jwt');
}

export function clearSession() {
  KEYS.forEach((k) => window.localStorage.removeItem(k));
}
