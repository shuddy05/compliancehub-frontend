import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Trash2,
  Archive,
} from "lucide-react";

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

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (notificationId: string) => void;
  onArchive?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onArchive,
  onDelete,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    if (filter === "unread") {
      setFilteredNotifications(notifications.filter((n) => !n.isRead));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [notifications, filter]);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return AlertCircle;
      case "high":
        return Clock;
      case "normal":
        return Info;
      default:
        return CheckCircle2;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "text-red-600",
      high: "text-orange-600",
      normal: "text-blue-600",
      low: "text-green-600",
    };
    return colors[priority] || "text-blue-600";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-screen w-96 max-w-[100vw] bg-background border-l border-border z-50 flex flex-col shadow-lg"
          >
            {/* Header */}
            <div className="border-b border-border p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Filters */}
            <div className="border-b border-border px-4 py-3 flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className="text-xs"
              >
                Unread ({unreadCount})
              </Button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Bell className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {filter === "unread"
                      ? "No unread notifications"
                      : "No notifications yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredNotifications.map((notification) => {
                    const Icon = getPriorityIcon(notification.priority);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        onClick={() => {
                          if (!notification.isRead && onMarkAsRead) {
                            onMarkAsRead(notification.id);
                          }
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl;
                          }
                        }}
                        className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                          notification.isRead
                            ? "bg-background border-border hover:border-primary/50"
                            : "bg-primary/5 border-primary/30 hover:border-primary/60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    notification.isRead
                                      ? "text-foreground"
                                      : "text-foreground font-bold"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  notification.createdAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onArchive) {
                                      onArchive(notification.id);
                                    }
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Archive className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDelete) {
                                      onDelete(notification.id);
                                    }
                                  }}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
