/**
 * 账本的核心逻辑：记录的类型、校验、筛选、排序和统计。
 * 这里的函数都是纯函数，不读写 DOM 或 localStorage，方便单元测试。
 */
import { monthKey } from './date'
import { parseAmount } from './money'

export const CATEGORIES = ['餐饮', '交通', '购物', '住房', '娱乐', '其他'] as const
export type Category = (typeof CATEGORIES)[number]

export interface Expense {
  id: string
  /** 金额，单位：分 */
  amount: number
  category: Category
  note: string
  /** 本地日期 "YYYY-MM-DD" */
  date: string
}

/** 表单里尚未校验的输入。 */
export interface ExpenseDraft {
  amount: string
  category: Category
  note: string
  date: string
}

export type ValidationResult =
  | { ok: true; expense: Omit<Expense, 'id'> }
  | { ok: false; error: string }

export const NOTE_MAX_LENGTH = 30

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value)
}

/** 校验表单输入，通过时返回可以保存的记录（不含 id）。 */
export function validateDraft(draft: ExpenseDraft): ValidationResult {
  const amount = parseAmount(draft.amount)
  if (amount === null) return { ok: false, error: '请输入正确的金额，最多两位小数' }
  if (amount <= 0) return { ok: false, error: '金额必须大于 0' }
  if (!isCategory(draft.category)) return { ok: false, error: '请选择分类' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return { ok: false, error: '请选择日期' }
  const note = draft.note.trim()
  if (note.length > NOTE_MAX_LENGTH) return { ok: false, error: `备注最多 ${NOTE_MAX_LENGTH} 个字` }
  return { ok: true, expense: { amount, category: draft.category, note, date: draft.date } }
}

export interface ExpenseFilter {
  /** "YYYY-MM"，空字符串表示全部月份 */
  month: string
  category: Category | 'all'
}

export function filterExpenses(list: Expense[], filter: ExpenseFilter): Expense[] {
  return list.filter(
    expense =>
      (filter.month === '' || monthKey(expense.date) === filter.month) &&
      (filter.category === 'all' || expense.category === filter.category),
  )
}

/** 按日期从新到旧排序，返回新数组，不修改原数组。 */
export function sortByDateDesc(list: Expense[]): Expense[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date))
}

/** 记录中出现过的月份，从新到旧。 */
export function listMonths(list: Expense[]): string[] {
  return [...new Set(list.map(expense => monthKey(expense.date)))].sort().reverse()
}

export interface CategoryTotal {
  category: Category
  amount: number
  /** 占总额的百分比，取整 */
  percent: number
}

export interface Summary {
  total: number
  count: number
  byCategory: CategoryTotal[]
}

/** 统计总额和各分类金额，分类按金额从高到低。 */
export function summarize(list: Expense[]): Summary {
  const total = list.reduce((sum, expense) => sum + expense.amount, 0)
  const amounts = new Map<Category, number>()
  for (const expense of list) {
    amounts.set(expense.category, (amounts.get(expense.category) ?? 0) + expense.amount)
  }
  const byCategory = [...amounts]
    .map(([category, amount]) => ({
      category,
      amount,
      percent: total === 0 ? 0 : Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount)
  return { total, count: list.length, byCategory }
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
