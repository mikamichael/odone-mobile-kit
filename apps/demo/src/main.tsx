import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 顺序有讲究：Tailwind(preflight) 先跑，kit 主题与组件样式后跑、优先级更高
// 主题变量已由 ./shadcn.css 内联带入，不再单独 import '@kit/core-theme'
import './shadcn.css';
import './demo.css';
import { App } from './App.tsx';

const container = document.getElementById('root');
if (!container) throw new Error('#root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
