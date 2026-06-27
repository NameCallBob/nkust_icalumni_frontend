import React from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
    this.retryTimeoutId = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const eventId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    this.setState({
      error: error,
      errorInfo: errorInfo,
      eventId: eventId
    });

    console.group('🚨 Error Boundary 捕獲到錯誤');
    console.error('錯誤ID:', eventId);
    console.error('錯誤對象:', error);
    console.error('錯誤資訊:', errorInfo);
    console.error('組件堆疊:', errorInfo.componentStack);
    console.groupEnd();

    if (this.props.onError) {
      this.props.onError(error, errorInfo, eventId);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    });
  }

  handleGoHome = () => {
    window.location.href = this.props.fallbackUrl || '/';
  }

  handleReload = () => {
    window.location.reload();
  }

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.backgroundAnimation}>
            <div className={styles.backgroundBlur}>
              <div className={styles.blob1}></div>
              <div className={styles.blob2}></div>
              <div className={styles.blob3}></div>
            </div>
            <div className={styles.gridPattern}></div>
          </div>

          <div className={styles.contentContainer}>
            <div className={styles.iconContainer}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconGlow}></div>
                <div className={styles.iconBox}>
                  <svg className={styles.iconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.94-.833-2.71 0L4.104 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>

              <h2 className={styles.title}>
                系統異常
              </h2>
              <p className={styles.description}>
                偵測到未預期的系統錯誤<br />
                正在嘗試自動修復...
              </p>
            </div>

            <div className={styles.buttonContainer}>
              <button
                onClick={this.handleRetry}
                className={`${styles.actionButton} ${styles.reloadButton}`}
                title="嘗試重新渲染組件"
              >
                <span className={styles.buttonContent}>
                  <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重試載入
                </span>
                <div className={styles.shimmerEffect}></div>
              </button>

              <button
                onClick={this.handleReload}
                className={`${styles.actionButton} ${styles.backButton}`}
                title="重新載入整個頁面"
              >
                <span className={styles.buttonContent}>
                  <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新載入頁面
                </span>
                <div className={styles.shimmerEffect}></div>
              </button>

              <button
                onClick={this.handleGoBack}
                className={`${styles.actionButton} ${styles.backButton}`}
                title="返回上一個頁面"
              >
                <span className={styles.buttonContent}>
                  <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  返回上一步
                </span>
                <div className={styles.shimmerEffect}></div>
              </button>

              <button
                onClick={this.handleGoHome}
                className={`${styles.actionButton} ${styles.homeButton}`}
                title="回到首頁"
              >
                <span className={styles.buttonContent}>
                  <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  回到首頁
                </span>
                <div className={styles.shimmerEffect}></div>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.debugSection}>
                <summary className={styles.debugSummary}>
                  <span>
                    <svg className={styles.debugIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    開發模式：診斷資訊
                  </span>
                </summary>
                <div className={styles.debugContent}>
                  {this.state.eventId && (
                    <>
                      <h4 className={styles.debugErrorTitle}>
                        <svg className={styles.debugIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        錯誤ID：
                      </h4>
                      <pre className={styles.debugPre}>
                        {this.state.eventId}
                      </pre>
                    </>
                  )}
                  <h4 className={styles.debugErrorTitle}>
                    <svg className={styles.debugIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    錯誤訊息：
                  </h4>
                  <pre className={styles.debugPre}>
                    {this.state.error && this.state.error.toString()}
                  </pre>
                  <h4 className={styles.debugStackTitle}>
                    <svg className={styles.debugIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    堆疊追蹤：
                  </h4>
                  <pre className={styles.debugStackPre}>
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;