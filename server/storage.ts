import { User, Task, InsertUser, InsertTask, StatCategory, TaskCategory, TaskDifficulty, users, tasks } from "@shared/schema";
import { eq } from "drizzle-orm";
import { calculateLevelInfo } from "../client/src/lib/utils";
import { db } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  resetUser(id: number): Promise<User>;
  
  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task>;
  completeTask(id: number): Promise<Task>;
  updateTaskProgress(id: number, progress: number): Promise<Task>;
  resetTasks(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private userIdCounter: number;
  private taskIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.userIdCounter = 1;
    this.taskIdCounter = 1;
    
    // Initialize with a default user
    this.initializeDefaultData();
  }
  
  private initializeDefaultData(): void {
    // Create default user
    const defaultUser: InsertUser = {
      name: "Hunter Kim",
      level: 4,
      xp: 350,
      currentLevelXp: 350,
      nextLevelXp: 500,
      progress: 70,
      stats: {
        strength: 65,
        endurance: 42,
        discipline: 78,
        speed: 53
      },
      achievements: [
        {
          id: 1,
          name: "First Blood",
          description: "Complete your first task",
          icon: "first_blood",
          isUnlocked: true,
          unlockedAt: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
        },
        {
          id: 2,
          name: "Speed Runner",
          description: "Complete 3 running tasks",
          icon: "speed_runner",
          isUnlocked: true,
          unlockedAt: Date.now() - 20 * 24 * 60 * 60 * 1000 // 20 days ago
        },
        {
          id: 3,
          name: "Iron Will",
          description: "Reach level 3",
          icon: "iron_will",
          isUnlocked: true,
          unlockedAt: Date.now() - 10 * 24 * 60 * 60 * 1000 // 10 days ago
        },
        {
          id: 4,
          name: "Bookworm",
          description: "Read for 10 hours total",
          icon: "bookworm",
          isUnlocked: false
        },
        {
          id: 5,
          name: "Strength Master",
          description: "Reach 100 strength",
          icon: "strength_master",
          isUnlocked: false
        },
        {
          id: 6,
          name: "Consistency",
          description: "Complete tasks for 7 days in a row",
          icon: "consistency",
          isUnlocked: false
        },
        {
          id: 7,
          name: "Discipline Master",
          description: "Reach 100 discipline",
          icon: "discipline",
          isUnlocked: false
        },
        {
          id: 8,
          name: "Endurance Champion",
          description: "Reach 100 endurance",
          icon: "endurance",
          isUnlocked: false
        },
        {
          id: 9,
          name: "Goal Crusher",
          description: "Complete 10 weekly goals",
          icon: "goal_crusher",
          isUnlocked: false
        }
      ],
      activityLog: [
        {
          id: 1,
          description: "Completed 40 push-ups",
          timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
          type: "task_completed"
        },
        {
          id: 2,
          description: "5km Run completed",
          timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
          type: "task_completed"
        },
        {
          id: 3,
          description: "Reached Level 4",
          timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
          type: "level_up"
        },
        {
          id: 4,
          description: "Completed 10 pull-ups",
          timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
          type: "task_completed"
        }
      ]
    };
    this.createUser(defaultUser);
    
    // Create default tasks
    const tasks: InsertTask[] = [
      {
        name: "Complete 50 Push-ups",
        description: "Do 50 push-ups in one day",
        xpReward: 30,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 2 }],
        difficulty: TaskDifficulty.MEDIUM,
        isCompleted: false,
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999))
      },
      {
        name: "Run 5 kilometers",
        description: "Go for a 5km run",
        xpReward: 45,
        category: TaskCategory.RUNNING,
        statRewards: [
          { category: StatCategory.ENDURANCE, amount: 3 },
          { category: StatCategory.DISCIPLINE, amount: 1 }
        ],
        difficulty: TaskDifficulty.MEDIUM,
        completionTarget: 5,
        currentProgress: 3,
        isCompleted: false,
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999))
      },
      {
        name: "Read for 30 minutes",
        description: "Read a book for at least 30 minutes",
        xpReward: 25,
        category: TaskCategory.READING,
        statRewards: [{ category: StatCategory.DISCIPLINE, amount: 2 }],
        difficulty: TaskDifficulty.EASY,
        isCompleted: false,
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999))
      },
      {
        name: "Complete 5 Pull-ups",
        description: "Do 5 pull-ups in one go",
        xpReward: 20,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 1 }],
        difficulty: TaskDifficulty.EASY,
        isCompleted: true,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999))
      },
      {
        name: "Complete 100 Push-ups",
        description: "Do 100 push-ups in one week",
        xpReward: 100,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 5 }],
        difficulty: TaskDifficulty.HARD,
        completionTarget: 100,
        currentProgress: 65,
        isCompleted: false
      },
      {
        name: "Run 15 kilometers",
        description: "Run 15km in one week",
        xpReward: 120,
        category: TaskCategory.RUNNING,
        statRewards: [{ category: StatCategory.ENDURANCE, amount: 8 }],
        difficulty: TaskDifficulty.HARD,
        completionTarget: 15,
        currentProgress: 6,
        isCompleted: false
      },
      {
        name: "Read for 3 hours",
        description: "Read books for 3 hours this week",
        xpReward: 80,
        category: TaskCategory.READING,
        statRewards: [{ category: StatCategory.DISCIPLINE, amount: 6 }],
        difficulty: TaskDifficulty.MEDIUM,
        completionTarget: 180,
        currentProgress: 90,
        isCompleted: false
      },
      {
        name: "Complete 30 Pull-ups",
        description: "Do 30 pull-ups in one week",
        xpReward: 90,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 4 }],
        difficulty: TaskDifficulty.MEDIUM,
        completionTarget: 30,
        currentProgress: 12,
        isCompleted: false
      }
    ];
    
    for (const task of tasks) {
      this.createTask(task);
    }
  }
  
  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const levelInfo = calculateLevelInfo(user.xp);
    const newUser: User = {
      ...user,
      id,
      level: levelInfo.level,
      currentLevelXp: levelInfo.currentLevelXp,
      nextLevelXp: levelInfo.nextLevelXp,
      progress: levelInfo.progress,
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...user, ...updates };
    
    // Recalculate level info if XP was updated
    if (updates.xp !== undefined) {
      const levelInfo = calculateLevelInfo(updatedUser.xp);
      updatedUser.level = levelInfo.level;
      updatedUser.currentLevelXp = levelInfo.currentLevelXp;
      updatedUser.nextLevelXp = levelInfo.nextLevelXp;
      updatedUser.progress = levelInfo.progress;
    }
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async resetUser(id: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    // Reset user to initial state
    const resetUser: User = {
      ...user,
      level: 1,
      xp: 0,
      currentLevelXp: 0,
      nextLevelXp: 100,
      progress: 0,
      stats: {
        strength: 10,
        endurance: 10,
        discipline: 10,
        speed: 10
      },
      achievements: user.achievements.map(achievement => ({
        ...achievement,
        isUnlocked: false,
        unlockedAt: undefined
      })),
      activityLog: []
    };
    
    this.users.set(id, resetUser);
    return resetUser;
  }
  
  // TASK METHODS
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date()
    };
    this.tasks.set(id, newTask);
    return newTask;
  }
  
  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async completeTask(id: number): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    if (task.isCompleted) {
      return task;
    }
    
    const completedTask = {
      ...task,
      isCompleted: true,
      completedAt: new Date()
    };
    
    this.tasks.set(id, completedTask);
    return completedTask;
  }
  
  async updateTaskProgress(id: number, progress: number): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    if (task.completionTarget === undefined) {
      throw new Error(`Task with id ${id} does not have a completion target`);
    }
    
    const isCompleted = progress >= task.completionTarget;
    const updatedTask = {
      ...task,
      currentProgress: progress,
      isCompleted,
      completedAt: isCompleted ? new Date() : task.completedAt
    };
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async resetTasks(): Promise<void> {
    this.tasks.clear();
    this.taskIdCounter = 1;
    
    // Create default daily tasks
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const dailyTasks: InsertTask[] = [
      {
        name: "Complete 20 Push-ups",
        description: "Do 20 push-ups in one day",
        xpReward: 20,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 1 }],
        difficulty: TaskDifficulty.EASY,
        isCompleted: false,
        expiresAt: today
      },
      {
        name: "Run 2 kilometers",
        description: "Go for a 2km run",
        xpReward: 25,
        category: TaskCategory.RUNNING,
        statRewards: [{ category: StatCategory.ENDURANCE, amount: 2 }],
        difficulty: TaskDifficulty.EASY,
        completionTarget: 2,
        currentProgress: 0,
        isCompleted: false,
        expiresAt: today
      },
      {
        name: "Meditate for 10 minutes",
        description: "Meditate for at least 10 minutes",
        xpReward: 15,
        category: TaskCategory.MEDITATION,
        statRewards: [{ category: StatCategory.DISCIPLINE, amount: 1 }],
        difficulty: TaskDifficulty.EASY,
        isCompleted: false,
        expiresAt: today
      }
    ];
    
    for (const task of dailyTasks) {
      await this.createTask(task);
    }
    
    // Create default weekly tasks
    const weeklyTasks: InsertTask[] = [
      {
        name: "Complete 50 Push-ups",
        description: "Do 50 push-ups in one week",
        xpReward: 50,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 3 }],
        difficulty: TaskDifficulty.MEDIUM,
        completionTarget: 50,
        currentProgress: 0,
        isCompleted: false
      },
      {
        name: "Run 10 kilometers",
        description: "Run 10km in one week",
        xpReward: 70,
        category: TaskCategory.RUNNING,
        statRewards: [{ category: StatCategory.ENDURANCE, amount: 5 }],
        difficulty: TaskDifficulty.MEDIUM,
        completionTarget: 10,
        currentProgress: 0,
        isCompleted: false
      },
      {
        name: "Read for 2 hours",
        description: "Read books for 2 hours this week",
        xpReward: 40,
        category: TaskCategory.READING,
        statRewards: [{ category: StatCategory.DISCIPLINE, amount: 3 }],
        difficulty: TaskDifficulty.EASY,
        completionTarget: 120,
        currentProgress: 0,
        isCompleted: false
      }
    ];
    
    for (const task of weeklyTasks) {
      await this.createTask(task);
    }
  }
}

