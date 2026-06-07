export interface DayTasks {
  workout1: boolean;   // 45-min workout (any location)
  workout2: boolean;   // 45-min outdoor workout
  water: boolean;      // 1 gallon of water
  diet: boolean;       // Followed diet, no cheat meals
  reading: boolean;    // 10 pages non-fiction
  photo: boolean;      // Progress photo
}

export interface DayRecord {
  date: string;        // YYYY-MM-DD
  tasks: DayTasks;
  completed: boolean;  // all 6 tasks done before midnight
}

export interface ChallengeState {
  startDate: string | null;
  currentDay: number;
  isActive: boolean;
  history: DayRecord[];
}

export const TASK_LABELS: Record<keyof DayTasks, string> = {
  workout1: 'Workout #1 (45 min)',
  workout2: 'Outdoor Workout #2 (45 min)',
  water:    'Drink 1 Gallon of Water',
  diet:     'Follow Your Diet (no cheat meals)',
  reading:  'Read 10 Pages',
  photo:    'Take a Progress Photo',
}

export const TASK_ICONS: Record<keyof DayTasks, string> = {
  workout1: '🏋️',
  workout2: '🌤️',
  water:    '💧',
  diet:     '🥗',
  reading:  '📖',
  photo:    '📸',
}

export const TASK_ORDER: (keyof DayTasks)[] = [
  'workout1',
  'workout2',
  'water',
  'diet',
  'reading',
  'photo',
]
