/**
 * 密碼規則——與 components/Manage/Center/PwdUpdateModal.js 一致：
 * 至少 8 碼，且包含大寫字母、小寫字母與數字。
 * （後端另有 Django 的相似度／常見密碼／純數字檢查，最終以後端回應為準。）
 */
export const PASSWORD_HINT = '密碼需至少 8 碼，且包含大寫字母、小寫字母與數字。';

export function validatePassword(password) {
  const value = typeof password === 'string' ? password : '';
  if (value.length < 8) return { valid: false, message: '密碼長度至少需 8 碼' };
  if (!/[A-Z]/.test(value)) return { valid: false, message: '密碼需包含至少一個大寫字母' };
  if (!/[a-z]/.test(value)) return { valid: false, message: '密碼需包含至少一個小寫字母' };
  if (!/[0-9]/.test(value)) return { valid: false, message: '密碼需包含至少一個數字' };
  return { valid: true, message: '' };
}
