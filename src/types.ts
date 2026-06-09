export interface DayTasks {
  workout1: boolean;
  workout2: boolean;
  water: boolean;
  diet: boolean;
  reading: boolean;
  photo: boolean;
}

export interface DayRecord {
  date: string;
  tasks: DayTasks;
  completed: boolean;
}

export interface ChallengeState {
  startDate: string | null;
  currentDay: number;
  isActive: boolean;
  history: DayRecord[];
}

export const TASK_LABELS: Record<keyof DayTasks, string> = {
  workout1: 'Workout #1',
  workout2: 'Workout #2 (outdoor)',
  water:    'Drink 1 Gallon of Water',
  diet:     'Follow Your Diet',
  reading:  'Read 10 Pages',
  photo:    'Progress Photo',
}

export const TASK_SUBS: Record<keyof DayTasks, string> = {
  workout1: '45 min · any location',
  workout2: '45 min · must be outside',
  water:    'No cheat — full gallon',
  diet:     'No cheat meals, no alcohol',
  reading:  'Non-fiction or self-help book',
  photo:    'One photo, every day',
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
