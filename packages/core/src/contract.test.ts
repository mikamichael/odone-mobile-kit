/**
 * 类型契约测试（type-level tests）
 *
 * 只测「公开类型的形状」，不测行为 —— 行为在 *.test.tsx 里。
 * 这些断言在运行时是空操作，真正生效的是 `npm run typecheck`（tsc --noEmit）。
 * 目的：以后改 props / 改联合类型时，破坏契约会在 typecheck 阶段直接报错，
 * 而不是等到某个业务页编译不过才发现。
 *
 * 写法参考 typescript-advanced-types: 「Test your types」（SKILL.md:279-300）。
 */
import { describe, expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import type { Column, DataListProps } from './list/types.ts';
import type { Field, FieldErrors, FieldType, FormShellProps } from './form/types.ts';
import type { PageShellProps } from './layout/PageShell.tsx';
import { validateFields } from './form/types.ts';

interface Row {
  id: string;
  qty: number;
}

describe('DataList 类型契约', () => {
  it('行的类型由 rows 推导，透传到列与回调', () => {
    expectTypeOf<DataListProps<Row>['rows']>().toEqualTypeOf<Row[]>();
    expectTypeOf<DataListProps<Row>['rowKey']>().toEqualTypeOf<(row: Row) => string>();
    expectTypeOf<DataListProps<Row>['onRowClick']>().toEqualTypeOf<((row: Row) => void) | undefined>();
    expectTypeOf<NonNullable<Column<Row>['render']>>().parameter(0).toEqualTypeOf<Row>();
    expectTypeOf<NonNullable<Column<Row>['render']>>().returns.toEqualTypeOf<ReactNode>();
  });

  it('error 允许 null（未出错时），loading 是布尔', () => {
    expectTypeOf<DataListProps<Row>['error']>().toEqualTypeOf<string | null | undefined>();
    expectTypeOf<DataListProps<Row>['loading']>().toEqualTypeOf<boolean | undefined>();
  });

  it('rowKey 必须返回 string —— 返回数字必须编译不过', () => {
    // @ts-expect-error rowKey 的返回值约定为 string，返回 number 应被拒绝
    const bad: DataListProps<Row>['rowKey'] = (row: Row) => row.qty;
    void bad;
  });
});

describe('表单类型契约', () => {
  it('FieldType 是封闭联合：新增类型必须显式改这里', () => {
    expectTypeOf<FieldType>().toEqualTypeOf<'text' | 'number' | 'select' | 'date' | 'textarea'>();
  });

  it('validate 返回「一句话错误或 undefined」', () => {
    expectTypeOf<NonNullable<Field['validate']>>().returns.toEqualTypeOf<string | undefined>();
    expectTypeOf<NonNullable<Field['validate']>>().parameter(1).toEqualTypeOf<Record<string, string>>();
  });

  it('validateFields 返回 FieldErrors（键 → 错误或 undefined）', () => {
    expectTypeOf(validateFields).returns.toEqualTypeOf<FieldErrors>();
    expectTypeOf<FieldErrors>().toEqualTypeOf<Record<string, string | undefined>>();
  });

  it('onChange 是 (key, value) 两参，不是事件对象', () => {
    expectTypeOf<FormShellProps['onChange']>().toEqualTypeOf<(key: string, value: string) => void>();
  });

  it('FieldType 之外的取值必须编译不过', () => {
    // @ts-expect-error checkbox 不是本内核支持的字段类型；要支持得先扩 FieldType
    const t: FieldType = 'checkbox';
    void t;
  });
});

describe('页面外壳类型契约', () => {
  it('返回键与下拉刷新都是可选的，children 必填', () => {
    expectTypeOf<PageShellProps['onBack']>().toEqualTypeOf<(() => void) | undefined>();
    expectTypeOf<PageShellProps['onRefresh']>().toEqualTypeOf<(() => void | Promise<void>) | undefined>();
    // @ts-expect-error children 是必填项，少了应编译不过
    const missingChildren: PageShellProps = { title: '标题' };
    void missingChildren;
  });
});
