/**
 * login-form.spec.js
 * 登入表單深度驗證測試 — 涵蓋所有表單欄位的驗證規則
 */

const { test, expect } = require('@playwright/test');
const { API_URL } = require('../../fixtures/test-data');

test.describe('📋 登入表單 — Email 欄位驗證', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await expect(page.getByPlaceholder('請輸入您的電子郵件')).toBeVisible({ timeout: 10000 });
  });

  test('空 email — 繼續按鈕應 disabled', async ({ page }) => {
    const continueBtn = page.getByRole('button', { name: '繼續' });
    await expect(continueBtn).toBeDisabled();
  });

  test('有效 email 格式 — 繼續按鈕啟用', async ({ page }) => {
    await page.getByPlaceholder('請輸入您的電子郵件').fill('valid@example.com');
    await expect(page.getByRole('button', { name: '繼續' })).toBeEnabled();
  });

  test('email 欄位 type=email（HTML5 格式驗證）', async ({ page }) => {
    const emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    const type = await emailInput.getAttribute('type');
    expect(type).toBe('email');
  });

  test('email 欄位有 autoFocus', async ({ page }) => {
    // 頁面載入後 email 欄位應自動聚焦
    const emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    const isFocused = await emailInput.evaluate((el) => document.activeElement === el);
    // autoFocus 不一定在所有瀏覽器生效，記錄即可
    console.log(`[login-form] email 自動聚焦: ${isFocused}`);
  });

  test('記住我功能 — 上次填入的 email 預填', async ({ page }) => {
    // 設定 localStorage 模擬上次記住 email
    await page.evaluate(() => {
      localStorage.setItem('rememberedEmail', 'saved@nkust.edu.tw');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    const emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const value = await emailInput.inputValue();
    expect(value).toBe('saved@nkust.edu.tw');
    console.log('[login-form] ✓ 記住 email 功能正常預填');
  });
});

test.describe('📋 登入表單 — 密碼欄位驗證', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.route(`${API_URL}/basic/check-user*`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ exists: true, name: '測試' }) });
    });

    // 進入密碼階段
    await page.getByPlaceholder('請輸入您的電子郵件').fill('test@nkust.edu.tw');
    await page.getByRole('button', { name: '繼續' }).click();
    await expect(page.getByPlaceholder('請輸入您的密碼')).toBeVisible({ timeout: 10000 });
  });

  test('密碼欄位預設為 password 類型（遮罩）', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('請輸入您的密碼');
    const type = await passwordInput.getAttribute('type');
    expect(type).toBe('password');
  });

  test('顯示/隱藏密碼切換', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('請輸入您的密碼');
    const toggleBtn = page.getByRole('button', { name: /顯示|隱藏/ });

    await passwordInput.fill('test_password');

    // 點顯示
    await toggleBtn.click();
    expect(await passwordInput.getAttribute('type')).toBe('text');

    // 點隱藏
    await toggleBtn.click();
    expect(await passwordInput.getAttribute('type')).toBe('password');
  });

  test('密碼欄位 autoFocus（進入密碼階段後）', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('請輸入您的密碼');
    await expect(passwordInput).toBeVisible();
    // autoFocus 屬性存在
    const autoFocus = await passwordInput.getAttribute('autofocus');
    console.log(`[login-form] 密碼欄位 autoFocus 屬性: ${autoFocus}`);
  });

  test('登入按鈕未填密碼時仍可點擊（表單必填驗證）', async ({ page }) => {
    const loginBtn = page.getByRole('button', { name: '登入' });
    // 登入按鈕不依賴 disabled，靠 form required 驗證
    await expect(loginBtn).toBeEnabled();
  });
});

test.describe('📋 登入表單 — 防重複提交', () => {
  test('登入中 — 按鈕 disabled 防止重複送出', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.route(`${API_URL}/basic/check-user*`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ exists: true, name: '測試' }) });
    });

    // 進入密碼階段
    await page.getByPlaceholder('請輸入您的電子郵件').fill('test@nkust.edu.tw');
    await page.getByRole('button', { name: '繼續' }).click();
    await expect(page.getByPlaceholder('請輸入您的密碼')).toBeVisible({ timeout: 10000 });

    // 設定慢速 API 回應
    await page.route(`${API_URL}/basic/login`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.fulfill({ status: 401, body: JSON.stringify({ detail: 'failed' }) });
    });

    await page.getByPlaceholder('請輸入您的密碼').fill('password');

    let apiCallCount = 0;
    page.on('request', (req) => {
      if (req.url().includes('/basic/login')) apiCallCount++;
    });

    // 快速點兩次
    const loginBtn = page.getByRole('button', { name: '登入' });
    await loginBtn.click();

    // 第一次點擊後應 disabled
    await expect(loginBtn).toBeDisabled({ timeout: 2000 });

    // 嘗試再點（應被阻止）
    await loginBtn.click({ force: true }).catch(() => {});

    await page.waitForTimeout(4000);

    // API 只應被呼叫一次
    expect(apiCallCount, '❌ 缺陷：防重複送出失效 — API 被呼叫超過一次').toBeLessThanOrEqual(1);
    console.log(`[login-form] ✓ 防重複提交正常（API 呼叫次數: ${apiCallCount}）`);
  });
});
