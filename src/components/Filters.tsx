import { formatMonth } from '../lib/date'
import { CATEGORIES, type Category, type ExpenseFilter } from '../lib/ledger'

interface Props {
  months: string[]
  value: ExpenseFilter
  onChange: (filter: ExpenseFilter) => void
}

export function Filters({ months, value, onChange }: Props) {
  return (
    <div className="filters">
      <label>
        月份
        <select value={value.month} onChange={event => onChange({ ...value, month: event.target.value })}>
          <option value="">全部月份</option>
          {months.map(month => (
            <option key={month} value={month}>
              {formatMonth(month)}
            </option>
          ))}
        </select>
      </label>
      <label>
        分类
        <select
          value={value.category}
          onChange={event => onChange({ ...value, category: event.target.value as Category | 'all' })}
        >
          <option value="all">全部分类</option>
          {CATEGORIES.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
