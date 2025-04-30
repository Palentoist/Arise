import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationsProvider } from "@/hooks/use-notifications";
import { UserProvider } from "@/hooks/use-user";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Stats from "@/pages/stats";
import Achievements from "@/pages/achievements";
import Settings from "@/pages/settings";
import MainLayout from "@/components/layout/main-layout";
import LoadingScreen from "@/components/ui/loading-screen";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/stats" component={Stats} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </>
  );
}

export default App;
