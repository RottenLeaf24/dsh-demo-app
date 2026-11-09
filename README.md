# 小账本

一个记录日常开销的单页应用：记一笔、按月份和分类筛选、查看分类占比、把当前明细导出为 CSV。数据保存在浏览器 localStorage。

技术栈：Vite + React 19 + TypeScript，单元测试用 Vitest。

## 开发

```sh
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run check      # 类型检查 + 单元测试 + 构建，提交前运行
```

## 在线预览（GitHub Pages）

每次向 `main` 推送（合并 PR）后，`.github/workflows/deploy-pages.yml` 会自动做类型检查、单元测试和构建，并把 `dist/` 发布到 GitHub Pages，地址为 `https://<用户名>.github.io/dsh-demo-app/`。也可以在 Actions 页面手动运行该 workflow（`workflow_dispatch`）。

仓库首次使用时，需要在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。仓库若为 Private，还需要账号当前套餐支持 Pages。

## 目录

```
src/
  lib/          纯逻辑，每个模块旁边有对应的 *.test.ts
    money.ts    金额解析与格式化（内部以「分」为单位）
    date.ts     日期工具（本地时区 YYYY-MM-DD）
    ledger.ts   记录类型、校验、筛选、排序、统计
    csv.ts      把记录转换成 CSV 文本、导出文件名
    storage.ts  localStorage 读写
    sample.ts   首次打开时的示例数据
  components/   React 组件：表单、筛选、统计、明细表、导出 CSV
  App.tsx       页面组装与状态
```
