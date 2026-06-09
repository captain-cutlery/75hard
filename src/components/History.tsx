import type { ChallengeState } from '../types'
import { TASK_ORDER, TASK_LABELS, TASK_ICONS } from '../types'
import { todayStr } from '../storage'
import { exportToday, exportAll } from '../export'

interface Props {
  state: ChallengeState
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function History({ state }: Props) {
  const today = todayStr()
  const records = [...state.history].reverse()

  if (records.length === 0) {
    return (
      <div className="empty">
        <div className="big">🌱</div>
        No days logged yet.<br />Consistency is the whole game — start today.
      </div>
    )
  }

  return (
    <>
      <p className="lede">
        {state.history.filter((r) => r.completed).length} of {state.history.length} days completed perfectly.
      </p>

      <div className="section-title">Your data</div>
      <p className="lede">Stored only on this device. Export regularly as a backup.</p>
      <div className="btn-row" style={{ marginBottom: 12 }}>
        <button className="btn-outline" onClick={() => exportToday(state)}>
          Today → vault
        </button>
        <button className="btn-outline" onClick={() => exportAll(state)}>
          All days (zip)
        </button>
      </div>

      <div className="section-title">History</div>
      {records.map((record, i) => {
        const dayNum = state.history.length - i
        const isToday = record.date === today

        return (
          <div key={record.date} className="day-group">
            <div className="day-head">
              <h3>
                Day {dayNum}
                {isToday && (
                  <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 400, marginLeft: 8 }}>
                    · Today
                  </span>
                )}
              </h3>
              <span>{formatDate(record.date)}</span>
            </div>
            <div className="card">
              {TASK_ORDER.map((key) => {
                const checked = record.tasks[key]
                return (
                  <div
                    key={key}
                    className={`entry${checked ? ' done-entry' : ' miss-entry'}`}
                  >
                    <div>
                      {TASK_ICONS[key]} {TASK_LABELS[key]}
                      <div className="e-meta">{checked ? 'Completed' : 'Not done'}</div>
                    </div>
                    <div className="e-val">{checked ? '✓' : '✕'}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}
