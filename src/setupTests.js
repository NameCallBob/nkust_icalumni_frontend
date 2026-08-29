// Jest 全域設定——每個測試檔執行前都會先跑這支。
//
// 這裡做三件事：
//   1. 載入 jest-dom 的自訂 matcher（toBeInTheDocument、toHaveTextContent…）
//   2. 補上 jsdom 沒有實作、但瀏覽器有的 API（matchMedia、IntersectionObserver…）
//      —— 缺了它們，元件在測試中會以 TypeError 崩潰，測到的是「假的失敗」
//   3. 封鎖對外網路，並在每個測試後清乾淨全域狀態
import '@testing-library/jest-dom';

// ── jsdom 缺少的瀏覽器 API ────────────────────────────────────────────
// 任何用到 CSS media query 的元件（含多數 UI 套件）都會呼叫 matchMedia。
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},      // 已棄用，但舊套件仍在用
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// 圖片延遲載入、無限捲動、進場動畫都會用到。
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom 沒有實作捲動，元件呼叫時會噴 "Not implemented" 警告淹沒輸出。
window.scrollTo = window.scrollTo || (() => {});
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});

// ── 封鎖對外網路 ────────────────────────────────────────────────────
// 單元測試不該打真的 API：慢、不穩、而且可能對正式資料產生副作用。
// 需要網路互動的測試請 mock 掉 axios（見 src/common/__tests__/Axios.test.js）。
// 端對端的真實流量測試屬於 e2e/（Playwright）的範圍。
global.fetch = jest.fn(() => {
  throw new Error(
    '測試嘗試呼叫 fetch()。單元測試不得打真實網路——請 mock 該模組，' +
      '或把這個情境移到 e2e/ 的 Playwright 測試。'
  );
});

// ── 每個測試之間互相隔離 ─────────────────────────────────────────────
afterEach(() => {
  // localStorage 活在整個 jest 環境裡，不清會讓「登入狀態」外洩到下一個測試，
  // 症狀是單獨跑會過、整批跑就掛。
  window.localStorage.clear();
  window.sessionStorage.clear();
  jest.clearAllMocks();
});

// 讓 console.error / console.warn 在測試中變成明顯的訊號而不是雜訊。
// React 的 "act(...)" 警告、無效 prop 型別等都會走這條路，是真實的問題。
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // react-toastify 在 jsdom 下的已知噪音，與被測程式無關。
    if (typeof args[0] === 'string' && args[0].includes('inside a test was not wrapped in act')) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
