# odone-mobile-kit

[![CI](https://github.com/mikamichael/odone-mobile-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/mikamichael/odone-mobile-kit/actions/workflows/ci.yml)

**在线演示**：https://mikamichael.github.io/odone-mobile-kit/ （手机宽度下看列表会变成卡片）

面向车间、仓储、外勤这类「手机上一只手操作」场景的前端内核：**页面外壳 + 声明式列表 + 声明式表单 + 请求层与错误映射机制 + 适配器接口**。

它只提供形状，不提供业务。任何行业字段（单据号叫什么、工序有哪些、错误码含义）都由使用方注入。

## 为什么会有这个项目

车间里真正的界面长得都差不多：一页表单、一个扫码按钮、一张当天记录、几个状态提示。但每个系统都会把这些东西各写一遍，于是同一个团队的第 20 个页面和第 1 个页面看起来像两个人做的。

这套东西只做一件事：**让「再做一个页面」变成填一份声明，而不是再写一遍取数、加载、空态、错误、窄屏。**

## 不是什么

- 不是组件库全家桶：没有表格库、没有图表库、没有富文本，需要时自己引。
- 不是低代码平台：页面还是你自己的 React 组件，只是骨架和状态自己不用写了。
- 不是后台模板：宽屏后台请用自己的表格方案，这里只管移动优先的窄屏体验。
- 不绑定任何平台：飞书、企业微信、浏览器都行，适配器由你实现。

## 目录

```
packages/
  core/        页面外壳、列表、表单、请求层、错误映射、格式化、主题变量
  adapters/    适配器接口 + 演示实现（身份与扫码、打印通道）
apps/
  demo/        演示站：假数据、能点的报工页
test/          vitest 引导
```

## 快速开始

```bash
npm install
npm run dev        # 打开 http://localhost:4317
npm test           # 单元测试
npm run typecheck  # 类型检查
npm run build      # 产物在 dist/
```

## 用法（一个页面要写的东西）

```tsx
import { PageShell, DataList, FormShell, validateFields, formatDateTime, type Column, type Field } from '@kit/core';

const fields: Field[] = [
  { key: 'code', label: '编号', type: 'text', required: true },
  { key: 'qty', label: '数量', type: 'number', required: true, unit: '支' },
];

const columns: Column<Row>[] = [
  { key: 'code', title: '编号' },
  { key: 'qty', title: '数量', align: 'right' },
  { key: 'at', title: '时间', render: (row) => formatDateTime(row.at) },
];

<PageShell title="报工" onRefresh={reload} headerExtra={<Who />}>
  <FormShell fields={fields} values={values} errors={errors} onChange={set} onSubmit={submit} />
  <DataList columns={columns} rows={rows} rowKey={(row) => row.id} loading={loading} error={error} />
</PageShell>
```

列表在窄屏自动换成卡片（不是把表格压窄），加载 / 空 / 错误三态内建。

## 三条设计取舍

1. **错误码文案由使用方注入**：内核只提供映射机制（已知码 → 本地文案；未知码 → fallback 且保留真码）。同一个码不允许出现两种说法，服务端文案只作为 `detail` 留存。
2. **适配器只给接口**：身份、扫码、打印这些都必须碰具体平台或设备，接口在这里，实现留在你自己的代码里，凭据永远不进这个仓库。
3. **一套主题变量**：换观感只改 `theme.css` 的变量，不改组件；深浅色共用同一套结构与尺寸。

## 路线（尚未实现，别当已有）

- 打印适配器的真实实现（含本机队列、直连打印机）—— 只会有接口与文档，实现留在使用方
- 列表的列宽拖拽、排序、虚拟滚动
- 表单的联动与分步
- 打包发布到 npm（目前是源码工作区，API 稳定后才发版）

## 许可

Apache-2.0，见 `LICENSE`。使用、修改、商用都可以，保留版权与许可声明即可。
