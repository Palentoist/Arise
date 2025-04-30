import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";

export default function NotificationToast() {
  const { notifications } = useNotifications();
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-2 max-w-xs"
          >
            <div className="bg-card p-4 rounded-md border border-primary system-border shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 text-primary">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-display">{notification.message}</p>
                  {notification.points !== undefined && (
                    <p className="text-xs text-gray-400">+{notification.points} XP</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
