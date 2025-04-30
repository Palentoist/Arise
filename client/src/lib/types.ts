import { StatCategory, TaskCategory, TaskDifficulty } from "@shared/schema";

export interface UserStats {
  id: number;
  strength: number;
  endurance: number;
  discipline: number;
  speed: number;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  xpReward: number;
  category: TaskCategory;
  statRewards: StatReward[];
  difficulty: TaskDifficulty;
  completionTarget?: number;
  currentProgress?: number;
  isCompleted: boolean;
  createdAt: number;
  completedAt?: number;
  expiresAt?: number;
}

export interface StatReward {
  category: StatCategory;
  amount: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface ActivityLog {
  id: number;
  description: string;
  timestamp: number;
  type: 'task_completed' | 'level_up' | 'achievement_unlocked' | 'stat_increase';
}

export interface UserProfile {
  id: number;
  name: string;
  level: number;
  xp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
  stats: UserStats;
  achievements: Achievement[];
  activityLog: ActivityLog[];
}

export interface NotificationToast {
  id: string;
  message: string;
  points?: number;
  type?: 'success' | 'info' | 'error' | 'warning';
}

export interface LevelUpInfo {
  newLevel: number;
  statIncreases: StatReward[];
}

export type TaskFilter = 'all' | 'active' | 'completed';
