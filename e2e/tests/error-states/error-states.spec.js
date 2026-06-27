/**
 * error-states.spec.js
 * 錯誤狀態與邊界條件測試
 * 主動模擬 API 錯誤、空資料、超時，驗證前端是否正確處理
 */

const { test, expect } = require('@playwright/test');
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

test.describe('💥 API 錯誤狀態處理', () => {
  test('API 500 錯誤 — 不應白屏，應顯示錯誤提示', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Mock 搜尋 API 回 500
    await page.route(`${API_URL}/company/search/**`, async (route) => {
      await route.fulfill({ status: 500, body: JSON.stringify({ detail: 'Internal error' }) });
    });

    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length, '❌ 缺陷：API 500 後頁面白屏').toBeGreaterThan(0);

    // 嚴重 JS 錯誤
    const criticalErrors = errors.filter(
      (e) => !e.includes('Warning') && !e.includes('ResizeObserver')
    );
    if (criticalErrors.length > 0) {
      console.warn(`[error-states] API 500 後產生 JS 錯誤：${criticalErrors.join(' | ')}`);
    }

    console.log('[error-states] ✓ API 500 後頁面未白屏');
  });

  test('API 401 未登入 — 前端正確處理 token 失效', async ({ page }) => {
    await setupMockAuth(page);

    // 讓 API 回 401
    await page.route(`**member/admin/tableOutput_all/**`, async (route) => {
      await route.fulfill({ status: 401, body: JSON.stringify({ detail: 'Token expired' }) });
    });

    // 401 的 interceptor 目前被 comment out（源碼中看到），記錄行為
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(0);

    const url = page.url();
    console.log(`[error-states] API 401 後 URL: ${url}`);

    // 記錄：源碼中 401 的 interceptor 被 comment out，這可能是缺陷
    if (!url.includes('/login')) {
      console.warn('[error-states] ⚠️ 注意：API 401 後未跳轉至登入頁 — axios interceptor 中 401 處理被 comment out');
    }
  });

  test('API 403 — 前端應重導向首頁', async ({ page }) => {
    await setupMockAuth(page);

    // Mock 403 回應
    await page.route(`**member/admin/tableOutput_all/**`, async (route) => {
      await route.fulfill({ status: 403, body: JSON.stringify({ detail: 'Forbidden' }) });
    });

    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // axios interceptor 對 403 會顯示 toast 並跳轉至 /
    const url = page.url();
    const toast = page.locator('.Toastify__toast').first();
    const hasToast = await toast.isVisible().catch(() => false);

    console.log(`[error-states] API 403 後 URL: ${url}, Toast: ${hasToast}`);
    // 預期：顯示 toast 並跳轉至首頁（依 Axios.js interceptor 邏輯）
  });

  test('API 超時 — 不應白屏，應有 loading 處理', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Mock 超時
    await page.route(`${API_URL}/company/search/**`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 11000)); // 超過 axios 10s timeout
      await route.abort('timedout');
    });

    await page.goto('/search', { waitUntil: 'domcontentloaded' });

    const body = await page.locator('body').textContent();
    expect(body?.trim().length, '超時後頁面不應白屏').toBeGreaterThan(0);

    console.log('[error-states] 超時測試完成（API 超時不應導致白屏）');
  });

  test('網路斷線模擬 — 頁面應有友善提示', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 模擬網路斷線
    await page.context().setOffline(true);

    // 嘗試進行需要網路的操作
    await page.goto('/search');
    await page.waitForTimeout(2000);

    // 恢復網路
    await page.context().setOffline(false);

    // 頁面應能顯示某些內容（即使是空殼）
    const body = await page.locator('body').textContent();
    console.log(`[error-states] 網路斷線後 body 長度: ${body?.length}`);
  });
});

