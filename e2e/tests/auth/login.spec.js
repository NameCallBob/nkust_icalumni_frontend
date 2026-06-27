/**
 * login.spec.js
 * 登入頁面完整測試 — 涵蓋 happy path、錯誤流程、表單驗證、UI 行為
 *
 * 測試優先級：Critical（登入是所有管理功能的入口）
 */

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { mockLoginAPI, mockCheckUser, mockTokenVerify } = require('../../utils/api-helpers');
const { TEST_CREDENTIALS, API_URL } = require('../../fixtures/test-data');

test.describe('🔐 登入頁 — 元素存在與初始狀態', () => {
  test('登入頁正確載入，core 元素全部可見', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Email 輸入框
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.emailInput).toBeEnabled();

    // 繼續按鈕存在
    await expect(loginPage.continueButton).toBeVisible();

    // 密碼輸入框不應在第一步出現
    await expect(loginPage.passwordInput).not.toBeVisible();

    // 頁面標題存在
    const title = page.getByText(/歡迎回來/);
    await expect(title).toBeVisible();
  });

  test('email 為空時，繼續按鈕應 disabled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // 未填 email，按鈕 disabled
    await expect(loginPage.continueButton).toBeDisabled();

    // 填入 email 後，按鈕應啟用
    await loginPage.emailInput.fill('test@example.com');
    await expect(loginPage.continueButton).toBeEnabled();

    // 清空後再次 disabled
    await loginPage.emailInput.clear();
    await expect(loginPage.continueButton).toBeDisabled();
  });
});

test.describe('🔐 登入頁 — 第一步：Email 驗證', () => {
  test('輸入無效 email 格式，點繼續應顯示錯誤', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // HTML5 type=email 本身有驗證
    // 填入無效格式
    await loginPage.emailInput.fill('not-an-email');

    // 嘗試提交（form submit）
    await page.keyboard.press('Enter');

    // 應停在 email 階段（不進入密碼階段）
    await expect(loginPage.passwordInput).not.toBeVisible({ timeout: 2000 });
  });

  test('輸入有效 email 點繼續，進入密碼階段', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Mock check-user API
    await mockCheckUser(page, true, '測試系友');

    await loginPage.emailInput.fill(TEST_CREDENTIALS.valid.email);
    await loginPage.continueButton.click();

    // 應進入密碼階段
    await expect(loginPage.passwordInput).toBeVisible({ timeout: 10000 });
    await expect(loginPage.loginButton).toBeVisible();

    // Email 顯示區應顯示輸入的 email
    const emailDisplay = page.getByText(TEST_CREDENTIALS.valid.email);
    await expect(emailDisplay).toBeVisible();
  });

  test('check-user API 發出正確 request', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await mockCheckUser(page, true, '測試系友');

    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('/basic/check-user'),
      { timeout: 10000 }
    );

    await loginPage.emailInput.fill('test@nkust.edu.tw');
    await loginPage.continueButton.click();

    const req = await requestPromise;
    expect(req.url()).toContain('email=test%40nkust.edu.tw');
    expect(req.method()).toBe('GET');
  });
});

