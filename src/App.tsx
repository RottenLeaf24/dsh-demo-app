import { useEffect, useMemo, useState } from 'react'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Filters } from './components/Filters'
import { Summary } from './components/Summary'
import {
  filterExpenses,
  listMonths,
  newId,
  sortByDateDesc,
  summarize,
  type Expense,
  type ExpenseFilter,
} from './lib/ledger'
import { sampleExpenses } from './lib/sample'
import { hasSavedExpenses, loadExpenses, saveExpenses } from './lib/storage'

function initialExpenses(): Expense[] {
  return hasSavedExpenses(localStorage) ? loadExpenses(localStorage) : sampleExpenses(new Date())
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [filter, setFilter] = useState<ExpenseFilter>({ month: '', category: 'all' })

  useEffect(() => {
    saveExpenses(localStorage, expenses)
  }, [expenses])

  const visible = useMemo(() => sortByDateDesc(filterExpenses(expenses, filter)), [expenses, filter])
  const summary = useMemo(() => summarize(visible), [visible])
  const months = useMemo(() => listMonths(expenses), [expenses])

  function addExpense(expense: Omit<Expense, 'id'>) {
    setExpenses(list => [...list, { ...expense, id: newId() }])
  }

  function deleteExpense(id: string) {
    setExpenses(list => list.filter(expense => expense.id !== id))
  }

  function resetSample() {
    setExpenses(sampleExpenses(new Date()))
    setFilter({ month: '', category: 'all' })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>小账本</h1>
          <p>记录每一笔开销，按月份和分类查看钱花在了哪里。</p>
        </div>
        <button type="button" className="secondary" onClick={resetSample}>
          重置示例数据
        </button>
      </header>
      <main className="layout">
        <section className="panel">
          <h2>记一笔</h2>
          <ExpenseForm onAdd={addExpense} />
        </section>
        <section className="panel">
          <h2>统计</h2>
          <Filters months={months} value={filter} onChange={setFilter} />
          <Summary summary={summary} />
        </section>
        <section className="panel wide">
          <h2>明细</h2>
          <ExpenseList items={visible} onDelete={deleteExpense} />
        </section>
      </main>
    </div>
  )
}
