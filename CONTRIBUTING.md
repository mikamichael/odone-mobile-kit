# 参与贡献

- 分支名：`feature/` `fix/` `chore/` `refactor/` `docs/` 前缀，走 PR。
- 提交前本地跑：`npm run typecheck && npm test && npm run build`，三条都要绿。
- 新增组件的四条要求：
  1. 只依赖 React 与浏览器原生能力，不引 UI 框架；
  2. 必须能被 `@testing-library` 直接查到（原生元素 / 有 aria 名字）；
  3. 文案里不出现任何业务名词，业务文案用 props 传；
  4. 窄屏与宽屏都要在 demo 里看得到。
- 不接受的改动：往核心里塞具体业务的错误码文案、接口路径、平台 SDK。
