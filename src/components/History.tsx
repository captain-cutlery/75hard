import type { ChallengeState } from '../types'
import { TASK_ORDER, TASK_LABELS, TASK_ICONS } from '../types'

interface Props {
  state: ChallengeState
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function History({ state }: Props) {
  const records = [...state.history].reverse()

  if (records.length === 0) {
    return (
      <div className="pt-12 text-center text-gray-500 text-sm">
        No history yet.
      </div>
    )
  }

  return (
    <div className="pt-6 space-y-3">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
        Challenge History
      </h2>

      {records.map((record, i) => {
        const dayNum = state.history.length - i
        const tasksDone = Object.values(record.tasks).filter(Boolean).length
        const isToday = i === 0

        return (
          <details
            key={record.date}
            className={`rounded-xl border overflow-hidden ${
              record.completed
                ? 'border-green-700/40 bg-green-900/10'
                : 'border-gray-700/40 bg-gray-900'
            }`}
          >
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none select-none">
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    record.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {dayNum}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-100">
                    {formatDate(record.date)}
                    {isToday && (
                      <span className="ml-2 text-xs text-orange-400">Today</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tasksDone}/6 tasks
                  </p>
                </div>
              </div>
              <span className="text-gray-600 text-xs">▼</span>
            </summary>

            <div className="px-4 pb-4 pt-1 space-y-1.5">
              {TASK_ORDER.map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      record.tasks[key]
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-600'
                    }`}
                  >
                    {record.tasks[key] && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
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
                  </span>
                  <span className="text-base">{TASK_ICONS[key]}</span>
                  <span
                    className={
                      record.tasks[key] ? 'text-gray-400' : 'text-gray-500'
                    }
                  >
                    {TASK_LABELS[key]}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )
      })}
    </div>
  )
}
