import { formatMoney } from '../lib/money'
import type { Summary as SummaryData } from '../lib/ledger'

interface Props {
  summary: SummaryData
}

export function Summary({ summary }: Props) {
  return (
    <div className="summary">
      <div className="total">
        <span>合计</span>
        <strong>{formatMoney(summary.total)}</strong>
        <small>共 {summary.count} 笔</small>
      </div>
      <ul className="bars">
        {summary.byCategory.map(item => (
          <li key={item.category}>
            <span className="bar-label">{item.category}</span>
            <span className="bar">
              <span className="bar-fill" style={{ width: `${item.percent}%` }} />
            </span>
            <span className="bar-value">
              {formatMoney(item.amount)} · {item.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
