import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "@/hooks/use-user";
import { useNotifications } from "@/hooks/use-notifications";
import { Task, TaskFilter, StatReward } from "@/lib/types";
import { TaskCategory, TaskDifficulty } from "@shared/schema";

interface CreateTaskPayload {
  name: string;
  category: TaskCategory;
  xpReward: number;
  difficulty: TaskDifficulty;
  completionTarget?: number;
}

export function useTasks() {
  const { addXp, updateStats, addActivityLog } = useUser();
  const { showNotification } = useNotifications();
  const queryClient = useQueryClient();
  
  // Fetch all tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
    retry: 1,
  });
  
  // Create task mutation
  const { mutate: createTaskMutation } = useMutation({
    mutationFn: async (taskData: CreateTaskPayload) => {
      const response = await apiRequest("POST", "/api/tasks", taskData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      showNotification({
        message: "New task created",
        type: "success"
      });
    }
  });
  
  // Complete task mutation
  const { mutate: completeTaskMutation } = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiRequest("POST", `/api/tasks/${taskId}/complete`, {});
      return response.json();
    },
    onSuccess: (data: Task) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      // Award XP
      addXp(data.xpReward);
      
      // Update stats based on rewards
      if (data.statRewards.length > 0) {
        const statUpdates = data.statRewards.reduce((acc, reward) => {
          const key = reward.category.toLowerCase() as keyof typeof acc;
          acc[key] = (acc[key] || 0) + reward.amount;
          return acc;
        }, {} as Record<string, number>);
        
        updateStats(statUpdates);
      }
      
      // Add to activity log
      addActivityLog({
        description: `Completed ${data.name}`,
        timestamp: Date.now(),
        type: 'task_completed'
      });
      
      // Show notification
      showNotification({
        message: "Task completed!",
        points: data.xpReward,
        type: "success"
      });
    }
  });
  
  // Update task progress mutation
  const { mutate: updateProgressMutation } = useMutation({
    mutationFn: async ({ taskId, progress }: { taskId: number; progress: number }) => {
      const response = await apiRequest("POST", `/api/tasks/${taskId}/progress`, { progress });
      return response.json();
    },
    onSuccess: (data: Task) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      
      // If task is completed by this progress update
      if (data.isCompleted) {
        // Award XP
        addXp(data.xpReward);
        
        // Update stats based on rewards
        if (data.statRewards.length > 0) {
          const statUpdates = data.statRewards.reduce((acc, reward) => {
            const key = reward.category.toLowerCase() as keyof typeof acc;
            acc[key] = (acc[key] || 0) + reward.amount;
            return acc;
          }, {} as Record<string, number>);
          
          updateStats(statUpdates);
        }
        
        // Add to activity log
        addActivityLog({
          description: `Completed ${data.name}`,
          timestamp: Date.now(),
          type: 'task_completed'
        });
        
        // Show notification
        showNotification({
          message: "Task completed!",
          points: data.xpReward,
          type: "success"
        });
      } else {
        // Show progress notification
        showNotification({
          message: `Progress updated: ${data.currentProgress}/${data.completionTarget}`,
          type: "info"
        });
      }
    }
  });
  
  // Reset tasks mutation
  const { mutate: resetTasksMutation } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/tasks/reset", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });
  
  // Task creation helper (with default stat rewards based on category and difficulty)
  const createTask = useCallback((taskData: CreateTaskPayload) => {
    // Generate appropriate stat rewards based on category and difficulty
    const difficulty = taskData.difficulty;
    let statRewards: StatReward[] = [];
    
    const difficultyMultiplier = 
      difficulty === TaskDifficulty.EASY ? 1 :
      difficulty === TaskDifficulty.MEDIUM ? 2 : 3;
    
    switch (taskData.category) {
      case TaskCategory.STRENGTH:
        statRewards = [{ category: "Strength", amount: 1 * difficultyMultiplier }];
        break;
      case TaskCategory.ENDURANCE:
        statRewards = [{ category: "Endurance", amount: 1 * difficultyMultiplier }];
        break;
      case TaskCategory.RUNNING:
        statRewards = [
          { category: "Endurance", amount: 1 * difficultyMultiplier },
          { category: "Speed", amount: 1 * difficultyMultiplier }
        ];
        break;
      case TaskCategory.READING:
      case TaskCategory.MEDITATION:
        statRewards = [{ category: "Discipline", amount: 1 * difficultyMultiplier }];
        break;
      case TaskCategory.DISCIPLINE:
        statRewards = [{ category: "Discipline", amount: 2 * difficultyMultiplier }];
        break;
    }
    
    // Submit task with calculated rewards
    createTaskMutation({
      ...taskData,
      statRewards
    });
  }, [createTaskMutation]);
  
  // Complete task helper
  const completeTask = useCallback((taskId: number) => {
    completeTaskMutation(taskId);
  }, [completeTaskMutation]);
  
  // Update task progress helper
  const updateTaskProgress = useCallback((taskId: number, progress: number) => {
    updateProgressMutation({ taskId, progress });
  }, [updateProgressMutation]);
  
  // Reset tasks
  const resetTasks = useCallback(() => {
    resetTasksMutation();
  }, [resetTasksMutation]);
  
  // Filter tasks by type
  const filterTasks = useCallback((filter: TaskFilter = 'all') => {
    if (!tasks) return [];
    
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.isCompleted);
      case 'completed':
        return tasks.filter(task => task.isCompleted);
      default:
        return tasks;
    }
  }, [tasks]);
  
  // Daily tasks (active non-weekly tasks)
  const dailyTasks = tasks.filter(task => !task.isCompleted && task.expiresAt);
  
  // Weekly goals (tasks with completion targets)
  const weeklyTasks = tasks.filter(task => 
    !task.isCompleted && 
    task.completionTarget && 
    task.currentProgress !== undefined
  );
  
  // Completed tasks
  const completedTasks = tasks.filter(task => task.isCompleted);
  
  return {
    tasks,
    dailyTasks,
    weeklyTasks,
    completedTasks,
    createTask,
    completeTask,
    updateTaskProgress,
    filterTasks,
    resetTasks
  };
}
