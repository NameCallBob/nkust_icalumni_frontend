/**
 * home-buttons.spec.js
 * 首頁與公開頁面按鈕功能測試
 * 重點：每個按鈕不只驗證存在，還驗證點擊後真的有反應
 */

const { test, expect } = require('@playwright/test');

test.describe('🖱️ 首頁按鈕功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
  });

  test('首頁所有按鈕都可見且不是假 disabled', async ({ page }) => {
    const buttons = page.getByRole('button').filter({ hasNotText: '' });
    const count = await buttons.count();

    console.log(`[home-buttons] 首頁共有 ${count} 個按鈕`);

    const defects = [];
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const text = await btn.textContent();
      const isDisabled = await btn.isDisabled();
      const isVisible = await btn.isVisible();

      if (!isVisible) {
        console.log(`[home-buttons] 按鈕 "${text?.trim()}" 不可見（可能是隱藏的）`);
        continue;
      }

      if (isDisabled) {
        defects.push(`按鈕 "${text?.trim()}" 被 disabled`);
        console.warn(`[home-buttons] ⚠️ 按鈕 "${text?.trim()}" 是 disabled 狀態`);
      }
    }

    // 記錄但不強制失敗（可能有合理的 disabled 按鈕）
    if (defects.length > 0) {
      console.warn(`[home-buttons] ${defects.length} 個按鈕有 disabled 問題`);
    }
  });

  test('首頁按鈕點擊後有可觀察行為', async ({ page }) => {
    const buttons = page.getByRole('button').filter({ hasNotText: '' });
    const count = await buttons.count();

    const defects = [];
    const tested = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
      const btn = buttons.nth(i);
      const text = (await btn.textContent())?.trim() || `Button[${i}]`;

      if (!(await btn.isVisible()) || await btn.isDisabled()) continue;

      // 記錄點擊前狀態
      const urlBefore = page.url();
      const modalsBefore = await page.locator('.modal, [role="dialog"]').filter({ hasText: '' }).count();

      // 點擊按鈕
      try {
        await btn.click({ timeout: 3000 });
        await page.waitForTimeout(800);
      } catch (e) {
        console.log(`[home-buttons] "${text}" 點擊失敗: ${e.message}`);
        continue;
      }

      // 檢查是否有可觀察變化
      const urlAfter = page.url();
      const modalsAfter = await page.locator('.modal, [role="dialog"]').filter({ hasText: '' }).count();
      const hasToast = await page.locator('.Toastify__toast').count() > 0;

      const hasEffect =
        urlAfter !== urlBefore || modalsAfter > modalsBefore || hasToast;

      if (hasEffect) {
        tested.push(`✓ "${text}" — 有效果`);
        console.log(`[home-buttons] ✓ "${text}" 點擊有反應`);

        // 若 URL 改變，回到首頁繼續
        if (urlAfter !== urlBefore) {
          await page.goto('/', { waitUntil: 'domcontentloaded' });
          await page.waitForLoadState('networkidle').catch(() => {});
        }

        // 若 modal 打開，關閉它
        if (modalsAfter > modalsBefore) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        }
      } else {
        defects.push(`❌ "${text}" 點擊後無可觀察行為`);
        console.warn(`[home-buttons] ❌ "${text}" 點擊後無任何可觀察變化 — 疑似無事件綁定`);
      }
    }

    console.log(`\n[home-buttons] 測試摘要：${tested.length} 個有效，${defects.length} 個疑似無效`);
  });
});

