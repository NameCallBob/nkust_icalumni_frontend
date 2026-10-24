import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './feedback';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-navy text-primary-foreground shadow-sm hover:bg-navy-700',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-border bg-background text-foreground hover:bg-muted',
        secondary: 'bg-muted text-foreground hover:bg-muted/70',
        ghost: 'text-foreground hover:bg-muted',
        link: 'text-brand-navy underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

/** loading 為 true 時顯示轉圈並禁用按鈕。 */
export const Button = React.forwardRef(function Button(
  { className, variant, size, loading = false, disabled, type = 'button', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
});
