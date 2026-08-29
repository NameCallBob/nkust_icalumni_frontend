/**
 * 前端的資安檢查（在真實瀏覽器裡才驗得到的部分）。
 *
 * 這些是單元測試看不到的：安全標頭是伺服器設定的、cookie 屬性是瀏覽器記錄的、
 * source map 是打包產物的一部分。它們也都是「上線之後某次設定調整就可能悄悄
 * 失效」的東西，適合放進定期執行的 E2E。
 */
const { test, expect } = require('@playwright/test');

test.describe('🔒 HTTP 安全標頭', () => {
  test('@security 首頁回應帶有基本的安全標頭', async ({ request, baseURL }) => {
    const response = await request.get(baseURL);
    const headers = response.headers();

    // 缺少這個標頭時，瀏覽器會依內容猜測 MIME type，
    // 使用者上傳的檔案可能被當成 HTML/JS 執行。
    expect(headers['x-content-type-options'], '缺少 X-Content-Type-Options: nosniff')
      .toBe('nosniff');

    // 防點擊劫持：不允許本站被嵌進別人的 iframe。
    const framePolicy = headers['x-frame-options'] || headers['content-security-policy'] || '';
    expect(framePolicy.toLowerCase(), '缺少防點擊劫持設定（X-Frame-Options 或 CSP frame-ancestors）')
      .toMatch(/deny|sameorigin|frame-ancestors/);
  });

  test('@security 正式站啟用 HSTS', async ({ request, baseURL }) => {
    test.skip(!baseURL.startsWith('https://'), '非 HTTPS 環境不適用');

    const response = await request.get(baseURL);
    const hsts = response.headers()['strict-transport-security'];
    expect(hsts, '缺少 Strict-Transport-Security，使用者第一次連線仍可能被降級攻擊')
      .toBeTruthy();
  });
});

test.describe('🔒 打包產物', () => {
  test('@security 正式站不得公開 source map', async ({ page, request, baseURL }) => {
    // .map 檔含有完整的原始碼（含註解）。公開它等於把前端邏輯、
    // 內部 API 路徑與任何寫死在前端的字串一併送給任何人。
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const scripts = await page.$$eval('script[src]', (nodes) =>
      nodes.map((n) => n.getAttribute('src')).filter((src) => src && src.includes('/static/js/'))
    );
    test.skip(scripts.length === 0, '找不到打包後的 JS 檔');

    const mapUrl = new URL(`${scripts[0]}.map`, baseURL).toString();
    const response = await request.get(mapUrl);
    expect(response.status(), `${mapUrl} 可被公開下載`).toBeGreaterThanOrEqual(400);
  });
});

test.describe('🔒 前端不得持有可被竊取的憑證', () => {
  test('@security 未登入時 localStorage 不含任何憑證', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const stored = await page.evaluate(() => {
      const result = {};
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        result[key] = window.localStorage.getItem(key);
      }
      return result;
    });

    for (const [key, value] of Object.entries(stored)) {
      // JWT 的特徵：以 eyJ 開頭（base64 的 '{"'）
      expect(
        String(value).startsWith('eyJ'),
        `localStorage["${key}"] 看起來是一個 JWT——任何 XSS 都能讀走它`
      ).toBe(false);
    }
  });

  test('@security 登入用的 cookie 必須是 HttpOnly + Secure', async ({ context, page, baseURL }) => {
    // 後端 SEC-015 之後，憑證應該以 HttpOnly cookie 交付。
    // 這條測試在前端完成 cookie 遷移後才會真的有東西可驗——
    // 在那之前它會因為找不到 cookie 而 skip，那本身就是一個訊號。
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const cookies = await context.cookies(baseURL);
    const authCookie = cookies.find((c) => c.name === 'access_token');
    test.skip(!authCookie, '找不到 access_token cookie（前端可能尚未完成 cookie 認證遷移）');

    expect(authCookie.httpOnly, 'access_token 必須是 HttpOnly，否則 XSS 可竊取').toBe(true);
    if (baseURL.startsWith('https://')) {
      expect(authCookie.secure, 'access_token 必須是 Secure').toBe(true);
    }
  });
});

test.describe('🔒 API 文件不得對外開放', () => {
  test('@security Swagger / Redoc 在正式站應回 404', async ({ request }) => {
    // 後端 SEC-020：API 文件會完整列出所有端點與資料模型。
    const apiUrl = process.env.API_URL || 'https://nkust-alumni-api.binbinbob.work';

    for (const path of ['/server/api/swagger/', '/server/api/redoc/']) {
      const response = await request.get(`${apiUrl}${path}`, { failOnStatusCode: false });
      expect(response.status(), `${path} 對外開放中`).toBeGreaterThanOrEqual(400);
    }
  });
});
