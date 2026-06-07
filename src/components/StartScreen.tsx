import { startChallenge } from '../storage'
import type { ChallengeState } from '../types'

interface Props {
  onStart: (state: ChallengeState) => void
}

const rules = [
  { icon: '🏋️', text: 'Two 45-minute workouts per day' },
  { icon: '🌤️', text: 'One workout must be outdoors' },
  { icon: '💧', text: 'Drink 1 gallon of water' },
  { icon: '🥗', text: 'Follow a diet — no cheat meals, no alcohol' },
  { icon: '📖', text: 'Read 10 pages of a non-fiction book' },
  { icon: '📸', text: 'Take a daily progress photo' },
]

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black text-orange-500 mb-1">75</h1>
          <h2 className="text-3xl font-black text-white tracking-wide">HARD</h2>
          <p className="mt-3 text-gray-400 text-sm">
            75 days. 6 daily tasks. No excuses. Miss one and you restart.
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            The Rules
          </h3>
          {rules.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-xl w-7 text-center shrink-0">{icon}</span>
              <span className="text-sm text-gray-200">{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onStart(startChallenge())}
          className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
        >
          Start the Challenge
        </button>

        <p className="mt-4 text-center text-xs text-gray-600">
          All data is stored locally on your device.
        </p>
      </div>
    </div>
  )
}
