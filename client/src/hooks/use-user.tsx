import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  UserProfile, 
  UserStats, 
  Achievement, 
  ActivityLog, 
  LevelUpInfo, 
  StatReward 
} from "@/lib/types";
import { calculateLevelInfo } from "@/lib/utils";
import { StatCategory } from "@shared/schema";

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  updateUser: (user: UserProfile) => void;
  addXp: (amount: number) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  addActivityLog: (log: Omit<ActivityLog, "id">) => void;
  isLevelUpVisible: boolean;
  levelUpInfo: LevelUpInfo | null;
  hideLevelUp: () => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLevelUpVisible, setIsLevelUpVisible] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo | null>(null);
  
  // Fetch user data
  const { data: user, isLoading, error } = useQuery<UserProfile | null>({
    queryKey: ["/api/user"],
    retry: 1,
  });
  
  // Update user mutation
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: async (updatedUser: UserProfile) => {
      const response = await apiRequest("PUT", "/api/user", updatedUser);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Reset user mutation
  const { mutate: resetUserMutation } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/user/reset", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reset user: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const updateUser = useCallback((updatedUser: UserProfile) => {
    updateUserMutation(updatedUser);
  }, [updateUserMutation]);
  
  const resetUser = useCallback(() => {
    resetUserMutation();
  }, [resetUserMutation]);
  
  const checkForLevelUp = useCallback((oldXp: number, newXp: number) => {
    const oldLevelInfo = calculateLevelInfo(oldXp);
    const newLevelInfo = calculateLevelInfo(newXp);
    
    if (newLevelInfo.level > oldLevelInfo.level) {
      // Generate random stat increases based on level difference
      const levelDifference = newLevelInfo.level - oldLevelInfo.level;
      const statIncreases: StatReward[] = [
        { category: StatCategory.STRENGTH, amount: Math.floor(Math.random() * 3) + 1 * levelDifference },
        { category: StatCategory.ENDURANCE, amount: Math.floor(Math.random() * 3) + 1 * levelDifference },
        { category: StatCategory.DISCIPLINE, amount: Math.floor(Math.random() * 3) + 1 * levelDifference },
      ].filter(reward => reward.amount > 0);
      
      // Show level up overlay
      setLevelUpInfo({
        newLevel: newLevelInfo.level,
        statIncreases
      });
      setIsLevelUpVisible(true);
      
      // Apply stat increases automatically
      if (user) {
        const updatedStats = { ...user.stats };
        statIncreases.forEach(increase => {
          const statKey = increase.category.toLowerCase() as keyof UserStats;
          if (statKey in updatedStats) {
            updatedStats[statKey] += increase.amount;
          }
        });
        
        // Update user stats
        updateUserMutation({
          ...user,
          stats: updatedStats
        });
        
        // Add activity log for level up
        addActivityLog({
          description: `Reached Level ${newLevelInfo.level}`,
          timestamp: Date.now(),
          type: 'level_up'
        });
      }
      
      return true;
    }
    
    return false;
  }, [user, updateUserMutation]);
  
  const addXp = useCallback((amount: number) => {
    if (!user) return;
    
    const oldXp = user.xp;
    const newXp = oldXp + amount;
    
    // Update user with new XP
    const levelInfo = calculateLevelInfo(newXp);
    const updatedUser = {
      ...user,
      xp: newXp,
      level: levelInfo.level,
      currentLevelXp: levelInfo.currentLevelXp,
      nextLevelXp: levelInfo.nextLevelXp,
      progress: levelInfo.progress
    };
    
    updateUserMutation(updatedUser);
    
    // Check if user leveled up
    checkForLevelUp(oldXp, newXp);
  }, [user, updateUserMutation, checkForLevelUp]);
  
  const updateStats = useCallback((updates: Partial<UserStats>) => {
    if (!user) return;
    
    const updatedStats = { ...user.stats, ...updates };
    updateUserMutation({
      ...user,
      stats: updatedStats
    });
    
    // Add activity log for stat increase
    const statChanges = Object.entries(updates)
      .map(([key, value]) => `+${value} ${key.charAt(0).toUpperCase() + key.slice(1)}`)
      .join(", ");
      
    addActivityLog({
      description: `Stats increased: ${statChanges}`,
      timestamp: Date.now(),
      type: 'stat_increase'
    });
  }, [user, updateUserMutation]);
  
  const addActivityLog = useCallback((log: Omit<ActivityLog, "id">) => {
    if (!user) return;
    
    const newLog: ActivityLog = {
      ...log,
      id: Date.now() // Use timestamp as ID for simplicity
    };
    
    const updatedLogs = [newLog, ...user.activityLog].slice(0, 50); // Keep only last 50 logs
    
    updateUserMutation({
      ...user,
      activityLog: updatedLogs
    });
  }, [user, updateUserMutation]);
  
  const hideLevelUp = useCallback(() => {
    setIsLevelUpVisible(false);
    setLevelUpInfo(null);
  }, []);
  
  const contextValue: UserContextType = {
    user: user || null,
    isLoading,
    error,
    updateUser,
    addXp,
    updateStats,
    addActivityLog,
    isLevelUpVisible,
    levelUpInfo,
    hideLevelUp,
    resetUser
  };
  
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Export the provider for direct use
export default UserProvider;