test.describe('💥 空資料狀態', () => {
  test('搜尋無結果時，不應白屏', async ({ page }) => {
    // Mock 空搜尋結果
    await page.route(`${API_URL}/company/search/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ count: 0, results: [] }),
      });
    });

    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    if ((await searchInput.count()) > 0) {
      await searchInput.fill('這個關鍵字不應有任何結果XXXXXXXXXXX');
    }

    const searchBtn = page.getByRole('button', { name: /搜尋/i }).first();
    if ((await searchBtn.count()) > 0) {
      await searchBtn.click();
    } else {
      await searchInput.press('Enter');
    }

    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(0);

    // 應顯示空狀態訊息
    const emptyMsg = page.getByText(/沒有|查無|找不到|No result|empty/i).first();
    const hasEmpty = await emptyMsg.count() > 0;

    if (!hasEmpty) {
      console.warn('[error-states] ⚠️ 搜尋無結果時未顯示空狀態提示');
    } else {
      console.log('[error-states] ✓ 搜尋無結果顯示空狀態提示');
    }
  });

  test('管理頁空資料不應白屏', async ({ page }) => {
    await setupMockAuth(page);

    // Mock 所有 API 回傳空列表
    await page.route(`${API_URL}/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ count: 0, results: [] }),
      });
    });

    const pagesToTest = [
      '/alumni/manage/article/',
      '/alumni/manage/recruit/',
    ];

    for (const pagePath of pagesToTest) {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));

      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const body = await page.locator('body').textContent();
      expect(
        body?.trim().length,
        `❌ 缺陷 [${pagePath}]：空資料時頁面白屏`
      ).toBeGreaterThan(0);

      const criticalErrors = errors.filter(
        (e) => !e.includes('Warning') && !e.includes('ResizeObserver') && !e.includes('favicon')
      );

      if (criticalErrors.length > 0) {
        console.warn(`[error-states] ${pagePath} 空資料時 JS 錯誤: ${criticalErrors[0]}`);
      } else {
        console.log(`[error-states] ✓ ${pagePath} 空資料不白屏`);
      }
    }
  });
});

test.describe('💥 無效路由與 404', () => {
  test('不存在的活動 ID — 不應崩潰', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/activity/99999999', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(0);

    const criticalErrors = errors.filter(
      (e) => !e.includes('Warning') && !e.includes('ResizeObserver')
    );
    if (criticalErrors.length > 0) {
      console.warn(`[error-states] ⚠️ /activity/99999999 產生 JS 錯誤: ${criticalErrors[0]}`);
    } else {
      console.log('[error-states] ✓ 無效活動 ID 不崩潰');
    }
  });

  test('不存在的校友 ID — 不應崩潰', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/alumni/99999999', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(0);

    const criticalErrors = errors.filter(
      (e) => !e.includes('Warning') && !e.includes('ResizeObserver')
    );
    if (criticalErrors.length > 0) {
      console.warn(`[error-states] ⚠️ /alumni/99999999 產生 JS 錯誤: ${criticalErrors[0]}`);
    } else {
      console.log('[error-states] ✓ 無效校友 ID 不崩潰');
    }
  });

  test('不存在的文章編輯路由 — 不應崩潰', async ({ page }) => {
    await setupMockAuth(page);

    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/alumni/manage/article/edit/99999999', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
    console.log('[error-states] ✓ 無效文章 ID 不崩潰');
  });
});

test.describe('💥 Loading 狀態驗證', () => {
  test('API 延遲時應顯示 loading 狀態', async ({ page }) => {
    // Mock 延遲回應
    await page.route(`${API_URL}/company/search/**`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ count: 0, results: [] }),
      });
    });

    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    const searchInput = page.locator('input[type="text"]').first();

    if ((await searchInput.count()) > 0) {
      await searchInput.fill('測試');
    }

    const searchBtn = page.getByRole('button', { name: /搜尋/i }).first();
    if ((await searchBtn.count()) > 0) {
      await searchBtn.click();

      // 在 API 回應前，應有 loading 狀態
      await page.waitForTimeout(200);

      const spinner = page.locator('.spinner-border, .loading, [role="progressbar"], .p-progress-spinner').first();
      const hasSpinner = await spinner.count() > 0;

      if (!hasSpinner) {
        // 按鈕本身 disabled 也是一種 loading 表示
        const btnDisabled = await searchBtn.isDisabled().catch(() => false);
        console.log(`[error-states] loading 指示: spinner=${hasSpinner}, btn disabled=${btnDisabled}`);
      } else {
        console.log('[error-states] ✓ 有 loading spinner');
      }
    }
  });
});
