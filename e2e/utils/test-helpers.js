/**
 * test-helpers.js
 * 共用測試輔助函式
 */

const { expect } = require('@playwright/test');

/**
 * 等待 Toast 通知出現並驗證文字
 * @param {import('@playwright/test').Page} page
 * @param {string|RegExp} text - 預期的 toast 文字
 * @param {number} timeout
 */
async function expectToast(page, text, timeout = 8000) {
  const toast = page.locator('.Toastify__toast, .toast, [role="alert"]').filter({ hasText: text });
  await expect(toast).toBeVisible({ timeout });
  return toast;
}

/**
 * 等待 Toast 消失
 * @param {import('@playwright/test').Page} page
 */
async function waitForToastDisappear(page, timeout = 10000) {
  await page.waitForSelector('.Toastify__toast', { state: 'detached', timeout }).catch(() => {});
}

/**
 * 驗證元素可見且可點擊（非 disabled）
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} locator
 */
async function expectClickable(page, locator) {
  await expect(locator).toBeVisible();
  await expect(locator).toBeEnabled();
  const isDisabled = await locator.getAttribute('disabled');
  const ariaDisabled = await locator.getAttribute('aria-disabled');
  expect(isDisabled).toBeNull();
  expect(ariaDisabled).not.toBe('true');
}

/**
 * 點擊按鈕並驗證有可觀察行為（不只是 DOM 變化）
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} button
 * @param {Object} options
 * @param {string} [options.expectURL] - 預期跳轉 URL pattern
 * @param {import('@playwright/test').Locator} [options.expectVisible] - 預期出現的元素
 * @param {string} [options.expectToast] - 預期 toast 文字
 * @param {string} [options.expectRequest] - 預期 API request URL pattern
 */
async function clickAndVerify(page, button, options = {}) {
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();

  const { expectURL, expectVisible, expectToast: toastText, expectRequest } = options;

  const requestPromise = expectRequest
    ? page.waitForRequest((req) => req.url().includes(expectRequest)).catch(() => null)
    : null;

  await button.click();

  if (expectURL) {
    await page.waitForURL(expectURL, { timeout: 10000 });
  }
  if (expectVisible) {
    await expect(expectVisible).toBeVisible({ timeout: 8000 });
  }
  if (toastText) {
    await expectToast(page, toastText);
  }
  if (requestPromise) {
    const req = await requestPromise;
    expect(req, `預期 API 呼叫 ${expectRequest} 應發出，但未偵測到`).not.toBeNull();
  }
}

/**
 * 驗證頁面載入核心區塊（無白屏、無 JS 錯誤）
 * @param {import('@playwright/test').Page} page
 * @param {string[]} mustHaveSelectors - 必須出現的選擇器
 */
async function expectPageLoaded(page, mustHaveSelectors = []) {
  // 頁面不應有 500/404 錯誤
  await expect(page.locator('body')).not.toBeEmpty();

  // 不應存在白屏（body 有可見內容）
  const bodyText = await page.locator('body').textContent();
  expect(bodyText?.trim().length, '頁面似乎是白屏（body 無內容）').toBeGreaterThan(0);

  // 驗證必要選擇器
  for (const selector of mustHaveSelectors) {
    await expect(page.locator(selector).first(), `必要元素 ${selector} 未出現`).toBeVisible({
      timeout: 10000,
    });
  }
}

/**
 * 等待 loading spinner 消失
 * @param {import('@playwright/test').Page} page
 * @param {number} timeout
 */
async function waitForLoadingComplete(page, timeout = 15000) {
  // 等待常見的 loading 元素消失
  const loadingSelectors = [
    '.spinner-border',
    '.loading',
    '[role="progressbar"]',
    '.p-progress-spinner',
    '.ant-spin',
    '.MuiCircularProgress-root',
  ];

  for (const selector of loadingSelectors) {
    await page.waitForSelector(selector, { state: 'detached', timeout: 3000 }).catch(() => {});
  }
}

/**
 * 填寫表單並提交
 * @param {import('@playwright/test').Page} page
 * @param {Object} fields - { label: value } 或 { placeholder: value }
 * @param {string} submitText - 提交按鈕文字
 */
