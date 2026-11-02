import type { Field, FormShellProps } from './types.ts';

/**
 * 声明式表单：字段声明 → 控件 + 必填标记 + 单位 + 错误提示。
 * 所有控件都是原生元素，能被测试直接查到，也不依赖任何 UI 框架。
 */
export function FormShell({
  fields,
  values,
  errors = {},
  onChange,
  onSubmit,
  submitText = '提交',
  disabled = false,
  footer,
}: FormShellProps) {
  return (
    <form
      className="kit-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      {fields.map((field) => (
        <FieldControl
          key={field.key}
          field={field}
          value={values[field.key] ?? ''}
          error={errors[field.key]}
          disabled={disabled}
          onChange={(next) => onChange(field.key, next)}
        />
      ))}
      <button type="submit" className="kit-button kit-button--primary" disabled={disabled}>
        {submitText}
      </button>
      {footer ? <div className="kit-form__footer">{footer}</div> : null}
    </form>
  );
}

interface FieldControlProps {
  field: Field;
  value: string;
  error?: string | undefined;
  disabled: boolean;
  onChange: (value: string) => void;
}

function FieldControl({ field, value, error, disabled, onChange }: FieldControlProps) {
  const inputId = `kit-field-${field.key}`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : field.help ? `${inputId}-help` : undefined;

  return (
    <div className={`kit-field${error ? ' kit-field--invalid' : ''}`}>
      <label className="kit-field__label" htmlFor={inputId}>
        {field.label}
        {field.required ? <span className="kit-field__required">*</span> : null}
      </label>

      <div className="kit-field__control">
        {field.type === 'select' ? (
          <select
            id={inputId}
            className="kit-input"
            value={value}
            disabled={disabled || field.readOnly}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">{field.placeholder ?? '请选择'}</option>
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={inputId}
            className="kit-input kit-input--textarea"
            value={value}
            rows={3}
            placeholder={field.placeholder}
            disabled={disabled || field.readOnly}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <input
            id={inputId}
            className="kit-input"
            type={field.type === 'number' ? 'text' : field.type === 'date' ? 'date' : 'text'}
            inputMode={field.type === 'number' ? 'decimal' : undefined}
            value={value}
            placeholder={field.placeholder}
            disabled={disabled || field.readOnly}
            readOnly={field.readOnly}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
        {field.unit ? <span className="kit-field__unit">{field.unit}</span> : null}
      </div>

      {error ? (
        <p className="kit-field__error" id={errorId}>
          {error}
        </p>
      ) : field.help ? (
        <p className="kit-field__help" id={`${inputId}-help`}>
          {field.help}
        </p>
      ) : null}
    </div>
  );
}
