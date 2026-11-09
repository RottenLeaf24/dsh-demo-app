import { describe, expect, it } from 'vitest'
import { CSV_HEADER, csvFileName, expensesToCsv, formatCentsForCsv } from './csv'
import type { Expense } from './ledger'

const expense = (patch: Partial<Expense> = {}): Expense => ({
  id: 'a',
  amount: 2500,
  category: '餐饮',
  note: '午饭',
  date: '2026-11-05',
  ...patch,
})

describe('formatCentsForCsv', () => {
  it('把分转成两位小数的元，不带货币符号和千分位', () => {
    expect(formatCentsForCsv(123456)).toBe('1234.56')
    expect(formatCentsForCsv(105)).toBe('1.05')
    expect(formatCentsForCsv(5)).toBe('0.05')
    expect(formatCentsForCsv(0)).toBe('0.00')
    expect(formatCentsForCsv(-2500)).toBe('-25.00')
  })
})

describe('expensesToCsv', () => {
  it('第一行是中文表头，其余每行一条记录，行尾用 CRLF', () => {
    const csv = expensesToCsv([expense(), expense({ id: 'b', amount: 99, category: '交通', note: '', date: '2026-11-04' })])
    expect(csv).toBe(
      [CSV_HEADER.join(','), '2026-11-05,餐饮,午饭,25.00', '2026-11-04,交通,,0.99'].join('\r\n'),
    )
  })

  it('没有记录时只有表头', () => {
    expect(expensesToCsv([])).toBe('日期,分类,备注,金额（元）')
  })

  it('备注里的逗号、引号和换行按 CSV 规则转义', () => {
    expect(expensesToCsv([expense({ note: '早餐,咖啡' })])).toContain('\n2026-11-05,餐饮,"早餐,咖啡",25.00'.trimStart())
    expect(expensesToCsv([expense({ note: '电影 "沙丘"' })])).toContain(',"电影 ""沙丘""",')
    expect(expensesToCsv([expense({ note: '第一行\n第二行' })])).toContain(',"第一行\n第二行",')
  })

  it('备注以公式字符开头时加前导单引号，避免被表格软件当公式执行', () => {
    const row = (note: string) => expensesToCsv([expense({ note })]).split('\r\n')[1]
    expect(row('=SUM(1,2)')).toBe('2026-11-05,餐饮,"\'=SUM(1,2)",25.00')
    expect(row("+1")).toBe("2026-11-05,餐饮,'+1,25.00")
    expect(row('-1')).toBe("2026-11-05,餐饮,'-1,25.00")
    expect(row('@user')).toBe("2026-11-05,餐饮,'@user,25.00")
    expect(row('暂无')).toBe('2026-11-05,餐饮,暂无,25.00')
  })

  it('按传入的顺序输出，不排序也不修改记录', () => {
    const list = [expense({ id: 'a', date: '2026-11-01' }), expense({ id: 'b', date: '2026-11-09' })]
    const copy = [...list]
    expect(expensesToCsv(list).split('\r\n').slice(1)).toEqual(['2026-11-01,餐饮,午饭,25.00', '2026-11-09,餐饮,午饭,25.00'])
    expect(list).toEqual(copy)
  })
})

describe('csvFileName', () => {
  it('按筛选的月份命名，全部月份时明确写出', () => {
    expect(csvFileName('2026-11')).toBe('小账本-2026-11.csv')
    expect(csvFileName('')).toBe('小账本-全部月份.csv')
  })
})
