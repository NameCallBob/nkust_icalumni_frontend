import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState — 無資料佔位（圖示 + 說明 + 可選操作）。
 * props: { icon, title, description, action, className }
 */
export default function EmptyState({ icon, title = '目前沒有資料', description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-14 px-4 ${className}`}>
      <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/40">
        {icon || <Inbox className="h-8 w-8" />}
      </span>
      <p className="font-medium text-base-content">{title}</p>
      {description && <p className="mt-1 text-sm text-base-content/50 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
