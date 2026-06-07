import { NavLink } from 'react-router-dom'

interface Props {
  currentDay: number
  isFinished: boolean
}

export default function Header({ currentDay, isFinished }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-black text-xl">75</span>
          <span className="font-bold text-white">HARD</span>
          {!isFinished && (
            <span className="ml-1 text-sm text-gray-400">
              Day {currentDay} / 75
            </span>
          )}
          {isFinished && (
            <span className="ml-1 text-sm text-green-400 font-semibold">
              COMPLETED 🏆
            </span>
          )}
        </div>
        <nav className="flex gap-4 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-orange-500 font-semibold'
                : 'text-gray-400 hover:text-white transition-colors'
            }
          >
            Today
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? 'text-orange-500 font-semibold'
                : 'text-gray-400 hover:text-white transition-colors'
            }
          >
            History
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
