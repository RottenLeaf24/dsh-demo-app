/**
 * 把记录保存在浏览器 localStorage。
 * 函数接收 storage 参数而不直接用全局 localStorage，方便在测试里传入假的实现。
 */
import { isCategory, type Expense } from './ledger'

export const STORAGE_KEY = 'ledger.expenses.v1'

type ReadStorage = Pick<Storage, 'getItem'>
type WriteStorage = Pick<Storage, 'setItem'>

function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    Number.isInteger(item.amount) &&
    isCategory(item.category) &&
    typeof item.note === 'string' &&
    typeof item.date === 'string'
  )
}

/** 是否已经保存过记录（保存过空列表也算）。 */
export function hasSavedExpenses(storage: ReadStorage): boolean {
  return storage.getItem(STORAGE_KEY) !== null
}

/** 读取记录；数据缺失或损坏时返回空列表，并丢弃格式不对的条目。 */
export function loadExpenses(storage: ReadStorage): Expense[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) ? data.filter(isExpense) : []
  } catch {
    return []
  }
}

export function saveExpenses(storage: WriteStorage, list: Expense[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(list))
}
