import React from 'react';

/**
 * StatCard — 後台儀表板統計卡（數字 + 標籤 + 圖示）。
 * props: { label, value, icon, accent('primary'|'secondary'|'accent'|'success'|'warning'|'error'), className }
 */
const ACCENT = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
};

export default function StatCard({ label, value, icon, accent = 'primary', className = '' }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm ${className}`}>
      {icon && (
        <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ACCENT[accent] ?? ACCENT.primary}`}>
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className="text-2xl font-bold text-base-content leading-tight">{value}</div>
        <div className="text-sm text-base-content/60 truncate">{label}</div>
      </div>
    </div>
  );
}
