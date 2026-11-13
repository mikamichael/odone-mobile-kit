/**
 * @kit/core/shadcn —— 需要 Tailwind v4 + shadcn 的组件子入口
 *
 * 单独开一个入口，是为了让不用 Tailwind 的车间 H5 页面继续只用 @kit/core：
 * 谁 import 了 '@kit/core/shadcn'，谁才承担 radix / date-fns / sonner 的体积。
 *
 * 用法要点见各 Kit* 组件头部注释；对外优先用 Kit* 封装，不要直接引 ui/ 下原语。
 */
export * from './ui/button.tsx';
export * from './ui/calendar.tsx';
export * from './ui/dialog.tsx';
export * from './ui/field.tsx';
export * from './ui/input.tsx';
export * from './ui/label.tsx';
export * from './ui/select.tsx';
export * from './ui/separator.tsx';
export * from './ui/sheet.tsx';
export * from './ui/sonner.tsx';
export * from './ui/table.tsx';

export * from './kit/KitField.tsx';
export * from './kit/KitInput.tsx';
export * from './kit/KitDatePicker.tsx';
