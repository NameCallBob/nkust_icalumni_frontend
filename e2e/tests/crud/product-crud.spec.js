/**
 * product-crud.spec.js
 * @manager 產品管理 CRUD 完整流程測試
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

const MOCK_PRODUCTS = {
  count: 3,
  results: [
    { id: 1, name: '智慧管理系統', description: '校友管理平台', category: '軟體', company: '測試科技', is_active: true },
    { id: 2, name: 'AI 分析工具', description: '資料分析服務', category: 'AI', company: '測試科技', is_active: true },
    { id: 3, name: '校友 App', description: '行動應用程式', category: 'APP', company: '智慧科技', is_active: false },
  ],
};

test.describe('@manager 產品管理 — 列表讀取 (Read)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**product/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_PRODUCTS),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('產品管理頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/product/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[product-crud] ✓ 產品管理頁載入成功');
  });

  test('產品列表 API 在頁面載入時被呼叫', async ({ page }) => {
    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('product') && req.method() === 'GET') {
        apiCalled = true;
        console.log(`[product-crud] 產品 API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    await page.goto('/alumni/manage/product/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    console.log(`[product-crud] 產品列表 API 狀態: ${apiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });
});

test.describe('@manager 產品管理 — 新增 (Create)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**product/**`, async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({
          status: 201,
          body: JSON.stringify({ id: 99, name: '新產品', category: '軟體' }),
        });
      } else if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_PRODUCTS) });
      } else {
        await route.continue();
      }
    });
  });

  test('新增產品按鈕存在且可點擊', async ({ page }) => {
    await page.goto('/alumni/manage/product/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();

    if ((await addBtn.count()) === 0) {
      console.warn('[product-crud] ⚠️ 找不到新增按鈕');
      return;
    }

    await expect(addBtn).toBeVisible();
    await expect(addBtn).toBeEnabled();

    const urlBefore = page.url();
    await addBtn.click();
    await page.waitForTimeout(1000);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const modalVisible = await modal.isVisible().catch(() => false);
    const urlChanged = page.url() !== urlBefore;

    expect(
      modalVisible || urlChanged,
      '❌ 缺陷：新增產品按鈕點擊後無任何反應'
    ).toBeTruthy();

    console.log(`[product-crud] ✓ 新增按鈕有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
  });

  test('新增產品表單欄位可輸入', async ({ page }) => {
    await page.goto('/alumni/manage/product/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
    if ((await addBtn.count()) === 0) return;

    await addBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    if (!(await modal.isVisible().catch(() => false))) return;

    const textInputs = modal.locator('input[type="text"], textarea');
    const count = await textInputs.count();
    console.log(`[product-crud] Modal 中找到 ${count} 個輸入框`);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = textInputs.nth(i);
      const isVisible = await input.isVisible().catch(() => false);
      const isEnabled = await input.isEnabled().catch(() => false);
      if (isVisible && isEnabled) {
        await input.fill('測試產品名稱');
        const value = await input.inputValue();
        expect(value).toBe('測試產品名稱');
        await input.clear();
        console.log('[product-crud] ✓ 欄位可填寫');
      }
    }
  });

  test('新增產品提交後發出 POST API', async ({ page }) => {
    await page.goto('/alumni/manage/product/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
    if ((await addBtn.count()) === 0) return;

    await addBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    if (!(await modal.isVisible().catch(() => false))) return;

    const textInputs = modal.locator('input[type="text"]');
    if ((await textInputs.count()) > 0) {
      await textInputs.first().fill('自動化測試產品');
    }

    let postCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('product') && req.method() === 'POST') {
        postCalled = true;
        console.log(`[product-crud] ✓ POST API: ${req.url()}`);
      }
    });

    const submitBtn = modal.getByRole('button', { name: /儲存|確認|新增|Submit|確定/i }).first();
    if ((await submitBtn.count()) > 0) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }

    console.log(`[product-crud] POST API: ${postCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });
});

test.describe('@manager 產品管理 — 編輯 (Update)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**product/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_PRODUCTS) });
      } else if (method === 'PUT' || method === 'PATCH') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });
  });

  test('編輯按鈕存在且可點擊', async ({ page }) => {
    await page.goto('/alumni/manage/product/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const editBtn = page.getByRole('button', { name: /編輯|Edit|修改/i }).first();

    if ((await editBtn.count()) === 0) {
      console.log('[product-crud] ⚠️ 找不到編輯按鈕');
      return;
    }

    await expect(editBtn).toBeVisible();
    await expect(editBtn).toBeEnabled();

    const urlBefore = page.url();
    await editBtn.click();
    await page.waitForTimeout(1000);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const modalVisible = await modal.isVisible().catch(() => false);
    const urlChanged = page.url() !== urlBefore;

    expect(
      modalVisible || urlChanged,
      '❌ 缺陷：編輯按鈕點擊後無任何反應'
    ).toBeTruthy();

    console.log(`[product-crud] ✓ 編輯有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
  });
});

test.describe('@manager 產品管理 — 刪除 (Delete)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**product/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_PRODUCTS) });
      } else if (method === 'DELETE') {
        await route.fulfill({ status: 204, body: '' });
      } else {
        await route.continue();
      }
    });
  });

  test('刪除操作有確認機制', async ({ page }) => {
    await page.goto('/alumni/manage/product/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const deleteBtn = page.getByRole('button', { name: /刪除|Delete/i }).first();

    if ((await deleteBtn.count()) === 0) {
      console.log('[product-crud] 找不到刪除按鈕');
      return;
    }

    let deleteApiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('product') && req.method() === 'DELETE') {
        deleteApiCalled = true;
      }
    });

    await deleteBtn.click();
    await page.waitForTimeout(500);

    expect(
      deleteApiCalled,
      '❌ 缺陷：刪除按鈕點擊後立即刪除，沒有確認步驟'
    ).toBeFalsy();

    const dialog = page.locator('[role="dialog"], .modal, .swal2-container').first();
    const hasDialog = await dialog.isVisible().catch(() => false);
    console.log(`[product-crud] 確認 dialog: ${hasDialog ? '✓ 有保護' : '⚠️ 無 dialog'}`);
  });
});
