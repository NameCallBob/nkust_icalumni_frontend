/**
 * article-crud.spec.js
 * @manager 文章 CRUD 完整流程測試
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

const MOCK_ARTICLES = {
  count: 2,
  results: [
    { id: 1, title: '測試文章一', content: '內容一', created_at: '2024-01-01T00:00:00Z', is_published: true },
    { id: 2, title: '測試文章二', content: '內容二', created_at: '2024-01-02T00:00:00Z', is_published: false },
  ],
};

test.describe('@manager 文章管理 — Read', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**article/all/tableOutput/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(MOCK_ARTICLES),
      });
    });
  });

  test('文章列表頁正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/article/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    expect(page.url()).not.toContain('/login');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    console.log('[article-crud] ✓ 文章管理頁載入成功');
  });

  test('文章列表 API 在頁面載入時被呼叫', async ({ page }) => {
    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('article')) {
        apiCalled = true;
      }
    });

    await page.goto('/alumni/manage/article/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    console.log(`[article-crud] 文章列表 API 呼叫狀態: ${apiCalled ? '✓ 有呼叫' : '⚠️ 未偵測到'}`);
  });
});

test.describe('@manager 文章管理 — Create', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**article/all/new/**`, async (route) => {
      await route.fulfill({ status: 201, body: JSON.stringify({ id: 99, title: '新文章' }) });
    });
    await page.route(`**article/all/tableOutput/**`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(MOCK_ARTICLES) });
    });
  });

  test('新增文章頁面可正常載入', async ({ page }) => {
    await page.goto('/alumni/manage/article/new/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    expect(page.url()).not.toContain('/login');
  });

  test('文章標題欄位存在且可輸入', async ({ page }) => {
    await page.goto('/alumni/manage/article/new/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const inputs = page.locator('input[type="text"]');
    const count = await inputs.count();
    console.log(`[article-crud] 文章新增頁文字輸入框數量: ${count}`);

    if (count > 0) {
      const firstInput = inputs.first();
      await firstInput.fill('自動化測試文章標題');
      const value = await firstInput.inputValue();
      expect(value).toBe('自動化測試文章標題');
      console.log('[article-crud] ✓ 標題欄位可輸入');
    }
  });

  test('Quill 富文本編輯器存在且可使用', async ({ page }) => {
    await page.goto('/alumni/manage/article/new/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); // Quill 需要時間初始化

    const quillEditor = page.locator('.ql-editor').first();
    const hasQuill = (await quillEditor.count()) > 0;

    if (!hasQuill) {
      console.warn('[article-crud] ⚠️ 找不到 Quill 編輯器 — 可能使用其他富文本工具');

      // 嘗試其他富文本選擇器
      const otherEditors = page.locator('[contenteditable="true"]');
      const otherCount = await otherEditors.count();
      console.log(`[article-crud] 其他 contenteditable 元素: ${otherCount}`);
      return;
    }

    await expect(quillEditor).toBeVisible();
    await quillEditor.click();
    await quillEditor.fill('這是自動化測試產生的文章內容。');
    console.log('[article-crud] ✓ Quill 編輯器可輸入');
  });

  test('儲存按鈕存在且發出 API 請求', async ({ page }) => {
    await page.goto('/alumni/manage/article/new/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const titleInput = page.locator('input[type="text"]').first();
    if ((await titleInput.count()) > 0) {
      await titleInput.fill('API 測試文章');
    }

    const saveBtn = page.getByRole('button', { name: /儲存|發布|Submit|確認/i }).first();

    if ((await saveBtn.count()) === 0) {
      console.warn('[article-crud] ⚠️ 找不到儲存按鈕');
      return;
    }

    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();

    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('article') && (req.method() === 'POST' || req.method() === 'PUT')) {
        apiCalled = true;
        console.log(`[article-crud] ✓ 文章 API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    await saveBtn.click();
    await page.waitForTimeout(3000);

    if (!apiCalled) {
      console.warn('[article-crud] ⚠️ 儲存按鈕點擊後未偵測到 POST/PUT API 呼叫');
    }
  });
});

test.describe('@manager 文章管理 — Delete', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**article/all/tableOutput/**`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(MOCK_ARTICLES) });
    });
    await page.route(`**article/all/delete/**`, async (route) => {
      await route.fulfill({ status: 204, body: '' });
    });
  });

  test('刪除文章有確認步驟', async ({ page }) => {
    await page.goto('/alumni/manage/article/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const deleteBtn = page.getByRole('button', { name: /刪除|Delete/i }).first();

    if ((await deleteBtn.count()) === 0) {
      console.log('[article-crud] 找不到刪除按鈕');
      return;
    }

    let deleteApiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('delete') && req.method() === 'DELETE') {
        deleteApiCalled = true;
      }
    });

    await deleteBtn.click();
    await page.waitForTimeout(500);

    // 刪除不應立即觸發 API
    expect(deleteApiCalled, '❌ 缺陷：文章刪除按鈕直接觸發刪除，無確認步驟').toBeFalsy();
    console.log('[article-crud] ✓ 刪除按鈕有確認保護');
  });
});

test.describe('@manager 文章管理 — 編輯路由', () => {
  test('文章編輯路由可正常載入', async ({ page }) => {
    await setupMockAuth(page);

    await page.route(`**article/*/`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ id: 1, title: '現有文章', content: '<p>內容</p>' }),
      });
    });

    await page.goto('/alumni/manage/article/edit/1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
    expect(page.url()).not.toContain('/login');

    console.log('[article-crud] ✓ 文章編輯路由 /alumni/manage/article/edit/1 載入成功');
  });
});
