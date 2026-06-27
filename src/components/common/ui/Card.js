import React from 'react';

/**
 * Card — 統一卡片容器（白底、細邊、柔和陰影、hover 微浮）。
 * props: { as, hover, padding('none'|'sm'|'md'|'lg'), className, children }
 */
const PAD = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' };

export default function Card({
  as: Tag = 'div',
  hover = false,
  padding = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={[
        'bg-base-100 rounded-2xl border border-base-300/70 shadow-sm',
        hover ? 'transition-shadow hover:shadow-lg' : '',
        PAD[padding] ?? PAD.md,
        className,
      ].join(' ').trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
