import React from 'react';
import EmptyState from './EmptyState';
import Spinner from './Spinner';

/**
 * DataTable — 響應式資料表：桌機顯示 table，手機自動轉為卡片堆疊。
 * props:
 *  - columns: [{ key, header, render?(row), className?, hideOnMobile? }]
 *  - data: array
 *  - rowKey: (row, i) => string|number
 *  - loading, empty(ReactNode), onRowClick(row)
 *
 * 注意：純展示元件，不改變資料來源；把既有 state 的資料傳進來即可。
 */
export default function DataTable({
  columns = [],
  data = [],
  rowKey,
  loading = false,
  empty,
  onRowClick,
  className = '',
}) {
  if (loading) return <Spinner center label="載入中..." />;
  if (!data || data.length === 0) return empty || <EmptyState />;
  const keyOf = (row, i) => (rowKey ? rowKey(row, i) : row.id ?? i);

  return (
    <div className={className}>
      {/* 桌機表格 */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
        <table className="table">
          <thead>
            <tr className="bg-base-200/60 text-base-content/70">
              {columns.map((c) => (
                <th key={c.key} className={c.className}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={keyOf(row, i)}
                className={onRowClick ? 'hover cursor-pointer' : 'hover'}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} className={c.className}>
                    {c.render ? c.render(row, i) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 手機卡片 */}
      <div className="md:hidden space-y-3">
        {data.map((row, i) => (
          <div
            key={keyOf(row, i)}
            className={`rounded-2xl border border-base-300/70 bg-base-100 p-4 shadow-sm ${onRowClick ? 'active:bg-base-200' : ''}`}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.filter((c) => !c.hideOnMobile).map((c) => (
              <div key={c.key} className="flex justify-between gap-3 py-1.5 border-b border-base-200 last:border-0">
                <span className="text-xs font-medium text-base-content/50 shrink-0">{c.header}</span>
                <span className="text-sm text-right text-base-content">
                  {c.render ? c.render(row, i) : row[c.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
