import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | number): string {
  if (typeof date === 'number') {
    date = new Date(date);
  }
  
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffInDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffInDays < 7) {
    return date.toLocaleString([], { weekday: 'long', hour: 'numeric', minute: '2-digit' });
  } else {
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}

export function formatTimeLeft(targetDate: Date | number): string {
  if (typeof targetDate === 'number') {
    targetDate = new Date(targetDate);
  }
  
  const now = new Date();
  let difference = Math.max(0, targetDate.getTime() - now.getTime()) / 1000;
  
  const hours = Math.floor(difference / 3600);
  difference -= hours * 3600;
  const minutes = Math.floor(difference / 60);
  difference -= minutes * 60;
  const seconds = Math.floor(difference);
  
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateLevelInfo(xp: number): { 
  level: number; 
  currentLevelXp: number; 
  nextLevelXp: number; 
  progress: number;
} {
  // XP required for each level follows a logarithmic progression
  const baseXP = 100;
  const scaleFactor = 1.5;
  
  let level = 1;
  let xpRequired = baseXP;
  let totalXpRequired = xpRequired;
  
  while (xp >= totalXpRequired) {
    level++;
    xpRequired = Math.floor(baseXP * Math.pow(scaleFactor, level - 1));
    totalXpRequired += xpRequired;
  }
  
  // Calculate XP for the current level
  const prevLevelTotalXp = totalXpRequired - xpRequired;
  const currentLevelXp = xp - prevLevelTotalXp;
  const progress = Math.min(100, Math.floor((currentLevelXp / xpRequired) * 100));
  
  return {
    level,
    currentLevelXp,
    nextLevelXp: xpRequired,
    progress
  };
}

export function getRandomTimeToday(): Date {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  
  const randomTime = new Date(startOfDay.getTime() + Math.random() * (now.getTime() - startOfDay.getTime()));
  
  return randomTime;
}

export function getRandomIntInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
