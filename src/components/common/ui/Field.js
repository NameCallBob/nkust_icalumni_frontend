import React from 'react';

/**
 * Field — DaisyUI 表單欄位封裝，取代 react-bootstrap <Form.Group>+<Form.Label>+<Form.Control>。
 * as: 'input' | 'textarea' | 'select'
 * 統一處理 label、必填星號、錯誤訊息、說明文字。
 */
export default function Field({
  as = 'input',
  label,
  required = false,
  error,
  help,
  className = '',
  children, // select 的 <option>
  ...rest
}) {
  const base =
    as === 'textarea'
      ? 'textarea textarea-bordered'
      : as === 'select'
      ? 'select select-bordered'
      : 'input input-bordered';
  const control = `${base} w-full ${error ? 'border-error' : ''} ${className}`.trim();

  return (
    <div className="form-control w-full mb-4">
      {label && (
        <label className="label pb-1">
          <span className="label-text font-medium text-base-content">
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </span>
        </label>
      )}

      {as === 'textarea' ? (
        <textarea className={control} {...rest} />
      ) : as === 'select' ? (
        <select className={control} {...rest}>
          {children}
        </select>
      ) : (
        <input className={control} {...rest} />
      )}

      {error ? (
        <span className="label-text-alt text-error mt-1">{error}</span>
      ) : help ? (
        <span className="label-text-alt text-base-content/60 mt-1">{help}</span>
      ) : null}
    </div>
  );
}
