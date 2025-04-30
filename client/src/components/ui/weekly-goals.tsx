import { CalendarDays, Target } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

export default function WeeklyGoals() {
  const { weeklyTasks } = useTasks();
  
  // Calculate days remaining in the week
  const now = new Date();
  const daysToWeekEnd = 7 - now.getDay();
  
  return (
    <div className="bg-card rounded-lg p-5 system-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-display font-bold flex items-center">
          <Target className="text-primary mr-2 h-5 w-5" />
          WEEKLY GOALS
        </h2>
        <span className="text-xs text-gray-400 font-medium">
          <CalendarDays className="h-3 w-3 inline mr-1" /> {daysToWeekEnd} days remaining
        </span>
      </div>
      
      {weeklyTasks.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No weekly goals available. Weekly goals will refresh every Sunday.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {weeklyTasks.map((task) => (
            <div key={task.id} className="bg-background rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{task.name}</h3>
                <span className="text-primary text-xs font-semibold">
                  {task.currentProgress}/{task.completionTarget} 
                  {task.category === 'running' ? ' km' : ''}
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded overflow-hidden mb-2">
                <div 
                  className="bg-primary h-full" 
                  style={{ width: `${(task.currentProgress! / task.completionTarget!) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">
                +{task.xpReward} XP
                {task.statRewards.map((reward, idx) => (
                  <span key={idx}>
                    , +{reward.amount} {reward.category}
                  </span>
                ))}
                {" upon completion"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
