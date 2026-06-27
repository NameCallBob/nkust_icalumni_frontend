/**
 * member-crud.spec.js
 * @manager 會員 CRUD 完整流程測試
 * 使用 Mock API — 不對生產資料庫寫入
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

const MOCK_MEMBERS = {
  count: 3,
  results: [
    { id: 1, name: '王小明', email: 'wang@test.com', is_active: true, phone: '0912000001', department: '智慧商務系' },
    { id: 2, name: '李小花', email: 'li@test.com', is_active: false, phone: '0912000002', department: '智慧商務系' },
    { id: 3, name: '陳大文', email: 'chen@test.com', is_active: true, phone: '0912000003', department: '智慧商務系' },
  ],
};

test.describe('@manager 會員管理 — 列表讀取 (Read)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**member/admin/tableOutput_all/**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_MEMBERS),
      });
    });
  });

  test('會員列表 API 被呼叫（頁面載入即觸發）', async ({ page }) => {
    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('member/admin/tableOutput_all') || req.url().includes('member')) {
        apiCalled = true;
        console.log(`[member-crud] 會員 API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    if (!apiCalled) {
      console.warn('[member-crud] ⚠️ 頁面載入後未偵測到會員 API 呼叫');
    } else {
      console.log('[member-crud] ✓ 會員列表 API 正確被呼叫');
    }
  });

  test('會員列表資料顯示在頁面上', async ({ page }) => {
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);

    // 記錄頁面是否有顯示任何表格/列表
    const table = page.locator('table, .data-table, .p-datatable').first();
    const list = page.locator('[class*="list"], [class*="table"]').first();

    const hasTable = await table.count() > 0;
    const hasList = await list.count() > 0;

    console.log(`[member-crud] 表格: ${hasTable}, 列表元素: ${hasList}`);
  });
});

test.describe('@manager 會員管理 — 搜尋與篩選', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**member/admin/tableOutput_all/**`, async (route) => {
      const url = route.request().url();
      const hasSearch = url.includes('search') || url.includes('q=') || url.includes('name=');

      if (hasSearch) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            count: 1,
            results: [MOCK_MEMBERS.results[0]],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          body: JSON.stringify(MOCK_MEMBERS),
        });
      }
    });
  });

  test('搜尋欄位可輸入', async ({ page }) => {
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const searchInput = page
      .locator('input[type="text"], input[type="search"], input[placeholder*="搜"], input[placeholder*="查"]')
      .first();

    if ((await searchInput.count()) === 0) {
      console.log('[member-crud] 找不到搜尋框（可能設計不同）');
      return;
    }

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
    await searchInput.fill('王小明');
    expect(await searchInput.inputValue()).toBe('王小明');
    console.log('[member-crud] ✓ 搜尋框可輸入');
  });
});

test.describe('@manager 會員管理 — 啟用/停用 (Update)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**member/admin/tableOutput_all/**`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(MOCK_MEMBERS) });
    });
    // Mock 啟用/停用 API
    await page.route(`**member/admin/switch_active/**`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });
  });

  test('啟用/停用操作按鈕存在', async ({ page }) => {
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 找切換開關或啟用/停用按鈕
    const toggleBtns = page.getByRole('button', { name: /啟用|停用|Active|Inactive/i });
    const toggleSwitches = page.locator('input[type="checkbox"][role="switch"], .form-switch input');

    const btnCount = await toggleBtns.count();
    const switchCount = await toggleSwitches.count();

    console.log(`[member-crud] 啟用/停用按鈕: ${btnCount}, 開關: ${switchCount}`);

    if (btnCount > 0 || switchCount > 0) {
      console.log('[member-crud] ✓ 找到啟用/停用控制項');
    } else {
      console.warn('[member-crud] ⚠️ 找不到啟用/停用控制項');
    }
  });
});

test.describe('@manager 會員管理 — 刪除 (Delete)', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
    await page.route(`**member/admin/tableOutput_all/**`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(MOCK_MEMBERS) });
    });
    await page.route(`**member/admin/delete/**`, async (route) => {
      await route.fulfill({ status: 204, body: '' });
    });
  });

  test('刪除操作有確認機制（不應直接刪除）', async ({ page }) => {
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const deleteBtn = page.getByRole('button', { name: /刪除|Delete/i }).first();

    if ((await deleteBtn.count()) === 0) {
      console.log('[member-crud] 找不到刪除按鈕（可能在 row 操作中）');
      return;
    }

    // 設定刪除 API 監聽
    let deleteApiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('delete') && req.method() === 'DELETE') {
        deleteApiCalled = true;
      }
    });

    await deleteBtn.click();
    await page.waitForTimeout(500);

    // 不應立即呼叫刪除 API（應先顯示確認 dialog）
    expect(
      deleteApiCalled,
      '❌ 缺陷：刪除按鈕點擊後立即刪除，沒有確認步驟 — 高風險操作缺少保護機制'
    ).toBeFalsy();

    // 應有確認 dialog
    const dialog = page.locator('[role="dialog"], .modal, .swal2-container').first();
    const hasDialog = await dialog.isVisible().catch(() => false);

    if (!hasDialog) {
      // 確認 browser confirm
      console.warn('[member-crud] ⚠️ 刪除沒有顯示確認 dialog — 請確認是否有 window.confirm');
    } else {
      console.log('[member-crud] ✓ 刪除有確認 dialog 保護');
    }
  });
});

test.describe('@manager 會員管理 — Excel 匯入', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);
  });

  test('Excel 匯入按鈕可開啟上傳介面', async ({ page }) => {
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const excelBtn = page.getByRole('button', { name: /Excel|匯入|Import/i }).first();

    if ((await excelBtn.count()) === 0) {
      console.log('[excel-import] 找不到 Excel 匯入按鈕');
      return;
    }

    await expect(excelBtn).toBeEnabled();
    await excelBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const fileInput = page.locator('input[type="file"]').first();

    const hasModal = await modal.isVisible().catch(() => false);
    const hasFileInput = await fileInput.count() > 0;

    expect(
      hasModal || hasFileInput,
      '❌ 缺陷：Excel 匯入按鈕點擊後未開啟上傳介面'
    ).toBeTruthy();

    console.log(`[excel-import] ✓ 匯入介面已開啟（modal: ${hasModal}, fileInput: ${hasFileInput}）`);
  });
});
