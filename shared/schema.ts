import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export enum TaskCategory {
  STRENGTH = "strength",
  ENDURANCE = "endurance",
  RUNNING = "running",
  READING = "reading",
  MEDITATION = "meditation",
  DISCIPLINE = "discipline"
}

export enum TaskDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard"
}

export enum StatCategory {
  STRENGTH = "Strength",
  ENDURANCE = "Endurance",
  DISCIPLINE = "Discipline",
  SPEED = "Speed"
}

export interface StatReward {
  category: StatCategory;
  amount: number;
}

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  currentLevelXp: integer("current_level_xp").notNull().default(0),
  nextLevelXp: integer("next_level_xp").notNull().default(100),
  progress: integer("progress").notNull().default(0),
  stats: json("stats").notNull().$type<{
    strength: number;
    endurance: number;
    discipline: number;
    speed: number;
  }>(),
  achievements: json("achievements").notNull().$type<{
    id: number;
    name: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedAt?: number;
  }[]>(),
  activityLog: json("activity_log").notNull().$type<{
    id: number;
    description: string;
    timestamp: number;
    type: 'task_completed' | 'level_up' | 'achievement_unlocked' | 'stat_increase';
  }[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  xpReward: integer("xp_reward").notNull(),
  category: text("category").notNull().$type<TaskCategory>(),
  statRewards: json("stat_rewards").notNull().$type<StatReward[]>(),
  difficulty: text("difficulty").notNull().$type<TaskDifficulty>(),
  completionTarget: integer("completion_target"),
  currentProgress: integer("current_progress"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
});

// Insert schema for User
export const insertUserSchema = createInsertSchema(users);

// Insert schema for Task
export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types based on schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
