import { useNarrow } from '../hooks/useNarrow.ts';
import type { DataListProps } from './types.ts';

/**
 * 声明式列表：给列定义和数据，自己决定宽屏出表格、窄屏出卡片。
 *
 * 一条纪律：窄屏不要「把表格压窄」，要换视图 —— 挤压的表格在手机上永远读不了。
 * 加载 / 空 / 错误三态内建，页面不用各写一遍。
 */
export function DataList<Row>({
  columns,
  rows,
  rowKey,
  loading = false,
  error = null,
  onRetry,
  emptyText = '暂无数据',
  onRowClick,
  breakpoint = 768,
}: DataListProps<Row>) {
  const narrow = useNarrow(breakpoint);

  if (error) {
    return (
      <div className="kit-state kit-state--error" role="alert">
        <p>{error}</p>
        {onRetry ? (
          <button type="button" className="kit-button" onClick={onRetry}>
            重试
          </button>
        ) : null}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="kit-state" role="status" aria-live="polite">
        <p>加载中…</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="kit-state kit-state--empty">
        <p>{emptyText}</p>
      </div>
    );
  }

  if (narrow) {
    return (
      <ul className="kit-cards">
        {rows.map((row) => (
          <li key={rowKey(row)}>
            <button
              type="button"
              className="kit-card"
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              disabled={!onRowClick}
            >
              {columns
                .filter((column) => !column.hideOnNarrow)
                .map((column) => (
                  <span className="kit-card__row" key={column.key}>
                    <span className="kit-card__label">{column.title}</span>
                    <span className={`kit-card__value kit-align-${column.align ?? 'left'}`}>
                      {column.render ? column.render(row) : readCell(row, column.key)}
                    </span>
                  </span>
                ))}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <table className="kit-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              style={column.width ? { width: column.width } : undefined}
              className={`kit-align-${column.align ?? 'left'}`}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={onRowClick ? 'kit-table__row kit-table__row--clickable' : 'kit-table__row'}
          >
            {columns.map((column) => (
              <td key={column.key} className={`kit-align-${column.align ?? 'left'}`}>
                {column.render ? column.render(row) : readCell(row, column.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function readCell(row: unknown, key: string) {
  if (typeof row !== 'object' || row === null) return '';
  const value = (row as Record<string, unknown>)[key];
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
    return String(value);
  }
  return '';
}
