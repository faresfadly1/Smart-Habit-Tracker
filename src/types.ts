export type Language = 'en' | 'ar';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: 'daily' | 'weekly';
  color: string;
  createdAt: number;
}

export interface TrackingData {
  [date: string]: {
    [habitId: string]: boolean;
  };
}

export interface Dictionary {
  title: string;
  addHabit: string;
  editHabit: string;
  habitName: string;
  habitIcon: string;
  frequency: string;
  daily: string;
  weekly: string;
  save: string;
  cancel: string;
  delete: string;
  stats: string;
  totalHabits: string;
  completedToday: string;
  completionRate: string;
  personalInsights: string;
  streaks: string;
  bestDay: string;
  weakDay: string;
  noHabits: string;
  confirmDelete: string;
  monthNames: string[];
  dayShortNames: string[];
}
