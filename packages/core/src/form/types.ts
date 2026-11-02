import type { ReactNode } from 'react';

export type FieldType = 'text' | 'number' | 'select' | 'date' | 'textarea';

export interface FieldOption {
  value: string;
  label: string;
}

/** 表单字段声明：页面只写这份声明，控件与校验由 FormShell 出。 */
export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  /** 输入框右侧的单位，如 kg / 支 / 元。 */
  unit?: string;
  options?: FieldOption[];
  help?: string;
  readOnly?: boolean;
  /** 返回一句话就是错误；返回 undefined 就是通过。 */
  validate?: (value: string, values: Record<string, string>) => string | undefined;
}

export type FieldErrors = Record<string, string | undefined>;

/** 必填 + 自定义校验，一次算完。 */
export function validateFields(
  fields: Field[],
  values: Record<string, string>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of fields) {
    const raw = values[field.key] ?? '';
    const value = raw.trim();
    if (field.required && !value) {
      errors[field.key] = `请填写${field.label}`;
      continue;
    }
    if (field.validate) {
      const message = field.validate(value, values);
      if (message) errors[field.key] = message;
    }
  }
  return errors;
}

export interface FormShellProps {
  fields: Field[];
  values: Record<string, string>;
  errors?: FieldErrors;
  onChange: (key: string, value: string) => void;
  onSubmit: (values: Record<string, string>) => void;
  submitText?: string;
  disabled?: boolean;
  /** 提交按钮下方的附加区域（如错误提示、链接）。 */
  footer?: ReactNode;
}
