import { useEffect, useState } from 'react';
import {
  DataList,
  FormShell,
  PageShell,
  formatDateTime,
  formatQty,
  validateFields,
  type Column,
  type Field,
} from '@kit/core';
import { createDemoIdentityAdapter, createDemoPrintAdapter } from '@kit/adapters';
import { DEMO_MACHINES, DEMO_PROCESSES, DEMO_ROWS, type ReportRow } from '../fixtures.ts';

const identity = createDemoIdentityAdapter();
const printer = createDemoPrintAdapter();

const FIELDS: Field[] = [
  { key: 'cardNo', label: '流程卡号', type: 'text', required: true, placeholder: '扫码或手输' },
  { key: 'process', label: '工序', type: 'select', required: true, options: DEMO_PROCESSES },
  {
    key: 'qty',
    label: '数量',
    type: 'number',
    required: true,
    unit: '支',
    validate: (value) => {
      const num = Number(value);
      if (!Number.isFinite(num) || num <= 0) return '请填一个大于 0 的数字';
      return undefined;
    },
  },
  { key: 'machine', label: '机台', type: 'select', options: DEMO_MACHINES },
  { key: 'note', label: '备注', type: 'textarea', placeholder: '可不填' },
];

const processLabel = (value: string) =>
  DEMO_PROCESSES.find((item) => item.value === value)?.label ?? value;

const COLUMNS: Column<ReportRow>[] = [
  { key: 'cardNo', title: '流程卡号', width: '140px' },
  { key: 'process', title: '工序', width: '90px' },
  { key: 'qty', title: '数量', align: 'right', width: '100px', render: (row) => formatQty(row.qty, 0) },
  { key: 'machine', title: '机台', width: '110px' },
  { key: 'reportedAt', title: '报工时间', width: '180px', render: (row) => formatDateTime(row.reportedAt) },
];

export function ReportingPage() {
  const [who, setWho] = useState('未登录');
  const [rows, setRows] = useState<ReportRow[]>(DEMO_ROWS);
  const [values, setValues] = useState<Record<string, string>>({
    cardNo: '',
    process: '',
    qty: '',
    machine: '',
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [listError, setListError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    void identity.getSession().then((session) => {
      setWho(session ? `${session.name}（${session.department ?? '—'}）` : '未登录');
    });
  }, []);

  const submit = (next: Record<string, string>) => {
    const found = validateFields(FIELDS, next);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    const row: ReportRow = {
      id: `r-${Date.now()}`,
      cardNo: next.cardNo ?? '',
      process: processLabel(next.process ?? ''),
      qty: Number(next.qty ?? 0),
      machine: DEMO_MACHINES.find((item) => item.value === next.machine)?.label ?? '—',
      reportedAt: Date.now(),
    };
    setRows((prev) => [row, ...prev]);
    setValues({ cardNo: '', process: '', qty: '', machine: '', note: '' });
    setToast(`已报工：${row.cardNo} · ${row.process}`);
  };

  const scan = async () => {
    const code = await identity.scan();
    if (code) {
      setValues((prev) => ({ ...prev, cardNo: code }));
      setToast(`扫码结果：${code}`);
    }
  };

  const refresh = async () => {
    setLoading(true);
    setListError(null);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLoading(false);
    setToast('列表已刷新');
  };

  return (
    <PageShell
      title="报工（演示）"
      subtitle="假数据 · 不含任何真实业务字段"
      onRefresh={refresh}
      headerExtra={<span className="demo-who">{who}</span>}
    >
      <section className="demo-block">
        <div className="demo-actions">
          <button type="button" className="kit-button" onClick={() => void scan()}>
            扫码带出卡号
          </button>
          <button
            type="button"
            className="kit-button"
            onClick={() => {
              setListError('列表加载失败（演示错误态）');
            }}
          >
            模拟列表错误
          </button>
          <button
            type="button"
            className="kit-button"
            onClick={async () => {
              const result = await printer.print({
                template: 'demo-report-label',
                data: { cardNo: rows[0]?.cardNo ?? 'DEMO-0000', qty: rows[0]?.qty ?? 0 },
              });
              setToast(`打印已受理：${result.jobId}`);
            }}
          >
            打印当前行
          </button>
        </div>
        {toast ? <p className="demo-toast" role="status">{toast}</p> : null}
      </section>

      <section className="demo-block">
        <FormShell
          fields={FIELDS}
          values={values}
          errors={errors}
          onChange={(key, value) => {
            setValues((prev) => ({ ...prev, [key]: value }));
            setErrors((prev) => ({ ...prev, [key]: undefined }));
          }}
          onSubmit={submit}
          submitText="提交报工"
        />
      </section>

      <section className="demo-block">
        <h2 className="demo-heading">今日报工（{rows.length}）</h2>
        <DataList
          columns={COLUMNS}
          rows={rows}
          rowKey={(row) => row.id}
          loading={loading}
          error={listError}
          onRetry={() => void refresh()}
          emptyText="还没有报工记录"
          onRowClick={(row) => setToast(`选中：${row.cardNo}`)}
        />
      </section>
    </PageShell>
  );
}
