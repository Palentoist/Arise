import React from "react";
import { Trophy, Award, Target, Dumbbell, BookOpen, Heart, Zap, Star, Shield, Activity } from "lucide-react";

interface AchievementIconProps {
  name: string;
  className?: string;
}

export function AchievementIcon({ name, className }: AchievementIconProps) {
  switch (name) {
    case "first_blood":
      return <Trophy className={className} />;
    case "speed_runner":
      return <Zap className={className} />;
    case "iron_will":
      return <Shield className={className} />;
    case "bookworm":
      return <BookOpen className={className} />;
    case "strength_master":
      return <Dumbbell className={className} />;
    case "consistency":
      return <Activity className={className} />;
    case "discipline":
      return <Star className={className} />;
    case "endurance":
      return <Heart className={className} />;
    case "goal_crusher":
      return <Target className={className} />;
    case "locked":
      return <Award className={className} />;
    default:
      return <Award className={className} />;
  }
}
