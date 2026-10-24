import React from 'react';

/**
 * Button — DaisyUI 按鈕封裝，取代 react-bootstrap <Button variant>。
 * variant: primary | secondary | accent | ghost | outline | error | success
 * size: sm | md | lg
 */
const VARIANT = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  outline: 'btn-outline btn-primary',
  error: 'btn-error',
  success: 'btn-success',
  link: 'btn-link',
};
const SIZE = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn ${VARIANT[variant] || VARIANT.primary} ${SIZE[size] || ''} ${className}`.trim()}
      {...rest}
    >
      {loading && <span className="loading loading-spinner loading-sm" />}
      {children}
    </button>
  );
}
