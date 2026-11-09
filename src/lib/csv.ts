/**
 * 导出 CSV 的逻辑。
 * 「记录 → CSV 文本」是纯函数，不碰 DOM；下载动作由组件负责。
 */
import type { Expense } from './ledger'

export const CSV_HEADER = ['日期', '分类', '备注', '金额（元）']

/**
 * 把分转成 CSV 里的「元」字符串，例如 123456 -> "1234.56"。
 * 不带 ¥ 和千分位，方便表格软件直接识别为数字；同样按字符串分段拼接，避免浮点误差。
 */
export function formatCentsForCsv(cents: number): string {
  const value = Number.isSafeInteger(cents) ? cents : 0
  const sign = value < 0 ? '-' : ''
  const digits = String(Math.abs(value)).padStart(3, '0')
  return `${sign}${digits.slice(0, -2)}.${digits.slice(-2)}`
}

/**
 * 让备注在表格软件里按普通文本显示，不会被当成公式执行。
 * 输入框会去掉开头的空格，所以这里只处理危险字符本身。
 */
function neutralizeFormula(text: string): string {
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
}

/** 按 CSV 规则转义一个单元格：含逗号、引号或换行时用双引号包起来，内部的引号写两遍。 */
function escapeField(text: string): string {
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** 生成 CSV 文本：表头 + 每条记录一行，行尾用 CRLF（与 Excel 的习惯一致）。 */
export function expensesToCsv(list: Expense[]): string {
  const rows = [
    CSV_HEADER,
    ...list.map(item => [item.date, item.category, neutralizeFormula(item.note), formatCentsForCsv(item.amount)]),
  ]
  return rows.map(row => row.map(escapeField).join(',')).join('\r\n')
}

/** 导出文件名，例如 "小账本-2026-11.csv"；month 为空表示全部月份。 */
export function csvFileName(month: string): string {
  return /^\d{4}-\d{2}$/.test(month) ? `小账本-${month}.csv` : '小账本-全部月份.csv'
}