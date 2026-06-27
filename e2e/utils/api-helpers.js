/**
 * api-helpers.js
 * API Mock 工具函式 — 攔截並模擬 API 回應，避免測試依賴後端
 */

const { expect } = require('@playwright/test');

const API_URL = process.env.API_URL || 'https://nkust-alumni-api.binbinbob.work';

/**
 * 設定登入 API Mock
 * @param {import('@playwright/test').Page} page
 * @param {'success'|'failure'|'inactive'} scenario
 */
async function mockLoginAPI(page, scenario = 'success') {
  await page.route(`${API_URL}/basic/login`, async (route) => {
    if (scenario === 'success') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock_jwt_token_for_testing',
          is_super: false,
        }),
      });
    } else if (scenario === 'failure') {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'No active account found' }),
      });
    } else if (scenario === 'inactive') {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Account inactive' }),
      });
    }
  });
}

/**
 * 設定 Token 驗證 API Mock
 * @param {import('@playwright/test').Page} page
 * @param {boolean} valid
 */
async function mockTokenVerify(page, valid = true) {
  await page.route(`${API_URL}/api/token/verify/`, async (route) => {
    if (valid) {
      await route.fulfill({ status: 200, body: JSON.stringify({ token: 'valid' }) });
    } else {
      await route.fulfill({ status: 401, body: JSON.stringify({ detail: 'Token invalid' }) });
    }
  });
}

/**
 * 設定 Check User API Mock
 * @param {import('@playwright/test').Page} page
 * @param {boolean} exists
 * @param {string} name
 */
async function mockCheckUser(page, exists = true, name = '測試系友') {
  await page.route(`${API_URL}/basic/check-user*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ exists, name }),
    });
  });
}

/**
 * 設定成員列表 API Mock
 * @param {import('@playwright/test').Page} page
 * @param {Object[]} data - 成員資料陣列
 */
async function mockMemberList(page, data = null) {
  const defaultData = {
    count: 3,
    results: [
      { id: 1, name: '會員一', email: 'a@test.com', is_active: true, phone: '0912000001' },
      { id: 2, name: '會員二', email: 'b@test.com', is_active: false, phone: '0912000002' },
      { id: 3, name: '會員三', email: 'c@test.com', is_active: true, phone: '0912000003' },
    ],
  };
  await page.route(`${API_URL}/member/admin/tableOutput_all/*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data || defaultData),
    });
  });
}

/**
 * 設定空資料 Mock（測試空狀態畫面）
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPattern
 */
async function mockEmptyList(page, urlPattern) {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ count: 0, results: [] }),
    });
  });
}

/**
 * 設定 API 錯誤 Mock（500）
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPattern
 */
async function mockAPIError(page, urlPattern, status = 500) {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'Internal server error' }),
    });
  });
}

/**
 * 設定 API 超時 Mock
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPattern
 * @param {number} delayMs
 */
async function mockAPITimeout(page, urlPattern, delayMs = 15000) {
  await page.route(urlPattern, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.fulfill({ status: 504, body: 'Gateway Timeout' });
  });
}

/**
 * 攔截並記錄所有 API requests（用於驗證 API 是否真的被呼叫）
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPattern
 * @returns {{ requests: Array, waitForRequest: Function }}
 */
function interceptRequests(page, urlPattern) {
  const requests = [];

  page.on('request', (req) => {
    if (req.url().includes(urlPattern)) {
      requests.push({
        url: req.url(),
        method: req.method(),
        headers: req.headers(),
        postData: req.postData(),
        timestamp: Date.now(),
      });
    }
  });

  const waitForRequest = (timeout = 10000) =>
    page.waitForRequest((req) => req.url().includes(urlPattern), { timeout });

  return { requests, waitForRequest };
}

/**
 * 驗證 API 請求確實發出
 * @param {import('@playwright/test').Page} page
 * @param {string} urlPattern
 * @param {string} method
 */
async function expectAPICall(page, urlPattern, method = 'GET') {
  const requestPromise = page.waitForRequest(
    (req) => req.url().includes(urlPattern) && req.method() === method,
    { timeout: 10000 }
  );
  return requestPromise;
}

/**
 * 在 localStorage 設定已登入狀態（繞過登入畫面）
 * @param {import('@playwright/test').Page} page
 * @param {string} token
 */
async function setAuthState(page, token = 'mock_jwt_token') {
  await page.addInitScript((jwt) => {
    const issuedAt = Math.floor(Date.now() / 1000);
    window.localStorage.setItem('jwt', jwt);
    window.localStorage.setItem('super', 'true');
    window.localStorage.setItem('issuedAt', String(issuedAt));
    window.localStorage.setItem('expiry', String(issuedAt + 14400));
  }, token);
}

/**
 * 清除 auth 狀態
 * @param {import('@playwright/test').Page} page
 */
async function clearAuthState(page) {
  await page.evaluate(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('super');
    localStorage.removeItem('issuedAt');
    localStorage.removeItem('expiry');
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lastAttemptTime');
  });
}

module.exports = {
  mockLoginAPI,
  mockTokenVerify,
  mockCheckUser,
  mockMemberList,
  mockEmptyList,
  mockAPIError,
  mockAPITimeout,
  interceptRequests,
  expectAPICall,
  setAuthState,
  clearAuthState,
};
