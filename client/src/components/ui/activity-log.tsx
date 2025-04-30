import { History } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { formatDate } from "@/lib/utils";

export default function ActivityLog() {
  const { user } = useUser();
  
  if (!user) return null;
  
  const activityLogs = user.activityLog.slice(0, 5);
  
  return (
    <div className="bg-card rounded-lg p-5 system-border hidden md:block">
      <h2 className="text-lg font-display font-bold mb-4 flex items-center">
        <History className="text-primary mr-2 h-5 w-5" />
        ACTIVITY LOG
      </h2>
      
      {activityLogs.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No activities recorded yet
        </div>
      ) : (
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div key={log.id} className="border-l-2 border-primary pl-3 py-1">
              <p className="text-sm text-white">{log.description}</p>
              <p className="text-xs text-gray-400">{formatDate(log.timestamp)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
