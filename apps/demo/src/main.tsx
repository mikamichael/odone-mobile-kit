import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 顺序有讲究：Tailwind(preflight) 先跑，kit 主题与组件样式后跑、优先级更高
import './shadcn.css';
import '@kit/core-theme';
import './demo.css';
import { App } from './App.tsx';

const container = document.getElementById('root');
if (!container) throw new Error('#root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
