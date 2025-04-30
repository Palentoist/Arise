import { useState } from "react";
import { BarChart3, TrendingUp, Activity, Brain, Watch } from "lucide-react";
import UserProfile from "@/components/ui/user-profile";
import StatBar from "@/components/ui/stat-bar";
import { useUser } from "@/hooks/use-user";
import { useTasks } from "@/hooks/use-tasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatDate } from "@/lib/utils";
import { Task } from "@/lib/types";

export default function Stats() {
  const { user } = useUser();
  const { completedTasks } = useTasks();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week");
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  // Get stats history based on completed tasks
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const filteredTasks = completedTasks.filter((task: Task) => {
    if (!task.completedAt) return false;
    
    const completedAt = new Date(task.completedAt);
    if (selectedPeriod === "week") {
      return completedAt >= oneWeekAgo;
    } else if (selectedPeriod === "month") {
      return completedAt >= oneMonthAgo;
    }
    return true;
  });
  
  // Group tasks by date for the chart
  const tasksByDate = filteredTasks.reduce((acc: Record<string, { date: string; count: number; xp: number }>, task: Task) => {
    if (!task.completedAt) return acc;
    
    const date = new Date(task.completedAt);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, count: 0, xp: 0 };
    }
    
    acc[dateStr].count += 1;
    acc[dateStr].xp += task.xpReward;
    
    return acc;
  }, {} as Record<string, { date: string; count: number; xp: number }>);
  
  const chartData = Object.values(tasksByDate).sort((a, b) => a.date.localeCompare(b.date));
  
  // Category breakdown
  const categoryBreakdown = filteredTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = 0;
    }
    acc[task.category] += 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value
  }));
  
  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <UserProfile />
        
        <div className="flex items-center space-x-2 bg-card px-3 py-1.5 rounded-md border border-border">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium font-display tracking-wide text-primary">STATS ANALYSIS</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg system-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total XP</p>
              <h3 className="text-2xl font-bold font-display text-primary">{user.xp}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg system-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Strength</p>
              <h3 className="text-2xl font-bold font-display text-primary">{user.stats.strength}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg system-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Discipline</p>
              <h3 className="text-2xl font-bold font-display text-primary">{user.stats.discipline}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg system-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Endurance</p>
              <h3 className="text-2xl font-bold font-display text-primary">{user.stats.endurance}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Watch className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card p-5 rounded-lg system-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold">COMPLETION HISTORY</h2>
              <div>
                <Tabs 
                  defaultValue="week" 
                  onValueChange={(v) => setSelectedPeriod(v as "week" | "month" | "all")}
                >
                  <TabsList className="bg-background">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#161B22', 
                        border: '1px solid #30363D',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Tasks" fill="#0EA5E9" />
                    <Bar dataKey="xp" name="XP Gained" fill="#38BDF8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No task completion data for this period
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card p-5 rounded-lg system-border">
            <h2 className="text-lg font-display font-bold mb-6">CATEGORY BREAKDOWN</h2>
            
            <div className="space-y-4">
              {categoryData.length > 0 ? (
                categoryData.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-300 capitalize">{item.name}</span>
                      <span className="text-sm font-medium text-primary">{item.value}</span>
                    </div>
                    <StatBar 
                      value={item.value} 
                      maxValue={Math.max(...categoryData.map(d => d.value))} 
                    />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No tasks completed yet
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-card p-5 rounded-lg system-border mt-6">
            <h2 className="text-lg font-display font-bold mb-4">RECENT COMPLETIONS</h2>
            
            <div className="space-y-3">
              {filteredTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="border-l-2 border-primary pl-3 py-1">
                  <p className="text-sm text-white">{task.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(task.completedAt!)}</p>
                </div>
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">
                  No recent completions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
