import { describe, expect, it } from 'vitest'
import type { Expense } from './ledger'
import { STORAGE_KEY, hasSavedExpenses, loadExpenses, saveExpenses } from './storage'

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

const expense: Expense = { id: 'a', amount: 1000, category: '餐饮', note: '午饭', date: '2026-11-05' }

describe('storage', () => {
  it('保存后可以读回', () => {
    const storage = memoryStorage()
    saveExpenses(storage, [expense])
    expect(loadExpenses(storage)).toEqual([expense])
    expect(hasSavedExpenses(storage)).toBe(true)
  })

  it('没有数据时返回空列表', () => {
    const storage = memoryStorage()
    expect(loadExpenses(storage)).toEqual([])
    expect(hasSavedExpenses(storage)).toBe(false)
  })

  it('丢弃格式不对的条目', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify([expense, { id: 1 }]) })
    expect(loadExpenses(storage)).toEqual([expense])
  })
})
