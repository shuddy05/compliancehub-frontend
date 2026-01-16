import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "./NotificationCenter";

interface Notification {
  id: string;
  notificationType: string;
  title: string;
  message: string;
  actionUrl?: string;
  priority: "low" | "normal" | "high" | "critical";
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  readAt?: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
  unreadCount?: number;
  onMarkAsRead?: (notificationId: string) => void;
  onArchive?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

export function NotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onArchive,
  onDelete,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animateNotification, setAnimateNotification] = useState(false);

  // Animate when new notification arrives
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimateNotification(true);
      const timer = setTimeout(() => setAnimateNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative text-muted-foreground hover:text-foreground"
        >
          <motion.div
            animate={animateNotification ? { rotate: [0, 20, -20, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Bell className="w-5 h-5" />
          </motion.div>

          {/* Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1"
            >
              <Badge
                className="flex items-center justify-center w-5 h-5 p-0 text-xs font-bold"
                variant="destructive"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={onMarkAsRead}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </>
  );
}
