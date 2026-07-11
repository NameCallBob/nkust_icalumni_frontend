import React from 'react';
import ReactDOM from 'react-dom/client';
import { hydrate } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals, { reportAdvancedWebVitals } from './reportWebVitals';
import { fontOptimization } from './utils/FontOptimization';
import { criticalCSSManager } from './utils/CriticalCSS';
import './styles/tailwind.css';

// 初始化效能優化
criticalCSSManager.init();
fontOptimization.init();

const rootElement = document.getElementById('root');
const app = <App />;

// 支援 react-snap 預渲染
if (rootElement.hasChildNodes()) {
  // 如果已經有內容（預渲染的），使用 hydrate
  hydrate(app, rootElement);
} else {
  // 否則使用正常的 render
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}

// 優化版本的 Web Vitals 報告

// 基礎 Web Vitals 監控
reportWebVitals((metric) => {
  // 在開發環境下輸出詳細信息
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }

  // 可以在這裡發送到分析服務
  // sendToAnalytics(metric);
});

// 進階效能監控（生產環境）
if (process.env.NODE_ENV === 'production') {
  reportAdvancedWebVitals((metric) => {
    // 發送到分析服務
    console.log('Advanced Web Vitals:', metric);

    // 示例：發送到 Google Analytics
    // if (window.gtag) {
    //   window.gtag('event', metric.name, {
    //     value: Math.round(metric.value),
    //     metric_id: metric.id,
    //     custom_parameter_1: metric.connectionType,
    //     custom_parameter_2: metric.deviceMemory
    //   });
    // }
  }, {
    enableCustomMetrics: true,
    enableResourceTiming: true,
    enableNavigationTiming: true
  });
}
