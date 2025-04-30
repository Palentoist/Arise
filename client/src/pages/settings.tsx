import { useState } from "react";
import { Settings as SettingsIcon, Save, User, Bell, Moon, Sun, RefreshCw } from "lucide-react";
import UserProfile from "@/components/ui/user-profile";
import { useUser } from "@/hooks/use-user";
import { useTasks } from "@/hooks/use-tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, updateUser, resetUser } = useUser();
  const { resetTasks } = useTasks();
  const { toast } = useToast();
  const [userName, setUserName] = useState(user?.name || "");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  const handleSaveProfile = () => {
    if (userName.trim()) {
      updateUser({ ...user, name: userName });
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    }
  };
  
  const handleReset = () => {
    if (showResetConfirm) {
      resetUser();
      resetTasks();
      setShowResetConfirm(false);
      toast({
        title: "System Reset",
        description: "All data has been reset. Starting fresh!",
      });
    } else {
      setShowResetConfirm(true);
    }
  };
  
  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <UserProfile />
        
        <div className="flex items-center space-x-2 bg-card px-3 py-1.5 rounded-md border border-border">
          <SettingsIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium font-display tracking-wide text-primary">SYSTEM SETTINGS</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" /> Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="bg-background border-border"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" /> Notification Settings
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-reminders">Daily Task Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive reminders for daily tasks</p>
              </div>
              <Switch id="daily-reminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="level-notifications">Level Up Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications when you level up</p>
              </div>
              <Switch id="level-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="mr-2 h-5 w-5" /> Appearance
            </CardTitle>
            <CardDescription>
              Customize how the system looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
              </div>
              <Switch id="theme-mode" defaultChecked disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-muted-foreground">Enable interface animations</p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border border-destructive/20">
          <CardHeader className="text-destructive/90">
            <CardTitle className="flex items-center">
              <RefreshCw className="mr-2 h-5 w-5" /> Reset System
            </CardTitle>
            <CardDescription className="text-destructive/70">
              Reset all your progress and start over
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This action will reset all your stats, level, XP, and remove all tasks. This cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              onClick={handleReset}
              className={showResetConfirm ? "animate-pulse" : ""}
            >
              {showResetConfirm ? "Confirm Reset" : "Reset Everything"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
