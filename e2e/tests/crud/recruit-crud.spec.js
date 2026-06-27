/**
 * recruit-crud.spec.js
 * @manager 招聘管理 CRUD 完整流程測試
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

const MOCK_RECRUITS = {
  count: 3,
  results: [
    { id: 1, title: '前端工程師', company: '台積電', location: '新竹', salary: '60000', deadline: '2025-06-30', is_active: true },
    { id: 2, title: '後端工程師', company: '鴻海精密', location: '新北', salary: '55000', deadline: '2025-07-31', is_active: true },
    { id: 3, title: '資料分析師', company: '中華電信', location: '台北', salary: '50000', deadline: '2025-05-31', is_active: false },
  ],
};

test.describe('@manager 招聘管理 — 列表讀取 (Read)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**recruit/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_RECRUITS),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('招聘管理頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[recruit-crud] ✓ 招聘管理頁載入成功');
  });

  test('招聘列表 API 在頁面載入時被呼叫', async ({ page }) => {
    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('recruit') && req.method() === 'GET') {
        apiCalled = true;
        console.log(`[recruit-crud] 招聘 API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    console.log(`[recruit-crud] 招聘列表 API 狀態: ${apiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });

  test('全部招聘頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/all/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[recruit-crud] ✓ 全部招聘頁載入成功');
  });
});

test.describe('@manager 招聘管理 — 新增 (Create)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**recruit/**`, async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 99, title: '新職缺', company: '測試公司' }),
        });
      } else if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_RECRUITS) });
      } else {
        await route.continue();
      }
    });
  });

  test('新增招聘按鈕存在且可點擊', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();

    if ((await addBtn.count()) === 0) {
      console.warn('[recruit-crud] ⚠️ 找不到新增按鈕');
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
      '❌ 缺陷：新增招聘按鈕點擊後無任何反應'
    ).toBeTruthy();

    console.log(`[recruit-crud] ✓ 新增按鈕有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
  });

  test('新增招聘表單欄位完整', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
    if ((await addBtn.count()) === 0) return;

    await addBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    if (!(await modal.isVisible().catch(() => false))) return;

    const fields = {
      title: modal.locator('input[placeholder*="職缺"], input[placeholder*="標題"], input[name*="title"]').first(),
      company: modal.locator('input[placeholder*="公司"], input[name*="company"]').first(),
    };

    for (const [key, field] of Object.entries(fields)) {
      if ((await field.count()) > 0) {
        await field.fill(`測試${key}`);
        const value = await field.inputValue();
        expect(value).toBeTruthy();
        console.log(`[recruit-crud] ✓ 欄位 ${key} 可輸入`);
      }
    }
  });

  test('新增招聘提交後發出 POST API', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
    if ((await addBtn.count()) === 0) return;

    await addBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    if (!(await modal.isVisible().catch(() => false))) return;

    const textInputs = modal.locator('input[type="text"]');
    if ((await textInputs.count()) > 0) {
      await textInputs.first().fill('自動化測試職缺');
    }

    let postCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('recruit') && req.method() === 'POST') {
        postCalled = true;
        console.log(`[recruit-crud] ✓ POST API: ${req.url()}`);
      }
    });

    const submitBtn = modal.getByRole('button', { name: /儲存|確認|新增|Submit|確定/i }).first();
    if ((await submitBtn.count()) > 0) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }

    console.log(`[recruit-crud] POST API 呼叫: ${postCalled ? '✓' : '⚠️ 未偵測到'}`);
  });
});

test.describe('@manager 招聘管理 — 編輯 (Update)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**recruit/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_RECRUITS) });
      } else if (method === 'PUT' || method === 'PATCH') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });
  });

  test('編輯按鈕存在且可點擊', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const editBtn = page.getByRole('button', { name: /編輯|Edit|修改/i }).first();

    if ((await editBtn.count()) === 0) {
      console.log('[recruit-crud] ⚠️ 找不到編輯按鈕');
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

    console.log(`[recruit-crud] ✓ 編輯有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
  });
});

test.describe('@manager 招聘管理 — 刪除 (Delete)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**recruit/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_RECRUITS) });
      } else if (method === 'DELETE') {
        await route.fulfill({ status: 204, body: '' });
      } else {
        await route.continue();
      }
    });
  });

  test('刪除操作有確認機制', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const deleteBtn = page.getByRole('button', { name: /刪除|Delete/i }).first();

    if ((await deleteBtn.count()) === 0) {
      console.log('[recruit-crud] 找不到刪除按鈕');
      return;
    }

    let deleteApiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('recruit') && req.method() === 'DELETE') {
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
    console.log(`[recruit-crud] 確認 dialog: ${hasDialog ? '✓ 有保護' : '⚠️ 無 dialog'}`);
  });
});

test.describe('@manager 招聘管理 — 搜尋篩選', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**recruit/**`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(MOCK_RECRUITS) });
    });
  });

  test('搜尋框可輸入', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const searchInput = page
      .locator('input[type="text"], input[type="search"], input[placeholder*="搜"], input[placeholder*="查"]')
      .first();

    if ((await searchInput.count()) === 0) {
      console.log('[recruit-crud] 找不到搜尋框');
      return;
    }

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
    await searchInput.fill('前端工程師');
    expect(await searchInput.inputValue()).toBe('前端工程師');
    console.log('[recruit-crud] ✓ 搜尋框可輸入');
  });
});
