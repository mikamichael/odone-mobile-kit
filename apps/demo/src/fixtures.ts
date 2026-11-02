/** 演示数据：全部是虚构的编码与工序名，不含任何真实业务字段。 */
export interface ReportRow {
  id: string;
  cardNo: string;
  process: string;
  qty: number;
  machine: string;
  reportedAt: number;
}

export const DEMO_PROCESSES = [
  { value: 'cut', label: '下料' },
  { value: 'form', label: '成型' },
  { value: 'pack', label: '包装' },
];

export const DEMO_MACHINES = [
  { value: 'm-01', label: '机台 01' },
  { value: 'm-02', label: '机台 02' },
];

export const DEMO_ROWS: ReportRow[] = [
  {
    id: 'r1',
    cardNo: 'DEMO-0001',
    process: '下料',
    qty: 1200,
    machine: '机台 01',
    reportedAt: Date.UTC(2026, 0, 6, 1, 20, 0),
  },
  {
    id: 'r2',
    cardNo: 'DEMO-0002',
    process: '成型',
    qty: 860,
    machine: '机台 02',
    reportedAt: Date.UTC(2026, 0, 6, 2, 5, 0),
  },
  {
    id: 'r3',
    cardNo: 'DEMO-0003',
    process: '包装',
    qty: 540,
    machine: '机台 01',
    reportedAt: Date.UTC(2026, 0, 6, 3, 40, 0),
  },
];
