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
]

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="start-wrap">
      <div className="start-hero">
        <div className="big-num">75</div>
        <div className="big-label">HARD</div>
        <p>75 days. 6 daily tasks. No excuses.<br />Miss one and you restart from day 1.</p>
      </div>

      <div className="card rules-card">
        <div className="section-title" style={{ margin: '0 0 10px' }}>The Rules</div>
        {rules.map(({ icon, text }) => (
          <div key={text} className="rule-row">
            <span className="rule-emoji">{icon}</span>
            <span className="rule-text">{text}</span>
          </div>
        ))}
      </div>

      <div className="start-btn-wrap">
        <button className="btn-primary" onClick={() => onStart(startChallenge())}>
          Start the Challenge
        </button>
        <p className="start-footer">All data is stored locally on your device.</p>
      </div>
    </div>
  )
}
