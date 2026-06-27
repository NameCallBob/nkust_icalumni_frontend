import React from 'react';
import PageHeader from './PageHeader';

/**
 * AdminPage — 後台頁面統一外殼，確保所有管理頁的內容寬度/留白一致。
 * 用法：
 *   <AdminPage title="使用者管理" subtitle="..." icon={<Users/>} actions={<Button/>}>
 *     ...頁面內容...
 *   </AdminPage>
 *
 * - 統一 max-w-7xl 置中容器 + 響應式左右留白 + 上下間距
 * - 內含 PageHeader（傳 title 時自動顯示）
 * - width="wide" 可用 max-w-screen-2xl（極寬頁面如儀表板）
 */
const MAXW = {
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
  narrow: 'max-w-4xl',
};

export default function AdminPage({
  title,
  subtitle,
  icon,
  actions,
  width = 'default',
  className = '',
  children,
}) {
  return (
    <div className="min-h-[60vh] bg-base-200/40">
      <div className={`mx-auto w-full ${MAXW[width] ?? MAXW.default} px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
        {title && <PageHeader title={title} subtitle={subtitle} icon={icon} actions={actions} />}
        {children}
      </div>
    </div>
  );
}
