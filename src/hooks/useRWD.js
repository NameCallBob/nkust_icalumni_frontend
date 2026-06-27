import { useState, useEffect } from 'react';

/**
 * useRWD Hook - 統一管理響應式網頁設計
 * @returns {Object} RWD 相關狀態和工具函數
 */
const useRWD = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  // 斷點定義
  const breakpoints = {
    mobile: 576,    // < 576px
    tablet: 768,    // 576px - 768px
    desktop: 992,   // 768px - 992px
    large: 1200,    // > 992px
  };

  // 更新設備類型
  const updateDeviceType = () => {
    const width = window.innerWidth;
    setScreenWidth(width);
    setScreenHeight(window.innerHeight);

    setIsMobile(width < breakpoints.mobile);
    setIsTablet(width >= breakpoints.mobile && width < breakpoints.desktop);
    setIsDesktop(width >= breakpoints.desktop);
  };

  useEffect(() => {
    updateDeviceType();

    const handleResize = () => {
      updateDeviceType();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 表格響應式配置
  const getTableResponsiveConfig = () => {
    if (isMobile) {
      return {
        tableLayout: 'card', // 卡片式顯示
        showColumns: ['primary'], // 只顯示主要欄位
        actionsPosition: 'dropdown', // 操作按鈕收進下拉選單
        fontSize: '14px',
        padding: '8px',
      };
    } else if (isTablet) {
      return {
        tableLayout: 'scroll', // 橫向滾動
        showColumns: ['primary', 'secondary'], // 顯示主要和次要欄位
        actionsPosition: 'inline', // 操作按鈕內聯
        fontSize: '15px',
        padding: '10px',
      };
    } else {
      return {
        tableLayout: 'fixed', // 固定表格
        showColumns: 'all', // 顯示所有欄位
        actionsPosition: 'inline', // 操作按鈕內聯
        fontSize: '16px',
        padding: '12px',
      };
    }
  };

  // 響應式表格樣式
  const getTableStyle = () => {
    const baseStyle = {
      width: '100%',
      borderCollapse: 'collapse',
    };

    if (isMobile) {
      return {
        ...baseStyle,
        fontSize: '14px',
        display: 'block',
        overflowX: 'auto',
      };
    } else if (isTablet) {
      return {
        ...baseStyle,
        fontSize: '15px',
        overflowX: 'auto',
      };
    } else {
      return {
        ...baseStyle,
        fontSize: '16px',
        tableLayout: 'fixed',
      };
    }
  };

  // 響應式容器樣式
  const getContainerStyle = () => {
    if (isMobile) {
      return {
        padding: '10px',
        margin: '0',
      };
    } else if (isTablet) {
      return {
        padding: '15px',
        margin: '0 auto',
        maxWidth: '100%',
      };
    } else {
      return {
        padding: '20px',
        margin: '0 auto',
        maxWidth: '1200px',
      };
    }
  };

  // 響應式按鈕樣式
  const getButtonStyle = (type = 'default') => {
    const baseStyle = {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      borderRadius: '4px',
    };

    if (isMobile) {
      return {
        ...baseStyle,
        padding: '8px 12px',
        fontSize: '14px',
        width: type === 'block' ? '100%' : 'auto',
        marginBottom: '8px',
      };
    } else if (isTablet) {
      return {
        ...baseStyle,
        padding: '10px 16px',
        fontSize: '15px',
        width: type === 'block' ? '100%' : 'auto',
        marginBottom: '10px',
      };
    } else {
      return {
        ...baseStyle,
        padding: '12px 20px',
        fontSize: '16px',
        width: 'auto',
        marginBottom: '0',
      };
    }
  };

  // 響應式卡片佈局
  const getCardColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (screenWidth < breakpoints.large) return 3;
    return 4;
  };

  // 響應式字體大小
  const getFontSize = (type = 'body') => {
    const sizes = {
      mobile: { h1: '24px', h2: '20px', h3: '18px', body: '14px', small: '12px' },
      tablet: { h1: '28px', h2: '24px', h3: '20px', body: '15px', small: '13px' },
      desktop: { h1: '32px', h2: '28px', h3: '24px', body: '16px', small: '14px' },
    };

    if (isMobile) return sizes.mobile[type] || sizes.mobile.body;
    if (isTablet) return sizes.tablet[type] || sizes.tablet.body;
    return sizes.desktop[type] || sizes.desktop.body;
  };

  // 響應式間距
  const getSpacing = (size = 'medium') => {
    const spacings = {
      mobile: { small: '4px', medium: '8px', large: '12px', xlarge: '16px' },
      tablet: { small: '6px', medium: '12px', large: '18px', xlarge: '24px' },
      desktop: { small: '8px', medium: '16px', large: '24px', xlarge: '32px' },
    };

    if (isMobile) return spacings.mobile[size] || spacings.mobile.medium;
    if (isTablet) return spacings.tablet[size] || spacings.tablet.medium;
    return spacings.desktop[size] || spacings.desktop.medium;
  };

  // 條件渲染輔助函數
  const renderForDevice = (mobileContent, tabletContent, desktopContent) => {
    if (isMobile) return mobileContent;
    if (isTablet) return tabletContent || desktopContent;
    return desktopContent;
  };

  return {
    // 設備狀態
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    breakpoints,

    // 樣式函數
    getTableResponsiveConfig,
    getTableStyle,
    getContainerStyle,
    getButtonStyle,
    getCardColumns,
    getFontSize,
    getSpacing,

    // 輔助函數
    renderForDevice,
  };
};

export default useRWD;