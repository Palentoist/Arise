import { Trophy, Award, Sparkles } from "lucide-react";
import UserProfile from "@/components/ui/user-profile";
import { useUser } from "@/hooks/use-user";
import { AchievementIcon } from "@/assets/svg/achievement-icons";
import { formatDate } from "@/lib/utils";

export default function Achievements() {
  const { user } = useUser();
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  const unlockedAchievements = user.achievements.filter(a => a.isUnlocked);
  const lockedAchievements = user.achievements.filter(a => !a.isUnlocked);
  
  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <UserProfile />
        
        <div className="flex items-center space-x-2 bg-card px-3 py-1.5 rounded-md border border-border">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium font-display tracking-wide text-primary">
            {unlockedAchievements.length}/{user.achievements.length} UNLOCKED
          </span>
        </div>
      </header>
      
      <div className="mb-8">
        <div className="bg-card p-5 rounded-lg system-border">
          <div className="flex items-center mb-6">
            <Sparkles className="text-amber-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-display font-bold">UNLOCKED ACHIEVEMENTS</h2>
          </div>
          
          {unlockedAchievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No achievements unlocked yet. Complete tasks to earn achievements!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {unlockedAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="text-center p-4 bg-background rounded-lg hover:border-primary border border-border transition-all"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-background/50 rounded-full border border-primary flex items-center justify-center animate-glow">
                    <AchievementIcon name={achievement.icon} className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <p className="text-xs text-primary">{formatDate(achievement.unlockedAt!)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <div className="bg-card p-5 rounded-lg system-border">
          <div className="flex items-center mb-6">
            <Award className="text-muted-foreground mr-2 h-5 w-5" />
            <h2 className="text-lg font-display font-bold">LOCKED ACHIEVEMENTS</h2>
          </div>
          
          {lockedAchievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You've unlocked all available achievements!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {lockedAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="text-center p-4 bg-background rounded-lg border border-border opacity-60 hover:opacity-80 transition-opacity"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-background/50 rounded-full border border-border flex items-center justify-center">
                    <AchievementIcon name={achievement.icon} className="w-10 h-10 text-border" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
