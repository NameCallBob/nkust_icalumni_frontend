import React, { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './AppModal.module.css';

/**
 * AppModal — 全站統一旗艦 Modal（深藍 / AI 專業 / 高級風格）
 * 取代 react-bootstrap <Modal>。視覺規範見 FRONTEND_MIGRATION_PLAN.md §3。
 *
 * Props:
 *  - show: boolean            是否顯示
 *  - onHide: () => void       關閉回呼
 *  - title: ReactNode         標題
 *  - icon: ReactNode          標題左側圖示（建議 lucide-react icon）
 *  - size: 'sm'|'md'|'lg'|'xl'  寬度（預設 md）
 *  - variant: 'admin'|'showcase'  後台表單 / 前台展示（預設 admin）
 *  - footer: ReactNode        底部按鈕區（不傳則不顯示 footer）
 *  - steps: string[]          多步驟標題陣列（傳入即顯示步驟列）
 *  - currentStep: number      目前步驟索引（0-based）
 *  - closeOnBackdrop: boolean 點遮罩是否關閉（預設 true）
 *  - hideClose: boolean       隱藏右上關閉鈕
 *  - children: ReactNode      內容
 */
const SIZE_MAX_W = {
  sm: 'max-w-[420px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[880px]',
  xl: 'max-w-[1080px]',
};

export default function AppModal({
  show,
  onHide,
  title,
  icon,
  size = 'md',
  variant = 'admin',
  footer,
  steps,
  currentStep = 0,
  closeOnBackdrop = true,
  hideClose = false,
  children,
}) {
  // ESC 關閉
  const onKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && show) onHide?.();
    },
    [show, onHide]
  );

  // 鍵盤監聽 + 開啟時鎖背景捲動
  useEffect(() => {
    if (!show) return undefined;
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [show, onKey]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) onHide?.();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : 'dialog'}
        >
          <motion.div
            className={`${styles.box} ${SIZE_MAX_W[size] || SIZE_MAX_W.md} ${
              variant === 'showcase' ? styles.showcase : styles.admin
            }`}
            initial={{ y: 16, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          >
            {/* Header：深藍漸層 + 頂部高光線 + 金色細線 */}
            {(title || !hideClose) && (
              <div className={styles.header}>
                <div className={styles.headerTitle}>
                  {icon && <span className={styles.headerIcon}>{icon}</span>}
                  <h3 className={styles.titleText}>{title}</h3>
                </div>
                {!hideClose && (
                  <button
                    type="button"
                    className={styles.closeBtn}
                    aria-label="關閉"
                    onClick={onHide}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* 多步驟進度列 */}
            {Array.isArray(steps) && steps.length > 0 && (
              <div className={styles.steps}>
                {steps.map((label, i) => (
                  <div
                    key={label}
                    className={`${styles.step} ${
                      i === currentStep
                        ? styles.stepActive
                        : i < currentStep
                        ? styles.stepDone
                        : ''
                    }`}
                  >
                    <span className={styles.stepDot}>{i + 1}</span>
                    <span className={styles.stepLabel}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 內容 */}
            <div className={styles.body}>{children}</div>

            {/* Footer */}
            {footer && <div className={styles.footer}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