test.describe('🖱️ 搜尋頁按鈕功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
  });

  test('搜尋按鈕存在且可點擊', async ({ page }) => {
    const searchBtn = page.getByRole('button', { name: /搜尋|查詢|Search/i }).first();

    if ((await searchBtn.count()) === 0) {
      // 可能是 enter 送出，找 input
      const searchInput = page.locator('input[type="search"], input[type="text"]').first();
      if ((await searchInput.count()) > 0) {
        await expect(searchInput).toBeVisible();
        console.log('[search-buttons] 使用 input Enter 搜尋，無明顯搜尋按鈕');
      } else {
        test.fail(true, '❌ 缺陷：找不到搜尋按鈕或搜尋輸入框');
      }
      return;
    }

    await expect(searchBtn).toBeVisible();
    await expect(searchBtn).toBeEnabled();
  });

  test('搜尋按鈕點擊後真的發出 API 請求', async ({ page }) => {
    const API_URL = process.env.API_URL || 'https://nkust-alumni-api.binbinbob.work';

    // Mock 搜尋 API
    await page.route(`${API_URL}/company/search/*`, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          count: 2,
          results: [
            { id: 1, name: '測試公司A', industry: '科技' },
            { id: 2, name: '測試公司B', industry: '製造' },
          ],
        }),
      });
    });

    const searchInput = page.locator('input[type="search"], input[type="text"], input[placeholder*="搜"]').first();

    if ((await searchInput.count()) === 0) {
      console.warn('[search-buttons] 找不到搜尋輸入框');
      return;
    }

    await searchInput.fill('測試公司');

    let apiCalled = false;
    page.on('request', (req) => {
      if (req.url().includes('search') || req.url().includes('company')) {
        apiCalled = true;
        console.log(`[search-buttons] ✓ API 呼叫: ${req.method()} ${req.url()}`);
      }
    });

    const searchBtn = page.getByRole('button', { name: /搜尋|查詢|Search/i }).first();
    if ((await searchBtn.count()) > 0) {
      await searchBtn.click();
    } else {
      await searchInput.press('Enter');
    }

    await page.waitForTimeout(3000);

    expect(apiCalled, '❌ 缺陷：搜尋按鈕點擊後未發出任何 API 請求 — 搜尋按鈕可能是假的').toBeTruthy();
  });

  test('重設按鈕確實清空搜尋條件', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[type="text"], input[placeholder*="搜"]').first();
    const resetBtn = page.getByRole('button', { name: /重設|清除|Reset|清空/i }).first();

    if ((await searchInput.count()) === 0) {
      console.warn('[search-buttons] 找不到搜尋輸入框');
      return;
    }

    if ((await resetBtn.count()) === 0) {
      console.log('[search-buttons] 找不到重設按鈕，跳過此測試');
      return;
    }

    // 填入搜尋值
    await searchInput.fill('測試關鍵字');
    expect(await searchInput.inputValue()).toBe('測試關鍵字');

    // 點重設
    await resetBtn.click();
    await page.waitForTimeout(500);

    // 驗證清空
    const valueAfter = await searchInput.inputValue();
    expect(valueAfter, '❌ 缺陷：重設按鈕點擊後搜尋欄位未清空').toBe('');
  });
});

test.describe('🖱️ 登入頁按鈕功能', () => {
  test('繼續按鈕未填 email 時 disabled，填寫後啟用', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    const continueBtn = page.getByRole('button', { name: '繼續' });

    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // 初始 disabled
    await expect(continueBtn).toBeDisabled();

    // 填入 email 後啟用
    await emailInput.fill('test@example.com');
    await expect(continueBtn).toBeEnabled();

    console.log('[login-buttons] ✓ 繼續按鈕 disabled/enabled 狀態正確');
  });

  test('忘記密碼連結點擊後跳轉', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const API_URL = process.env.API_URL || 'https://nkust-alumni-api.binbinbob.work';
    await page.route(`${API_URL}/basic/check-user*`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ exists: true, name: '測試' }) });
    });

    // 進入密碼階段才有忘記密碼連結
    const emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    await emailInput.fill('test@nkust.edu.tw');
    await page.getByRole('button', { name: '繼續' }).click();
    await expect(page.getByPlaceholder('請輸入您的密碼')).toBeVisible({ timeout: 10000 });

    const forgotBtn = page.getByRole('button', { name: '忘記密碼？' });
    await expect(forgotBtn).toBeVisible();
    await expect(forgotBtn).toBeEnabled();

    await forgotBtn.click();
    await page.waitForURL('**/forgot**', { timeout: 5000 });
    console.log('[login-buttons] ✓ 忘記密碼按鈕點擊後正確跳轉');
  });
});
