import type { ChallengeState, DayRecord, DayTasks } from './types'

const STORAGE_KEY = '75hard_state'

const emptyTasks = (): DayTasks => ({
  workout1: false,
  workout2: false,
  water: false,
  diet: false,
  reading: false,
})

const defaultState = (): ChallengeState => ({
  startDate: null,
  currentDay: 1,
  isActive: false,
  history: [],
})

export function loadState(): ChallengeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return JSON.parse(raw) as ChallengeState
  } catch {
    return defaultState()
  }
}

export function saveState(state: ChallengeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function startChallenge(): ChallengeState {
  const today = todayStr()
  const state: ChallengeState = {
    startDate: today,
    currentDay: 1,
    isActive: true,
    history: [{ date: today, tasks: emptyTasks(), completed: false }],
  }
  saveState(state)
  return state
}

export function resetChallenge(): ChallengeState {
  const state = defaultState()
  saveState(state)
  return state
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function advanceStateIfNeeded(state: ChallengeState): ChallengeState {
  if (!state.isActive) return state

  const today = todayStr()
  const lastRecord = state.history[state.history.length - 1]

  if (!lastRecord || lastRecord.date === today) return state

  // Days have passed since last record
  const lastDate = new Date(lastRecord.date)
  const todayDate = new Date(today)
  const daysDiff = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Any day in between that wasn't completed = reset
  if (daysDiff > 1 || !lastRecord.completed) {
    // Missed a day — reset
    const reset = defaultState()
    saveState(reset)
    return reset
  }

  // Move to next day
  const nextDay = state.currentDay + 1

  if (nextDay > 75) {
    // Challenge complete!
    const completed: ChallengeState = {
      ...state,
      currentDay: 75,
      isActive: false,
    }
    saveState(completed)
    return completed
  }

  const next: ChallengeState = {
    ...state,
    currentDay: nextDay,
    history: [
      ...state.history,
      { date: today, tasks: emptyTasks(), completed: false },
    ],
  }
  saveState(next)
  return next
}

export function toggleTask(
  state: ChallengeState,
  task: keyof DayTasks
): ChallengeState {
  if (!state.isActive) return state

  const today = todayStr()
  const history = state.history.map((record): DayRecord => {
    if (record.date !== today) return record
    const tasks = { ...record.tasks, [task]: !record.tasks[task] }
    const completed = Object.values(tasks).every(Boolean)
    return { ...record, tasks, completed }
  })

  const next = { ...state, history }
  saveState(next)
  return next
}

export function updateDayTask(
  state: ChallengeState,
  date: string,
  task: keyof DayTasks
): ChallengeState {
  const history = state.history.map((record): DayRecord => {
    if (record.date !== date) return record
    const tasks = { ...record.tasks, [task]: !record.tasks[task] }
    const completed = Object.values(tasks).every(Boolean)
    return { ...record, tasks, completed }
  })
  const next = { ...state, history }
  saveState(next)
  return next
}

export function addPreviousDay(state: ChallengeState): ChallengeState {
  const earliest = state.history[0]
  if (!earliest || state.history.length >= 75) return state

  const d = new Date(earliest.date + 'T00:00')
  d.setDate(d.getDate() - 1)
  const prevDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const next: ChallengeState = {
    ...state,
    startDate: prevDate,
    currentDay: state.currentDay + 1,
    history: [{ date: prevDate, tasks: emptyTasks(), completed: false }, ...state.history],
  }
  saveState(next)
  return next
}


export function getTodayRecord(state: ChallengeState): DayRecord | null {
  const today = todayStr()
  return state.history.find((r) => r.date === today) ?? null
}

export function completedDays(state: ChallengeState): number {
  return state.history.filter((r) => r.completed).length
}
