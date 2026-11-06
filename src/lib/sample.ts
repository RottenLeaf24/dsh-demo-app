/** 首次打开时展示的示例数据：本月和上个月各几笔。 */
import { toISODate } from './date'
import type { Expense } from './ledger'

export function sampleExpenses(now: Date): Expense[] {
  const year = now.getFullYear()
  const month = now.getMonth()
  const thisMonth = (day: number) => toISODate(new Date(year, month, Math.min(day, now.getDate())))
  const lastMonth = (day: number) => toISODate(new Date(year, month - 1, day))
  return [
    { id: 'sample-1', amount: 3250, category: '餐饮', note: '和同事吃午饭', date: lastMonth(3) },
    { id: 'sample-2', amount: 450000, category: '住房', note: '房租', date: lastMonth(5) },
    { id: 'sample-3', amount: 1999, category: '娱乐', note: '视频会员', date: lastMonth(12) },
    { id: 'sample-4', amount: 600, category: '交通', note: '地铁', date: lastMonth(20) },
    { id: 'sample-5', amount: 2880, category: '餐饮', note: '外卖', date: thisMonth(1) },
    { id: 'sample-6', amount: 12900, category: '购物', note: '耳机', date: thisMonth(2) },
    { id: 'sample-7', amount: 800, category: '交通', note: '公交卡充值', date: thisMonth(3) },
  ]
}
