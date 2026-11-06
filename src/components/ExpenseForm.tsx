import { useState, type FormEvent } from 'react'
import { toISODate } from '../lib/date'
import { CATEGORIES, NOTE_MAX_LENGTH, validateDraft, type Category, type Expense, type ExpenseDraft } from '../lib/ledger'

interface Props {
  onAdd: (expense: Omit<Expense, 'id'>) => void
}

function emptyDraft(): ExpenseDraft {
  return { amount: '', category: '餐饮', note: '', date: toISODate(new Date()) }
}

export function ExpenseForm({ onAdd }: Props) {
  const [draft, setDraft] = useState<ExpenseDraft>(emptyDraft)
  const [error, setError] = useState('')

  function update(patch: Partial<ExpenseDraft>) {
    setDraft(current => ({ ...current, ...patch }))
    setError('')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const result = validateDraft(draft)
    if (!result.ok) {
      setError(result.error)
      return
    }
    onAdd(result.expense)
    setDraft({ ...emptyDraft(), category: draft.category, date: draft.date })
  }

  return (
    <form className="expense-form" onSubmit={submit}>
      <label>
        金额（元）
        <input
          inputMode="decimal"
          placeholder="例如 19.99"
          value={draft.amount}
          onChange={event => update({ amount: event.target.value })}
        />
      </label>
      <label>
        分类
        <select value={draft.category} onChange={event => update({ category: event.target.value as Category })}>
          {CATEGORIES.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        日期
        <input type="date" value={draft.date} onChange={event => update({ date: event.target.value })} />
      </label>
      <label>
        备注
        <input
          maxLength={NOTE_MAX_LENGTH + 10}
          placeholder="选填"
          value={draft.note}
          onChange={event => update({ note: event.target.value })}
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit">添加</button>
    </form>
  )
}
