import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize a default user if none exists
  try {
    const user = await storage.getUser(1);
    if (!user) {
      // Create a default user
      await storage.createUser({
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
      });
      console.log("Created default user");
      
      // Also create default tasks
      await storage.resetTasks();
      console.log("Created default tasks");
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
  
  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      // For simplicity, we'll always use user ID 1
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.put("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(1, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  app.post("/api/user/reset", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const resetUser = await storage.resetUser(1);
      res.json(resetUser);
    } catch (error) {
      console.error("Error resetting user:", error);
      res.status(500).json({ message: "Failed to reset user" });
    }
  });
  
  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });
  
  app.post("/api/tasks", async (req, res) => {
    try {
      // Validate the request body against the schema
      const taskData = insertTaskSchema.parse(req.body);
      
      // Create the task
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid task data",
          errors: error.format()
        });
      }
      
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });
  
  app.post("/api/tasks/:id/complete", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      if (task.isCompleted) {
        return res.status(400).json({ message: "Task is already completed" });
      }
      
      const completedTask = await storage.completeTask(taskId);
      res.json(completedTask);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });
  
  app.post("/api/tasks/:id/progress", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0) {
        return res.status(400).json({ message: "Invalid progress value" });
      }
      
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      if (task.isCompleted) {
        return res.status(400).json({ message: "Task is already completed" });
      }
      
      if (task.completionTarget === undefined) {
        return res.status(400).json({ message: "This task doesn't track progress" });
      }
      
      const updatedTask = await storage.updateTaskProgress(taskId, progress);
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task progress:", error);
      res.status(500).json({ message: "Failed to update task progress" });
    }
  });
  
  app.post("/api/tasks/reset", async (req, res) => {
    try {
      await storage.resetTasks();
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error resetting tasks:", error);
      res.status(500).json({ message: "Failed to reset tasks" });
    }
  });
  
  return httpServer;
}
