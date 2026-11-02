/**
 * 错误映射机制（不含任何业务码文案）。
 *
 * 设计取舍：
 *  - 已知码：一律用本地登记的那句文案，保证同一个码在界面上的说法永远一致；
 *    服务端返回的文案只保留为 `detail`，默认不展示（避免同一码两种说法）。
 *  - 未知码：落到 fallback，并把真码放进 `code` 供日志/埋点使用。
 *  - 业务码由使用方注入，内核里不出现任何具体码值。
 */

export interface ErrorText {
  /** 给人看的一句话。 */
  message: string;
  /** 可选：告诉用户下一步能做什么（如「重新提交」「联系管理员」）。 */
  action?: string;
}

export interface ErrorMapOptions {
  codes: Record<string, ErrorText>;
  fallback: ErrorText;
}

export interface ResolvedError extends ErrorText {
  code: string;
  /** 服务端返回的原始文案，默认不展示。 */
  detail?: string;
  /** 命中本地登记表 = true；落到 fallback = false。 */
  known: boolean;
}

export interface ErrorMap {
  resolve(code: string, serverMessage?: string): ResolvedError;
  has(code: string): boolean;
}

export function createErrorMap(options: ErrorMapOptions): ErrorMap {
  const { codes, fallback } = options;

  return {
    has: (code) => Object.prototype.hasOwnProperty.call(codes, code),
    resolve(code, serverMessage) {
      const known = Object.prototype.hasOwnProperty.call(codes, code) ? codes[code] : undefined;
      const text = known ?? fallback;
      const detail = serverMessage && serverMessage.trim() ? serverMessage.trim() : undefined;
      return {
        code,
        message: text.message,
        ...(text.action ? { action: text.action } : {}),
        ...(detail ? { detail } : {}),
        known: Boolean(known),
      };
    },
  };
}
