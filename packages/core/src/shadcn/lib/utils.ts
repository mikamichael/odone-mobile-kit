import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** shadcn 约定的 className 合并器：条件类名 + 冲突消解。 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
