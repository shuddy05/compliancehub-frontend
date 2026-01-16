import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoleBadge } from "@/components/RoleBadge";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { supportService } from "@/services/api";
import { ChevronDown, LogOut } from "lucide-react";

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

interface TopNavProps {
  showCompanySelector?: boolean;
  selectedCompany?: { id: string; name: string };
  userRole?: "super_admin" | "company_admin" | "accountant" | "staff" | "read_only" | "support_staff";
  onCompanyChange?: (company: { id: string; name: string }) => void;
  companies?: Array<{ id: string; name: string }>;
  userCompanies?: Array<{ id: string; name: string }>;
}

export function TopNav({
  showCompanySelector = false,
  selectedCompany,
  userRole = "staff",
  onCompanyChange,
  companies = [],
  userCompanies = [],
}: TopNavProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const response = await supportService.getNotifications?.(0, 20) || { data: { data: [] } };
        const notificationsData = response?.data?.data || [];
        setNotifications(notificationsData);
        const unread = notificationsData.filter((n: Notification) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Call backend to mark as read
      if (supportService.markNotificationAsRead) {
        await supportService.markNotificationAsRead(notificationId);
      }
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleArchive = async (notificationId: string) => {
    try {
      // Call backend to archive
      if (supportService.archiveNotification) {
        await supportService.archiveNotification(notificationId);
      }

      // Update local state
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to archive notification:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      // Call backend to delete
      if (supportService.deleteNotification) {
        await supportService.deleteNotification(notificationId);
      }

      // Update local state
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const companyList = userCompanies.length > 0 ? userCompanies : companies;

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-border z-40 md:flex-col">
      <div className="h-full flex items-center justify-between w-full px-4">
        {/* Site Logo and Name - Extreme Left */}
        <div className="flex items-center gap-2 w-64">
          <Logo size="md" />
        </div>

        {/* Company Selector & Role Badge - Center-Right */}
        <div className="flex items-center gap-6 flex-1">
          {showCompanySelector && (
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <h2 className="font-semibold text-sm text-left">
                    {selectedCompany?.name || "Select Company"}
                  </h2>
                  <p className="text-xs text-muted-foreground">Switch Company</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Company Dropdown */}
              {showCompanyDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50">
                  {companyList.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => {
                        if (onCompanyChange) {
                          onCompanyChange(comp);
                        }
                        setShowCompanyDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedCompany?.id === comp.id
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}
                    >
                      <p className="font-medium text-sm">{comp.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role Badge - Only visible to super_admin */}
          {userRole === "super_admin" && (
            <>
              <div className="h-10 w-px bg-border"></div>
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <RoleBadge role={userRole} size="md" showLabel />
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                {showRoleDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-lg z-50">
                    {(
                      [
                        "super_admin",
                        "company_admin",
                        "accountant",
                        "staff",
                        "read_only",
                        "support_staff",
                      ] as const
                    ).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          // Handle role change if needed
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          userRole === role
                            ? "bg-primary/10 text-primary font-medium"
                            : ""
                        }`}
                      >
                        {role.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Theme, Notifications, Logout */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell 
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
