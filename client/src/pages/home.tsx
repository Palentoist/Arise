import UserProfile from "@/components/ui/user-profile";
import UserStats from "@/components/ui/user-stats";
import Achievements from "@/components/ui/achievements";
import ActivityLog from "@/components/ui/activity-log";
import DailyQuests from "@/components/ui/daily-quests";
import WeeklyGoals from "@/components/ui/weekly-goals";
import CreateTask from "@/components/ui/create-task";
import { useUser } from "@/hooks/use-user";
import { Activity } from "lucide-react";

export default function Home() {
  const { user } = useUser();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header with user info and system status */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <UserProfile />
        
        {/* System Status */}
        <div className="flex items-center space-x-2 bg-card px-3 py-1.5 rounded-md border border-border">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium font-display tracking-wide text-primary">SYSTEM ONLINE</span>
        </div>
      </header>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Stats and achievements */}
        <div className="lg:col-span-1 space-y-6">
          <UserStats />
          <Achievements />
          <ActivityLog />
        </div>
        
        {/* Middle column - Daily quests and Weekly goals */}
        <div className="lg:col-span-2 space-y-6">
          <DailyQuests />
          <WeeklyGoals />
          <CreateTask />
        </div>
      </div>
    </div>
  );
}
