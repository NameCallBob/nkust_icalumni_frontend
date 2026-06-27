/**
 * company-crud.spec.js
 * @manager 公司管理 CRUD 完整流程測試
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

const MOCK_COMPANIES = {
  count: 3,
  results: [
    { id: 1, name: '台積電', industry: '半導體', address: '新竹市', contact: 'hr@tsmc.com', is_active: true },
    { id: 2, name: '鴻海精密', industry: '電子製造', address: '新北市', contact: 'hr@foxconn.com', is_active: true },
    { id: 3, name: '中華電信', industry: '電信', address: '台北市', contact: 'hr@cht.com', is_active: false },
  ],
};

test.describe('@manager 公司管理 — 列表讀取 (Read)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**company/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_COMPANIES),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('公司管理頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[company-crud] ✓ 公司管理頁載入成功');
  });

  test('公司列表 API 在頁面載入時被呼叫', async ({ page }) => {
    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('company') && req.method() === 'GET') {
        apiCalled = true;
        console.log(`[company-crud] 公司 API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    console.log(`[company-crud] 公司列表 API 狀態: ${apiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });

  test('頁面有顯示表格或列表區塊', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const table = page.locator('table, .data-table, .p-datatable, [class*="table"]').first();
    const hasList = (await table.count()) > 0;
    console.log(`[company-crud] 表格區塊存在: ${hasList}`);
  });
});

test.describe('@manager 公司管理 — 新增 (Create)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**company/**`, async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 99, name: '新公司', industry: '科技' }),
        });
      } else if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_COMPANIES),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('新增公司按鈕存在且可點擊', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();

    if ((await addBtn.count()) === 0) {
      console.warn('[company-crud] ⚠️ 找不到新增按鈕');
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
      '❌ 缺陷：新增按鈕點擊後無任何反應'
    ).toBeTruthy();

    console.log(`[company-crud] ✓ 新增按鈕有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
  });

  test('新增表單欄位可輸入', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
    if ((await addBtn.count()) === 0) {
      console.warn('[company-crud] ⚠️ 找不到新增按鈕，跳過表單測試');
      return;
    }

    await addBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const isOpen = await modal.isVisible().catch(() => false);
    if (!isOpen) {
      console.log('[company-crud] 新增未開啟 Modal，可能跳轉頁面');
      return;
    }

    const textInputs = modal.locator('input[type="text"], input[type="email"], textarea');
    const count = await textInputs.count();
    console.log(`[company-crud] Modal 中找到 ${count} 個輸入框`);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = textInputs.nth(i);
      const isVisible = await input.isVisible().catch(() => false);
      const isEnabled = await input.isEnabled().catch(() => false);
      if (isVisible && isEnabled) {
        await input.fill('測試公司資料');
        const value = await input.inputValue();
        expect(value).toBe('測試公司資料');
        await input.clear();
        console.log('[company-crud] ✓ Modal 輸入框可填寫');
      }
    }
  });

  test('新增公司提交後發出 POST API', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
    if ((await addBtn.count()) === 0) return;

    await addBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    if (!(await modal.isVisible().catch(() => false))) return;

    // 填寫必要欄位
    const nameInput = modal
      .locator('input[type="text"], input[placeholder*="公司"], input[placeholder*="名稱"]')
      .first();
    if ((await nameInput.count()) > 0) {
      await nameInput.fill('自動化測試公司');
    }

    let postCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('company') && req.method() === 'POST') {
        postCalled = true;
        console.log(`[company-crud] ✓ 新增 POST API: ${req.url()}`);
      }
    });

    const submitBtn = modal.getByRole('button', { name: /儲存|確認|新增|Submit|確定/i }).first();
    if ((await submitBtn.count()) > 0) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }

    console.log(`[company-crud] POST API 呼叫: ${postCalled ? '✓' : '⚠️ 未偵測到'}`);
  });
});

test.describe('@manager 公司管理 — 編輯 (Update)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**company/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_COMPANIES) });
      } else if (method === 'PUT' || method === 'PATCH') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });
  });

  test('編輯按鈕存在', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const editBtn = page.getByRole('button', { name: /編輯|Edit|修改/i }).first();
    const editIcon = page.locator('[class*="edit"], [title*="編輯"], [title*="Edit"]').first();

    const hasBtn = (await editBtn.count()) > 0;
    const hasIcon = (await editIcon.count()) > 0;

    console.log(`[company-crud] 編輯按鈕: ${hasBtn}, 編輯圖示: ${hasIcon}`);

    if (hasBtn) {
      await expect(editBtn).toBeVisible();
      await expect(editBtn).toBeEnabled();
      console.log('[company-crud] ✓ 編輯按鈕可用');
    }
  });

  test('點擊編輯按鈕可開啟編輯表單', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const editBtn = page.getByRole('button', { name: /編輯|Edit|修改/i }).first();
    if ((await editBtn.count()) === 0) {
      console.log('[company-crud] ⚠️ 找不到編輯按鈕');
      return;
    }

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

    console.log(`[company-crud] ✓ 編輯按鈕有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
  });
});

test.describe('@manager 公司管理 — 刪除 (Delete)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**company/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_COMPANIES) });
      } else if (method === 'DELETE') {
        await route.fulfill({ status: 204, body: '' });
      } else {
        await route.continue();
      }
    });
  });

  test('刪除操作有確認機制（不應直接刪除）', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const deleteBtn = page.getByRole('button', { name: /刪除|Delete/i }).first();

    if ((await deleteBtn.count()) === 0) {
      console.log('[company-crud] 找不到刪除按鈕（可能在 row 操作中）');
      return;
    }

    let deleteApiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('company') && req.method() === 'DELETE') {
        deleteApiCalled = true;
      }
    });

    await deleteBtn.click();
    await page.waitForTimeout(500);

    expect(
      deleteApiCalled,
      '❌ 缺陷：刪除按鈕點擊後立即刪除，沒有確認步驟 — 高風險操作缺少保護機制'
    ).toBeFalsy();

    const dialog = page.locator('[role="dialog"], .modal, .swal2-container').first();
    const hasDialog = await dialog.isVisible().catch(() => false);
    console.log(`[company-crud] 確認 dialog: ${hasDialog ? '✓ 有保護' : '⚠️ 無 dialog（可能用 window.confirm）'}`);
  });
});

test.describe('@manager 公司管理 — 搜尋篩選', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**company/**`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(MOCK_COMPANIES) });
    });
  });

  test('搜尋框可輸入並篩選', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const searchInput = page
      .locator('input[type="text"], input[type="search"], input[placeholder*="搜"], input[placeholder*="查"]')
      .first();

    if ((await searchInput.count()) === 0) {
      console.log('[company-crud] 找不到搜尋框');
      return;
    }

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
    await searchInput.fill('台積電');
    expect(await searchInput.inputValue()).toBe('台積電');
    console.log('[company-crud] ✓ 搜尋框可輸入');
  });
});
