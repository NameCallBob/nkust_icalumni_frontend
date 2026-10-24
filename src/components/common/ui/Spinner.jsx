import React from 'react';

/**
 * Spinner — DaisyUI loading 封裝，取代 react-bootstrap <Spinner>。
 * size: sm | md | lg ; center: 是否置中佔位
 */
const SIZE = { sm: 'loading-sm', md: 'loading-md', lg: 'loading-lg' };

export default function Spinner({ size = 'md', center = false, label, className = '' }) {
  const spinner = (
    <span
      className={`loading loading-spinner ${SIZE[size] || SIZE.md} text-primary ${className}`.trim()}
      role="status"
      aria-label={label || '載入中'}
    />
  );
  if (!center) return spinner;
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6">
      {spinner}
      {label && <span className="text-sm text-base-content/60">{label}</span>}
    </div>
  );
}
