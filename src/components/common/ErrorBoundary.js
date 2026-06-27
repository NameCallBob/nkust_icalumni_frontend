import React from 'react';
import styles from './ErrorBoundary.module.css';

// 自動重整的紀錄鍵；同一個錯誤在重整後若於時間窗內再次發生，視為持續性故障。
const RELOAD_FLAG_KEY = 'eb:autoReloadAt';
// 重整後多久內再次出錯，即判定為持續性故障 → 顯示「伺服器維護中」。
const RELOAD_WINDOW_MS = 15000;
// 顯示品牌重整動畫後再實際重整，避免畫面突兀閃爍。
const RELOAD_DELAY_MS = 650;

const readReloadAt = () => {
  try {
    return Number(window.sessionStorage.getItem(RELOAD_FLAG_KEY)) || 0;
  } catch (e) {
    return 0;
  }
};

const writeReloadAt = (value) => {
  try {
    window.sessionStorage.setItem(RELOAD_FLAG_KEY, String(value));
  } catch (e) {
    /* sessionStorage 不可用時靜默略過 */
  }
};

const clearReloadAt = () => {
  try {
    window.sessionStorage.removeItem(RELOAD_FLAG_KEY);
  } catch (e) {
    /* noop */
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      // phase: 'reloading'（首次出錯，自動重整中）| 'maintenance'（重整後仍故障）
      phase: null,
      error: null,
      errorInfo: null,
      eventId: null
    };
    this.reloadTimeoutId = null;
    this.clearFlagTimeoutId = null;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    // 頁面成功載入後，稍待片刻清除自動重整紀錄，
    // 讓日後不相關的錯誤仍能獲得一次乾淨的自動重整機會。
    this.clearFlagTimeoutId = setTimeout(() => {
      if (!this.state.hasError) {
        clearReloadAt();
      }
    }, 4000);
  }

  componentDidCatch(error, errorInfo) {
    const eventId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    console.group('🚨 Error Boundary 捕獲到錯誤');
    console.error('錯誤ID:', eventId);
    console.error('錯誤對象:', error);
    console.error('錯誤資訊:', errorInfo);
    console.error('組件堆疊:', errorInfo && errorInfo.componentStack);
    console.groupEnd();

    if (this.props.onError) {
      this.props.onError(error, errorInfo, eventId);
    }

    const now = Date.now();
    const lastReloadAt = readReloadAt();
    const recentlyReloaded = lastReloadAt > 0 && now - lastReloadAt < RELOAD_WINDOW_MS;

    if (recentlyReloaded) {
      // 已經自動重整過、卻仍在時間窗內再次發生 → 判定為伺服器維護／持續性故障。
      clearReloadAt();
      this.setState({ phase: 'maintenance', error, errorInfo, eventId });
    } else {
      // 首次發生 → 記錄並自動重整頁面（不需要使用者手動操作）。
      writeReloadAt(now);
      this.setState({ phase: 'reloading', error, errorInfo, eventId });
      this.reloadTimeoutId = setTimeout(() => {
        window.location.reload();
      }, RELOAD_DELAY_MS);
    }
  }

  componentWillUnmount() {
    if (this.reloadTimeoutId) clearTimeout(this.reloadTimeoutId);
    if (this.clearFlagTimeoutId) clearTimeout(this.clearFlagTimeoutId);
  }

  renderDebug() {
    if (process.env.NODE_ENV !== 'development' || !this.state.error) {
      return null;
    }

    return (
      <details className={styles.debugSection}>
        <summary className={styles.debugSummary}>
          <svg className={styles.debugIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          開發模式：診斷資訊
        </summary>
        <div className={styles.debugContent}>
          {this.state.eventId && (
            <>
              <h4 className={styles.debugErrorTitle}>錯誤ID：</h4>
              <pre className={styles.debugPre}>{this.state.eventId}</pre>
            </>
          )}
          <h4 className={styles.debugErrorTitle}>錯誤訊息：</h4>
          <pre className={styles.debugPre}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <h4 className={styles.debugStackTitle}>堆疊追蹤：</h4>
          <pre className={styles.debugStackPre}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      </details>
    );
  }

  renderReloading() {
    return (
      <div className={styles.container}>
        <span className={styles.goldTopLine} aria-hidden="true" />
        <div className={styles.content}>
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.reloadingText}>系統正在重新整理…</p>
        </div>
      </div>
    );
  }

  renderMaintenance() {
    return (
      <div className={styles.container}>
        <span className={styles.goldTopLine} aria-hidden="true" />
        <div className={styles.content} role="alert">
          <div className={styles.iconBox} aria-hidden="true">
            <svg className={styles.iconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M11.42 15.17 17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>

          <p className={styles.subtitle}>系統維護通知</p>
          <h2 className={styles.title}>伺服器維護中</h2>
          <span className={styles.goldLine} aria-hidden="true" />
          <p className={styles.description}>
            目前系統正在維護，造成不便敬請見諒。<br />
            請稍後再回來，我們將盡快恢復服務。
          </p>

          {this.renderDebug()}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.state.phase === 'maintenance') {
        return this.renderMaintenance();
      }
      // 'reloading' 或尚未判定（getDerivedStateFromError 與 componentDidCatch 之間）
      // 一律顯示品牌重整畫面，避免錯誤畫面閃爍。
      return this.renderReloading();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
