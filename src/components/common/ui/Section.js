import React from 'react';

/**
 * Section — 前台內容區塊：置中容器 + 區塊標題（深藍標題 + 金色短線）。
 * props: { title, subtitle, eyebrow, center, width('narrow'|'default'|'wide'|'full'), className, children }
 */
const WIDTH = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
};

export function SectionTitle({ title, subtitle, eyebrow, center = false }) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-base-content inline-block">
        {title}
      </h2>
      <div className={`mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-primary ${center ? 'mx-auto' : ''}`} />
      {subtitle && <p className="mt-4 text-base-content/60 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export default function Section({
  title,
  subtitle,
  eyebrow,
  center = false,
  width = 'default',
  className = '',
  children,
}) {
  return (
    <section className={`px-4 sm:px-6 py-10 sm:py-14 ${className}`}>
      <div className={`mx-auto ${WIDTH[width] ?? WIDTH.default}`}>
        {title && <SectionTitle title={title} subtitle={subtitle} eyebrow={eyebrow} center={center} />}
        {children}
      </div>
    </section>
  );
}
