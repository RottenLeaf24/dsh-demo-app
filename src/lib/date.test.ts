import { describe, expect, it } from 'vitest'
import { formatMonth, monthKey } from './date'

describe('monthKey', () => {
  it('取年月', () => {
    expect(monthKey('2026-11-05')).toBe('2026-11')
  })
})

describe('formatMonth', () => {
  it('显示成中文年月', () => {
    expect(formatMonth('2026-03')).toBe('2026 年 3 月')
  })
})
