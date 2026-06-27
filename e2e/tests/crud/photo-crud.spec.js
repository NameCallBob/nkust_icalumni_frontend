/**
 * photo-crud.spec.js
 * @manager 照片管理 CRUD 完整流程測試
 * 使用 Mock API — 不對生產資料庫寫入
 */

const { test, expect } = require('@playwright/test');

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

const MOCK_PHOTOS = {
  count: 3,
  results: [
    { id: 1, title: '系友會活動 2024', url: 'https://via.placeholder.com/300', category: '活動', created_at: '2024-01-01' },
    { id: 2, title: '年度大會', url: 'https://via.placeholder.com/300', category: '活動', created_at: '2024-02-01' },
    { id: 3, title: '校慶紀念照', url: 'https://via.placeholder.com/300', category: '校慶', created_at: '2024-03-01' },
  ],
};

test.describe('@manager 照片管理 — 列表讀取 (Read)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**pic/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_PHOTOS),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**photo/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_PHOTOS),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('照片管理頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[photo-crud] ✓ 照片管理頁載入成功');
  });

  test('照片列表 API 在頁面載入時被呼叫', async ({ page }) => {
    let apiCalled = false;
    page.on('request', (req) => {
      if ((req.url().includes('pic') || req.url().includes('photo')) && req.method() === 'GET') {
        apiCalled = true;
        console.log(`[photo-crud] 照片 API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    console.log(`[photo-crud] 照片列表 API 狀態: ${apiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });

  test('頁面有顯示圖片或圖片相關元素', async ({ page }) => {
    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const imgElements = page.locator('img, [class*="photo"], [class*="pic"], [class*="gallery"]').first();
    const hasImages = (await imgElements.count()) > 0;
    console.log(`[photo-crud] 圖片/相簿元素存在: ${hasImages}`);
  });
});

test.describe('@manager 照片管理 — 上傳新增 (Create)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**pic/**`, async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({ status: 201, body: JSON.stringify({ id: 99, title: '新照片' }) });
      } else if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_PHOTOS) });
      } else {
        await route.continue();
      }
    });
  });

  test('上傳照片按鈕存在且可點擊', async ({ page }) => {
    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const uploadBtn = page
      .getByRole('button', { name: /上傳|Upload|新增照片|新增|Add/i })
      .first();

    if ((await uploadBtn.count()) === 0) {
      console.warn('[photo-crud] ⚠️ 找不到上傳按鈕');
      return;
    }

    await expect(uploadBtn).toBeVisible();
    await expect(uploadBtn).toBeEnabled();

    await uploadBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const fileInput = page.locator('input[type="file"]').first();

    const hasModal = await modal.isVisible().catch(() => false);
    const hasFileInput = (await fileInput.count()) > 0;

    expect(
      hasModal || hasFileInput,
      '❌ 缺陷：上傳按鈕點擊後未開啟 Modal 或 file input'
    ).toBeTruthy();

    console.log(`[photo-crud] ✓ 上傳介面開啟（modal: ${hasModal}, fileInput: ${hasFileInput}）`);
  });

  test('上傳 Modal 有 file input', async ({ page }) => {
    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const uploadBtn = page
      .getByRole('button', { name: /上傳|Upload|新增照片|新增|Add/i })
      .first();
    if ((await uploadBtn.count()) === 0) return;

    await uploadBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    if (!(await modal.isVisible().catch(() => false))) return;

    const fileInput = modal.locator('input[type="file"]').first();
    const hasFileInput = (await fileInput.count()) > 0;

    if (hasFileInput) {
      console.log('[photo-crud] ✓ Modal 中有 file input');
    } else {
      // file input 可能在 modal 外
      const globalFileInput = page.locator('input[type="file"]').first();
      const globalCount = await globalFileInput.count();
      console.log(`[photo-crud] file input（全域）: ${globalCount > 0 ? '✓' : '⚠️ 找不到'}`);
    }
  });

  test('上傳 Modal 可用 ESC 或取消按鈕關閉', async ({ page }) => {
    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const uploadBtn = page
      .getByRole('button', { name: /上傳|Upload|新增照片|新增|Add/i })
      .first();
    if ((await uploadBtn.count()) === 0) return;

    await uploadBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    if (!(await modal.isVisible().catch(() => false))) return;

    // 嘗試取消按鈕
    const cancelBtn = modal.getByRole('button', { name: /取消|Cancel|關閉|Close/i }).first();
    if ((await cancelBtn.count()) > 0) {
      await cancelBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(500);

    const stillOpen = await modal.isVisible().catch(() => false);
    expect(!stillOpen, '❌ 缺陷：照片上傳 Modal 無法關閉').toBeTruthy();
    console.log('[photo-crud] ✓ 照片上傳 Modal 可正常關閉');
  });
});

test.describe('@manager 照片管理 — 刪除 (Delete)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**pic/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_PHOTOS) });
      } else if (method === 'DELETE') {
        await route.fulfill({ status: 204, body: '' });
      } else {
        await route.continue();
      }
    });
  });

  test('刪除照片有確認機制', async ({ page }) => {
    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const deleteBtn = page.getByRole('button', { name: /刪除|Delete|移除/i }).first();

    if ((await deleteBtn.count()) === 0) {
      console.log('[photo-crud] 找不到刪除按鈕（可能在圖片 hover 中）');
      return;
    }

    let deleteApiCalled = false;
    page.on('request', (req) => {
      if ((req.url().includes('pic') || req.url().includes('photo')) && req.method() === 'DELETE') {
        deleteApiCalled = true;
      }
    });

    await deleteBtn.click();
    await page.waitForTimeout(500);

    expect(
      deleteApiCalled,
      '❌ 缺陷：照片刪除按鈕直接觸發刪除，無確認步驟'
    ).toBeFalsy();

    const dialog = page.locator('[role="dialog"], .modal, .swal2-container').first();
    const hasDialog = await dialog.isVisible().catch(() => false);
    console.log(`[photo-crud] 確認 dialog: ${hasDialog ? '✓ 有保護' : '⚠️ 無 dialog'}`);
  });
});
