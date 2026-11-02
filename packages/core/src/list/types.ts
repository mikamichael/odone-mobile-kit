import type { ReactNode } from 'react';

export interface Column<Row> {
  /** 取值的键；也可以只靠 render。 */
  key: string;
  /** 列名（表头 / 窄屏卡片上的字段名）。 */
  title: string;
  /** 宽屏下的建议宽度，如 '120px' 或 '20%'。 */
  width?: string;
  align?: 'left' | 'right' | 'center';
  /** 窄屏卡片里不展示这一列（例如纯操作列）。 */
  hideOnNarrow?: boolean;
  render?: (row: Row) => ReactNode;
}

export interface DataListProps<Row> {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  loading?: boolean;
  /** 一句话错误文案；传了就在列表位置显示错误态。 */
  error?: string | null;
  onRetry?: () => void;
  emptyText?: string;
  onRowClick?: (row: Row) => void;
  /** 窄屏断点，默认 768。 */
  breakpoint?: number;
}
