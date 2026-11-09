import { csvFileName, expensesToCsv } from '../lib/csv'
import type { Expense } from '../lib/ledger'

interface Props {
  /** 当前筛选后看到的记录，导出内容与页面列表一致 */
  items: Expense[]
  /** 当前筛选的月份，"YYYY-MM" 或空字符串（全部月份） */
  month: string
}

export function ExportButton({ items, month }: Props) {
  function exportCsv() {
    if (items.length === 0) return
    // 带 BOM，Excel 打开时才能正确识别 UTF-8 的中文。
    const blob = new Blob(['\uFEFF', expensesToCsv(items)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = csvFileName(month)
    link.click()
    // 下载已经开始，可以释放临时地址。
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <button type="button" className="secondary" disabled={items.length === 0} onClick={exportCsv}>
      导出 CSV
    </button>
  )
}
