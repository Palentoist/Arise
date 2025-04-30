import React from "react";
import { Dumbbell, Book, Watch, RunningFast, Brain, Activity } from "react-icons/fa6";
import { Terminal, BookOpen, Clock, Dumbbell as DumbbellIcon, Brain as BrainIcon, Activity as ActivityIcon } from "lucide-react";
import { TaskCategory } from "@shared/schema";

interface TaskIconProps {
  name: TaskCategory | string;
  className?: string;
}

export function TaskIcon({ name, className }: TaskIconProps) {
  const iconProps = { className };
  
  switch (name) {
    case TaskCategory.STRENGTH:
      return <DumbbellIcon {...iconProps} />;
    case TaskCategory.ENDURANCE:
      return <ActivityIcon {...iconProps} />;
    case TaskCategory.RUNNING:
      return <Terminal {...iconProps} />;
    case TaskCategory.READING:
      return <BookOpen {...iconProps} />;
    case TaskCategory.MEDITATION:
      return <Clock {...iconProps} />;
    case TaskCategory.DISCIPLINE:
      return <BrainIcon {...iconProps} />;
    default:
      return <ActivityIcon {...iconProps} />;
  }
}
