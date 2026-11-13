import { lazy, Suspense } from 'react';
import { ReportingPage } from './pages/ReportingPage.tsx';

// 试点页按需加载：主包不受影响，只有 ?pilot=1 时才拉这一块
const PilotPage = lazy(() =>
  import('./pages/PilotPage.tsx').then((m) => ({ default: m.PilotPage })),
);

export function App() {
  const isPilot = new URLSearchParams(window.location.search).has('pilot');
  if (!isPilot) return <ReportingPage />;
  return (
    <Suspense fallback={<p style={{ padding: 16 }}>加载试点页…</p>}>
      <PilotPage />
    </Suspense>
  );
}
