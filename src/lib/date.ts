/**
 * 日期工具。
 * 记录里的日期统一保存为本地时区的 "YYYY-MM-DD" 字符串，按字符串比较即可排序。
 */

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** 把 Date 转成本地时区的 "YYYY-MM-DD"。 */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** 取日期所在的月份，例如 "2026-11-05" -> "2026-11"。 */
export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7)
}

/** 把 "2026-11" 显示成 "2026 年 11 月"。 */
export function formatMonth(key: string): string {
  const [year, month] = key.split('-')
  return `${year} 年 ${Number(month)} 月`
}
