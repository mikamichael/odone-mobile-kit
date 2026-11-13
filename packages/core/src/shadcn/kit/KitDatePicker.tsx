/**
 * KitDatePicker —— 手机上点日期用「底部抽屉 + 日历」，不用 Popover 悬浮层
 *
 * 试点实测结论：
 *   - Calendar 日期格子 47×47px，够车间戴手套点
 *   - 但默认英文月份（November 2026），必须 locale=zhCN，否则中文界面蹦英文
 *   - 悬浮 Popover 在小屏容易顶出视口，改用 Sheet 底部抽屉
 * 与 KitField 共用上下文：id / aria-invalid / aria-describedby 自动接线。
 */
import { useState } from 'react';
import { zhCN } from 'date-fns/locale';
import { formatDate } from '../../format/index.ts';
import { Calendar } from '../ui/calendar.tsx';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet.tsx';
import { useKitField } from './KitField.tsx';

export interface KitDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** 抽屉标题，无障碍读屏会念它（Sheet 必须有 Title） */
  title?: string;
  className?: string;
  id?: string;
}

export function KitDatePicker({
  value,
  onChange,
  placeholder = '选择日期',
  title = '选择日期',
  className,
  id,
}: KitDatePickerProps) {
  const [open, setOpen] = useState(false);
  const field = useKitField();
  const classes = [
    'border-border flex min-h-11 w-full items-center justify-between rounded-md border px-3 text-left text-sm',
    value ? '' : 'text-muted-foreground',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        id={id ?? field?.id}
        aria-invalid={field?.invalid ? true : undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required ? true : undefined}
        className={classes}
      >
        <span>{value ? formatDate(value) : placeholder}</span>
        <span aria-hidden="true" className="text-muted-foreground">
          选择
        </span>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="flex justify-center px-2 pb-2">
          <Calendar
            mode="single"
            locale={zhCN}
            selected={value}
            onSelect={(next) => {
              onChange?.(next);
              setOpen(false);
            }}
            className="w-full"
          />
        </div>
        <SheetFooter>
          <SheetClose className="border-border min-h-11 w-full rounded-md border px-4">取消</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
