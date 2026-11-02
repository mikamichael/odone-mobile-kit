import { useCallback, useEffect, useState } from 'react';

/** 窄屏判定（默认 768px）：列表据此在「表格」与「卡片」之间切换。 */
export function useNarrow(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint}px)`;
  const [narrow, setNarrow] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  const listen = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => undefined;
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setNarrow(event.matches);
    setNarrow(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  useEffect(() => listen(), [listen]);

  return narrow;
}
