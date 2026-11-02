/** 数字：固定小数位，缺省值给占位符而不是空白（表格里空白会让人以为漏数）。 */
export function formatQty(value: number | string | null | undefined, digits = 2): string {
  const num = typeof value === 'string' ? Number(value) : value;
  if (num === null || num === undefined || !Number.isFinite(num)) return '—';
  return num.toFixed(digits);
}

/**
 * 时间：一律按北京时间展示，格式固定 yyyy-MM-dd HH:mm:ss。
 * 不接受把 UTC/ISO 原文直接透到界面上。
 */
export function formatDateTime(input: number | string | Date | null | undefined): string {
  if (input === null || input === undefined || input === '') return '—';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '—';
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00';
  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')}:${pick('second')}`;
}
