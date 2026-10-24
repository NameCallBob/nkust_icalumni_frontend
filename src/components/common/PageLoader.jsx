import React, { useState, useEffect } from 'react';
import './PageLoader.css';

/**
 * PageLoader - 頁面進入動畫
 * 品牌載入畫面：深藍背景 → 標題逐字揭露 → 金線延伸 → 整體向上滑出
 *
 * 時間軸：
 * 0.25s  - 學校名稱淡入
 * 0.45s  - 「智慧商務系」從下方揭露
 * 0.65s  - 「系友會」從下方揭露
 * 1.05s  - 金線從左延伸至右
 * 1.8s   - 開始退場（向上滑出）
 * 2.45s  - 完全隱藏，移除 DOM
 */
const PageLoader = () => {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // 已瀏覽過則跳過 loader（重新整理才顯示）
    const hasLoaded = sessionStorage.getItem('__site_loaded');
    if (hasLoaded) {
      setVisible(false);
      return;
    }

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1800);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('__site_loaded', '1');
    }, 2450);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`page-loader${exiting ? ' page-loader--exit' : ''}`}>
      <div className="page-loader__content">
        <div className="page-loader__subtitle">國立高雄科技大學</div>
        <div className="page-loader__title">
          <span className="page-loader__title-part">智慧商務系</span>
          <span className="page-loader__title-part">系友會</span>
        </div>
        <div className="page-loader__line" />
      </div>

      <div className="page-loader__dots">
        <div className="page-loader__dot" />
        <div className="page-loader__dot" />
        <div className="page-loader__dot" />
      </div>
    </div>
  );
};

export default PageLoader;
