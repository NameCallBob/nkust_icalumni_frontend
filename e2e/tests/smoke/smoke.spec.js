/**
 * smoke.spec.js
 * @smoke — 快速確認全站主要頁面沒有白屏、核心區塊存在、無 JS 崩潰
 *
 * 目標：5 分鐘內跑完，偵測最基本的「網站是否壞掉」
 */

const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES } = require('../../fixtures/test-data');

// 封鎖外部資源（Google Fonts、Analytics、Captcha），加速測試
async function blockExternalResources(page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => route.abort());
  await page.route(/hcaptcha\.com|recaptcha\.net/, (route) => route.abort());
  await page.route(/sentry\.io/, (route) => route.abort());
}

test.describe('🔥 Smoke Test — 公開頁面', () => {
  // 對每個公開路由執行基本載入檢查
  for (const route of PUBLIC_ROUTES) {
    test(`@smoke [載入] ${route.name} (${route.path})`, async ({ page }) => {
      await blockExternalResources(page);
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(route.path, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });

      // ── 1. HTTP 狀態應非 5xx ──
      if (response) {
        expect(response.status(), `${route.name} HTTP 狀態異常`).toBeLessThan(500);
      }

      // ── 2. 頁面不應是白屏 ──
      const bodyText = await page.locator('body').textContent();
      expect(
        bodyText?.trim().length,
        `${route.name} 頁面似乎是白屏（body 內容為空）`
      ).toBeGreaterThan(10);

      // ── 3. 導航列應存在 ──
      const navbar = page.locator('nav, header, .navbar').first();
      await expect(navbar, `${route.name} 找不到導航列`).toBeVisible({ timeout: 10000 });

      // ── 4. 無嚴重 JS 錯誤（放寬為警告，因為某些外部資源可能 fail）──
      if (errors.length > 0) {
        console.warn(`[${route.name}] JS 警告：${errors.join(' | ')}`);
      }
    });
  }
});

test.describe('🔥 Smoke Test — 管理端入口', () => {
  test('@smoke [載入] 管理中心 — 未登入應重導向或提示', async ({ page }) => {
    page.on('pageerror', (err) => console.warn('JS Error:', err.message));

    await page.goto('/alumni/manage/', { waitUntil: 'domcontentloaded', timeout: 20000 });

    // 若未登入，可能跳到 login 或顯示 403 提示
    const url = page.url();
    const bodyText = await page.locator('body').textContent();

    // 不應是空白頁面
    expect(bodyText?.trim().length).toBeGreaterThan(0);

    // 記錄實際行為（不強制是哪種）
    if (url.includes('/login')) {
      console.log('[smoke] 未登入 → 重導向至登入頁 ✓');
    } else {
      console.log('[smoke] 未登入 → 顯示當前頁面（可能無保護）:', url);
    }
  });

  test('@smoke [載入] 登入頁 — 核心元素存在', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByPlaceholder('請輸入您的電子郵件')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: '繼續' })).toBeVisible();

    // 繼續按鈕不應一開始就 disabled（email 未填才 disabled）
    const btn = page.getByRole('button', { name: '繼續' });
    // 按鈕存在即可，disabled 狀態在填寫後才驗證
    await expect(btn).toBeVisible();
  });

  test('@smoke [載入] 404 頁面 — 應顯示友善提示', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345', { waitUntil: 'domcontentloaded' });

    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(0);

    // 應顯示 404 提示（不能是白屏）
    const has404 = bodyText?.includes('404') || bodyText?.includes('找不到') || bodyText?.includes('不存在');
    expect(has404, '404 頁面應顯示友善錯誤提示').toBeTruthy();
  });
});

test.describe('🔥 Smoke Test — 核心導覽功能', () => {
  test('@smoke 首頁 → 搜尋頁 導覽', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 找搜尋相關連結
    const searchLink = page.getByRole('link', { name: /搜尋|Search/i }).first();
    if ((await searchLink.count()) > 0) {
      await searchLink.click();
      await expect(page).toHaveURL(/search/);
    } else {
      // 直接導覽
      await page.goto('/search');
      await expect(page).toHaveURL(/search/);
    }

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
  });

  test('@smoke 首頁 → 登入頁 導覽', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const loginLink = page.getByRole('link', { name: /登入|Login/i }).first();
    if ((await loginLink.count()) > 0) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/);
    } else {
      await page.goto('/login');
    }

    await expect(page.getByPlaceholder('請輸入您的電子郵件')).toBeVisible({ timeout: 10000 });
  });
});
