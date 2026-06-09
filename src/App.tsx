import { useState, useEffect } from 'react'
import type { ChallengeState, DayTasks } from './types'
import { loadState, advanceStateIfNeeded, toggleTask, updateDayTask, addPreviousDay, todayStr } from './storage'
import Dashboard from './components/Dashboard'
import History from './components/History'
import StartScreen from './components/StartScreen'

type Tab = 'today' | 'history'

function weekStrip(history: ChallengeState['history']) {
  const names = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = todayStr()
  const now = new Date()
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - now.getDay())
  const completed = new Set(history.filter((r) => r.completed).map((r) => r.date))

  return (
    <div className="week-strip">
      {Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday)
        d.setDate(sunday.getDate() + i)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const done = completed.has(key)
        const isToday = key === today
        const cls = ['week-day', done ? 'done' : '', isToday ? 'today' : ''].filter(Boolean).join(' ')
        return (
          <div key={i} className={cls}>
            <b>{names[i]}</b>
            {d.getDate()}
          </div>
        )
      })}
    </div>
  )
}

export default function App() {
  const [state, setState] = useState<ChallengeState>(() =>
    advanceStateIfNeeded(loadState())
  )
  const [tab, setTab] = useState<Tab>('today')

  useEffect(() => {
    const now = new Date()
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime()
    const timer = setTimeout(() => {
      setState((s) => advanceStateIfNeeded(s))
    }, msUntilMidnight + 1000)
    return () => clearTimeout(timer)
  }, [state])

  function handleToggle(task: keyof DayTasks) {
    setState((s) => toggleTask(s, task))
  }

  function handleStateChange(next: ChallengeState) {
    setState(next)
    setTab('today')
  }

  const challengeFinished =
    !state.isActive && state.currentDay === 75 && state.startDate !== null

  if (!state.isActive && !challengeFinished) {
    return <StartScreen onStart={handleStateChange} />
  }

  const titles: Record<Tab, string> = { today: 'Today', history: 'History' }

  return (
    <>
      <header className="topbar">
        <div className="topbar-row">
          <h1>{titles[tab]}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>
              Day {state.currentDay} / 75
            </span>
          </div>
        </div>
        {weekStrip(state.history)}
      </header>

      <main className="view">
        {tab === 'today' && (
          <Dashboard
            state={state}
            onToggle={handleToggle}
            onReset={() =>
              handleStateChange({
                startDate: null,
                currentDay: 1,
                isActive: false,
                history: [],
              })
            }
          />
        )}
        {tab === 'history' && (
          <History
            state={state}
            onUpdateTask={(date, task) => setState((s) => updateDayTask(s, date, task))}
            onAddPreviousDay={() => setState((s) => addPreviousDay(s))}
          />
        )}
      </main>

      <nav className="tabbar">
        <button
          className={`tab${tab === 'today' ? ' is-active' : ''}`}
          onClick={() => setTab('today')}
        >
          <span className="tab-ico">☀</span>
          <span>Today</span>
        </button>
        <button
          className={`tab${tab === 'history' ? ' is-active' : ''}`}
          onClick={() => setTab('history')}
        >
          <span className="tab-ico">≡</span>
          <span>History</span>
        </button>
      </nav>
    </>
  )
}
