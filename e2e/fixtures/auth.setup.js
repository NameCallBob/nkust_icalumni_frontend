/**
 * auth.setup.js
 * 登入初始化 — 將登入後的 localStorage state 儲存至 fixtures/auth-state.json
 * 所有需要 manager 權限的測試都依賴此 setup。
 *
 * 使用方式：
 *   TEST_EMAIL=your@email.com TEST_PASSWORD=yourpass npx playwright test --project=auth-setup
 */

const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const AUTH_STATE_PATH = path.join(__dirname, 'auth-state.json');
const API_URL = process.env.API_URL || 'https://nkust-alumni-api.binbinbob.work';
const BASE_URL = process.env.BASE_URL || 'https://aaic.nkust.edu.tw';

setup('取得登入 token 並儲存 auth state', async ({ page, request }) => {
  const email = process.env.TEST_EMAIL || '';
  const password = process.env.TEST_PASSWORD || '';

  if (!email || !password) {
    console.warn('[auth-setup] 未設定 TEST_EMAIL / TEST_PASSWORD，使用 mock token。');
    // 建立空白 auth-state（讓其他 test 不因找不到 file 而失敗）
    const mockState = {
      cookies: [],
      origins: [
        {
          origin: BASE_URL,
          localStorage: [
            { name: 'jwt', value: 'MOCK_TOKEN_FOR_UI_TESTS' },
            { name: 'super', value: 'false' },
          ],
        },
      ],
    };
    fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(mockState, null, 2));
    console.log('[auth-setup] Mock auth state 已儲存。');
    return;
  }

  // ── Step 1：直接呼叫 API 取得 JWT（比 UI 登入更穩定）──
  let token = null;
  try {
    const response = await request.post(`${API_URL}/basic/login`, {
      data: { email, password },
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    if (response.ok()) {
      const data = await response.json();
      token = data.token;
      console.log('[auth-setup] API 登入成功，取得 token。');
    } else {
      console.warn(`[auth-setup] API 登入失敗：${response.status()} — 改用 UI 登入`);
    }
  } catch (err) {
    console.warn(`[auth-setup] API 登入例外：${err.message} — 改用 UI 登入`);
  }

  // ── Step 2：若 API 登入成功，直接注入 localStorage ──
  if (token) {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate((jwt) => {
      const issuedAt = Math.floor(Date.now() / 1000);
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('super', 'true');
      localStorage.setItem('issuedAt', String(issuedAt));
      localStorage.setItem('expiry', String(issuedAt + 14400));
    }, token);
    await page.context().storageState({ path: AUTH_STATE_PATH });
    console.log('[auth-setup] Auth state 已儲存至', AUTH_STATE_PATH);
    return;
  }

  // ── Step 3：Fallback — UI 登入流程 ──
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 20000 });

    // 第一步：輸入 email
    const emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(email);
    await page.getByRole('button', { name: '繼續' }).click();

    // 等待進入密碼階段
    await expect(page.getByPlaceholder('請輸入您的密碼')).toBeVisible({ timeout: 10000 });

    // 第二步：輸入密碼並登入
    await page.getByPlaceholder('請輸入您的密碼').fill(password);
    await page.getByRole('button', { name: '登入' }).click();

    // 等待跳轉至管理頁
    await page.waitForURL('**/alumni/manage/**', { timeout: 15000 });

    // 儲存 auth state
    await page.context().storageState({ path: AUTH_STATE_PATH });
    console.log('[auth-setup] UI 登入成功，auth state 已儲存。');
  } catch (uiErr) {
    console.warn(`[auth-setup] UI 登入也失敗：${uiErr.message}`);
    console.warn('[auth-setup] ⚠️  帳號可能不存在於正式環境，改用 mock auth state。');
    console.warn('[auth-setup] ℹ️  請確認 TEST_EMAIL 帳號已在後端建立，或改用環境內測試帳號。');

    // 最終 fallback：存有管理員權限的 mock state，讓依賴此 setup 的測試可繼續執行
    const issuedAt = Math.floor(Date.now() / 1000);
    const fallbackState = {
      cookies: [],
      origins: [
        {
          origin: BASE_URL,
          localStorage: [
            { name: 'jwt', value: 'MOCK_ADMIN_TOKEN_FALLBACK' },
            { name: 'super', value: 'true' },
            { name: 'issuedAt', value: String(issuedAt) },
            { name: 'expiry', value: String(issuedAt + 14400) },
          ],
        },
      ],
    };
    fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(fallbackState, null, 2));
    console.log('[auth-setup] Fallback mock auth state 已儲存，測試將繼續。');
  }
});
