# 小账本

一个记录日常开销的单页应用：记一笔、按月份和分类筛选、查看分类占比。数据保存在浏览器 localStorage。

技术栈：Vite + React 19 + TypeScript，单元测试用 Vitest。

## 开发

```sh
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run check      # 类型检查 + 单元测试 + 构建，提交前运行
```

## 目录

```
src/
  lib/          纯逻辑，每个模块旁边有对应的 *.test.ts
    money.ts    金额解析与格式化（内部以「分」为单位）
    date.ts     日期工具（本地时区 YYYY-MM-DD）
    ledger.ts   记录类型、校验、筛选、排序、统计
    storage.ts  localStorage 读写
    sample.ts   首次打开时的示例数据
  components/   React 组件：表单、筛选、统计、明细表
  App.tsx       页面组装与状态
```
