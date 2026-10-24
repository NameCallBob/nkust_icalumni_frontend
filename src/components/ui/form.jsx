import React, { useId } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlBase =
  'flex w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground shadow-sm transition-colors ' +
  'placeholder:text-muted-foreground focus-visible:border-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive';

export const Input = React.forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return <input ref={ref} type={type} className={cn(controlBase, 'h-11', className)} {...props} />;
});

export const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(controlBase, 'min-h-[88px] py-2', className)} {...props} />;
});

export const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return <LabelPrimitive.Root ref={ref} className={cn('text-sm font-medium leading-none text-foreground', className)} {...props} />;
});

/**
 * 表單欄位：label + 控制項 + 提示 / 錯誤訊息。
 * as: 'input'（預設）| 'textarea'；className 套在最外層容器，其餘 props 傳給控制項。
 */
export function Field({ as = 'input', label, required, error, hint, id, className, ...props }) {
  const autoId = useId();
  const controlId = id || autoId;
  const messageId = `${controlId}-msg`;
  const Control = as === 'textarea' ? Textarea : Input;
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label htmlFor={controlId}>
          {label}
          {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
        </Label>
      )}
      <Control
        id={controlId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        {...props}
      />
      {error ? (
        <p id={messageId} className="text-xs text-destructive" role="alert">{error}</p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export const Switch = React.forwardRef(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-navy data-[state=unchecked]:bg-slate-300',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );
});

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Trigger ref={ref} className={cn(controlBase, 'h-11 items-center justify-between gap-2 text-left [&>span]:line-clamp-1', className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

export const SelectContent = React.forwardRef(function SelectContent({ className, children, position = 'popper', ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          'relative z-[1100] max-h-72 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-modal',
          position === 'popper' && 'w-[var(--radix-select-trigger-width)] translate-y-1',
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export const SelectItem = React.forwardRef(function SelectItem({ className, children, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex min-h-[40px] w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none',
        'data-[highlighted]:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-brand-navy" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef(function TabsList({ className, ...props }, ref) {
  return <TabsPrimitive.List ref={ref} className={cn('inline-flex items-center gap-1 rounded-lg bg-muted p-1', className)} {...props} />;
});

export const TabsTrigger = React.forwardRef(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex min-h-[40px] items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-background data-[state=active]:text-brand-navy data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  );
});

export const TabsContent = React.forwardRef(function TabsContent({ className, ...props }, ref) {
  return <TabsPrimitive.Content ref={ref} className={cn('mt-4 focus-visible:outline-none', className)} {...props} />;
});
