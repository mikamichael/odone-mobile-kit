# 参与贡献

- 分支名：`feature/` `fix/` `chore/` `refactor/` `docs/` 前缀，走 PR。
- 提交前本地跑：`npm run typecheck && npm test && npm run build`，三条都要绿。
- 新增组件的四条要求：
  1. 只依赖 React 与浏览器原生能力，不引 UI 框架 —— **例外**：`@kit/core/shadcn` 子入口可用 Tailwind v4 + shadcn/radix（见下）；
  2. 必须能被 `@testing-library` 直接查到（原生元素 / 有 aria 名字）；
  3. 文案里不出现任何业务名词，业务文案用 props 传；
  4. 窄屏与宽屏都要在 demo 里看得到。
- 不接受的改动：往核心里塞具体业务的错误码文案、接口路径、平台 SDK。

## 关于 `@kit/core/shadcn` 子入口

主入口 `@kit/core` 仍然零 UI 框架依赖（车间 H5 只引它）。shadcn 原语与封装放在**单独子入口** `@kit/core/shadcn`，谁 import 谁承担 radix / date-fns / sonner 的体积。

- 业务侧表单优先用 `KitField` + `KitInput` / `KitDatePicker`，**不要**直接用 shadcn 的 `Input`：默认 36px，低于 44px 触屏纪律；`KitField` 还会自动接 `id / aria-invalid / aria-describedby`。
- 新增原语：`npx shadcn@latest add <组件> -c apps/demo`（`apps/demo/components.json` 的 alias 已指向包内，文件会直接落到 `packages/core/src/shadcn/ui/`）。落盘后若出现 `from "cn"` 改成 `from "../lib/utils.ts"`。
- Tailwind 必须在这个入口的样式文件里 `@source "../../../packages/core/src/shadcn"`，否则扫不到包内组件的 class，样式会静默少掉一半（`dist` CSS 从 45KB 掉到 14KB 就是这个征兆）。
- Table 在 390 宽下 4 列就溢出（实测 398 > 356），窄屏请用卡片视图，别把表格压窄。
