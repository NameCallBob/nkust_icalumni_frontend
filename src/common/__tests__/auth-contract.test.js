/**
 * 前端 ↔ 後端 認證契約。
 *
 * ⚠️ 這個檔案記錄一項**目前存在的不一致**。
 *
 * 後端在 SEC-015（後端 repo commit 67c5a18）把 JWT 從「回應 body 交付、前端存
 * localStorage」改成「HttpOnly cookie 交付 + CSRF double-submit」。改完之後：
 *
 *   - 登入回應的 body 只有 `{ message, is_super }`，**不再有 token 欄位**
 *   - 憑證放在 HttpOnly cookie，JavaScript 讀不到（這正是防 XSS 竊取的重點）
 *   - 前後端是不同網域（aaic.nkust.edu.tw ↔ nkust-alumni-api...），
 *     瀏覽器要送出該 cookie，前端必須明確設定 `withCredentials: true`
 *   - 所有寫入請求必須帶 `X-CSRFToken` 標頭（值從 csrftoken cookie 讀出）
 *
 * 前端尚未跟上：`src/common/Axios.js` 仍在讀 localStorage 組 Bearer 標頭、
 * 沒有 `withCredentials`、也沒有 CSRF 標頭；`src/pages/User/LoginPage.js`
 * 仍在寫 `localStorage.setItem('jwt', res.data.token)`。
 *
 * 下面的測試斷言的是**現況**，用意是讓這個落差在每次 CI 中都被看見，而不是
 * 埋在兩個 repo 之間沒有人負責的縫隙裡。前端完成遷移後，這些測試會失敗——
 * 屆時把每條的斷言反過來寫（註解裡都寫了該改成什麼）即可。
 */
import Axios from '../Axios';
import PicAxios from '../PicAxios';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(), error: jest.fn(), warning: jest.fn(),
    warn: jest.fn(), info: jest.fn(),
  },
}));

describe('目前的憑證機制：localStorage + Authorization 標頭', () => {
  it('Axios 從 localStorage 讀 jwt 並組成 Bearer 標頭', () => {
    // 遷移後應改為：不再讀 localStorage，改由瀏覽器自動附帶 HttpOnly cookie。
    window.localStorage.setItem('jwt', 'a-token');
    expect(Axios().defaults.headers.Authorization).toBe('Bearer a-token');
  });

  it('Axios 沒有設定 withCredentials', () => {
    // 遷移後應改為：expect(...withCredentials).toBe(true)
    //
    // 沒有這個設定，瀏覽器不會把後端種下的 access_token cookie 送到跨網域的
    // API，所有需要登入的請求都會得到 401。
    expect(Axios().defaults.withCredentials).toBeFalsy();
  });

  it('Axios 沒有送出 X-CSRFToken 標頭', () => {
    // 遷移後應改為：從 csrftoken cookie 讀值並放進 X-CSRFToken。
    //
    // 後端的 CookieJWTAuthentication 在走 cookie 分支時會驗 CSRF，
    // 缺少這個標頭的話所有 POST/PATCH/PUT/DELETE 都會被回 403。
    const headers = Axios().defaults.headers;
    expect(headers['X-CSRFToken']).toBeUndefined();
    expect(headers['x-csrftoken']).toBeUndefined();
  });

  it('PicAxios 同樣使用 localStorage 且沒有 withCredentials', () => {
    window.localStorage.setItem('jwt', 'a-token');
    const instance = PicAxios();
    expect(instance.defaults.headers.Authorization).toBe('Bearer a-token');
    expect(instance.defaults.withCredentials).toBeFalsy();
  });

  it('PicAxios 在沒有憑證時會把字串 "None" 寫進 localStorage', () => {
    // 這個 sentinel 值會一路變成 `Authorization: Bearer None` 送給後端。
    // 遷移後這段邏輯應整個移除。
    window.localStorage.removeItem('jwt');
    PicAxios();
    expect(window.localStorage.getItem('jwt')).toBe('None');
  });

  it('PicAxios 送出 Access-Control-Allow-Origin 請求標頭（無效且多餘）', () => {
    // Access-Control-Allow-Origin 是**回應**標頭，放在請求上不會有任何作用，
    // 反而會讓這個請求變成 CORS preflight。清掉即可。
    expect(PicAxios().defaults.headers['Access-Control-Allow-Origin']).toBe('*');
  });
});

describe('後端目前的登入回應會讓前端存下無效憑證', () => {
  /**
   * 後端 `LoginView` 現在回的是 `{ message: "OK", is_super: false }`，
   * token 只透過 Set-Cookie 交付。這裡直接模擬那個回應形狀，
   * 重現 `LoginPage` 會發生什麼事。
   */
  const backendLoginResponse = { message: 'OK', is_super: false };

  it('回應 body 裡沒有 token 欄位', () => {
    expect(backendLoginResponse.token).toBeUndefined();
  });

  it('LoginPage 的寫法會把字串 "undefined" 存進 localStorage', () => {
    // LoginPage.js 目前是：window.localStorage.setItem('jwt', res.data.token)
    // localStorage 只能存字串，undefined 會被轉成字面上的 "undefined"。
    window.localStorage.setItem('jwt', backendLoginResponse.token);
    expect(window.localStorage.getItem('jwt')).toBe('undefined');
  });

  it('於是後續請求會送出 "Bearer undefined"，被後端判為無效憑證', () => {
    // 這就是「登入看起來成功了，但下一頁全部 401」的成因。
    window.localStorage.setItem('jwt', backendLoginResponse.token);
    expect(Axios().defaults.headers.Authorization).toBe('Bearer undefined');
  });
});

describe('遷移完成後應該成立的性質（目前尚未成立）', () => {
  /**
   * 這些是遷移的驗收條件。現在全部被 skip，遷移時把 `.skip` 拿掉，
   * 它們就變成「改對了沒有」的檢查清單。
   */
  it.skip('登入後不得有任何 token 留在 localStorage', () => {
    expect(window.localStorage.getItem('jwt')).toBeNull();
  });

  it.skip('Axios 設定 withCredentials 讓 cookie 能跨網域送出', () => {
    expect(Axios().defaults.withCredentials).toBe(true);
  });

  it.skip('寫入請求帶上從 csrftoken cookie 讀出的 X-CSRFToken', () => {
    document.cookie = 'csrftoken=test-csrf-value';
    expect(Axios().defaults.headers['X-CSRFToken']).toBe('test-csrf-value');
  });

  it.skip('登入狀態改以 /basic/whoami 判斷，而非讀 localStorage', () => {
    // 後端提供 GET /basic/whoami：200 代表 cookie 仍有效，401 代表已過期。
  });
});
