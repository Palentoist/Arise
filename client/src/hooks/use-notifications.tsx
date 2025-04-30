import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { NotificationToast } from "@/lib/types";

interface NotificationsContextType {
  notifications: NotificationToast[];
  showNotification: (notification: Omit<NotificationToast, "id">) => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  
  const showNotification = useCallback((notification: Omit<NotificationToast, "id">) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);
  
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  const contextValue = {
    notifications,
    showNotification,
    clearNotifications
  };
  
  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};

// Export the provider for direct use
export default NotificationsProvider;
