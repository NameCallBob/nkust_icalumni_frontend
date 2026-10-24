import React from 'react';

/**
 * Badge — 狀態標籤。
 * props: { variant('neutral'|'primary'|'secondary'|'success'|'warning'|'error'|'info'), soft, className }
 */
const SOLID = {
  neutral: 'badge-neutral',
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
};
const SOFT = {
  neutral: 'bg-base-200 text-base-content/70',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-info/10 text-info',
};

export default function Badge({ variant = 'neutral', soft = true, className = '', children, ...rest }) {
  return (
    <span
      className={
        soft
          ? `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SOFT[variant] ?? SOFT.neutral} ${className}`
          : `badge ${SOLID[variant] ?? SOLID.neutral} ${className}`
      }
      {...rest}
    >
      {children}
    </span>
  );
}
