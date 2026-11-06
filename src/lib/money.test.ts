import { describe, expect, it } from 'vitest'
import { formatMoney, parseAmount } from './money'

describe('parseAmount', () => {
  it('把元转换成分', () => {
    expect(parseAmount('12.5')).toBe(1250)
    expect(parseAmount('100')).toBe(10000)
    expect(parseAmount(' 8 ')).toBe(800)
  })

  it('拒绝格式不对的输入', () => {
    expect(parseAmount('')).toBeNull()
    expect(parseAmount('abc')).toBeNull()
    expect(parseAmount('-1')).toBeNull()
    expect(parseAmount('1.234')).toBeNull()
  })
})

describe('formatMoney', () => {
  it('带千分位和两位小数', () => {
    expect(formatMoney(123456789)).toBe('¥1,234,567.89')
    expect(formatMoney(105)).toBe('¥1.05')
    expect(formatMoney(0)).toBe('¥0.00')
  })

  it('负数带负号', () => {
    expect(formatMoney(-2500)).toBe('-¥25.00')
  })
})
