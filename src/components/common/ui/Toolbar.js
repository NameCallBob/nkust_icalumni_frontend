import React from 'react';

/**
 * Toolbar — 後台列表上方的搜尋/篩選/操作列。RWD：手機自動換行堆疊。
 * props: { left, right, className }  // 左側通常放搜尋/篩選，右側放新增等主操作
 */
export default function Toolbar({ left, right, className = '' }) {
  return (
    <div className={`mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex flex-wrap items-center gap-2 min-w-0">{left}</div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}
