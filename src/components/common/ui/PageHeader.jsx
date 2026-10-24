import React from 'react';

/**
 * PageHeader — 頁首區塊：標題 + 副標 + 右側操作。後台頁面通用。
 * props: { title, subtitle, icon, actions, className }
 */
export default function PageHeader({ title, subtitle, icon, actions, className = '' }) {
  return (
    <div className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-base-content truncate">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
