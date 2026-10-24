import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/**
 * preventQuickClose：點背景或按 Esc 不會關閉（表單類對話框避免誤觸遺失輸入）。
 * hideClose：隱藏右上角的關閉鈕（例如上傳中）。
 */
export const DialogContent = React.forwardRef(function DialogContent(
  { className, children, preventQuickClose = false, hideClose = false, onPointerDownOutside, onInteractOutside, onEscapeKeyDown, ...props },
  ref
) {
  const block = (cb) => (e) => {
    if (preventQuickClose) e.preventDefault();
    if (cb) cb(e);
  };
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[1000] bg-slate-950/55 backdrop-blur-xs data-[state=open]:animate-in" />
      <DialogPrimitive.Content
        ref={ref}
        aria-describedby={props['aria-describedby']}
        onPointerDownOutside={block(onPointerDownOutside)}
        onInteractOutside={block(onInteractOutside)}
        onEscapeKeyDown={block(onEscapeKeyDown)}
        className={cn(
          'fixed left-1/2 top-1/2 z-[1001] flex max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4',
          'overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-modal animate-modalIn focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="關閉"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DialogHeader = ({ className, ...props }) => <div className={cn('flex flex-col gap-1.5 pr-8 text-left', className)} {...props} />;

export const DialogFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
);

export const DialogTitle = React.forwardRef(function DialogTitle({ className, ...props }, ref) {
  return <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-tight text-foreground', className)} {...props} />;
});

export const DialogDescription = React.forwardRef(function DialogDescription({ className, ...props }, ref) {
  return <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />;
});

/** 確認對話框。destructive 讓確認鈕變紅；loading 期間禁止關閉。 */
export function ConfirmDialog({
  open, onOpenChange, title, description, confirmText = '確認', cancelText = '取消',
  destructive = false, loading = false, onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChange?.(v); }}>
      <DialogContent className="max-w-md" preventQuickClose={loading} hideClose={loading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={loading}>{cancelText}</Button>
          <Button variant={destructive ? 'destructive' : 'default'} onClick={onConfirm} loading={loading}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
