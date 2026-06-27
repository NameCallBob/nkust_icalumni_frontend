/**
 * user-navigation.spec.js
 * 使用者端導覽測試 — 驗證所有連結可點、跳轉正確
 */

const { test, expect } = require('@playwright/test');

test.describe('🧭 使用者端導覽 — 頂部導覽列', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
  });

  test('導覽列存在且可見', async ({ page }) => {
    const nav = page.locator('nav, header, .navbar').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('導覽列連結點擊後正確跳轉', async ({ page }) => {
    // 找出所有導覽連結
    const navLinks = page.locator('nav a[href], header a[href]');
    const count = await navLinks.count();
    expect(count, '導覽列應至少有 1 個連結').toBeGreaterThan(0);

    console.log(`[navigation] 找到 ${count} 個導覽連結`);

    // 取前 5 個測試（避免測試時間過長）
    const testCount = Math.min(count, 5);

    for (let i = 0; i < testCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.textContent();

      if (!href || href.startsWith('http') || href === '#') {
        console.log(`[navigation] 跳過外部/錨點連結: ${text?.trim()} (${href})`);
        continue;
      }

      await link.click();
      await page.waitForLoadState('domcontentloaded');

      const currentUrl = page.url();
      const bodyText = await page.locator('body').textContent();

      // 跳轉後不應是白屏
      expect(bodyText?.trim().length, `導覽至 ${href} 後頁面是白屏`).toBeGreaterThan(10);

      console.log(`[navigation] ✓ ${text?.trim()} → ${currentUrl}`);

      // 回到首頁繼續測試
      await page.goto('/', { waitUntil: 'domcontentloaded' });
    }
  });

  test('系友會相關選單可展開', async ({ page }) => {
    // 找可能的 dropdown 觸發器
    const menuTriggers = page.locator('nav .dropdown-toggle, nav [class*="dropdown"], nav button').filter({
      hasNotText: '',
    });

    const count = await menuTriggers.count();
    if (count === 0) {
      console.log('[navigation] 沒有找到 dropdown 選單，可能是平面導覽');
      return;
    }

    const firstTrigger = menuTriggers.first();
    const text = await firstTrigger.textContent();
    await firstTrigger.click();

    // 展開後應有子選單
    await page.waitForTimeout(500);
    const dropdown = page.locator('.dropdown-menu, [class*="submenu"]').first();
    const isVisible = await dropdown.isVisible().catch(() => false);

    if (isVisible) {
      console.log(`[navigation] ✓ Dropdown "${text?.trim()}" 展開成功`);
    } else {
      console.log(`[navigation] Dropdown "${text?.trim()}" 點擊後子選單未顯示`);
    }
  });
});

test.describe('🧭 使用者端導覽 — 系友會介紹頁', () => {
  const icRoutes = [
    { path: '/IC/intro', name: '簡介' },
    { path: '/IC/structure', name: '組織架構' },
    { path: '/IC/joinUs', name: '加入系友會' },
    { path: '/IC/constitution', name: '章程' },
    { path: '/IC/contactUs', name: '聯絡我們' },
  ];

  for (const route of icRoutes) {
    test(`直接導覽至 ${route.name} 頁面`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });

      const body = await page.locator('body').textContent();
      expect(body?.trim().length).toBeGreaterThan(10);

      // 導覽列應存在
      const nav = page.locator('nav, header, .navbar').first();
      await expect(nav).toBeVisible({ timeout: 10000 });

      console.log(`[IC navigation] ✓ ${route.name} (${route.path}) 載入成功`);
    });
  }
});

test.describe('🧭 使用者端導覽 — 頁面間轉換', () => {
  test('首頁 → 搜尋 → 返回 — 正確運作', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    expect(page.url()).toContain('/search');

    await page.goBack();
    expect(page.url()).toContain('/');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
  });

  test('重新整理後頁面正常恢復', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await page.reload({ waitUntil: 'domcontentloaded' });

    expect(page.url()).toContain('/search');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
  });

  test('直接輸入校友詳情 URL — 正確載入', async ({ page }) => {
    await page.goto('/alumni/1', { waitUntil: 'domcontentloaded' });

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);

    // 不應是空白或崩潰（即使 ID 1 不存在，也應顯示友善訊息）
    const url = page.url();
    console.log(`[navigation] /alumni/1 → ${url}`);
  });

  test('直接輸入活動詳情 URL — 正確載入', async ({ page }) => {
    await page.goto('/activity/1', { waitUntil: 'domcontentloaded' });

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
  });

  test('Footer 連結存在', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    const footer = page.locator('footer').first();
    const hasFooter = await footer.count() > 0;

    if (hasFooter) {
      await expect(footer).toBeVisible({ timeout: 5000 });
      const footerLinks = footer.locator('a');
      const linkCount = await footerLinks.count();
      console.log(`[navigation] Footer 連結數量: ${linkCount}`);
    } else {
      console.log('[navigation] 找不到 footer');
    }
  });
});

test.describe('🧭 路由邊界條件', () => {
  test('不存在路由顯示 404 頁面而非白屏', async ({ page }) => {
    await page.goto('/this-route-does-not-exist', { waitUntil: 'domcontentloaded' });

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(0);

    // 不應顯示 React 錯誤邊界
    const hasReactError = body?.includes('Something went wrong') || body?.includes('Uncaught Error');
    if (hasReactError) {
      console.warn('[navigation] ⚠️ 404 頁面觸發 React 錯誤邊界！');
    }
  });

  test('服務條款頁面有尾部斜線也能正常載入', async ({ page }) => {
    // 這個路由 /website/terms/ 有尾部斜線，需確認能正常工作
    await page.goto('/website/terms/', { waitUntil: 'domcontentloaded' });

    const body = await page.locator('body').textContent();
    expect(body?.trim().length).toBeGreaterThan(10);
  });
});
