import { useEffect, useState } from "react";
import { CheckSquare, RefreshCw } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { formatTimeLeft } from "@/lib/utils";
import { TaskIcon } from "@/assets/svg/task-icons";
import { Button } from "@/components/ui/button";

export default function DailyQuests() {
  const { dailyTasks, completeTask, updateTaskProgress } = useTasks();
  const [timeLeft, setTimeLeft] = useState("");
  
  // Refreshes countdown every second
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    
    const updateCounter = () => {
      setTimeLeft(formatTimeLeft(tomorrow));
    };
    
    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-card rounded-lg p-5 system-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-display font-bold flex items-center">
          <CheckSquare className="text-primary mr-2 h-5 w-5" />
          DAILY QUESTS
        </h2>
        <span className="text-xs text-gray-400 font-medium">
          <RefreshCw className="h-3 w-3 inline mr-1" /> Refreshes in {timeLeft}
        </span>
      </div>
      
      {dailyTasks.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No daily quests available. Create custom tasks to get started!
        </div>
      ) : (
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <div key={task.id} className="quest-card flex items-center justify-between bg-background rounded-md p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 text-xl text-primary">
                  <TaskIcon name={task.category} />
                </div>
                <div>
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-xs text-gray-400">
                    +{task.xpReward} XP
                    {task.statRewards.map((reward, idx) => (
                      <span key={idx}>
                        , +{reward.amount} {reward.category}
                      </span>
                    ))}
                  </p>
                  
                  {task.completionTarget && task.currentProgress !== undefined && (
                    <>
                      <div className="w-48 h-1.5 bg-black/30 mt-1.5 rounded overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${(task.currentProgress / task.completionTarget) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-primary mt-0.5">
                        {task.currentProgress}/{task.completionTarget} {task.category === 'running' ? 'km' : ''}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div>
                {task.isCompleted ? (
                  <span className="text-xs text-success flex items-center">
                    <CheckSquare className="mr-1 h-3 w-3" /> Completed
                  </span>
                ) : task.completionTarget && task.currentProgress !== undefined ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => updateTaskProgress(task.id, task.currentProgress + 1)}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" /> Update
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => completeTask(task.id)}
                  >
                    <CheckSquare className="mr-1 h-3 w-3" /> Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
