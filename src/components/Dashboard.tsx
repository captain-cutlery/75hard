import { useState } from 'react'
import type { ChallengeState, DayTasks } from '../types'
import { TASK_ORDER, TASK_LABELS, TASK_ICONS } from '../types'
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
  const progress = ((state.currentDay - 1) / 75) * 100

  const challengeFinished =
    !state.isActive && state.currentDay === 75 && state.startDate !== null

  if (challengeFinished) {
    return (
      <div className="pt-10 text-center">
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-3xl font-black text-white mb-2">You Did It!</h2>
        <p className="text-gray-400 mb-2">
          You completed all 75 days of 75 Hard.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          {done} days completed perfectly.
        </p>
        <button
          onClick={() => onReset()}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
        >
          Start Again
        </button>
      </div>
    )
  }

  return (
    <div className="pt-6 space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Progress</span>
          <span>{done} / 75 days</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Day card */}
      <div
        className={`rounded-2xl p-5 ${
          allDone
            ? 'bg-green-900/30 border border-green-700/40'
            : 'bg-gray-900 border border-gray-800'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Day
            </p>
            <p className="text-4xl font-black text-white leading-none">
              {state.currentDay}
            </p>
          </div>
          {allDone ? (
            <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-sm font-semibold">
              <span>✓</span>
              <span>All done!</span>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-lg font-bold text-gray-300">
                {tasks
                  ? Object.values(tasks).filter((v) => !v).length
                  : 6}
              </p>
            </div>
          )}
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {TASK_ORDER.map((key) => {
            const checked = tasks?.[key] ?? false
            return (
              <button
                key={key}
                onClick={() => onToggle(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 ${
                  checked
                    ? 'bg-green-900/20 border border-green-700/30'
                    : 'bg-gray-800/60 border border-gray-700/40 hover:border-gray-600'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    checked
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-600'
                  }`}
                >
                  {checked && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-lg">{TASK_ICONS[key]}</span>
                <span
                  className={`text-sm font-medium ${
                    checked ? 'text-gray-400 line-through' : 'text-gray-100'
                  }`}
                >
                  {TASK_LABELS[key]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reset */}
      <div className="pt-2">
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full text-xs text-gray-600 hover:text-gray-500 py-2 transition-colors"
          >
            Reset challenge
          </button>
        ) : (
          <div className="bg-gray-900 border border-red-900/50 rounded-xl p-4 text-center space-y-3">
            <p className="text-sm text-gray-300">
              Are you sure? This will erase all progress.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset()
                  resetChallenge()
                }}
                className="flex-1 py-2 rounded-lg bg-red-900/60 text-sm text-red-300 hover:bg-red-900 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
