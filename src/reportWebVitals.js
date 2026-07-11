// 優化版本的 Web Vitals 監控
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Core Web Vitals
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getLCP(onPerfEntry);

      // 其他重要指標
      getFCP(onPerfEntry); // First Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

// 進階效能監控函數
export const reportAdvancedWebVitals = (onPerfEntry, options = {}) => {
  if (!onPerfEntry || typeof onPerfEntry !== 'function') return;

  const {
    enableCustomMetrics = true,
    enableResourceTiming = true,
    enableNavigationTiming = true
  } = options;

  // 載入 Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    // 包裝回調函數以添加更多上下文
    const enhancedCallback = (metric) => {
      // 添加時間戳和用戶代理信息
      const enhancedMetric = {
        ...metric,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
      };

      // 根據指標類型添加額外資訊
      if (metric.name === 'LCP') {
        enhancedMetric.lcpElement = metric.entries?.[0]?.element?.tagName;
      }

      if (metric.name === 'CLS') {
        enhancedMetric.clsDetails = metric.entries?.map(entry => ({
          element: entry.sources?.[0]?.node?.tagName,
          value: entry.value
        }));
      }

      onPerfEntry(enhancedMetric);
    };

    // 收集核心指標
    getCLS(enhancedCallback);
    getFID(enhancedCallback);
    getLCP(enhancedCallback);
    getFCP(enhancedCallback);
    getTTFB(enhancedCallback);

    // 自定義指標收集
    if (enableCustomMetrics) {
      collectCustomMetrics(enhancedCallback);
    }

    // Resource Timing 分析
    if (enableResourceTiming) {
      analyzeResourceTiming(enhancedCallback);
    }

    // Navigation Timing 分析
    if (enableNavigationTiming) {
      analyzeNavigationTiming(enhancedCallback);
    }
  });
};

// 收集自定義效能指標
const collectCustomMetrics = (callback) => {
  // 字體載入時間
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      const fontLoadTime = performance.now();
      callback({
        name: 'custom-font-load-time',
        value: fontLoadTime,
        delta: fontLoadTime,
        id: 'font-load',
        entries: []
      });
    });
  }

  // React 組件載入時間
  performance.mark('react-load-start');

  // 在 React 完全載入後測量
  setTimeout(() => {
    performance.mark('react-load-end');
    const measure = performance.measure('react-load-time', 'react-load-start', 'react-load-end');

    if (measure) {
      callback({
        name: 'custom-react-load-time',
        value: measure.duration,
        delta: measure.duration,
        id: 'react-load',
        entries: [measure]
      });
    }
  }, 0);

  // 互動準備時間
  let isInteractionReady = false;
  const checkInteractionReady = () => {
    if (isInteractionReady) return;

    if (document.readyState === 'complete' && window.React) {
      isInteractionReady = true;
      const interactionReadyTime = performance.now();

      callback({
        name: 'custom-interaction-ready',
        value: interactionReadyTime,
        delta: interactionReadyTime,
        id: 'interaction-ready',
        entries: []
      });
    }
  };

  document.addEventListener('readystatechange', checkInteractionReady);
  window.addEventListener('load', checkInteractionReady);
};

// 分析資源載入時間
const analyzeResourceTiming = (callback) => {
  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource');

    // 分析慢速資源
    const slowResources = resources.filter(resource => resource && typeof resource.duration === 'number' && resource.duration > 1000);

    if (slowResources.length > 0) {
      callback({
        name: 'custom-slow-resources',
        value: slowResources.length,
        delta: slowResources.length,
        id: 'slow-resources',
        entries: slowResources.map(r => ({
          name: r.name,
          duration: r.duration,
          size: r.transferSize
        }))
      });
    }

    // 分析關鍵資源
    const criticalResources = resources.filter(resource =>
      resource &&
      (resource.name.includes('css') ||
      resource.name.includes('font') ||
      resource.name.includes('js'))
    );

    const validCriticalResources = criticalResources.filter(r => r && typeof r.duration === 'number');
    const avgCriticalLoadTime = validCriticalResources.length > 0
      ? validCriticalResources.reduce((sum, r) => sum + r.duration, 0) / validCriticalResources.length
      : 0;

    callback({
      name: 'custom-critical-resource-time',
      value: avgCriticalLoadTime,
      delta: avgCriticalLoadTime,
      id: 'critical-resources',
      entries: criticalResources
    });
  });
};

// 分析導航時間
const analyzeNavigationTiming = (callback) => {
  window.addEventListener('load', () => {
    const navigationEntries = performance.getEntriesByType('navigation');
    const navigation = navigationEntries.length > 0 ? navigationEntries[0] : null;

    if (navigation) {
      // DNS 查找時間
      const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;

      // 連線建立時間
      const connectTime = navigation.connectEnd - navigation.connectStart;

      // 伺服器回應時間
      const responseTime = navigation.responseEnd - navigation.responseStart;

      // DOM 建構時間
      const domBuildTime = navigation.domComplete - navigation.domLoading;

      [
        { name: 'custom-dns-time', value: dnsTime },
        { name: 'custom-connect-time', value: connectTime },
        { name: 'custom-response-time', value: responseTime },
        { name: 'custom-dom-build-time', value: domBuildTime }
      ].forEach(metric => {
        callback({
          ...metric,
          delta: metric.value,
          id: metric.name,
          entries: [navigation]
        });
      });
    }
  });
};

export default reportWebVitals;
