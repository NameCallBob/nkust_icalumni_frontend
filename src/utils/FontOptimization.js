// FontOptimization.js - 字體載入優化工具
export class FontOptimization {
  constructor() {
    this.fontsLoaded = false;
    this.fallbackTimeouts = new Map();
  }

  // 預載入關鍵字體
  preloadFonts() {
    const fonts = [
      {
        family: 'Noto Sans TC',
        weight: '400',
        display: 'swap'
      },
      {
        family: 'Noto Sans TC',
        weight: '500',
        display: 'swap'
      },
      {
        family: 'Noto Sans TC',
        weight: '700',
        display: 'swap'
      }
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `https://fonts.gstatic.com/s/notosanstc/v35/-nFuOG829Oofr2wohFbTp9iFOSsLA.woff2`;
      document.head.appendChild(link);
    });
  }

  // 使用 Font Loading API 檢測字體載入狀態
  async loadFontsWithFallback() {
    if (!('fonts' in document)) {
      console.warn('Font Loading API 不支援，使用傳統載入方式');
      return this.loadFontsTraditional();
    }

    try {
      // 載入關鍵字體
      const fontPromises = [
        new FontFace('Noto Sans TC', 'url(https://fonts.gstatic.com/s/notosanstc/v35/-nFuOG829Oofr2wohFbTp9iFOSsLA.woff2)', {
          weight: '400',
          display: 'swap'
        }).load(),
        new FontFace('Noto Sans TC', 'url(https://fonts.gstatic.com/s/notosanstc/v35/-nFuOG829Oofr2wohFbTp9iFOSsLA.woff2)', {
          weight: '500',
          display: 'swap'
        }).load(),
        new FontFace('Noto Sans TC', 'url(https://fonts.gstatic.com/s/notosanstc/v35/-nFuOG829Oofr2wohFbTp9iFOSsLA.woff2)', {
          weight: '700',
          display: 'swap'
        }).load()
      ];

      // 設定超時（3秒）
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('字體載入超時')), 3000)
      );

      const loadedFonts = await Promise.race([
        Promise.allSettled(fontPromises),
        timeoutPromise
      ]);

      // 將載入的字體加入到文檔中
      loadedFonts.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          document.fonts.add(result.value);
        }
      });

      this.fontsLoaded = true;
      document.documentElement.classList.add('fonts-loaded');

      console.log('字體載入完成');
      return true;

    } catch (error) {
      console.warn('字體載入失敗，使用後備方案:', error);
      return this.loadFontsTraditional();
    }
  }

  // 傳統字體載入方式（後備方案）
  loadFontsTraditional() {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap';
      link.rel = 'stylesheet';

      link.onload = () => {
        this.fontsLoaded = true;
        document.documentElement.classList.add('fonts-loaded');
        resolve(true);
      };

      link.onerror = () => {
        console.warn('Google Fonts 載入失敗，使用系統字體');
        document.documentElement.classList.add('fonts-fallback');
        resolve(false);
      };

      document.head.appendChild(link);
    });
  }

  // 初始化字體優化
  init() {
    // 立即添加 CSS 類別來隱藏未載入字體的閃爍
    document.documentElement.classList.add('fonts-loading');

    // 開始載入字體
    this.loadFontsWithFallback().then(() => {
      document.documentElement.classList.remove('fonts-loading');
    });

    // 預載入字體
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => this.preloadFonts());
    } else {
      setTimeout(() => this.preloadFonts(), 0);
    }
  }
}

// 創建全域實例
export const fontOptimization = new FontOptimization();