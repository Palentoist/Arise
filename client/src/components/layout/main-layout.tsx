import React from "react";
import BottomNav from "./bottom-nav";
import NotificationToast from "@/components/ui/notification-toast";
import LevelUpOverlay from "@/components/ui/level-up-overlay";
import { useUser } from "@/hooks/use-user";
import { useTasks } from "@/hooks/use-tasks";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLevelUpVisible, levelUpInfo, hideLevelUp } = useUser();
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
      
      <BottomNav />
      <NotificationToast />
      
      {isLevelUpVisible && levelUpInfo && (
        <LevelUpOverlay 
          newLevel={levelUpInfo.newLevel} 
          statIncreases={levelUpInfo.statIncreases} 
          onContinue={hideLevelUp} 
        />
      )}
    </div>
  );
}