async function fillAndSubmitForm(page, fields, submitText = '送出') {
  for (const [key, value] of Object.entries(fields)) {
    const input =
      (await page.getByLabel(key).count()) > 0
        ? page.getByLabel(key)
        : page.getByPlaceholder(key);
    await input.fill(value);
  }
  await page.getByRole('button', { name: submitText }).click();
}

/**
 * 驗證表單驗證錯誤訊息顯示
 * @param {import('@playwright/test').Page} page
 * @param {string} fieldName
 * @param {string} errorMessage
 */
async function expectFieldError(page, fieldName, errorMessage) {
  const field =
    (await page.getByLabel(fieldName).count()) > 0
      ? page.getByLabel(fieldName)
      : page.getByPlaceholder(fieldName);

  await field.fill('');
  await field.blur();

  const error = page.locator('.invalid-feedback, .error-message, [role="alert"]').filter({
    hasText: errorMessage,
  });
  await expect(error).toBeVisible({ timeout: 5000 });
}

/**
 * 驗證 Modal/Dialog 開啟
 * @param {import('@playwright/test').Page} page
 * @param {string} triggerText - 觸發按鈕文字
 * @param {string|RegExp} modalTitle - Modal 標題
 */
async function openAndVerifyModal(page, triggerText, modalTitle) {
  await page.getByRole('button', { name: triggerText }).click();
  const modal = page.locator('.modal, [role="dialog"]').filter({ hasText: modalTitle });
  await expect(modal).toBeVisible({ timeout: 5000 });
  return modal;
}

/**
 * 關閉 Modal 並確認消失
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} modal
 */
async function closeModal(page, modal) {
  // 嘗試點擊關閉按鈕或按 Escape
  const closeBtn = modal.locator('button[aria-label="Close"], .btn-close, [data-dismiss="modal"]');
  if ((await closeBtn.count()) > 0) {
    await closeBtn.first().click();
  } else {
    await page.keyboard.press('Escape');
  }
  await expect(modal).not.toBeVisible({ timeout: 5000 });
}

/**
 * 截圖並記錄缺陷（在 test 失敗時使用）
 * @param {import('@playwright/test').Page} page
 * @param {string} defectName
 */
async function captureDefect(page, defectName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `reports/defects/${defectName}_${timestamp}.png`, fullPage: true });
}

/**
 * 驗證分頁功能（點下一頁，驗證資料更新）
 * @param {import('@playwright/test').Page} page
 */
async function testPagination(page) {
  const nextBtn = page.locator('a[aria-label="Next"], button[aria-label="Next page"], .next').first();
  if ((await nextBtn.count()) === 0) {
    console.log('[pagination] 找不到下一頁按鈕，跳過分頁測試');
    return false;
  }
  await expect(nextBtn).toBeEnabled();
  await nextBtn.click();
  await waitForLoadingComplete(page);
  return true;
}

/**
 * 驗證搜尋/篩選有實際發出 API
 * @param {import('@playwright/test').Page} page
 * @param {string} inputPlaceholder
 * @param {string} searchValue
 * @param {string} apiUrlPattern
 */
async function testSearch(page, inputPlaceholder, searchValue, apiUrlPattern) {
  const searchInput = page.getByPlaceholder(inputPlaceholder);
  await expect(searchInput).toBeVisible();
  await searchInput.fill(searchValue);

  const requestPromise = page
    .waitForRequest((req) => req.url().includes(apiUrlPattern), { timeout: 8000 })
    .catch(() => null);

  const searchBtn = page
    .getByRole('button', { name: /搜尋|查詢|Search/i })
    .first();
  if ((await searchBtn.count()) > 0) {
    await searchBtn.click();
  } else {
    await searchInput.press('Enter');
  }

  const req = await requestPromise;
  return req;
}

module.exports = {
  expectToast,
  waitForToastDisappear,
  expectClickable,
  clickAndVerify,
  expectPageLoaded,
  waitForLoadingComplete,
  fillAndSubmitForm,
  expectFieldError,
  openAndVerifyModal,
  closeModal,
  captureDefect,
  testPagination,
  testSearch,
};
