import { useState } from "react";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Bell, Archive, Trash2, Calendar, DollarSign, AlertCircle, Settings } from "lucide-react";

type NotificationType = "deadline" | "payroll" | "overdue" | "subscription" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "deadline",
    title: "PAYE Deadline Approaching",
    message: "PAYE remittance of ₦485,000 is due in 2 days",
    timestamp: "2 hours ago",
    read: false,
    actionLabel: "View Deadline",
    actionUrl: "/dashboard",
  },
  {
    id: "2",
    type: "payroll",
    title: "Payroll Ready for Review",
    message: "December payroll for 23 employees is ready for approval",
    timestamp: "5 hours ago",
    read: false,
    actionLabel: "Approve Payroll",
    actionUrl: "/dashboard",
  },
  {
    id: "3",
    type: "overdue",
    title: "Payment Overdue",
    message: "Your November WHT payment is overdue by 3 days",
    timestamp: "1 day ago",
    read: false,
    actionLabel: "Pay Now",
    actionUrl: "/dashboard",
  },
  {
    id: "4",
    type: "subscription",
    title: "Subscription Renewal",
    message: "Your Pro plan renews in 7 days",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "New Feature Available",
    message: "Export reports to Excel is now available",
    timestamp: "3 days ago",
    read: true,
  },
];

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "deadline":
      return { icon: Calendar, color: "bg-destructive/10 text-destructive" };
    case "payroll":
      return { icon: DollarSign, color: "bg-primary/10 text-primary" };
    case "overdue":
      return { icon: AlertCircle, color: "bg-accent/10 text-accent" };
    case "subscription":
      return { icon: Bell, color: "bg-primary/10 text-primary" };
    case "system":
      return { icon: Settings, color: "bg-muted text-muted-foreground" };
    default:
      return { icon: Bell, color: "bg-muted text-muted-foreground" };
  }
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "archived">("all");
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const filteredNotifications = notificationList.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "archived") return false;
    return true;
  });

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <ModuleLayout title="Notifications" activeTab="notifications">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with important alerts and activities</p>
          </div>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors w-full sm:w-auto"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: "all", label: "All", count: notificationList.length },
          { id: "unread", label: "Unread", count: unreadCount },
          { id: "archived", label: "Archived", count: 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 text-xs font-medium">
                ({tab.count})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification, index) => {
          const { icon: Icon, color } = getIcon(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-colors ${
                notification.read
                  ? "bg-card border-border hover:bg-muted/50"
                  : "bg-primary/5 border-primary/20 hover:bg-primary/10"
              }`}
            >
              <div className="flex gap-4">
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <h3
                        className={`font-medium ${
                          notification.read ? "" : "font-semibold"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No notifications</h3>
          <p className="text-sm text-muted-foreground">
            You're all caught up!
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
