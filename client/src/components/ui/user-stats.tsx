import StatBar from "./stat-bar";
import { useUser } from "@/hooks/use-user";
import { BarChart } from "lucide-react";

export default function UserStats() {
  const { user } = useUser();
  
  if (!user) return null;
  
  const { stats } = user;
  
  const statItems = [
    { name: "Strength", value: stats.strength },
    { name: "Endurance", value: stats.endurance },
    { name: "Discipline", value: stats.discipline },
    { name: "Speed", value: stats.speed },
  ];
  
  return (
    <div className="bg-card rounded-lg p-5 system-border">
      <h2 className="text-lg font-display font-bold mb-4 flex items-center">
        <BarChart className="text-primary mr-2 h-5 w-5" />
        HUNTER STATS
      </h2>
      
      <div className="space-y-4">
        {statItems.map((stat) => (
          <div key={stat.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-300">{stat.name}</span>
              <span className="text-sm font-medium text-primary">{stat.value}</span>
            </div>
            <StatBar value={stat.value} maxValue={100} />
          </div>
        ))}
      </div>
    </div>
  );
}
