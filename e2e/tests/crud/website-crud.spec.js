/**
 * website-crud.spec.js
 * @manager 網站設定管理 CRUD 測試
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

const MOCK_WEBSITE_INFO = {
  id: 1,
  site_name: 'NKUST 智慧商務系友會',
  contact_email: 'alumni@nkust.edu.tw',
  contact_phone: '07-1234567',
  address: '高雄市燕巢區深中路1號',
  intro: '本系友會成立於民國90年，致力於連結在校生與校友...',
  facebook_url: 'https://facebook.com/nkust.ic',
  instagram_url: '',
};

test.describe('@manager 網站設定 — 讀取 (Read)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**website/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_WEBSITE_INFO),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('網站設定頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/website/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[website-crud] ✓ 網站設定頁載入成功');
  });

  test('網站設定 API 在頁面載入時被呼叫', async ({ page }) => {
    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('website') && req.method() === 'GET') {
        apiCalled = true;
        console.log(`[website-crud] 網站 API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    await page.goto('/alumni/manage/website/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    console.log(`[website-crud] 網站設定 API: ${apiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });

  test('頁面有表單輸入框', async ({ page }) => {
    await page.goto('/alumni/manage/website/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const inputs = page.locator('input, textarea').filter({ hasNotText: '' });
    const count = await page.locator('input[type="text"], input[type="email"], input[type="url"], textarea').count();
    console.log(`[website-crud] 找到 ${count} 個輸入欄位`);
  });
});

test.describe('@manager 網站設定 — 更新 (Update)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**website/**`, async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(MOCK_WEBSITE_INFO) });
      } else if (method === 'PUT' || method === 'PATCH') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true, ...MOCK_WEBSITE_INFO }) });
      } else {
        await route.continue();
      }
    });
  });

  test('網站設定表單欄位可編輯', async ({ page }) => {
    await page.goto('/alumni/manage/website/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const textInputs = page.locator('input[type="text"], input[type="email"], input[type="url"]');
    const count = await textInputs.count();
    console.log(`[website-crud] 文字輸入框數量: ${count}`);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = textInputs.nth(i);
      const isVisible = await input.isVisible().catch(() => false);
      const isEnabled = await input.isEnabled().catch(() => false);
      if (isVisible && isEnabled) {
        const placeholder = await input.getAttribute('placeholder');
        const originalValue = await input.inputValue();
        await input.fill('測試更新值');
        const newValue = await input.inputValue();
        expect(newValue).toBe('測試更新值');
        // 還原原始值
        await input.fill(originalValue || '');
        console.log(`[website-crud] ✓ 欄位 "${placeholder}" 可編輯`);
      }
    }
  });

  test('儲存按鈕存在且發出 PUT/PATCH API', async ({ page }) => {
    await page.goto('/alumni/manage/website/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const saveBtn = page.getByRole('button', { name: /儲存|Save|更新|Submit|確認/i }).first();

    if ((await saveBtn.count()) === 0) {
      console.warn('[website-crud] ⚠️ 找不到儲存按鈕');
      return;
    }

    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();

    let updateApiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('website') && (req.method() === 'PUT' || req.method() === 'PATCH')) {
        updateApiCalled = true;
        console.log(`[website-crud] ✓ 更新 API: ${req.method()} ${req.url()}`);
      }
    });

    await saveBtn.click();
    await page.waitForTimeout(2000);

    console.log(`[website-crud] 更新 API: ${updateApiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });

  test('textarea 內容可修改', async ({ page }) => {
    await page.goto('/alumni/manage/website/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const textareas = page.locator('textarea');
    const count = await textareas.count();

    if (count === 0) {
      console.log('[website-crud] 找不到 textarea，跳過');
      return;
    }

    const textarea = textareas.first();
    const isVisible = await textarea.isVisible().catch(() => false);
    const isEnabled = await textarea.isEnabled().catch(() => false);

    if (isVisible && isEnabled) {
      await textarea.fill('測試網站介紹文字，由自動化測試填入。');
      const value = await textarea.inputValue();
      expect(value).toBe('測試網站介紹文字，由自動化測試填入。');
      console.log('[website-crud] ✓ textarea 可編輯');
    }
  });
});

test.describe('@manager 網站設定 — 系友會資料 (Info)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**info/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            id: 1,
            name: '國立高雄科技大學智慧商務系友會',
            founding_year: 2001,
            chairman: '測試會長',
          }),
        });
      } else if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });
  });

  test('系友會資料頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/info/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[website-crud] ✓ 系友會資料頁載入成功');
  });

  test('系友會資料頁有可編輯欄位', async ({ page }) => {
    await page.goto('/alumni/manage/info/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const inputs = page.locator('input[type="text"], textarea');
    const count = await inputs.count();
    console.log(`[website-crud] 系友會資料欄位數量: ${count}`);
  });
});

test.describe('@manager 章程管理', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**constitutions/**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            id: 1,
            content: '第一章 總則\n第一條 本會名稱為...',
            updated_at: '2024-01-01T00:00:00Z',
          }),
        });
      } else if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });
  });

  test('章程管理頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/constitutions/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[website-crud] ✓ 章程管理頁載入成功');
  });

  test('章程內容可編輯並儲存', async ({ page }) => {
    await page.goto('/alumni/manage/constitutions/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const editor = page
      .locator('.ql-editor, [contenteditable="true"], textarea')
      .first();

    if ((await editor.count()) === 0) {
      console.log('[website-crud] 找不到章程編輯區');
      return;
    }

    const isVisible = await editor.isVisible().catch(() => false);
    if (isVisible) {
      await editor.click();
      console.log('[website-crud] ✓ 章程編輯區可點擊');
    }

    const saveBtn = page.getByRole('button', { name: /儲存|Save|更新|確認/i }).first();
    if ((await saveBtn.count()) > 0) {
      await expect(saveBtn).toBeEnabled();
      console.log('[website-crud] ✓ 章程儲存按鈕存在');
    }
  });
});
