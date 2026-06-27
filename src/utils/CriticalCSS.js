// CriticalCSS.js - 關鍵 CSS 管理工具
export class CriticalCSSManager {
  constructor() {
    this.criticalCSSLoaded = false;
    this.nonCriticalCSSLoaded = false;
  }

  // 獲取關鍵 CSS 內容
  getCriticalCSS() {
    // 這裡應該包含真正的關鍵 CSS，但為了示例，我們返回基礎樣式
    return `
      /* 關鍵 CSS - 首屏渲染 */
      :root {
        --color-primary: #1e3a8a;
        --color-white: #ffffff;
        --font-primary: 'Noto Sans TC', system-ui, sans-serif;
        --spacing-md: 1rem;
        --duration-base: 300ms;
      }

      * { box-sizing: border-box; }

      html {
        font-family: var(--font-primary);
        line-height: 1.6;
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        padding: 0;
        background-color: var(--color-white);
        font-family: var(--font-primary);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .fonts-loading * {
        font-family: system-ui, -apple-system, sans-serif !important;
      }

      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 2px solid #f1f5f9;
        border-top: 2px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--spacing-md);
      }

      h1, h2, h3 {
        margin: 0 0 var(--spacing-md) 0;
        font-family: var(--font-primary);
        font-weight: 700;
        line-height: 1.3;
      }

      img {
        max-width: 100%;
        height: auto;
        background-color: #f1f5f9;
      }

      @media (max-width: 768px) {
        .container { padding: 0 0.5rem; }
        html { font-size: 14px; }
      }
    `;
  }

  // 內聯關鍵 CSS 到頁面
  inlineCriticalCSS() {
    if (this.criticalCSSLoaded) return;

    const style = document.createElement('style');
    style.id = 'critical-css';
    style.innerHTML = this.getCriticalCSS();
    document.head.insertBefore(style, document.head.firstChild);

    this.criticalCSSLoaded = true;
    console.log('關鍵 CSS 已內聯載入');
  }

  // 非同步載入非關鍵 CSS
  async loadNonCriticalCSS() {
    if (this.nonCriticalCSSLoaded) return;

    return new Promise((resolve) => {
      // Bootstrap 已通過 npm 安裝，不需要從 CDN 載入
      // 載入其他非關鍵 CSS
      const nonCriticalStyles = [
        '/static/css/animations.css',
        '/static/css/components.css'
      ];

      const promises = nonCriticalStyles.map(href =>
        this.loadStylesheet(href).catch(err => {
          // 忽略載入失敗的錯誤（在預渲染時這些文件可能不存在）
          console.warn(`無法載入 CSS: ${href}`, err.message);
          return null;
        })
      );

      Promise.allSettled(promises).then(() => {
        this.nonCriticalCSSLoaded = true;
        document.documentElement.classList.add('non-critical-css-loaded');
        console.log('非關鍵 CSS 載入完成');
        resolve();
      });
    });
  }

  // 載入樣式表的工具方法
  loadStylesheet(href, id = null) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      if (id) link.id = id;

      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error(`載入失敗: ${href}`));

      document.head.appendChild(link);
    });
  }

  // 預載入資源
  preloadResources() {
    const resources = [
      { href: '/static/css/animations.css', as: 'style' },
      { href: '/static/css/components.css', as: 'style' },
      { href: '/static/js/bootstrap.bundle.min.js', as: 'script' }
    ];

    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'style') {
        link.onload = () => {
          link.rel = 'stylesheet';
        };
      }
      document.head.appendChild(link);
    });
  }

  // 檢測首屏內容載入完成
  onFirstContentfulPaint(callback) {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            callback(entry);
            observer.disconnect();
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } else {
      // 後備方案
      window.addEventListener('load', callback);
    }
  }

  // 初始化關鍵 CSS 策略
  init() {
    // 立即內聯關鍵 CSS
    this.inlineCriticalCSS();

    // 預載入資源
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => this.preloadResources());
    } else {
      setTimeout(() => this.preloadResources(), 0);
    }

    // 在首屏內容載入後載入非關鍵 CSS
    this.onFirstContentfulPaint(() => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => this.loadNonCriticalCSS());
      } else {
        setTimeout(() => this.loadNonCriticalCSS(), 100);
      }
    });
  }
}

// 創建全域實例
export const criticalCSSManager = new CriticalCSSManager();