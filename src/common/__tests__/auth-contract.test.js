/**
 * 前端 ↔ 後端 認證契約（後端 SEC-015：HttpOnly cookie JWT + CSRF double-submit）。
 *
 * 後端事實（IC_alumni：apps/private/views.py、cookie_auth.py、settings.py）：
 *   - POST /basic/login 回 { message, is_super }，token 只在 Set-Cookie `access_token`（HttpOnly）
 *   - 同時種 `csrftoken` cookie（JS 可讀）；寫入請求須帶 `X-CSRFToken`，否則 403
 *   - GET /basic/whoami：200 { is_super } / 401；POST /basic/logout：清除 cookie
 *   - 只要請求帶了 Authorization 標頭，後端就以它為準、不看 cookie
 *     → 前端絕不能再送 "Bearer None" / "Bearer undefined" 之類的標頭
 *   - CORS_ALLOW_CREDENTIALS=True 且允許 x-csrftoken 標頭 → 前端需 withCredentials
 */
import { vi } from 'vitest';
import { AxiosHeaders } from 'axios';
import Axios, { getCsrfToken, attachCsrfHeader } from '../Axios';
import PicAxios from '../PicAxios';
import { saveSession, syncSession, clearSession } from '../session';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(), error: vi.fn(), warning: vi.fn(),
    warn: vi.fn(), info: vi.fn(),
  },
}));

const clearCookie = () => { document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; };
afterEach(clearCookie);

/** 取出實例上第一個 request 攔截器並對 config 執行（模擬 axios 發送前的流程）。 */
const runRequest = async (instance, config) => {
  const handler = instance.interceptors.request.handlers[0];
  const headers = new AxiosHeaders();
  return handler.fulfilled({ headers, ...config });
};

describe.each([['Axios', Axios], ['PicAxios', PicAxios]])('%s 的認證設定', (_name, factory) => {
  it('withCredentials 為 true，cookie 才會跨網域送出', () => {
    expect(factory().defaults.withCredentials).toBe(true);
  });

  it('不送 Authorization 標頭，即使 localStorage 殘留舊的 jwt', () => {
    window.localStorage.setItem('jwt', 'None');
    const headers = factory().defaults.headers;
    expect(headers.Authorization).toBeUndefined();
    expect(headers.authorization).toBeUndefined();
  });

  it('不再寫入 localStorage', () => {
    window.localStorage.removeItem('jwt');
    factory();
    expect(window.localStorage.getItem('jwt')).toBeNull();
  });
});

describe('X-CSRFToken 請求攔截器', () => {
  it.each(['post', 'put', 'patch', 'delete', 'POST'])('%s 請求帶上 csrftoken cookie 的值', async (method) => {
    document.cookie = 'csrftoken=abc123; path=/';
    const config = await runRequest(Axios(), { method });
    expect(config.headers.get('X-CSRFToken')).toBe('abc123');
  });

  it.each(['get', 'head', 'options', undefined])('%s 這類安全 method 不帶 CSRF 標頭', async (method) => {
    document.cookie = 'csrftoken=abc123; path=/';
    const config = await runRequest(Axios(), { method });
    expect(config.headers.get('X-CSRFToken')).toBeFalsy();
  });

  it('沒有 csrftoken cookie 時不帶標頭，也不拋錯', async () => {
    const config = await runRequest(Axios(), { method: 'post' });
    expect(config.headers.get('X-CSRFToken')).toBeFalsy();
  });

  it('cookie 值有 URL 編碼時會解碼，且能從多個 cookie 中挑出正確的', () => {
    document.cookie = 'other=1; path=/';
    document.cookie = 'csrftoken=a%2Bb; path=/';
    expect(getCsrfToken()).toBe('a+b');
  });

  it('每次請求即時讀 cookie（登入後才種下的 token 也能用）', async () => {
    const instance = Axios();
    expect((await runRequest(instance, { method: 'post' })).headers.get('X-CSRFToken')).toBeFalsy();
    document.cookie = 'csrftoken=late; path=/';
    expect((await runRequest(instance, { method: 'post' })).headers.get('X-CSRFToken')).toBe('late');
  });

  it('attachCsrfHeader 可單獨使用', () => {
    document.cookie = 'csrftoken=zzz; path=/';
    const headers = new AxiosHeaders();
    expect(attachCsrfHeader({ method: 'patch', headers }).headers.get('X-CSRFToken')).toBe('zzz');
  });
});

describe('登入狀態的本地顯示資訊（session.js）', () => {
  it('saveSession 只存 super / issuedAt / expiry，並清掉舊的 jwt（含 "undefined"）', () => {
    window.localStorage.setItem('jwt', 'undefined');
    saveSession({ isSuper: true });
    expect(window.localStorage.getItem('jwt')).toBeNull();
    expect(window.localStorage.getItem('super')).toBe('true');
    const issued = Number(window.localStorage.getItem('issuedAt'));
    expect(Number(window.localStorage.getItem('expiry'))).toBe(issued + 3 * 60 * 60);
  });

  it('syncSession 保留尚未過期的 expiry，過期或缺少時重設', () => {
    const future = String(Math.floor(Date.now() / 1000) + 600);
    window.localStorage.setItem('expiry', future);
    syncSession({ isSuper: false });
    expect(window.localStorage.getItem('expiry')).toBe(future);

    window.localStorage.setItem('expiry', '1');
    syncSession({ isSuper: false });
    expect(Number(window.localStorage.getItem('expiry'))).toBeGreaterThan(Date.now() / 1000);

    window.localStorage.removeItem('expiry');
    syncSession({ isSuper: false });
    expect(window.localStorage.getItem('expiry')).not.toBeNull();
  });

  it('clearSession 清乾淨', () => {
    saveSession({ isSuper: true });
    clearSession();
    ['super', 'issuedAt', 'expiry', 'jwt'].forEach((k) => expect(window.localStorage.getItem(k)).toBeNull());
  });
});
