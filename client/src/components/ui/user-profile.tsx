import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { Progress } from "@/components/ui/progress";

export default function UserProfile() {
  const { user } = useUser();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-card border-2 border-primary flex items-center justify-center overflow-hidden level-badge">
          <Avatar className="h-full w-full">
            <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-primary text-xs font-bold text-white w-6 h-6 rounded-full flex items-center justify-center">
          <span>{user.level}</span>
        </div>
      </div>
      
      <div>
        <h1 className="text-xl font-bold font-display text-white">{user.name}</h1>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">XP:</span>
          <div className="w-32 h-2 bg-black/30 rounded overflow-hidden">
            <div 
              className="bg-primary h-full rounded" 
              style={{ width: `${user.progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-primary font-medium">
            {user.currentLevelXp}/{user.nextLevelXp}
          </span>
        </div>
      </div>
    </div>
  );
}
