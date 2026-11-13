# 前端技术栈：唯一选择（不做多项对比，不来回换）

> 这份文件的目的只有一个：**同一件事只有一种做法**。
> 下面没写的，就是不用；要换，先改这份文件，再改代码。

## 一、底座（所有页面共用）

| 层 | 唯一选择 | 说明 |
|---|---|---|
| 构建 | Vite 8 + React 19 + TS 7（`allowImportingTsExtensions` 必开） | 本仓现役 |
| 样式 | Tailwind v4（`@tailwindcss/vite`） | 只有 `@import "tailwindcss"` 一行 + 包内 `shadcn.css` |
| 主题 | `packages/core/src/theme/tokens.css` 三层 token（品牌原值 → 语义 → 尺度） | 换品牌色只改这一层 |
| 组件 | shadcn 原语（`@kit/core/shadcn/ui`）+ Kit 封装（`KitField/KitInput/KitDatePicker`） | 业务页只用 Kit 封装，不直接引原语 |
| 图标 | lucide-react | 由组件控制尺寸，页面不写 `size-*` |

## 二、能力层（按需引，不装进主入口）

| 需求 | 用什么 |
|---|---|
| 页面外壳 / 列表 / 表单（无框架依赖） | `@kit/core`：`PageShell`、`DataList`、`FormShell` |
| 弹层 / 选择器 / 日期 / 提示 | `@kit/core/shadcn`：`Sheet`、`Dialog`、`Select`、`Sonner`、`KitDatePicker` |
| 日期与数字展示 | `format/formatDate`、`formatQty`、`formatDateTime`（一律北京时间） |

## 三、写法规矩（技能分工，一层只认一个）

| 层 | 认哪个技能 | 不许做什么 |
|---|---|---|
| 组件结构 / 表单约定 | `shadcn` | 不自己搓弹层、不绕过 `Field` 家族 |
| 组件 API / 组合方式 | `vercel-composition-patterns` | 不靠一堆 boolean props 变体 |
| 性能 | `vercel-react-best-practices` | 不为「以后可能要用」提前抽象 |
| 类型 | `typescript-advanced-types` | 不写 `any`，不靠注释兜类型 |
| 令牌 / 设计系统 | `tailwind-design-system` | 不在组件里写死颜色、字号、圆角 |
| 观感 / 版式清单 | `web-ui-design-system`（含本仓口味） | 不自选配色，用户给了「照 X 页」就照 X 页 |
| 找风格参考（少用） | `ui-ux-pro-max`（须先出方案再动手） | 不在默认路径里随手用 |
| 浏览器实测 | `webapp-testing`（Playwright） | 不用截图目测代替 `getBoundingClientRect()` |

冲突时的顺序：**用户口述规格 > 本文件 > 技能默认值**。

## 四、固定验收（每次改前端都跑，缺一项不算完成）

1. `npm run check:public`（脱敏闸，公共仓硬要求）
2. `npm run typecheck`
3. `npm test`
4. `npm run build`
5. 390×844 浏览器实测三项：可点元素 ≥44px、`aria-invalid`/`aria-describedby` 能解析、页面无横向溢出

## 五、已知会错的地方（踩过，别再踩）

- Tailwind 扫不到包内组件 → `dist` CSS 从 45 kB 掉到 14 kB（`@source` 丢了）。
- shadcn CLI 落盘会写 `from "cn"` 和假依赖 `cn`（`add` 后必须扫一遍）。
- `apps/demo/tsconfig.json` 不能 `extends` 根 tsconfig（CLI 会栈溢出）。
- 表格在 390 宽 4 列就溢出（398 > 356）→ 窄屏换卡片，不压窄。
- 跨仓引用必须用真名 `@odone-mobile-kit/core`；`@kit/core` 只是本仓别名。
