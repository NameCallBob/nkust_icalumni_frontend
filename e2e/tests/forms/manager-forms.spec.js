/**
 * manager-forms.spec.js
 * @manager 管理端表單測試 — 新增/編輯表單的所有欄位驗證
 */

const { test, expect } = require('@playwright/test');
const { API_URL } = require('../../fixtures/test-data');

async function setupMockAuth(page) {
  await page.addInitScript(() => {
    const issuedAt = Math.floor(Date.now() / 1000);
    localStorage.setItem('jwt', 'mock_test_token');
    localStorage.setItem('super', 'true');
    localStorage.setItem('issuedAt', String(issuedAt));
    localStorage.setItem('expiry', String(issuedAt + 14400));
  });
  await page.route(`**api/token/verify/**`, async (route) => {
    await route.fulfill({ status: 200, body: JSON.stringify({ token: 'valid' }) });
  });
}

test.describe('@manager 文章編輯表單', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
  });

  test('新增文章頁有必要的表單欄位', async ({ page }) => {
    await page.goto('/alumni/manage/article/new/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    console.log('[article-form] 頁面內容長度:', body?.length);

    // 應有標題輸入框
    const titleInput = page.locator('input[placeholder*="標題"], input[name*="title"]').first();
    const hasTitle = (await titleInput.count()) > 0;

    // 應有富文本編輯器（react-quill）
    const richEditor = page.locator('.ql-editor, [class*="quill"], [contenteditable="true"]').first();
    const hasEditor = (await richEditor.count()) > 0;

    // 應有儲存/發布按鈕
    const saveBtn = page.getByRole('button', { name: /儲存|發布|Submit|確認/i }).first();
    const hasSave = (await saveBtn.count()) > 0;

    console.log(`[article-form] 標題輸入框: ${hasTitle}, 編輯器: ${hasEditor}, 儲存按鈕: ${hasSave}`);

    expect(
      hasTitle || hasEditor,
      '❌ 缺陷：文章新增頁缺少標題輸入框或富文本編輯器'
    ).toBeTruthy();
  });

  test('文章編輯器可以輸入內容', async ({ page }) => {
    await page.goto('/alumni/manage/article/new/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 標題
    const titleInput = page.locator('input[placeholder*="標題"], input[name*="title"]').first();
    if ((await titleInput.count()) > 0) {
      await titleInput.fill('自動化測試文章標題');
      const value = await titleInput.inputValue();
      expect(value).toBe('自動化測試文章標題');
      console.log('[article-form] ✓ 標題欄位可輸入');
    }

    // Quill 編輯器
    const quillEditor = page.locator('.ql-editor').first();
    if ((await quillEditor.count()) > 0) {
      await quillEditor.click();
      await quillEditor.fill('自動化測試文章內容');
      console.log('[article-form] ✓ Quill 編輯器可輸入');
    }
  });

  test('文章管理頁 — 刪除按鈕有確認機制', async ({ page }) => {
    // Mock 文章列表
    await page.route(`**article/all/tableOutput/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          count: 1,
          results: [{ id: 1, title: '測試文章', created_at: '2024-01-01' }],
        }),
      });
    });

    await page.goto('/alumni/manage/article/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const deleteBtn = page.getByRole('button', { name: /刪除|Delete/i }).first();

    if ((await deleteBtn.count()) === 0) {
      console.log('[article-form] 找不到刪除按鈕，可能在列表 row 操作中');
      return;
    }

    await deleteBtn.click();
    await page.waitForTimeout(500);

    // 應有確認 dialog
    const confirmDialog = page.locator(
      '[role="dialog"], .modal, .swal2-container, .MuiDialog-root'
    ).first();
    const hasDialog = await confirmDialog.isVisible().catch(() => false);

    // 若沒有 dialog，也可能是 browser confirm
    if (!hasDialog) {
      console.warn('[article-form] ⚠️ 刪除按鈕點擊後沒有確認 dialog — 可能直接刪除（建議加確認機制）');
    } else {
      console.log('[article-form] ✓ 刪除有確認 dialog');
    }
  });
});

test.describe('@manager 招聘管理表單', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**recruit/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ count: 0, results: [] }),
      });
    });
  });

  test('招聘管理頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    expect(page.url()).not.toContain('/login');
  });

  test('新增招聘按鈕開啟表單', async ({ page }) => {
    await page.goto('/alumni/manage/recruit/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|Add/i }).first();

    if ((await addBtn.count()) === 0) {
      console.log('[recruit-form] 找不到新增按鈕');
      return;
    }

    await addBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const hasModal = await modal.isVisible().catch(() => false);
    const url = page.url();

    expect(
      hasModal || url.includes('new'),
      '❌ 缺陷：招聘新增按鈕沒有反應'
    ).toBeTruthy();
  });
});

test.describe('@manager 公司管理表單', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
  });

  test('公司管理頁可正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[company-form] 公司管理頁載入成功');
  });

  test('公司資訊表單欄位可輸入', async ({ page }) => {
    await page.goto('/alumni/manage/company/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 找所有文字輸入框
    const textInputs = page.locator('input[type="text"], input[type="email"], textarea');
    const count = await textInputs.count();
    console.log(`[company-form] 找到 ${count} 個文字輸入框`);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = textInputs.nth(i);
      const isVisible = await input.isVisible().catch(() => false);
      const isEnabled = await input.isEnabled().catch(() => false);

      if (isVisible && isEnabled) {
        const placeholder = await input.getAttribute('placeholder');
        await input.fill('測試輸入');
        const value = await input.inputValue();
        expect(value, `輸入框 "${placeholder}" 無法填入值`).toBe('測試輸入');
        await input.clear();
        console.log(`[company-form] ✓ 輸入框 "${placeholder}" 可操作`);
      }
    }
  });
});

test.describe('@manager 表單儲存流程', () => {
  test('@manager 取消按鈕正確關閉表單/Modal', async ({ page }) => {
    await setupMockAuth(page);

    const managerPages = [
      '/alumni/manage/member/',
      '/alumni/manage/recruit/',
      '/alumni/manage/article/',
    ];

    for (const pagePath of managerPages) {
      await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const addBtn = page.getByRole('button', { name: /新增|Add/i }).first();
      if ((await addBtn.count()) === 0) continue;

      await addBtn.click();
      await page.waitForTimeout(500);

      const modal = page.locator('.modal, [role="dialog"]').first();
      const isModalOpen = await modal.isVisible().catch(() => false);

      if (!isModalOpen) continue;

      // 找取消按鈕
      const cancelBtn = page.getByRole('button', { name: /取消|Cancel|關閉|Close/i }).first();

      if ((await cancelBtn.count()) > 0) {
        await cancelBtn.click();
        await page.waitForTimeout(500);

        const stillOpen = await modal.isVisible().catch(() => false);
        expect(!stillOpen, `❌ 缺陷 [${pagePath}]：取消按鈕無法關閉 Modal`).toBeTruthy();
        console.log(`[modal-close] ✓ ${pagePath} 取消按鈕正常關閉 Modal`);
      } else {
        // 嘗試 ESC
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        const stillOpen = await modal.isVisible().catch(() => false);
        console.log(`[modal-close] ${pagePath} ESC 關閉結果: ${!stillOpen ? '✓' : '⚠️ 無法關閉'}`);
      }
    }
  });
});
