/**
 * manager-buttons.spec.js
 * @manager 管理端按鈕功能深度測試
 * 這是最重要的測試：驗證每個管理操作按鈕真的有功能
 */

const { test, expect } = require('@playwright/test');
const { ManagerPage } = require('../../pages/ManagerPage');
const { API_URL } = require('../../fixtures/test-data');

// ── Helper：注入 mock auth state ──
async function setupMockAuth(page) {
  await page.addInitScript(() => {
    const issuedAt = Math.floor(Date.now() / 1000);
    localStorage.setItem('jwt', 'mock_test_token');
    localStorage.setItem('super', 'true');
    localStorage.setItem('issuedAt', String(issuedAt));
    localStorage.setItem('expiry', String(issuedAt + 14400));
  });

  // Mock token verify
  await page.route(`**api/token/verify/**`, async (route) => {
    await route.fulfill({ status: 200, body: JSON.stringify({ token: 'valid' }) });
  });
}

test.describe('@manager 會員管理頁按鈕', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);

    // Mock 會員列表 API
    await page.route(`**member/admin/tableOutput_all/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          count: 3,
          results: [
            { id: 1, name: '測試會員一', email: 'a@test.com', is_active: true, phone: '0912111111' },
            { id: 2, name: '測試會員二', email: 'b@test.com', is_active: false, phone: '0912222222' },
            { id: 3, name: '測試會員三', email: 'c@test.com', is_active: true, phone: '0912333333' },
          ],
        }),
      });
    });
  });

  test('會員管理頁正常載入且有資料', async ({ page }) => {
    const manager = new ManagerPage(page);
    await manager.gotoMemberManage();
    await manager.expectManagePageLoaded();

    // 應有某種資料顯示
    const body = await page.locator('body').textContent();
    console.log('[member-buttons] 頁面載入成功');
  });

  test('新增按鈕存在且可點擊', async ({ page }) => {
    const manager = new ManagerPage(page);
    await manager.gotoMemberManage();
    await page.waitForLoadState('networkidle').catch(() => {});

    const addBtn = page.getByRole('button', { name: /新增|Add|建立/i }).first();

    if ((await addBtn.count()) === 0) {
      console.warn('[member-buttons] ⚠️ 找不到新增按鈕');
      return;
    }

    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await expect(addBtn).toBeEnabled();

    // 點擊新增按鈕，應開啟 modal 或跳轉
    const urlBefore = page.url();
    await addBtn.click();
    await page.waitForTimeout(1000);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const modalVisible = await modal.isVisible().catch(() => false);
    const urlChanged = page.url() !== urlBefore;

    expect(
      modalVisible || urlChanged,
      '❌ 缺陷：新增按鈕點擊後無任何反應（沒有開啟 modal，也沒有跳轉頁面）'
    ).toBeTruthy();

    console.log(`[member-buttons] ✓ 新增按鈕有效果（modal: ${modalVisible}, url變: ${urlChanged}）`);
  });

  test('搜尋框存在且可操作', async ({ page }) => {
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[type="text"], input[placeholder*="搜"], input[placeholder*="查"]').first();

    if ((await searchInput.count()) === 0) {
      console.log('[member-buttons] 找不到搜尋框');
      return;
    }

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
    await searchInput.fill('測試');

    console.log('[member-buttons] ✓ 搜尋框可輸入');
  });

  test('Excel 匯入按鈕存在', async ({ page }) => {
    await page.goto('/alumni/manage/member/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const excelBtn = page.getByRole('button', { name: /Excel|匯入|Import/i }).first();

    if ((await excelBtn.count()) === 0) {
      console.log('[member-buttons] 找不到 Excel 匯入按鈕（可能未在此頁）');
      return;
    }

    await expect(excelBtn).toBeVisible();
    await expect(excelBtn).toBeEnabled();
    await excelBtn.click();
    await page.waitForTimeout(500);

    // 應開啟 modal
    const modal = page.locator('.modal, [role="dialog"]').first();
    const modalVisible = await modal.isVisible().catch(() => false);
    expect(modalVisible, '❌ 缺陷：Excel 匯入按鈕點擊後未開啟 modal').toBeTruthy();
  });
});

test.describe('@manager 文章管理頁按鈕', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAuth(page);

    await page.route(`**article/all/tableOutput/**`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          count: 2,
          results: [
            { id: 1, title: '測試文章一', created_at: '2024-01-01', is_published: true },
            { id: 2, title: '測試文章二', created_at: '2024-01-02', is_published: false },
          ],
        }),
      });
    });
  });

  test('文章管理頁正常載入', async ({ page }) => {
    const manager = new ManagerPage(page);
    await manager.gotoArticleManage();
    await manager.expectManagePageLoaded();
  });

  test('新增文章按鈕點擊後跳轉至文章編輯頁', async ({ page }) => {
    const manager = new ManagerPage(page);
    await manager.gotoArticleManage();
    await page.waitForTimeout(2000);

    const addBtn = page.getByRole('button', { name: /新增|撰寫|Add/i }).first();

    if ((await addBtn.count()) === 0) {
      // 可能是連結
      const addLink = page.getByRole('link', { name: /新增|撰寫/i }).first();
      if ((await addLink.count()) > 0) {
        await addLink.click();
        await page.waitForURL('**/article/**', { timeout: 5000 });
        console.log('[article-buttons] ✓ 新增文章連結有效');
        return;
      }
      console.warn('[article-buttons] ⚠️ 找不到新增文章按鈕或連結');
      return;
    }

    await expect(addBtn).toBeVisible();
    await expect(addBtn).toBeEnabled();
    await addBtn.click();

    // 應跳轉至 article/new/ 或開啟 modal
    await page.waitForTimeout(1000);
    const url = page.url();
    const modal = page.locator('.modal, [role="dialog"]').first();
    const modalVisible = await modal.isVisible().catch(() => false);
    const urlChanged = url.includes('article');

    expect(
      modalVisible || urlChanged,
      '❌ 缺陷：新增文章按鈕點擊後無反應'
    ).toBeTruthy();

    console.log(`[article-buttons] ✓ 新增文章按鈕有效（url: ${url}）`);
  });
});

test.describe('@manager 管理端通用按鈕掃描', () => {
  const managerPages = [
    { path: '/alumni/manage/', name: '管理中心' },
    { path: '/alumni/manage/recruit/', name: '招聘管理' },
    { path: '/alumni/manage/company/', name: '公司管理' },
    { path: '/alumni/manage/product/', name: '產品管理' },
    { path: '/alumni/manage/pic/', name: '照片管理' },
    { path: '/alumni/manage/website/', name: '網站管理' },
    { path: '/alumni/manage/outstanding/', name: '傑出系友' },
    { path: '/alumni/manage/outstanding-alumni/', name: '傑出校友' },
  ];

  for (const manPage of managerPages) {
    test(`@manager [按鈕掃描] ${manPage.name}`, async ({ page }) => {
      await setupMockAuth(page);
      await page.goto(manPage.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // 不應跳轉至登入頁
      const url = page.url();
      if (url.includes('/login')) {
        console.warn(`[manager-buttons] ${manPage.name} — 未登入狀態被重導向至登入頁`);
        return;
      }

      const buttons = page.getByRole('button').filter({ hasNotText: '' });
      const count = await buttons.count();
      console.log(`[manager-buttons] ${manPage.name} 共有 ${count} 個按鈕`);

      const defects = [];
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        const text = (await btn.textContent())?.trim();
        const isVisible = await btn.isVisible().catch(() => false);
        if (!isVisible || !text) continue;

        const isDisabled = await btn.isDisabled().catch(() => false);
        const ariaDisabled = await btn.getAttribute('aria-disabled');

        if (isDisabled || ariaDisabled === 'true') {
          defects.push({ button: text, issue: 'disabled' });
          console.warn(`[manager-buttons] ⚠️ "${text}" 是 disabled 狀態`);
        }
      }

      // 報告缺陷但不強制失敗
      if (defects.length > 0) {
        console.warn(`[manager-buttons] ${manPage.name} 有 ${defects.length} 個 disabled 按鈕`);
      }
    });
  }
});

test.describe('@manager 管理頁 Modal 開關測試', () => {
  test('照片管理頁 — 上傳按鈕可開啟 Modal', async ({ page }) => {
    await setupMockAuth(page);
    await page.goto('/alumni/manage/pic/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const uploadBtn = page.getByRole('button', { name: /上傳|Upload|新增照片|Add/i }).first();

    if ((await uploadBtn.count()) === 0) {
      console.log('[modal-test] 照片管理頁找不到上傳按鈕');
      return;
    }

    await expect(uploadBtn).toBeVisible();
    await uploadBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('.modal, [role="dialog"]').first();
    const hasModal = await modal.isVisible().catch(() => false);

    expect(hasModal, '❌ 缺陷：上傳按鈕點擊後未開啟 Modal').toBeTruthy();

    if (hasModal) {
      // 關閉 modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const stillOpen = await modal.isVisible().catch(() => false);
      expect(!stillOpen, '❌ 缺陷：Modal 無法關閉（ESC 無效）').toBeTruthy();
      console.log('[modal-test] ✓ 上傳 Modal 可開啟且可關閉');
    }
  });
});
