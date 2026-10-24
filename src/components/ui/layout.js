import React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={cn('rounded-xl border border-border bg-card text-foreground shadow-sm', className)} {...props} />;
});

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />;
}

/** 前台區塊：統一左右留白與最大寬度。 */
export function Section({ className, children, ...props }) {
  return (
    <section className={cn('px-4 py-10 sm:px-6 lg:px-8', className)} {...props}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** 後台頁面外殼：標題列（icon 為 lucide 元件）＋右側操作區＋內容。 */
export function AdminPage({ title, description, icon: Icon, actions, className, children }) {
  return (
    <div className="min-h-[60vh] bg-background">
      <div className={cn('mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8', className)}>
        {(title || actions) && (
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              {Icon && (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy" aria-hidden="true">
                  <Icon className="h-5 w-5" />
                </span>
              )}
              <div>
                {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}
export const TableHeader = ({ className, ...props }) => <thead className={cn('border-b border-border bg-muted/50', className)} {...props} />;
export const TableBody = ({ className, ...props }) => <tbody className={cn('[&>tr:last-child]:border-0', className)} {...props} />;
export const TableRow = ({ className, ...props }) => <tr className={cn('border-b border-border transition-colors hover:bg-muted/40', className)} {...props} />;
export const TableHead = ({ className, ...props }) => (
  <th className={cn('h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground', className)} {...props} />
);
export const TableCell = ({ className, ...props }) => <td className={cn('px-4 py-3 align-middle', className)} {...props} />;

/** 分頁。page 從 1 起算；只有一頁以下時不渲染。 */
export function Pagination({ page, totalPages, onPageChange, className }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const add = (p) => pages.push(p);
  const windowStart = Math.max(2, page - 1);
  const windowEnd = Math.min(totalPages - 1, page + 1);
  add(1);
  if (windowStart > 2) add('start-ellipsis');
  for (let p = windowStart; p <= windowEnd; p += 1) add(p);
  if (windowEnd < totalPages - 1) add('end-ellipsis');
  add(totalPages);

  const base =
    'inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

  return (
    <nav aria-label="分頁" className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      <button type="button" className={cn(base, 'border-border bg-background hover:bg-muted')} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        上一頁
      </button>
      {pages.map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="px-1 text-muted-foreground" aria-hidden="true">…</span>
        ) : (
          <button
            type="button"
            key={p}
            aria-current={p === page ? 'page' : undefined}
            className={cn(base, p === page ? 'border-brand-navy bg-brand-navy text-primary-foreground' : 'border-border bg-background hover:bg-muted')}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}
      <button type="button" className={cn(base, 'border-border bg-background hover:bg-muted')} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        下一頁
      </button>
    </nav>
  );
}
