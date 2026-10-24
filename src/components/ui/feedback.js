import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** 轉圈載入指示。size: sm | md | lg；center 會置中並預留上下間距；label 同時作為無障礙文字。 */
const SPINNER_SIZE = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' };

export function Spinner({ size = 'md', center = false, label, className }) {
  const ring = (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-brand-navy border-t-transparent',
        SPINNER_SIZE[size] || SPINNER_SIZE.md,
        className
      )}
      aria-hidden="true"
    />
  );
  if (!center && !label) {
    return (
      <span role="status" aria-live="polite" className="inline-flex">
        {ring}
        <span className="sr-only">載入中</span>
      </span>
    );
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-3', center && 'w-full py-8')}
    >
      {ring}
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : <span className="sr-only">載入中</span>}
    </div>
  );
}

const alertVariants = cva('relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:shrink-0', {
  variants: {
    variant: {
      default: 'border-border bg-background text-foreground',
      info: 'border-info/30 bg-info/10 text-foreground [&>svg]:text-info',
      success: 'border-success/30 bg-success/10 text-foreground [&>svg]:text-success',
      warning: 'border-warning/40 bg-warning/10 text-foreground [&>svg]:text-warning',
      destructive: 'border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

export function Alert({ className, variant, children, ...props }) {
  return (
    <div role={variant === 'destructive' ? 'alert' : 'status'} className={cn(alertVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export function AlertDescription({ className, ...props }) {
  return <div className={cn('text-sm leading-relaxed', className)} {...props} />;
}

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'border-transparent bg-brand-navy text-primary-foreground',
      secondary: 'border-transparent bg-muted text-foreground',
      outline: 'border-border text-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground',
      info: 'border-transparent bg-info/10 text-info',
      'soft-success': 'border-transparent bg-success/10 text-success',
      'soft-warning': 'border-transparent bg-warning/10 text-warning',
      'soft-muted': 'border-transparent bg-muted text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** 空狀態。icon 可傳 lucide 元件（icon={Foo}）或已建立的元素（icon={<Foo />}）。 */
export function EmptyState({ icon, title, description, action, className }) {
  let iconNode = null;
  if (React.isValidElement(icon)) iconNode = icon;
  else if (icon) iconNode = React.createElement(icon, { className: 'h-8 w-8' });
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-4 py-12 text-center', className)}>
      {iconNode && (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-hidden="true">
          {iconNode}
        </span>
      )}
      {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
