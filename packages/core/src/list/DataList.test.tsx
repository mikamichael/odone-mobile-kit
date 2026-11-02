import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataList } from './DataList.tsx';
import type { Column } from './types.ts';

interface Row {
  id: string;
  code: string;
  qty: number;
}

const columns: Column<Row>[] = [
  { key: 'code', title: '编码' },
  { key: 'qty', title: '数量', align: 'right' },
];

const rows: Row[] = [
  { id: '1', code: 'DEMO-0001', qty: 10 },
  { id: '2', code: 'DEMO-0002', qty: 20 },
];

describe('DataList', () => {
  it('宽屏出表格，两个数据都在', () => {
    render(<DataList columns={columns} rows={rows} rowKey={(row) => row.id} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('DEMO-0001')).toBeInTheDocument();
    expect(screen.getByText('DEMO-0002')).toBeInTheDocument();
  });

  it('空数据显示空态文案', () => {
    render(<DataList columns={columns} rows={[]} rowKey={(row) => row.id} emptyText="没有记录" />);
    expect(screen.getByText('没有记录')).toBeInTheDocument();
  });

  it('有错误时显示错误态，不显示数据', () => {
    render(
      <DataList
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        error="加载失败"
        onRetry={() => undefined}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('加载失败');
    expect(screen.getByRole('button', { name: '重试' })).toBeInTheDocument();
    expect(screen.queryByText('DEMO-0001')).not.toBeInTheDocument();
  });

  it('加载中显示加载态', () => {
    render(<DataList columns={columns} rows={rows} rowKey={(row) => row.id} loading />);
    expect(screen.getByText('加载中…')).toBeInTheDocument();
  });
});
