/**
 * KitInput —— 44px 触屏高度 + 自动接线（id / aria-invalid / aria-describedby）
 *
 * 全仓禁止再直接用 shadcn 的 Input：它的默认高度 36px，在车间戴手套点不中。
 * 显式传入的 aria-* 与 id 优先，不被上下文覆盖。
 */
import type { ComponentProps } from 'react';
import { Input } from '../ui/input.tsx';
import { useKitField } from './KitField.tsx';

export type KitInputProps = ComponentProps<typeof Input>;

export function KitInput({ className, ...rest }: KitInputProps) {
  const field = useKitField();
  const classes = ['min-h-11', className].filter(Boolean).join(' ');

  return (
    <Input
      {...rest}
      id={rest.id ?? field?.id}
      className={classes}
      aria-invalid={rest['aria-invalid'] ?? (field?.invalid ? true : undefined)}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      aria-required={rest['aria-required'] ?? (field?.required ? true : undefined)}
    />
  );
}
