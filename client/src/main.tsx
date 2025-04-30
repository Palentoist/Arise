import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from "@/hooks/use-user";
import { NotificationsProvider } from "@/hooks/use-notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
