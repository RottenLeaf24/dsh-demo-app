import { describe, expect, it } from 'vitest'
import {
  filterExpenses,
  listMonths,
  sortByDateDesc,
  summarize,
  validateDraft,
  type Expense,
  type ExpenseDraft,
} from './ledger'

const draft = (patch: Partial<ExpenseDraft> = {}): ExpenseDraft => ({
  amount: '25',
  category: '餐饮',
  note: ' 午饭 ',
  date: '2026-11-05',
  ...patch,
})

const expenses: Expense[] = [
  { id: 'a', amount: 1000, category: '餐饮', note: '', date: '2026-10-30' },
  { id: 'b', amount: 3000, category: '交通', note: '', date: '2026-11-02' },
  { id: 'c', amount: 1000, category: '餐饮', note: '', date: '2026-11-01' },
]

describe('validateDraft', () => {
  it('通过时返回以分为单位的金额和去掉空格的备注', () => {
    expect(validateDraft(draft())).toEqual({
      ok: true,
      expense: { amount: 2500, category: '餐饮', note: '午饭', date: '2026-11-05' },
    })
  })

  it('金额必须大于 0', () => {
    expect(validateDraft(draft({ amount: '0' }))).toEqual({ ok: false, error: '金额必须大于 0' })
  })

  it('拒绝格式不对的金额', () => {
    expect(validateDraft(draft({ amount: 'abc' })).ok).toBe(false)
  })

  it('拒绝缺失的日期', () => {
    expect(validateDraft(draft({ date: '' })).ok).toBe(false)
  })
})

describe('filterExpenses', () => {
  it('按月份筛选', () => {
    expect(filterExpenses(expenses, { month: '2026-11', category: 'all' }).map(e => e.id)).toEqual(['b', 'c'])
  })

  it('按分类筛选', () => {
    expect(filterExpenses(expenses, { month: '', category: '餐饮' }).map(e => e.id)).toEqual(['a', 'c'])
  })
})

describe('sortByDateDesc', () => {
  it('从新到旧排序', () => {
    expect(sortByDateDesc(expenses).map(e => e.id)).toEqual(['b', 'c', 'a'])
  })

  it('不修改原数组', () => {
    const copy = [...expenses]
    sortByDateDesc(expenses)
    expect(expenses).toEqual(copy)
  })
})

describe('listMonths', () => {
  it('去重并从新到旧', () => {
    expect(listMonths(expenses)).toEqual(['2026-11', '2026-10'])
  })
})

describe('summarize', () => {
  it('统计总额和分类占比', () => {
    expect(summarize(expenses)).toEqual({
      total: 5000,
      count: 3,
      byCategory: [
        { category: '交通', amount: 3000, percent: 60 },
        { category: '餐饮', amount: 2000, percent: 40 },
      ],
    })
  })

  it('空列表总额为 0', () => {
    expect(summarize([])).toEqual({ total: 0, count: 0, byCategory: [] })
  })
})
