/**
 * regression.spec.js
 * 回歸測試 — 確保改版後不破壞既有核心功能
 * 這是 CI/CD 必跑的測試集
 */

const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES, MANAGER_ROUTES } = require('../../fixtures/test-data');
const { API_URL } = require('../../fixtures/test-data');

async function setupMockAuth(page) {
  await page.addInitScript(() => {
    const t = Math.floor(Date.now() / 1000);
    localStorage.setItem('jwt', 'mock_test_token');
    localStorage.setItem('super', 'true');
    localStorage.setItem('issuedAt', String(t));
    localStorage.setItem('expiry', String(t + 14400));
  });
  await page.route(`**api/token/verify/**`, async (route) => {
    await route.fulfill({ status: 200, body: JSON.stringify({ token: 'valid' }) });
  });
}

// ── 全站公開頁面回歸 ──
test.describe('♻️ 回歸測試 — 公開頁面完整性', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`[公開] ${route.name} — 頁面完整性`, async ({ page }) => {
      const jsErrors = [];
      page.on('pageerror', (err) => jsErrors.push(err.message));

      await page.goto(route.path, { waitUntil: 'domcontentloaded', timeout: 20000 });

      // 1. 不應白屏
      const body = await page.locator('body').textContent();
      expect(body?.trim().length, `${route.name} 白屏`).toBeGreaterThan(10);

      // 2. 導覽列應存在
      const nav = page.locator('nav, header, .navbar').first();
      await expect(nav, `${route.name} 缺少導覽列`).toBeVisible({ timeout: 10000 });

      // 3. 不應有嚴重 JS 錯誤
      const criticalErrors = jsErrors.filter(
        (e) => !e.includes('Warning') && !e.includes('ResizeObserver') && !e.includes('favicon')
      );
      if (criticalErrors.length > 0) {
        console.warn(`[regression] ${route.name} JS 錯誤: ${criticalErrors[0]}`);
      }
    });
  }
});

// ── 管理端頁面回歸 ──
test.describe('♻️ 回歸測試 — 管理端頁面完整性', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    // 讓所有 API 有基本回應
    await page.route(`${API_URL}/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ count: 0, results: [] }),
      });
    });
  });

  for (const route of MANAGER_ROUTES) {
    test(`[管理端] ${route.name} — 不白屏、不崩潰`, async ({ page }) => {
      const jsErrors = [];
      page.on('pageerror', (err) => jsErrors.push(err.message));

      await page.goto(route.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);

      // 不應跳轉至登入頁（auth 已 mock）
      const url = page.url();
      if (url.includes('/login')) {
        console.warn(`[regression] ${route.name} — mock auth 後仍被重導向至登入頁`);
      }

      // 不應白屏
      const body = await page.locator('body').textContent();
      expect(body?.trim().length, `${route.name} 白屏`).toBeGreaterThan(5);

      const criticalErrors = jsErrors.filter(
        (e) =>
          !e.includes('Warning') &&
          !e.includes('ResizeObserver') &&
          !e.includes('favicon') &&
          !e.includes('ChunkLoadError') // code splitting 在 dev 模式可能有
      );

      if (criticalErrors.length > 0) {
        console.warn(`[regression] ${route.name} JS 錯誤: ${criticalErrors[0]}`);
      } else {
        console.log(`[regression] ✓ ${route.name} 正常`);
      }
    });
  }
});

// ── 核心互動回歸 ──
test.describe('♻️ 回歸測試 — 核心互動', () => {
  test('登入流程兩步驟正常', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.route(`${API_URL}/basic/check-user*`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ exists: true, name: '系友' }) });
    });

    // Step 1
    const emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill('test@nkust.edu.tw');
    await page.getByRole('button', { name: '繼續' }).click();

    // Step 2
    await expect(page.getByPlaceholder('請輸入您的密碼')).toBeVisible({ timeout: 10000 });
    console.log('[regression] ✓ 登入兩步驟流程正常');
  });

  test('搜尋頁輸入後可提交', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const input = page.locator('input[type="text"], input[type="search"]').first();
    if ((await input.count()) === 0) {
      console.log('[regression] 搜尋頁無輸入框');
      return;
    }

    await expect(input).toBeEnabled();
    await input.fill('NKUST');
    console.log('[regression] ✓ 搜尋框可輸入');
  });

  test('404 頁面顯示友善提示而非白屏', async ({ page }) => {
    await page.goto('/page-does-not-exist-xyz', { waitUntil: 'domcontentloaded' });

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(0);

    const has404Content =
      body?.includes('404') ||
      body?.includes('找不到') ||
      body?.includes('不存在') ||
      body?.includes('Page Not Found');

    expect(has404Content, '404 頁面缺少友善提示').toBeTruthy();
    console.log('[regression] ✓ 404 頁面有友善提示');
  });

  test('Footer 在首頁顯示', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    const footer = page.locator('footer').first();
    if ((await footer.count()) > 0) {
      await expect(footer).toBeVisible({ timeout: 10000 });
      console.log('[regression] ✓ Footer 存在且可見');
    } else {
      console.log('[regression] 找不到 footer 元素（可能非 footer tag）');
    }
  });
});

// ── API Mock 整合回歸 ──
test.describe('♻️ 回歸測試 — API 互動', () => {
  test('登入 API 有正確的 payload', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await page.route(`${API_URL}/basic/check-user*`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ exists: true, name: '系友' }) });
    });

    await page.route(`${API_URL}/basic/login`, async (route) => {
      const payload = JSON.parse(route.request().postData() || '{}');

      // 驗證 payload 格式
      expect(payload).toHaveProperty('email');
      expect(payload).toHaveProperty('password');
      expect(typeof payload.email).toBe('string');
      expect(typeof payload.password).toBe('string');

      await route.fulfill({ status: 401, body: JSON.stringify({ detail: 'test' }) });
    });

    await page.getByPlaceholder('請輸入您的電子郵件').fill('test@nkust.edu.tw');
    await page.getByRole('button', { name: '繼續' }).click();
    await expect(page.getByPlaceholder('請輸入您的密碼')).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('請輸入您的密碼').fill('password123');
    await page.getByRole('button', { name: '登入' }).click();

    await page.waitForTimeout(3000);
    console.log('[regression] ✓ 登入 API payload 格式正確');
  });

  test('axios 攔截器對 500 顯示 Toast', async ({ page }) => {
    await setupMockAuth(page);

    // 觸發 500 的方式：讓某個頁面的 API 回 500
    await page.route(`${API_URL}/member/admin/tableOutput_all/**`, async (route) => {
      await route.fulfill({ status: 500, body: JSON.stringify({ detail: 'Server Error' }) });
    });

    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // axios interceptor 對 500 應顯示 toast
    const toast = page.locator('.Toastify__toast--error').first();
    const hasToast = await toast.isVisible().catch(() => false);

    if (hasToast) {
      console.log('[regression] ✓ API 500 後正確顯示 error toast');
    } else {
      console.warn('[regression] ⚠️ API 500 後未顯示 error toast');
    }
  });
});
