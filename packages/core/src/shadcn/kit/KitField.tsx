/**
 * KitField —— 把 shadcn 的 Field 家族收成「一个字段一个组件」
 *
 * 为什么封这一层（试点实测出来的三个坑）：
 *   1. shadcn 的 FieldDescription/FieldError 不会自动挂 aria-describedby，得自己给 id 并连上
 *   2. 校验态要在两处写：Field 的 data-invalid、控件的 aria-invalid，漏一处读屏就残疾
 *   3. 控件默认 36px，低于车间 44px 触屏纪律
 * 这里用 context 一次算好 id / describedBy / invalid，控件（KitInput、KitDatePicker）自己来取。
 */
import { createContext, useContext, useId, type ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field.tsx';

export interface KitFieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

const KitFieldContext = createContext<KitFieldContextValue | null>(null);

/** 供 KitInput / KitDatePicker 等控件取上下文；脱离 KitField 用时返回 null，控件自动降级。 */
export function useKitField(): KitFieldContextValue | null {
  return useContext(KitFieldContext);
}

export interface KitFieldProps {
  /** 不传则自动生成，用于 label htmlFor / 控件 id / 错误文案 id 三处对齐 */
  id?: string;
  label: string;
  description?: string;
  /** 有值即视为校验失败：同时打开 data-invalid 与 aria-invalid */
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function KitField({
  id,
  label,
  description,
  error,
  required = false,
  className,
  children,
}: KitFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `kit-field-${autoId}`;
  const descriptionId = description ? `${fieldId}-desc` : undefined;
  const errorId = error ? `${fieldId}-err` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <KitFieldContext.Provider value={{ id: fieldId, describedBy, invalid: Boolean(error), required }}>
      <Field data-invalid={error ? true : undefined} className={className}>
        <FieldLabel htmlFor={fieldId}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </FieldLabel>
        {children}
        {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
        {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      </Field>
    </KitFieldContext.Provider>
  );
}