test.describe('🔐 登入頁 — 第二步：密碼與登入', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await mockCheckUser(page, true, '測試系友');
    await loginPage.emailInput.fill(TEST_CREDENTIALS.valid.email);
    await loginPage.continueButton.click();
    await expect(page.getByPlaceholder('請輸入您的密碼')).toBeVisible({ timeout: 10000 });
  });

  test('密碼顯示/隱藏切換正常運作', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.passwordInput.fill('password123');

    // 初始應為 password 類型
    const initialType = await loginPage.passwordInput.getAttribute('type');
    expect(initialType).toBe('password');

    // 點顯示
    await loginPage.showPasswordToggle.click();
    const visibleType = await loginPage.passwordInput.getAttribute('type');
    expect(visibleType).toBe('text');

    // 點隱藏
    await loginPage.showPasswordToggle.click();
    const hiddenType = await loginPage.passwordInput.getAttribute('type');
    expect(hiddenType).toBe('password');
  });

  test('點擊「編輯」可返回 email 輸入階段', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.backToEmailStage();

    // 應回到 email 階段
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).not.toBeVisible();
  });

  test('記住我 checkbox 可勾選/取消', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const checkbox = loginPage.rememberMeCheckbox;

    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();

    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('點「忘記密碼？」應跳轉至忘記密碼頁', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeEnabled();

    await loginPage.forgotPasswordLink.click();
    await page.waitForURL('**/forgot**', { timeout: 5000 });
  });

  test('登入成功 — Mock API — 正確跳轉至管理頁', async ({ page }) => {
    await mockLoginAPI(page, 'success');

    const loginPage = new LoginPage(page);
    await loginPage.passwordInput.fill('correct_password');

    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('/basic/login') && req.method() === 'POST',
      { timeout: 10000 }
    );

    await loginPage.loginButton.click();

    // 驗證 API 確實被呼叫
    const req = await requestPromise;
    const postData = JSON.parse(req.postData() || '{}');
    expect(postData).toHaveProperty('email');
    expect(postData).toHaveProperty('password');

    // 驗證跳轉
    await page.waitForURL('**/alumni/manage/**', { timeout: 10000 });
  });

  test('登入失敗 — Mock API — 顯示錯誤 Toast', async ({ page }) => {
    await mockLoginAPI(page, 'failure');

    const loginPage = new LoginPage(page);
    await loginPage.passwordInput.fill('wrong_password');
    await loginPage.loginButton.click();

    // 應顯示錯誤 toast
    const errorToast = page.locator('.Toastify__toast--error, .Toastify__toast--warning').first();
    await expect(errorToast).toBeVisible({ timeout: 8000 });

    // 不應跳轉
    expect(page.url()).not.toContain('/alumni/manage/');
  });

  test('帳號未啟用 (403) — Mock API — 顯示適當提示', async ({ page }) => {
    await mockLoginAPI(page, 'inactive');

    const loginPage = new LoginPage(page);
    await loginPage.passwordInput.fill('password');
    await loginPage.loginButton.click();

    // 應顯示 403 相關提示
    const toast = page.locator('.Toastify__toast').first();
    await expect(toast).toBeVisible({ timeout: 8000 });
    const toastText = await toast.textContent();
    expect(toastText).toMatch(/未啟用|未繳費|帳號/);
  });

  test('登入中按鈕應顯示 loading 狀態', async ({ page }) => {
    // 讓 API 延遲回應
    await page.route(`${API_URL}/basic/login`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'test_token', is_super: false }),
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.passwordInput.fill('password');
    await loginPage.loginButton.click();

    // 點擊後按鈕應顯示 loading
    const spinner = page.locator('.spinner-border').first();
    await expect(spinner).toBeVisible({ timeout: 3000 });

    // 按鈕應 disabled（防止重複提交）
    await expect(loginPage.loginButton).toBeDisabled();
  });

  test('登入按鈕點擊後確實發出 POST /basic/login', async ({ page }) => {
    await mockLoginAPI(page, 'failure'); // 讓登入失敗但不崩潰

    const loginPage = new LoginPage(page);
    await loginPage.passwordInput.fill('test_password');

    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('/basic/login') && req.method() === 'POST') {
        apiCalled = true;
      }
    });

    await loginPage.loginButton.click();
    await page.waitForTimeout(3000);

    expect(apiCalled, '❌ 缺陷：登入按鈕點擊後未發出 API 請求').toBeTruthy();
  });
});

test.describe('🔐 登入頁 — 登入嘗試次數限制', () => {
  test('5 次登入失敗後，登入應被封鎖', async ({ page }) => {
    await mockLoginAPI(page, 'failure');
    await mockCheckUser(page, false);

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // 設定 localStorage 模擬已失敗 4 次
    await page.evaluate(() => {
      localStorage.setItem('loginAttempts', '4');
      localStorage.setItem('lastAttemptTime', String(Math.floor(Date.now() / 1000)));
    });

    // 重新整理使設定生效
    await page.reload();
    await mockLoginAPI(page, 'failure');
    await mockCheckUser(page, false);

    await loginPage.emailInput.fill(TEST_CREDENTIALS.valid.email);
    await loginPage.continueButton.click();

    await expect(loginPage.passwordInput).toBeVisible({ timeout: 10000 });
    await loginPage.passwordInput.fill('wrong_password');
    await loginPage.loginButton.click();

    // 第 5 次失敗後應出現封鎖提示
    const blockAlert = page.getByText(/登入暫時受限|封鎖/);
    await expect(blockAlert).toBeVisible({ timeout: 8000 });

    // 登入按鈕應 disabled
    await expect(loginPage.loginButton).toBeDisabled({ timeout: 5000 });
  });
});

test.describe('🔐 登入頁 — 已登入自動重導向', () => {
  test('已有有效 token 時，應自動驗證並跳轉管理頁', async ({ page }) => {
    // 設定 token verify 成功
    await mockTokenVerify(page, true);

    // 注入 token
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('jwt', 'valid_test_token');
    });

    // Mock token verify API
    await page.route(`${API_URL}/api/token/verify/`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ token: 'valid' }) });
    });

    await page.reload();

    // 應跳轉至管理頁
    await page.waitForURL('**/alumni/manage/**', { timeout: 10000 });
    console.log('[test] 已登入 → 自動跳轉管理頁 ✓');
  });
});
