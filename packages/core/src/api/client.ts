import type { ErrorMap, ResolvedError } from './errors.ts';

/** 请求层抛出的唯一错误类型：带码、带状态、带已解析的文案。 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly detail?: string;
  readonly action?: string;
  readonly known: boolean;

  constructor(resolved: ResolvedError, status: number) {
    super(resolved.message);
    this.name = 'ApiError';
    this.code = resolved.code;
    this.status = status;
    this.known = resolved.known;
    if (resolved.detail) this.detail = resolved.detail;
    if (resolved.action) this.action = resolved.action;
  }
}

export interface ApiClientOptions {
  /** 形如 https://example.com 或空字符串（同源）。 */
  baseUrl: string;
  /** 每次请求前取一遍附加头（令牌、租户等），返回 undefined 表示不加。 */
  headers?: () => Record<string, string | undefined>;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  /** 错误码 → 文案。不传则一切都落到「未知错误」。 */
  errorMap?: ErrorMap;
  /** 服务端错误信封的字段名，默认按 { code, message } 解析。 */
  envelope?: { code: string; message: string };
}

type Json = unknown;

const UNKNOWN_CODE = 'UNKNOWN';

function joinUrl(baseUrl: string, path: string): string {
  if (!baseUrl) return path;
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function createApiClient(options: ApiClientOptions) {
  const {
    baseUrl,
    headers,
    timeoutMs = 15_000,
    fetchImpl = fetch,
    envelope = { code: 'code', message: 'message' },
  } = options;

  const fallback = {
    message: '请求没有完成，请稍后重试。',
    action: '重试',
  };

  const map = options.errorMap;

  function resolve(code: string, serverMessage?: string): ResolvedError {
    if (map) return map.resolve(code, serverMessage);
    return { code, message: fallback.message, action: fallback.action, known: false,
      ...(serverMessage ? { detail: serverMessage } : {}) };
  }

  async function request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: Json,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<unknown> {
    const url = new URL(joinUrl(baseUrl, path), baseUrl || 'http://localhost');
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const extraHeaders = headers?.() ?? {};
    const merged: Record<string, string> = { Accept: 'application/json' };
    for (const [k, v] of Object.entries(extraHeaders)) {
      if (v !== undefined) merged[k] = v;
    }
    if (body !== undefined) merged['Content-Type'] = 'application/json';

    let response: Response;
    try {
      response = await fetchImpl(baseUrl ? url.toString() : url.pathname + url.search, {
        method,
        headers: merged,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        signal: controller.signal,
      });
    } catch (error) {
      const aborted = error instanceof Error && error.name === 'AbortError';
      throw new ApiError(resolve(aborted ? 'TIMEOUT' : 'NETWORK_ERROR',
        error instanceof Error ? error.message : undefined), 0);
    } finally {
      clearTimeout(timer);
    }

    const text = await response.text();
    let payload: unknown = undefined;
    if (text) {
      try {
        payload = JSON.parse(text) as unknown;
      } catch {
        payload = undefined;
      }
    }

    if (!response.ok) {
      const box = (payload ?? {}) as Record<string, unknown>;
      const code = typeof box[envelope.code] === 'string' ? (box[envelope.code] as string)
        : `HTTP_${response.status}`;
      const serverMessage = typeof box[envelope.message] === 'string'
        ? (box[envelope.message] as string) : undefined;
      throw new ApiError(resolve(code, serverMessage), response.status);
    }

    return payload;
  }

  return {
    get: (path: string, query?: Record<string, string | number | boolean | undefined>) =>
      request('GET', path, undefined, query),
    post: (path: string, body?: Json) => request('POST', path, body),
    put: (path: string, body?: Json) => request('PUT', path, body),
    del: (path: string) => request('DELETE', path),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
