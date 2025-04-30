import { Trophy } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { AchievementIcon } from "@/assets/svg/achievement-icons";

export default function Achievements() {
  const { user } = useUser();
  
  if (!user) return null;
  
  const maxDisplayed = 6;
  const achievements = [...user.achievements];
  
  // Ensure exactly 6 achievement slots (filled or locked)
  while (achievements.length < maxDisplayed) {
    achievements.push({
      id: -achievements.length,
      name: "Locked",
      description: "Achievement locked",
      icon: "locked",
      isUnlocked: false
    });
  }
  
  return (
    <div className="bg-card rounded-lg p-5 system-border">
      <h2 className="text-lg font-display font-bold mb-4 flex items-center">
        <Trophy className="text-amber-500 mr-2 h-5 w-5" />
        ACHIEVEMENTS
      </h2>
      
      <div className="grid grid-cols-3 gap-3">
        {achievements.slice(0, maxDisplayed).map((achievement) => (
          <div 
            key={achievement.id} 
            className={`text-center ${!achievement.isUnlocked ? "opacity-40" : ""}`}
            title={achievement.description}
          >
            <div className={`w-14 h-14 mx-auto mb-2 bg-background rounded-full 
              ${achievement.isUnlocked ? "border border-primary" : "border border-border"} 
              flex items-center justify-center`}
            >
              <AchievementIcon 
                name={achievement.icon} 
                className={achievement.isUnlocked ? "w-10 h-10" : "w-8 h-8 text-border"} 
              />
            </div>
            <p className={`text-xs ${achievement.isUnlocked ? "text-gray-300" : "text-gray-500"}`}>
              {achievement.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
