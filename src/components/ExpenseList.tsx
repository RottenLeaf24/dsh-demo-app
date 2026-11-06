import { formatMoney } from '../lib/money'
import type { Expense } from '../lib/ledger'

interface Props {
  items: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ items, onDelete }: Props) {
  if (items.length === 0) return <p className="empty">没有符合条件的记录。</p>
  return (
    <table className="expense-list">
      <thead>
        <tr>
          <th>日期</th>
          <th>分类</th>
          <th>备注</th>
          <th className="num">金额</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.date}</td>
            <td>
              <span className="tag">{item.category}</span>
            </td>
            <td>{item.note || '—'}</td>
            <td className="num">{formatMoney(item.amount)}</td>
            <td className="actions">
              <button type="button" className="link" onClick={() => onDelete(item.id)}>
                删除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
