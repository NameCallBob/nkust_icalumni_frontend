# ErrorBoundary 元件說明

## 概述

ErrorBoundary 採用「**先自動重整、仍失敗才顯示維護中**」的策略，並以本專案的**深藍 / 金色**品牌風格（對齊 `AppModal`、`PageLoader`）呈現，使用 CSS Modules 進行樣式隔離。

## 錯誤處理流程

當子元件樹發生未預期錯誤時：

1. **首次發生** → 顯示品牌「重新整理中…」動畫，並於短暫延遲後**自動重整整個頁面**（無需使用者手動操作，也不會出現「請重新整理」之類的提示）。
2. **重整後仍故障** → 若在時間窗（預設 15 秒）內再次捕獲到錯誤，判定為持續性故障／伺服器問題，顯示「**伺服器維護中**」訊息，且**不再提供重試按鈕**。
3. **錯誤記錄** → 每次皆生成唯一錯誤ID 並輸出到 console；可透過 `onError` 回調送至監控服務。
4. **開發模式診斷** → 僅在 `NODE_ENV === 'development'` 顯示錯誤ID、錯誤訊息與堆疊追蹤。

> 自動重整紀錄存放於 `sessionStorage`（鍵 `eb:autoReloadAt`）。頁面成功載入數秒後會自動清除，確保日後不相關的錯誤仍能獲得一次乾淨的自動重整機會。

## 使用方法

### 基本用法

```jsx
import ErrorBoundary from 'components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### 搭配錯誤監控

```jsx
import ErrorBoundary from 'components/common/ErrorBoundary';

function App() {
  const handleError = (error, errorInfo, eventId) => {
    // 發送錯誤報告到監控服務（Sentry、LogRocket…）
    console.log('Error ID:', eventId);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `children` | ReactNode | - | 要保護的子元件 |
| `onError` | Function | - | 錯誤發生時的回調函式 `(error, errorInfo, eventId) => {}` |

## 檔案結構

```
src/components/common/
├── ErrorBoundary.js          # 主要元件邏輯（自動重整 / 維護中判定）
├── ErrorBoundary.module.css  # 深藍 / 金色品牌樣式（CSS Modules）
└── ErrorBoundary.README.md   # 說明文件
```

## 可調參數

於 `ErrorBoundary.js` 頂部：

| 常數 | 預設 | 說明 |
|------|------|------|
| `RELOAD_WINDOW_MS` | `15000` | 重整後多久內再次出錯，即判定為持續性故障 |
| `RELOAD_DELAY_MS` | `650` | 顯示重整動畫後再實際重整的延遲 |

## 主要樣式類別

- `.container` - 全螢幕深藍漸層容器
- `.goldTopLine` / `.goldLine` - 金色細線與底線
- `.iconBox` / `.iconSvg` - 維護圖示
- `.title` / `.subtitle` / `.description` - 文字（標題使用 Noto Serif TC）
- `.spinner` / `.reloadingText` - 重新整理中畫面
- `.debugSection` - 開發模式除錯區域

## 注意事項

1. ErrorBoundary 只能捕獲其子元件樹「**渲染期間**」的錯誤。
2. 無法捕獲事件處理器、非同步程式碼、伺服器端渲染的錯誤。
3. 生產模式下只顯示使用者友善的訊息，不顯示診斷資訊。
4. 若 `sessionStorage` 不可用（如隱私模式），相關存取會靜默略過，不影響畫面顯示。
