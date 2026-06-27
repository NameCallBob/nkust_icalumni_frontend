import React from 'react';
import './LoadingComponent.css';

const LoadingComponent = ({ text = '載入中...', size = 'medium' }) => {
  return (
    <div className={`loading-container loading-${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">{text}</p>
    </div>
  );
};

// 針對不同場景的預設組件
export const PageLoading = () => (
  <LoadingComponent text="頁面載入中..." size="large" />
);

export const ComponentLoading = () => (
  <LoadingComponent text="載入中..." size="small" />
);

export const FullPageLoading = () => (
  <div className="full-page-loading">
    <LoadingComponent text="正在載入應用程式..." size="large" />
  </div>
);

export default LoadingComponent;