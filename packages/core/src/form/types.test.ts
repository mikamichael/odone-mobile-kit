import { describe, expect, it } from 'vitest';
import { validateFields, type Field } from './types.ts';

const fields: Field[] = [
  { key: 'code', label: '编号', type: 'text', required: true },
  {
    key: 'qty',
    label: '数量',
    type: 'number',
    required: true,
    validate: (value) => (Number(value) > 0 ? undefined : '数量要大于 0'),
  },
];

describe('表单校验', () => {
  it('必填缺失逐字段报出来', () => {
    const errors = validateFields(fields, { code: '  ', qty: '' });
    expect(errors.code).toBe('请填写编号');
    expect(errors.qty).toBe('请填写数量');
  });

  it('自定义校验在必填通过后生效', () => {
    expect(validateFields(fields, { code: 'A-1', qty: '0' }).qty).toBe('数量要大于 0');
  });

  it('全部合规时没有任何错误', () => {
    expect(validateFields(fields, { code: 'A-1', qty: '5' })).toEqual({});
  });
});
