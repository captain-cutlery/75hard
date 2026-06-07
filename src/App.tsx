import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { ChallengeState } from './types'
import { loadState, advanceStateIfNeeded, toggleTask } from './storage'
import type { DayTasks } from './types'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import History from './components/History'
import StartScreen from './components/StartScreen'

export default function App() {
  const [state, setState] = useState<ChallengeState>(() => {
    const loaded = loadState()
    return advanceStateIfNeeded(loaded)
  })

  useEffect(() => {
    // Re-check at midnight in case the app stays open
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
  }

  const challengeFinished =
    !state.isActive && state.currentDay === 75 && state.startDate !== null

  return (
    <div className="min-h-screen bg-gray-950">
      {state.isActive || challengeFinished ? (
        <>
          <Header currentDay={state.currentDay} isFinished={challengeFinished} />
          <main className="max-w-lg mx-auto px-4 pb-10">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    state={state}
                    onToggle={handleToggle}
                    onReset={() => handleStateChange({ startDate: null, currentDay: 1, isActive: false, history: [] })}
                  />
                }
              />
              <Route
                path="/history"
                element={<History state={state} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </>
      ) : (
        <Routes>
          <Route
            path="*"
            element={<StartScreen onStart={handleStateChange} />}
          />
        </Routes>
      )}
    </div>
  )
}