export class DatabaseStorage implements IStorage {
  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.name, username));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    // Ensure xp is a number
    const xp = user.xp ?? 0;
    const levelInfo = calculateLevelInfo(xp);
    const userData = {
      ...user,
      xp,
      level: levelInfo.level,
      currentLevelXp: levelInfo.currentLevelXp,
      nextLevelXp: levelInfo.nextLevelXp,
      progress: levelInfo.progress
    };
    
    const [newUser] = await db.insert(users).values(userData).returning();
    return newUser;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    let updatedData = { ...updates };
    
    // Recalculate level info if XP was updated
    if (updates.xp !== undefined) {
      const levelInfo = calculateLevelInfo(updates.xp);
      updatedData = {
        ...updatedData,
        level: levelInfo.level,
        currentLevelXp: levelInfo.currentLevelXp,
        nextLevelXp: levelInfo.nextLevelXp,
        progress: levelInfo.progress
      };
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(updatedData)
      .where(eq(users.id, id))
      .returning();
      
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return updatedUser;
  }
  
  async resetUser(id: number): Promise<User> {
    // First get the current user to preserve some data
    const [user] = await db.select().from(users).where(eq(users.id, id));
    
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    // Reset user stats
    const resetData = {
      level: 1,
      xp: 0,
      currentLevelXp: 0,
      nextLevelXp: 100,
      progress: 0,
      stats: {
        strength: 10,
        endurance: 10,
        discipline: 10,
        speed: 10
      },
      achievements: user.achievements.map((achievement: any) => ({
        ...achievement,
        isUnlocked: false,
        unlockedAt: undefined
      })),
      activityLog: []
    };
    
    const [resetUser] = await db
      .update(users)
      .set(resetData)
      .where(eq(users.id, id))
      .returning();
      
    return resetUser;
  }
  
  // TASK METHODS
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }
  
  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
      
    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    return updatedTask;
  }
  
  async completeTask(id: number): Promise<Task> {
    // First check if task exists and is not already completed
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    if (task.isCompleted) {
      return task;
    }
    
    // Update the task as completed
    const [completedTask] = await db
      .update(tasks)
      .set({
        isCompleted: true,
        completedAt: new Date()
      })
      .where(eq(tasks.id, id))
      .returning();
      
    return completedTask;
  }
  
  async updateTaskProgress(id: number, progress: number): Promise<Task> {
    // First check if task exists and has a completion target
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    if (task.completionTarget === null || task.completionTarget === undefined) {
      throw new Error(`Task with id ${id} does not have a completion target`);
    }
    
    // Determine if the task is completed
    const isCompleted = progress >= task.completionTarget;
    const updates = {
      currentProgress: progress,
      isCompleted,
      completedAt: isCompleted ? new Date() : task.completedAt
    };
    
    // Update the task
    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
      
    return updatedTask;
  }
  
  async resetTasks(): Promise<void> {
    // Delete all existing tasks
    await db.delete(tasks);
    
    // Create default daily tasks
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const dailyTasks: InsertTask[] = [
      {
        name: "Complete 20 Push-ups",
        description: "Do 20 push-ups in one day",
        xpReward: 20,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 1 }],
        difficulty: TaskDifficulty.EASY,
        isCompleted: false,
        expiresAt: today
      },
      {
        name: "Run 2 kilometers",
        description: "Go for a 2km run",
        xpReward: 25,
        category: TaskCategory.RUNNING,
        statRewards: [{ category: StatCategory.ENDURANCE, amount: 2 }],
        difficulty: TaskDifficulty.EASY,
        completionTarget: 2,
        currentProgress: 0,
        isCompleted: false,
        expiresAt: today
      },
      {
        name: "Meditate for 10 minutes",
        description: "Meditate for at least 10 minutes",
        xpReward: 15,
        category: TaskCategory.MEDITATION,
        statRewards: [{ category: StatCategory.DISCIPLINE, amount: 1 }],
        difficulty: TaskDifficulty.EASY,
        isCompleted: false,
        expiresAt: today
      }
    ];
    
    // Create weekly tasks
    const weeklyTasks: InsertTask[] = [
      {
        name: "Complete 50 Push-ups",
        description: "Do 50 push-ups in one week",
        xpReward: 50,
        category: TaskCategory.STRENGTH,
        statRewards: [{ category: StatCategory.STRENGTH, amount: 3 }],
        difficulty: TaskDifficulty.MEDIUM,
        completionTarget: 50,
        currentProgress: 0,
        isCompleted: false
      },
      {
        name: "Run 10 kilometers",
        description: "Run 10km in one week",
        xpReward: 70,
        category: TaskCategory.RUNNING,
        statRewards: [{ category: StatCategory.ENDURANCE, amount: 5 }],
        difficulty: TaskDifficulty.MEDIUM,
        completionTarget: 10,
        currentProgress: 0,
        isCompleted: false
      },
      {
        name: "Read for 2 hours",
        description: "Read books for 2 hours this week",
        xpReward: 40,
        category: TaskCategory.READING,
        statRewards: [{ category: StatCategory.DISCIPLINE, amount: 3 }],
        difficulty: TaskDifficulty.EASY,
        completionTarget: 120,
        currentProgress: 0,
        isCompleted: false
      }
    ];
    
    // Insert all the tasks
    await db.insert(tasks).values([...dailyTasks, ...weeklyTasks]);
  }
}

// Use database storage
export const storage = new DatabaseStorage();
