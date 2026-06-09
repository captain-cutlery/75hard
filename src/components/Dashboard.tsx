import { useState } from 'react'
import type { ChallengeState, DayTasks } from '../types'
import { TASK_ORDER, TASK_LABELS, TASK_ICONS, TASK_SUBS } from '../types'
import { getTodayRecord, completedDays, resetChallenge } from '../storage'

interface Props {
  state: ChallengeState
  onToggle: (task: keyof DayTasks) => void
  onReset: () => void
}

export default function Dashboard({ state, onToggle, onReset }: Props) {
  const [confirmReset, setConfirmReset] = useState(false)

  const todayRecord = getTodayRecord(state)
  const tasks = todayRecord?.tasks
  const allDone = todayRecord?.completed ?? false
  const done = completedDays(state)
  const pct = Math.round(((state.currentDay - 1) / 75) * 100)

  const challengeFinished =
    !state.isActive && state.currentDay === 75 && state.startDate !== null

  if (challengeFinished) {
    return (
      <div className="finish-wrap">
        <div className="big">🏆</div>
        <h2>You Did It!</h2>
        <p>You completed all 75 days of 75 Hard.</p>
        <p style={{ marginBottom: 32 }}>{done} days completed perfectly.</p>
        <button className="btn-primary" onClick={onReset}>
          Start Again
        </button>
      </div>
    )
  }

  return (
    <>
      <p className="lede">Complete all 6 tasks every day. Miss one and you restart.</p>

      {allDone && (
        <div className="alldone-banner">
          <span style={{ fontSize: 22 }}>✓</span>
          <span>All tasks done for today — great work!</span>
        </div>
      )}

      {/* Stats */}
      <div className="progress-card">
        <div className="stat">
          <b>{state.currentDay}</b>
          <span>current day</span>
        </div>
        <div className="stat">
          <b>{done}</b>
          <span>days done</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div className="prog-bar-labels">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="prog-bar-track">
          <div className="prog-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Tasks */}
      <div className="section-title">Today's Tasks</div>
      {TASK_ORDER.map((key) => {
        const checked = tasks?.[key] ?? false
        return (
          <div
            key={key}
            className={`card task-card${checked ? ' done-card' : ''}`}
            onClick={() => onToggle(key)}
          >
            <div className="task-emoji">{TASK_ICONS[key]}</div>
            <div className="task-main">
              <div className="task-name">{TASK_LABELS[key]}</div>
              <div className="task-sub">{TASK_SUBS[key]}</div>
            </div>
            <div className={`task-status${checked ? ' is-done' : ''}`}>
              {checked ? '✓ Done' : 'Tap to log'}
            </div>
          </div>
        )
      })}

      {/* Reset */}
      <div className="section-title">Challenge</div>
      {!confirmReset ? (
        <button
          className="btn-outline danger"
          style={{ width: '100%' }}
          onClick={() => setConfirmReset(true)}
        >
          Reset challenge
        </button>
      ) : (
        <div className="card">
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text)' }}>
            Are you sure? This will erase all progress.
          </p>
          <div className="btn-row">
            <button
              className="btn-outline"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
            <button
              className="btn-outline danger"
              onClick={() => {
                onReset()
                resetChallenge()
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  )
}
