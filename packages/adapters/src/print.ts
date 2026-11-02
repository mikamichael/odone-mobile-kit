/**
 * 打印通道适配器。
 *
 * 现实中「网页点一下就出纸」有四条路（本机队列、本机接口、直连打印机、服务端打印服务），
 * 内核只规定接口，不规定走哪条；真实实现（含凭据、设备名）永远留在使用方私有代码里。
 */

export interface PrinterInfo {
  id: string;
  name: string;
  /** 在线 / 离线，由适配器自己判。 */
  online: boolean;
}

export interface PrintJob {
  /** 模板标识与数据（模板长什么样由使用方定义）。 */
  template: string;
  data: Record<string, string | number>;
  /** 指定打印机；不传由适配器取默认机。 */
  printerId?: string;
}

export interface PrintResult {
  jobId: string;
  acceptedAt: number;
}

export interface PrintAdapter {
  listPrinters(): Promise<PrinterInfo[]>;
  print(job: PrintJob): Promise<PrintResult>;
}

/** 演示实现：不碰任何真实设备，只把任务记在控制台。 */
export function createDemoPrintAdapter(options?: { printers?: PrinterInfo[] }): PrintAdapter {
  const printers = options?.printers ?? [{ id: 'demo-printer', name: '演示打印机', online: true }];
  let seq = 0;

  return {
    async listPrinters() {
      return printers;
    },
    async print(job) {
      seq += 1;
      console.info('[demo-print]', job.template, job.data);
      return { jobId: `demo-job-${seq}`, acceptedAt: Date.now() };
    },
  };
}
