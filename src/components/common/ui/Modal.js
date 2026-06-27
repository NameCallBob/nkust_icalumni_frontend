import React from 'react';

/**
 * Modal 內容原子 — 讓所有 Modal 用同一套積木組裝，骨架一致。
 * 搭配 AppModal（外殼）使用。
 *
 * <AppModal title=... footer={<ModalActions ... />}>
 *   <ModalSection title="基本資訊" icon={<.../>}>
 *     <ModalGrid cols={2}>
 *       <Field .../> <Field .../>
 *     </ModalGrid>
 *   </ModalSection>
 *   <ModalSection title="聯絡方式">
 *     <InfoItem icon={<Mail/>} label="Email">a@b.c</InfoItem>
 *   </ModalSection>
 * </AppModal>
 */

/** 區塊：統一標題（深藍 + 細線）+ 內容 */
export function ModalSection({ title, icon, description, className = '', children }) {
  return (
    <section className={`mb-6 last:mb-0 ${className}`}>
      {title && (
        <div className="mb-3 flex items-center gap-2 border-b border-base-200 pb-2">
          {icon && <span className="text-primary">{icon}</span>}
          <h3 className="font-semibold text-base-content">{title}</h3>
          {description && (
            <span className="ml-1 text-xs font-normal text-base-content/50">{description}</span>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

/** 欄位響應式格線：手機單欄、桌機可雙欄（表單欄位用） */
export function ModalGrid({ cols = 2, className = '', children }) {
  const c = cols === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';
  return <div className={`grid ${c} gap-x-5 ${className}`}>{children}</div>;
}

/** 詳情列：圖示 + 標籤 + 值（展示型 Modal 用） */
export function InfoItem({ icon, label, className = '', children }) {
  return (
    <div className={`flex items-start gap-2 py-1.5 text-sm ${className}`}>
      {icon && <span className="mt-0.5 shrink-0 text-base-content/40">{icon}</span>}
      <span className="min-w-0 break-words">
        {label && <span className="font-medium text-base-content/70">{label}：</span>}
        <span className="text-base-content">{children}</span>
      </span>
    </div>
  );
}

/** 統一底部動作：次要(ghost)在左、主要在右。直接傳給 AppModal 的 footer。 */
export function ModalActions({ children }) {
  return <>{children}</>;
}
