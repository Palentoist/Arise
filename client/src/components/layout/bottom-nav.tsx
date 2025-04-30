import { Link, useLocation } from "wouter";
import { 
  Home, 
  BarChart3, 
  Trophy, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const isActive = item.href === location;
          
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "py-2 px-4 text-center flex flex-col items-center transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}>
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
