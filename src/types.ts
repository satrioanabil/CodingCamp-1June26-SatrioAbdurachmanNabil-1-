export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category: string; // e.g., 'Kerja', 'Pribadi', 'Kesehatan'
  priority: 'low' | 'medium' | 'high';
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  iconName: string; // lucide icon name or emoji
  clickCount: number;
  isCustom: boolean;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerConfig {
  focus: number; // in seconds
  shortBreak: number; // in seconds
  longBreak: number; // in seconds
}

export interface MotivationalQuote {
  text: string;
  author: string;
}
