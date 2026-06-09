import { useState } from 'react'
import type { ChallengeState, DayTasks } from '../types'
import { TASK_ORDER, TASK_LABELS, TASK_ICONS, TASK_SUBS } from '../types'
import { todayStr } from '../storage'
import { exportToday, exportAll } from '../export'

interface Props {
  state: ChallengeState
  onUpdateTask: (date: string, task: keyof DayTasks) => void
  onAddPreviousDay: () => void
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

export default function History({ state, onUpdateTask, onAddPreviousDay }: Props) {
  const [editDate, setEditDate] = useState<string | null>(null)
  const today = todayStr()
  const records = [...state.history].reverse()

  const editRecord = editDate
    ? state.history.find((r) => r.date === editDate) ?? null
    : null
  const editDayNum = editDate
    ? state.history.findIndex((r) => r.date === editDate) + 1
    : 0

  const canAddPrevious = state.isActive && state.history.length < 75

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
        <button className="btn-outline" onClick={() => exportToday(state)}>Today → vault</button>
        <button className="btn-outline" onClick={() => exportAll(state)}>All days (zip)</button>
      </div>

      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>History</span>
        {canAddPrevious && (
          <button className="day-edit-btn" onClick={onAddPreviousDay}>
            + Add previous day
          </button>
        )}
      </div>

      {records.map((record, i) => {
        const dayNum = state.history.length - i
        const isToday = record.date === today
        const tasksDone = Object.values(record.tasks).filter(Boolean).length

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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>{formatDate(record.date)}</span>
                <button className="day-edit-btn" onClick={() => setEditDate(record.date)}>
                  Edit
                </button>
              </div>
            </div>
            <div className="card">
              {TASK_ORDER.map((key) => {
                const checked = record.tasks[key]
                return (
                  <div key={key} className={`entry${checked ? ' done-entry' : ' miss-entry'}`}>
                    <div>
                      {TASK_ICONS[key]} {TASK_LABELS[key]}
                      <div className="e-meta">{checked ? 'Completed' : 'Not done'}</div>
                    </div>
                    <div className="e-val">{checked ? '✓' : '✕'}</div>
                  </div>
                )
              })}
              {!record.completed && (
                <div style={{ paddingTop: 8, borderTop: '1px solid var(--line)', marginTop: 4 }}>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {tasksDone}/6 tasks · tap <b>Edit</b> to fill in missing tasks
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Edit sheet */}
      <div className="sheet" hidden={editRecord === null || undefined}>
        <div className="sheet-backdrop" onClick={() => setEditDate(null)} />
        <div className="sheet-card">
          <div className="sheet-grip" />
          <h2>Day {editDayNum}</h2>
          <p className="cues" style={{ marginBottom: 12 }}>
            {editDate ? formatDateLong(editDate) : ''} — tap tasks to toggle them.
          </p>

          {editRecord && TASK_ORDER.map((key) => {
            const checked = editRecord.tasks[key]
            return (
              <div
                key={key}
                className="sheet-task"
                onClick={() => {
                  if (editDate) onUpdateTask(editDate, key)
                }}
              >
                <span style={{ fontSize: 22, width: 32, textAlign: 'center' }}>
                  {TASK_ICONS[key]}
                </span>
                <div className="sheet-task-main">
                  <div className="sheet-task-name">{TASK_LABELS[key]}</div>
                  <div className="sheet-task-sub">{TASK_SUBS[key]}</div>
                </div>
                <div className={`sheet-task-check${checked ? ' is-done' : ''}`}>
                  {checked ? '✓' : ''}
                </div>
              </div>
            )
          })}

          <div className="sheet-actions">
            <button className="btn-primary" onClick={() => setEditDate(null)}>Done</button>
          </div>
        </div>
      </div>
    </>
  )
}
