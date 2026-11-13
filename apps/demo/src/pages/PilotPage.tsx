/**
 * shadcn 试点页 —— 长期样板（只在 ?pilot=1 时挂载，不影响现有演示页）
 *
 * 这个页面固定做三件事：
 *   1. 体积对照：它是独立 chunk，build 后与主包分开看
 *   2. 触屏手感：所有可点元素 ≥44px
 *   3. 无障碍：KitField 自动接线，Sheet/Dialog 必须有 Title
 *
 * 结论沉淀（改这里之前先读）：
 *   - 表单优先用 KitField + KitInput / KitDatePicker，不要直接用 shadcn 的 Input（默认 36px）
 *   - Calendar 必须 locale=zhCN，否则中文界面出现英文月份（KitDatePicker 已内置）
 *   - Table 在 390 视口下 4 列就溢出（实测宽 398 > 容器 356），车间手机端不要用，换卡片视图
 *   - 原语在 @kit/core/shadcn/ui/ 下；新增组件用 shadcn add -c apps/demo 会直接落到包内
 */
import { useState } from 'react';
import { formatDate } from '@kit/core';
import {
  Button,
  Calendar,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldGroup,
  FieldLabel,
  KitDatePicker,
  KitField,
  KitInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toaster,
} from '@kit/core/shadcn';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

export function PilotPage() {
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [inlineDate, setInlineDate] = useState<Date | undefined>(new Date());
  const qtyError = qty.trim() === '' ? '数量不能为空' : undefined;

  return (
    <div className="flex min-h-dvh flex-col gap-4 p-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">shadcn 试点样板</h1>
        <p className="text-muted-foreground text-sm">
          KitField / KitInput / KitDatePicker + Sheet / Dialog / Table —— 验手感、体积、无障碍
        </p>
      </header>

      <FieldGroup>
        {/* KitField 自动把 id / aria-describedby / aria-invalid 接到 KitInput 上 */}
        <KitField
          id="pilot-qty"
          label="领用数量"
          description="单位按物料主档，无需手输"
          error={qtyError}
          required
        >
          <KitInput inputMode="decimal" placeholder="请输入数量" value={qty} onChange={(event) => setQty(event.target.value)} />
        </KitField>

        <KitField id="pilot-due" label="需求日期" description="抽屉里选，格子 47px，戴手套也点得中">
          <KitDatePicker value={dueDate} onChange={setDueDate} />
        </KitField>

        {/* Select 暂无 Kit 封装：目前只需自己补 min-h-11 */}
        <Field>
          <FieldLabel htmlFor="pilot-unit">计量单位</FieldLabel>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger id="pilot-unit" className="min-h-11 w-full">
              <SelectValue placeholder="选择单位" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="qz">千支</SelectItem>
                <SelectItem value="kg">公斤</SelectItem>
                <SelectItem value="pcs">个</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Sheet>
          <SheetTrigger className="border-border min-h-11 rounded-md border px-4">打开底部抽屉</SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>领料确认</SheetTitle>
              <SheetDescription>Sheet 必须有 Title，读屏靠它报出这是哪个弹层</SheetDescription>
            </SheetHeader>
            <div className="px-4 py-2 text-sm">
              数量 {qty || '—'} {unit || ''} · 需求日期 {dueDate ? formatDate(dueDate) : '—'}
            </div>
            <SheetFooter>
              <SheetClose className="border-border min-h-11 w-full rounded-md border px-4">关闭</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <button
          type="button"
          className="bg-primary text-primary-foreground min-h-11 rounded-md px-4"
          onClick={() => toast.success('已提交（模拟）')}
        >
          弹一个 toast
        </button>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">表格 Table（宽屏用；390 视口下 4 列必溢出，要横滚）</h2>
        <div className="border-border rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>单号</TableHead>
                <TableHead>物料</TableHead>
                <TableHead className="text-right">数量</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { code: 'DEMO-2026-0001', item: '304花瓣膨胀', qty: '12 千支', state: '未审' },
                { code: 'DEMO-2026-0002', item: '六角法兰螺栓 M8×25', qty: '40 千支', state: '已审' },
                { code: 'DEMO-2026-0003', item: '平垫圈 M8', qty: '8 千支', state: '已审' },
              ].map((row) => (
                <TableRow key={row.code}>
                  <TableCell className="whitespace-nowrap">{row.code}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.item}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{row.qty}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">确认弹窗 Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="min-h-11">
              删除单据
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除 DEMO-2026-0001？</DialogTitle>
              <DialogDescription>删除后不可恢复；已审核单据需先弃审。</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="min-h-11 flex-1">
                  取消
                </Button>
              </DialogClose>
              <Button variant="destructive" className="min-h-11 flex-1" onClick={() => toast.error('已取消（模拟）')}>
                确认删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">原始 Calendar（对照用：KitDatePicker 就是它 + 中文 + 抽屉）</h2>
        <Calendar mode="single" locale={zhCN} selected={inlineDate} onSelect={setInlineDate} className="border-border w-full rounded-md border" />
        <p className="text-muted-foreground text-sm">已选：{inlineDate ? formatDate(inlineDate) : '—'}</p>
      </section>

      <Toaster position="top-center" />
    </div>
  );
}
