/**
 * 身份与扫码适配器。
 *
 * 内核不认任何具体平台（飞书、企业微信、浏览器都行）：
 * 宿主应用实现这个接口，把它注入页面。
 * 公共仓里只带一个「演示实现」，不含任何真实租户标识。
 */

export interface Session {
  /** 展示用名字，例如「张三」。 */
  name: string;
  /** 权限键列表，由宿主系统定义含义；内核只做展示与判断是否为空。 */
  permissions: string[];
  /** 可选：部门 / 车间等归属，纯展示。 */
  department?: string;
}

export interface IdentityAdapter {
  /** 当前会话；未登录返回 null（由宿主决定跳转到哪）。 */
  getSession(): Promise<Session | null>;
  /** 扫码取一个字符串（单号、卡号、条码内容）。取消返回 null。 */
  scan(): Promise<string | null>;
  /** 退出登录。 */
  signOut(): Promise<void>;
}

/** 演示实现：随机返回一个假身份，扫码返回固定示例值。 */
export function createDemoIdentityAdapter(options?: {
  session?: Session;
  scanResult?: string | null;
}): IdentityAdapter {
  const session = options?.session ?? {
    name: '演示用户',
    permissions: ['demo.read', 'demo.write'],
    department: '演示车间',
  };

  return {
    async getSession() {
      return session;
    },
    async scan() {
      return options?.scanResult ?? 'DEMO-0001';
    },
    async signOut() {
      /* 演示实现不改任何状态 */
    },
  };
}
