/**
 * Kit* 封装的行为契约：这些性质是「封装存在的理由」，退化了就说明白封了。
 * 只测我们自己加的那层，不测 shadcn/radix 内部。
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { formatDate } from '../../format/index.ts';
import { KitDatePicker } from './KitDatePicker.tsx';
import { KitField } from './KitField.tsx';
import { KitInput } from './KitInput.tsx';

describe('KitField + KitInput', () => {
  it('自动接线 id / aria-describedby / aria-invalid / aria-required', () => {
    render(
      <KitField id="q" label="领用数量" description="单位按主档" error="数量不能为空" required>
        <KitInput value="" onChange={() => {}} />
      </KitField>,
    );

    const input = screen.getByLabelText(/领用数量/) as HTMLInputElement;
    expect(input.id).toBe('q');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');

    const describedBy = (input.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
    expect(describedBy).toEqual(['q-desc', 'q-err']);
    // 两个 id 必须真的能在 DOM 里找到，否则读屏念不出来
    for (const id of describedBy) {
      expect(document.getElementById(id)?.textContent?.trim().length).toBeGreaterThan(0);
    }
  });

  it('无错误时不挂 aria-invalid，只关联说明文案', () => {
    render(
      <KitField id="q2" label="数量" description="说明">
        <KitInput value="1" onChange={() => {}} />
      </KitField>,
    );

    const input = screen.getByLabelText('数量') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe('q2-desc');
  });

  it('始终给 44px 触屏高度，且允许调用方覆盖 aria', () => {
    render(<KitInput aria-invalid={false} className="text-right" value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.className).toContain('min-h-11');
    expect(input.className).toContain('text-right');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });
});

describe('KitDatePicker', () => {
  it('有值时按北京时间 yyyy-MM-dd 显示，无值显示占位符', () => {
    const { unmount } = render(<KitDatePicker value={new Date('2026-11-13T02:00:00+08:00')} />);
    expect(screen.getByText('2026-11-13')).toBeInTheDocument();
    unmount();

    render(<KitDatePicker placeholder="选择需求日期" />);
    expect(screen.getByText('选择需求日期')).toBeInTheDocument();
  });
});

describe('formatDate', () => {
  it('按北京时间取年月日，不受 UTC 偏移影响', () => {
    // 北京时间 2026-11-13 00:30 = UTC 2026-11-12 16:30，直接 toISOString 会切到 12 号
    expect(formatDate(new Date('2026-11-13T00:30:00+08:00'))).toBe('2026-11-13');
    expect(formatDate(null)).toBe('—');
    expect(formatDate('not-a-date')).toBe('—');
  });
});
