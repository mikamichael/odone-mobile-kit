import { describe, expect, it } from 'vitest';
import { createErrorMap } from '../api/errors.ts';

const map = createErrorMap({
  codes: {
    DEMO_NOT_FOUND: { message: '没有找到这条记录。', action: '核对单号' },
    DEMO_LOCKED: { message: '这张单已被别人处理，请刷新后再试。' },
  },
  fallback: { message: '操作没有完成，请稍后重试。', action: '重试' },
});

describe('错误映射机制', () => {
  it('已知码用本地登记的那句文案', () => {
    const resolved = map.resolve('DEMO_NOT_FOUND');
    expect(resolved.message).toBe('没有找到这条记录。');
    expect(resolved.action).toBe('核对单号');
    expect(resolved.known).toBe(true);
  });

  it('未知码落到 fallback，但保留真码', () => {
    const resolved = map.resolve('SOMETHING_NEW');
    expect(resolved.message).toBe('操作没有完成，请稍后重试。');
    expect(resolved.code).toBe('SOMETHING_NEW');
    expect(resolved.known).toBe(false);
  });

  it('服务端文案只进 detail，不覆盖已知码的文案（避免一个码两种说法）', () => {
    const resolved = map.resolve('DEMO_NOT_FOUND', 'server said: record missing');
    expect(resolved.message).toBe('没有找到这条记录。');
    expect(resolved.detail).toBe('server said: record missing');
  });

  it('空白的服务端文案不算 detail', () => {
    expect(map.resolve('DEMO_LOCKED', '   ').detail).toBeUndefined();
  });
});
