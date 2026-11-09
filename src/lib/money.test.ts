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

  it('转换结果不受浮点误差影响', () => {
    expect(parseAmount('0.29')).toBe(29)
    expect(parseAmount('1.15')).toBe(115)
    expect(parseAmount('1.005')).toBeNull()
  })

  it('接受末尾带 0 的小数', () => {
    expect(parseAmount('0.10')).toBe(10)
    expect(parseAmount('1.50')).toBe(150)
  })

  it('拒绝超出安全整数范围的金额', () => {
    expect(parseAmount('9999999999999999')).toBeNull()
    expect(parseAmount('1'.repeat(400))).toBeNull()
    expect(parseAmount('99999999999999.99')).toBeNull()
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

  it('小数部分不足两位时补零', () => {
    expect(formatMoney(5)).toBe('¥0.05')
    expect(formatMoney(-5)).toBe('-¥0.05')
    expect(formatMoney(50)).toBe('¥0.50')
    expect(formatMoney(100)).toBe('¥1.00')
  })

  it('对非整数分和超大数不产生乱码', () => {
    expect(formatMoney(12.5)).toBe('¥0.00')
    expect(formatMoney(-0.5)).toBe('¥0.00')
    expect(formatMoney(Number.NaN)).toBe('¥0.00')
    expect(formatMoney(Number.POSITIVE_INFINITY)).toBe('¥0.00')
    expect(formatMoney(2 ** 60)).toBe('¥0.00')
  })
})
