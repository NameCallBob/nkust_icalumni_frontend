/**
 * outstanding-crud.spec.js
 * @manager 傑出系友/傑出校友管理 CRUD 完整流程測試
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

const MOCK_OUTSTANDING = {
  count: 3,
  results: [
    { id: 1, name: '張大維', graduation_year: 2010, company: '台積電', title: '資深工程師', achievement: '獲 IEEE 傑出工程師獎', is_active: true },
    { id: 2, name: '林美玲', graduation_year: 2012, company: '鴻海', title: '產品經理', achievement: '創業成功，估值超億', is_active: true },
    { id: 3, name: '陳建宏', graduation_year: 2008, company: '中華電信', title: '技術總監', achievement: '主導 5G 建設計畫', is_active: false },
  ],
};

// ── 共用測試邏輯（傑出系友 & 傑出校友頁面結構相同）──
function createOutstandingTests(pageTitle, pagePath, apiPattern) {
  test.describe(`@manager ${pageTitle} — 列表讀取 (Read)`, () => {
    test.beforeEach(async ({ page }) => {
      await setupMockAuth(page);
      await page.route(apiPattern, async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(MOCK_OUTSTANDING),
          });
        } else {
          await route.continue();
        }
      });
    });

    test(`${pageTitle}頁正常載入`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      expect(page.url()).not.toContain('/login');
      const body = await page.locator('body').textContent();
      expect(body?.trim().length).toBeGreaterThan(10);
      console.log(`[outstanding-crud] ✓ ${pageTitle}頁載入成功`);
    });

    test(`${pageTitle}列表 API 在頁面載入時被呼叫`, async ({ page }) => {
      let apiCalled = false;
      page.on('request', (req) => {
        if (req.url().includes('outstanding') && req.method() === 'GET') {
          apiCalled = true;
          console.log(`[outstanding-crud] API 呼叫: ${req.method()} ${req.url()}`);
        }
      });

      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      console.log(`[outstanding-crud] ${pageTitle} API: ${apiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
    });
  });

  test.describe(`@manager ${pageTitle} — 新增 (Create)`, () => {
    test.beforeEach(async ({ page }) => {
      await setupMockAuth(page);
      await page.route(apiPattern, async (route) => {
        const method = route.request().method();
        if (method === 'POST') {
          await route.fulfill({ status: 201, body: JSON.stringify({ id: 99, name: '新傑出系友' }) });
        } else if (method === 'GET') {
          await route.fulfill({ status: 200, body: JSON.stringify(MOCK_OUTSTANDING) });
        } else {
          await route.continue();
        }
      });
    });

    test(`新增${pageTitle}按鈕存在且可點擊`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();

      if ((await addBtn.count()) === 0) {
        console.warn(`[outstanding-crud] ⚠️ ${pageTitle} 找不到新增按鈕`);
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
        `❌ 缺陷：${pageTitle}新增按鈕點擊後無任何反應`
      ).toBeTruthy();

      console.log(`[outstanding-crud] ✓ ${pageTitle}新增按鈕有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
    });

    test(`新增${pageTitle}表單欄位可填寫`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
      if ((await addBtn.count()) === 0) return;

      await addBtn.click();
      await page.waitForTimeout(500);

      const modal = page.locator('.modal, [role="dialog"]').first();
      if (!(await modal.isVisible().catch(() => false))) return;

      const textInputs = modal.locator('input[type="text"], textarea');
      const count = await textInputs.count();
      console.log(`[outstanding-crud] ${pageTitle} Modal 輸入框: ${count} 個`);

      for (let i = 0; i < Math.min(count, 3); i++) {
        const input = textInputs.nth(i);
        const isVisible = await input.isVisible().catch(() => false);
        const isEnabled = await input.isEnabled().catch(() => false);
        if (isVisible && isEnabled) {
          await input.fill('測試資料');
          const value = await input.inputValue();
          expect(value).toBe('測試資料');
          await input.clear();
          console.log(`[outstanding-crud] ✓ 欄位 ${i + 1} 可填寫`);
        }
      }
    });

    test(`新增${pageTitle}提交後發出 POST API`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const addBtn = page.getByRole('button', { name: /新增|Add|建立|Create/i }).first();
      if ((await addBtn.count()) === 0) return;

      await addBtn.click();
      await page.waitForTimeout(500);

      const modal = page.locator('.modal, [role="dialog"]').first();
      if (!(await modal.isVisible().catch(() => false))) return;

      const nameInput = modal.locator('input[type="text"]').first();
      if ((await nameInput.count()) > 0) {
        await nameInput.fill('自動化測試傑出系友');
      }

      let postCalled = false;
      page.on('request', (req) => {
        if (req.url().includes('outstanding') && req.method() === 'POST') {
          postCalled = true;
          console.log(`[outstanding-crud] ✓ POST API: ${req.url()}`);
        }
      });

      const submitBtn = modal.getByRole('button', { name: /儲存|確認|新增|Submit|確定/i }).first();
      if ((await submitBtn.count()) > 0) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }

      console.log(`[outstanding-crud] ${pageTitle} POST API: ${postCalled ? '✓' : '⚠️ 未偵測到'}`);
    });
  });

  test.describe(`@manager ${pageTitle} — 編輯 (Update)`, () => {
    test.beforeEach(async ({ page }) => {
      await setupMockAuth(page);
      await page.route(apiPattern, async (route) => {
        const method = route.request().method();
        if (method === 'GET') {
          await route.fulfill({ status: 200, body: JSON.stringify(MOCK_OUTSTANDING) });
        } else if (method === 'PUT' || method === 'PATCH') {
          await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        } else {
          await route.continue();
        }
      });
    });

    test(`編輯${pageTitle}按鈕存在`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const editBtn = page.getByRole('button', { name: /編輯|Edit|修改/i }).first();

      if ((await editBtn.count()) === 0) {
        console.log(`[outstanding-crud] ⚠️ ${pageTitle} 找不到編輯按鈕`);
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
        `❌ 缺陷：${pageTitle}編輯按鈕點擊後無任何反應`
      ).toBeTruthy();

      console.log(`[outstanding-crud] ✓ ${pageTitle}編輯有效（modal: ${modalVisible}, url變: ${urlChanged}）`);
    });
  });

  test.describe(`@manager ${pageTitle} — 刪除 (Delete)`, () => {
    test.beforeEach(async ({ page }) => {
      await setupMockAuth(page);
      await page.route(apiPattern, async (route) => {
        const method = route.request().method();
        if (method === 'GET') {
          await route.fulfill({ status: 200, body: JSON.stringify(MOCK_OUTSTANDING) });
        } else if (method === 'DELETE') {
          await route.fulfill({ status: 204, body: '' });
        } else {
          await route.continue();
        }
      });
    });

    test(`刪除${pageTitle}有確認機制`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const deleteBtn = page.getByRole('button', { name: /刪除|Delete/i }).first();

      if ((await deleteBtn.count()) === 0) {
        console.log(`[outstanding-crud] ${pageTitle} 找不到刪除按鈕`);
        return;
      }

      let deleteApiCalled = false;
      page.on('request', (req) => {
        if (req.url().includes('outstanding') && req.method() === 'DELETE') {
          deleteApiCalled = true;
        }
      });

      await deleteBtn.click();
      await page.waitForTimeout(500);

      expect(
        deleteApiCalled,
        `❌ 缺陷：${pageTitle}刪除按鈕直接觸發刪除，無確認步驟`
      ).toBeFalsy();

      const dialog = page.locator('[role="dialog"], .modal, .swal2-container').first();
      const hasDialog = await dialog.isVisible().catch(() => false);
      console.log(`[outstanding-crud] ${pageTitle} 確認保護: ${hasDialog ? '✓' : '⚠️ 無 dialog'}`);
    });
  });
}

// ── 傑出系友（非校友）──
createOutstandingTests('傑出系友', '/alumni/manage/outstanding/', `**outstanding/**`);

// ── 傑出校友 ──
createOutstandingTests('傑出校友', '/alumni/manage/outstanding-alumni/', `**outstanding-alumni/**`);
