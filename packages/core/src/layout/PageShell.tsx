import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

export interface PageShellProps {
  title: string;
  subtitle?: string;
  /** 传了才显示返回键；不传就是一级页。 */
  onBack?: () => void;
  /** 传了才启用下拉刷新（到顶才触发）。 */
  onRefresh?: () => void | Promise<void>;
  /** 页头右侧的附加区域（筛选、状态等）。 */
  headerExtra?: ReactNode;
  children: ReactNode;
}

/** 触发下拉刷新需要拉过的距离（px）。 */
const PULL_THRESHOLD = 64;
/** 下拉最多能拉多远（px），超出部分不再跟随手指。 */
const PULL_MAX = 96;

/**
 * 移动端页面外壳：安全区、吸顶页头、返回键、下拉刷新。
 * 只负责「形状」，不管取数，也不认识任何业务字段。
 */
export function PageShell({
  title,
  subtitle,
  onBack,
  onRefresh,
  headerExtra,
  children,
}: PageShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const canPull = Boolean(onRefresh) && !refreshing;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canPull) return;
    const el = scrollRef.current;
    if (!el || el.scrollTop > 0) return;
    startY.current = event.clientY;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canPull || startY.current === null) return;
    const delta = event.clientY - startY.current;
    if (delta <= 0) {
      setPull(0);
      return;
    }
    setPull(Math.min(PULL_MAX, delta * 0.6));
  };

  const endPull = async () => {
    if (startY.current === null) return;
    startY.current = null;
    if (pull < PULL_THRESHOLD || !onRefresh) {
      setPull(0);
      return;
    }
    setRefreshing(true);
    setPull(PULL_THRESHOLD);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      setPull(0);
    }
  };

  return (
    <div className="kit-page">
      <header className="kit-page__header">
        {onBack ? (
          <button type="button" className="kit-page__back" onClick={onBack} aria-label="返回">
            ←
          </button>
        ) : null}
        <div className="kit-page__titles">
          <h1 className="kit-page__title">{title}</h1>
          {subtitle ? <p className="kit-page__subtitle">{subtitle}</p> : null}
        </div>
        {headerExtra ? <div className="kit-page__extra">{headerExtra}</div> : null}
      </header>

      <div
        ref={scrollRef}
        className="kit-page__body"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => void endPull()}
        onPointerCancel={() => void endPull()}
        style={{ transform: `translateY(${pull}px)` }}
      >
        {refreshing ? (
          <div className="kit-page__refreshing" role="status">
            正在刷新…
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
