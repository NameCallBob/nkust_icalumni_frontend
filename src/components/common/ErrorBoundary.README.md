# ErrorBoundary 元件說明

## 概述

重新設計的 ErrorBoundary 元件使用 CSS Modules 進行樣式隔離，防止樣式污染，並提供更好的錯誤處理體驗。

## 特點

### 🎨 樣式隔離
- 使用 CSS Modules 完全避免樣式污染
- 所有樣式都封裝在 `ErrorBoundary.module.css` 中
- 響應式設計，支援各種螢幕尺寸

### 🔧 增強功能
- **錯誤ID追蹤**: 每個錯誤都有唯一的ID，方便追蹤和除錯
- **多種復原選項**: 提供重試、重新載入、返回、回首頁等選項
- **詳細錯誤資訊**: 開發模式下顯示完整的錯誤資訊和堆疊追蹤
- **自定義回調**: 支援錯誤發生時的自定義處理

### ✨ 使用者體驗
- 現代化的視覺設計
- 動畫效果和互動回饋
- 多語言支援（中文）
- 清晰的操作指引

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

### 進階用法

```jsx
import ErrorBoundary from 'components/common/ErrorBoundary';

function App() {
  const handleError = (error, errorInfo, eventId) => {
    // 發送錯誤報告到監控服務
    console.log('Error ID:', eventId);
    // 可以在這裡發送到 Sentry, LogRocket 等服務
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallbackUrl="/dashboard"
    >
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
| `fallbackUrl` | String | `'/'` | 回到首頁按鈕的目標 URL |

## 檔案結構

```
src/components/common/
├── ErrorBoundary.js          # 主要元件邏輯
├── ErrorBoundary.module.css  # CSS Modules 樣式
└── ErrorBoundary.README.md   # 說明文件
```

## 樣式自定義

如需自定義樣式，請修改 `ErrorBoundary.module.css` 檔案。所有的 CSS 類別都使用模組化，不會污染全域樣式。

### 主要樣式類別

- `.errorContainer` - 主容器
- `.actionButton` - 操作按鈕
- `.reloadButton` - 重試按鈕樣式
- `.backButton` - 返回按鈕樣式
- `.homeButton` - 首頁按鈕樣式
- `.debugSection` - 除錯區域

## 錯誤處理流程

1. **錯誤捕獲**: 當子元件發生錯誤時，ErrorBoundary 會捕獲錯誤
2. **錯誤記錄**: 生成唯一的錯誤ID，並詳細記錄錯誤資訊到控制台
3. **使用者介面**: 顯示友好的錯誤頁面，提供多種復原選項
4. **錯誤報告**: 可透過 `onError` 回調發送錯誤報告到監控服務

## 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事項

1. ErrorBoundary 只能捕獲其子元件樹中的錯誤
2. 無法捕獲事件處理器、異步程式碼、伺服器端渲染錯誤
3. 開發模式下會顯示詳細的除錯資訊
4. 生產模式下只顯示使用者友好的錯誤訊息

## 最佳實踐

1. **適當的邊界設置**: 在路由層級設置 ErrorBoundary
2. **錯誤監控**: 配合錯誤監控服務使用
3. **使用者友好**: 提供清晰的錯誤訊息和復原指引
4. **測試**: 定期測試錯誤邊界的功能

```jsx
// 推薦的應用結構
<Router>
  <ErrorBoundary onError={sendToErrorReporting}>
    <Routes>
      <Route path="/" element={
        <ErrorBoundary fallbackUrl="/home">
          <HomePage />
        </ErrorBoundary>
      } />
      {/* 其他路由 */}
    </Routes>
  </ErrorBoundary>
</Router>
```