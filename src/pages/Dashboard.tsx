import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/TopNav";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ComplianceProgress } from "@/components/ComplianceProgress";
import { DeadlineProgress } from "@/components/DeadlineProgress";
import { PayslipHistory } from "@/components/PayslipHistory";
import { PermissionGuard } from "@/components/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/context/AuthContext";
import { companiesService, usersService, supportService } from "@/services/api";
import {
  Bell,
  UserPlus,
  FileText,
  Upload,
  BarChart3,
  ChevronRight,
  Calendar,
  DollarSign,
  Home,
  ClipboardList,
  Wallet,
  MoreHorizontal,
  BookOpen,
  Users,
  ChevronDown,
  Settings,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Headphones,
  LogOut,
  Activity,
  TrendingUp,
  AlertCircle,
  Server,
  Shield,
  Zap,
  Ticket,
  MessageSquare,
} from "lucide-react";

type UserRole = "super_admin" | "company_admin" | "accountant" | "staff" | "read_only" | "support_staff";

const upcomingDeadlines = [
  {
    date: "Dec 20",
    name: "PAYE Remittance",
    amount: "₦485,000",
    daysLeft: 2,
  },
  {
    date: "Dec 21",
    name: "VAT Filing",
    amount: "₦125,000",
    daysLeft: 3,
  },
  {
    date: "Dec 31",
    name: "WHT Remittance",
    amount: "₦89,000",
    daysLeft: 13,
  },
];

const payslips = [
  { id: "ps-2024-12", period: "December 2024", date: "Dec 31, 2024", amount: "₦48,500" },
  { id: "ps-2024-11", period: "November 2024", date: "Nov 30, 2024", amount: "₦42,000" },
  { id: "ps-2024-10", period: "October 2024", date: "Oct 31, 2024", amount: "₦46,700" },
];

const quickActionsConfig: Record<UserRole, Array<{ icon: any; label: string; color: string; action: string }>> = {
  super_admin: [
    { icon: Users, label: "Manage Users", color: "bg-amber-500/10 text-amber-600", action: "users" },
    { icon: Building2, label: "Manage Companies", color: "bg-blue-500/10 text-blue-600", action: "companies" },
    { icon: Settings, label: "System Settings", color: "bg-purple-500/10 text-purple-600", action: "settings" },
    { icon: BarChart3, label: "View Analytics", color: "bg-green-500/10 text-green-600", action: "analytics" },
  ],
  support_staff: [
    { icon: Headphones, label: "Support Tickets", color: "bg-blue-500/10 text-blue-600", action: "support" },
    { icon: Users, label: "Customer Issues", color: "bg-amber-500/10 text-amber-600", action: "customers" },
    { icon: BarChart3, label: "Performance", color: "bg-green-500/10 text-green-600", action: "performance" },
    { icon: Settings, label: "Settings", color: "bg-purple-500/10 text-purple-600", action: "settings" },
  ],
  company_admin: [
    { icon: UserPlus, label: "Invite Team Member", color: "bg-blue-500/10 text-blue-600", action: "invite" },
    { icon: Users, label: "Manage Users", color: "bg-purple-500/10 text-purple-600", action: "users" },
    { icon: FileText, label: "File Compliance", color: "bg-amber-500/10 text-amber-600", action: "compliance" },
    { icon: BarChart3, label: "View Reports", color: "bg-green-500/10 text-green-600", action: "reports" },
  ],
  accountant: [
    { icon: DollarSign, label: "Run Payroll", color: "bg-green-500/10 text-green-600", action: "payroll" },
    { icon: FileText, label: "File Compliance", color: "bg-amber-500/10 text-amber-600", action: "compliance" },
    { icon: Upload, label: "Upload Document", color: "bg-blue-500/10 text-blue-600", action: "upload" },
    { icon: BarChart3, label: "Generate Report", color: "bg-purple-500/10 text-purple-600", action: "reports" },
  ],
  staff: [
    { icon: Download, label: "Download Payslip", color: "bg-green-500/10 text-green-600", action: "payslip" },
    { icon: DollarSign, label: "View Pay Stub", color: "bg-blue-500/10 text-blue-600", action: "paystub" },
    { icon: Calendar, label: "Attendance", color: "bg-amber-500/10 text-amber-600", action: "attendance" },
    { icon: FileText, label: "Tax Documents", color: "bg-purple-500/10 text-purple-600", action: "tax-docs" },
  ],
  read_only: [
    { icon: BarChart3, label: "View Reports", color: "bg-purple-500/10 text-purple-600", action: "reports" },
    { icon: FileText, label: "View Documents", color: "bg-blue-500/10 text-blue-600", action: "docs" },
    { icon: Calendar, label: "Compliance Calendar", color: "bg-amber-500/10 text-amber-600", action: "calendar" },
    { icon: DollarSign, label: "View Payroll", color: "bg-green-500/10 text-green-600", action: "payroll" },
  ],
};

const companies = [
  { id: 1, name: "Acme Technologies" },
  { id: 2, name: "TechVision Inc" },
  { id: 3, name: "Digital Solutions Ltd" },
];

interface Company {
  id: number;
  name: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { userRole, setUserRole, company, setCompany, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(company || companies[0]);
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const { can } = usePermissions(userRole);

  // Super-admin dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeCompanies: 0,
    totalUsers: 0,
    newUsersThisWeek: 0,
    supportTickets: 0,
    pendingTickets: 0,
    activeSubscriptions: 0,
    isLoading: true,
  });

  // Support staff dashboard state
  const [supportStaffMetrics, setSupportStaffMetrics] = useState({
    workload: { total: 0, open: 0, inProgress: 0, resolved: 0, thisWeek: 0, avgResolutionTime: 0 },
    urgentTickets: [],
    recentActivity: [],
    performance: { resolvedThisMonth: 0, resolutionRate: 0, avgResponseTime: 0, satisfactionScore: 0, teamRank: 1 },
    isLoading: true,
  });

  // Fetch dashboard metrics for support_staff
  useEffect(() => {
    if (userRole === "support_staff") {
      const fetchSupportStaffData = async () => {
        try {
          setSupportStaffMetrics(prev => ({ ...prev, isLoading: true }));
          
          const [statsRes, urgentRes, activityRes, metricsRes] = await Promise.all([
            supportService.getAssignedTicketsStats(),
            supportService.getUrgentAssignedTickets(0, 5),
            supportService.getAssignedTicketsActivity(0, 5),
            supportService.getAssignedTicketsMetrics(),
          ]);

          const stats = statsRes?.data || {};
          const urgent = urgentRes?.data?.data || [];
          const activity = activityRes?.data?.data || [];
          const metrics = metricsRes?.data || {};

          setSupportStaffMetrics({
            workload: {
              total: stats.total || 0,
              open: stats.open || 0,
              inProgress: stats.inProgress || 0,
              resolved: stats.resolved || 0,
              thisWeek: stats.thisWeek || 0,
              avgResolutionTime: stats.avgResolutionTime || 0,
            },
            urgentTickets: urgent,
            recentActivity: activity,
            performance: {
              resolvedThisMonth: metrics.resolvedThisMonth || 0,
              resolutionRate: metrics.resolutionRate || 0,
              avgResponseTime: metrics.avgResponseTime || 0,
              satisfactionScore: metrics.satisfactionScore || 0,
              teamRank: metrics.teamRank || 1,
            },
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to fetch support staff dashboard data:", error);
          setSupportStaffMetrics(prev => ({ ...prev, isLoading: false }));
        }
      };

      fetchSupportStaffData();
    }
  }, [userRole]);

  // Fetch dashboard metrics for super-admin
  useEffect(() => {
    if (userRole === "super_admin") {
      const fetchMetrics = async () => {
        try {
          const companiesResponse = await companiesService.getAllCompanies(0, 1000);
          const usersResponse = await usersService.getAllUsersForAdmin(0, 1000);
          const supportResponse = await supportService.getTicketStats();
          
          const companiesTotal = companiesResponse.data?.total || 0;
          const usersTotal = usersResponse.data?.total || 0;
          const newUsersThisWeek = usersResponse.data?.newThisWeek || 0;
          const openTickets = supportResponse.data?.openTickets || 0;
          const pendingTickets = supportResponse.data?.pendingTickets || 0;
          
          // Update metrics
          setDashboardMetrics(prev => ({
            ...prev,
            activeCompanies: companiesTotal,
            totalUsers: usersTotal,
            newUsersThisWeek: newUsersThisWeek,
            supportTickets: openTickets,
            pendingTickets: pendingTickets,
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to fetch dashboard metrics:", error);
          setDashboardMetrics(prev => ({ ...prev, isLoading: false }));
        }
      };
      
      fetchMetrics();
    }
  }, [userRole]);

  // Fetch user's companies on mount
  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const response = await companiesService.getUserCompanies();
        if (response.data && response.data.data) {
          const companies = response.data.data;
          setUserCompanies(companies);
          // Set selected company from context or use first available
          if (company) {
            setSelectedCompany(company);
          } else if (companies.length > 0) {
            setSelectedCompany(companies[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user companies:", error);
        // Fallback to hardcoded companies if API fails
        setUserCompanies(companies);
        setSelectedCompany(company || companies[0]);
      }
    };

    fetchUserCompanies();
  }, [company]);

  const handleCompanySwitch = (newCompany: Company) => {
    setSelectedCompany(newCompany);
    setCompany(newCompany);
    setShowCompanyDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/signin");
    }
  };

  const quickActions = quickActionsConfig[userRole];

  const getDeadlineColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "deadline-urgent";
    if (daysLeft <= 7) return "deadline-warning";
    return "deadline-safe";
  };

  const getBadgeColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "bg-destructive/10 text-destructive";
    if (daysLeft <= 7) return "bg-accent/10 text-accent";
    return "bg-primary/10 text-primary";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Header - Visible on Desktop and Tablet */}
      <TopNav
        showCompanySelector={true}
        selectedCompany={selectedCompany}
        userRole={userRole}
        onCompanyChange={handleCompanySwitch}
        companies={companies}
        userCompanies={userCompanies}
      />

      {/* Sidebar Navigation - Visible on Tablet and Desktop */}
      <aside className="hidden md:fixed md:left-0 md:top-20 md:h-[calc(100vh-80px)] md:w-64 md:flex md:flex-col md:bg-background md:border-r md:border-border">
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: "home", icon: Home, label: "Home", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only", "support_staff"] },
            { id: "companies", icon: Building2, label: "Companies", roles: ["super_admin"] },
            { id: "compliance", icon: ClipboardList, label: "Compliance", roles: ["company_admin", "accountant", "read_only"] },
            { id: "payroll", icon: Wallet, label: "Payroll", roles: ["company_admin", "accountant", "read_only"] },
            { id: "employees", icon: Users, label: "Employees", roles: ["company_admin"] },
            { id: "documents", icon: FileText, label: "Documents", roles: ["company_admin", "accountant", "read_only"] },
            { id: "my-tickets", icon: Ticket, label: "My Tickets", roles: ["company_admin", "accountant", "staff", "read_only", "support_staff"] },
            { id: "learn", icon: BookOpen, label: "Learn", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
            { id: "support", icon: Headphones, label: "Support", roles: ["super_admin"] },
          ]
            .filter((tab) => tab.roles.includes(userRole))
            .map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "companies") navigate("/companies");
                if (tab.id === "compliance") navigate("/compliance");
                if (tab.id === "payroll") navigate("/payroll");
                if (tab.id === "employees") navigate("/employees");
                if (tab.id === "documents") navigate("/documents");
                if (tab.id === "my-tickets") navigate("/my-tickets");
                if (tab.id === "learn") navigate("/learning");
                if (tab.id === "support") navigate("/support");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={() => navigate("/settings")}
          className="m-4 flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left w-[calc(100%-32px)]"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Settings</span>
        </button>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 md:ml-64 md:mt-20 flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border md:hidden">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-6 flex-1 min-w-0">
              <Logo size="sm" />
              {/* Company Switcher on Mobile */}
              <div className="relative">
                <button
                  onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <h2 className="font-semibold text-sm text-left">{selectedCompany?.name || "Select Company"}</h2>
                    <p className="text-xs text-muted-foreground">Switch Company</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {/* Company Dropdown */}
                {showCompanyDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50">
                    {(userCompanies.length > 0 ? userCompanies : companies).map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => handleCompanySwitch(comp)}
                        className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          selectedCompany?.id === comp.id ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        <p className="font-medium text-sm">{comp.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </button>
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

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl flex-1">
        
        {/* SUPER ADMIN DASHBOARD */}
        {userRole === "super_admin" && (
          <>
            {/* System Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Active Companies Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Companies</p>
                        <p className="text-3xl font-bold">{dashboardMetrics.activeCompanies}</p>
                        <p className="text-xs text-green-600 mt-2">↑ 2 this month</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Active Users Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                        <p className="text-3xl font-bold">{dashboardMetrics.totalUsers}</p>
                        <p className="text-xs text-green-600 mt-2">↑ {dashboardMetrics.newUsersThisWeek} this week</p>
                      </div>
                      <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Users className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support Tickets Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Open Support Tickets</p>
                        <p className="text-3xl font-bold">{dashboardMetrics.supportTickets}</p>
                        <p className="text-xs text-amber-600 mt-2">{dashboardMetrics.pendingTickets} pending response</p>
                      </div>
                      <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Ticket className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Revenue/Subscriptions Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
                        <p className="text-3xl font-bold">18</p>
                        <p className="text-xs text-green-600 mt-2">Premium tier</p>
                      </div>
                      <div className="p-3 bg-purple-500/10 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Management Cards */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Recent System Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border-l-2 border-blue-500">
                      <div>
                        <p className="text-sm font-medium">New company registered</p>
                        <p className="text-xs text-muted-foreground">Tech Innovations Ltd</p>
                      </div>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border-l-2 border-green-500">
                      <div>
                        <p className="text-sm font-medium">User subscription upgraded</p>
                        <p className="text-xs text-muted-foreground">ifeanyireed@gmail.com</p>
                      </div>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border-l-2 border-amber-500">
                      <div>
                        <p className="text-sm font-medium">System maintenance scheduled</p>
                        <p className="text-xs text-muted-foreground">Database optimization</p>
                      </div>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <button className="w-full text-sm text-primary hover:underline flex items-center justify-center gap-1 mt-2">
                      View All Activity <ChevronRight className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* System Alerts Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-background border border-amber-500/20">
                      <p className="text-sm font-medium text-amber-900">High database usage</p>
                      <p className="text-xs text-amber-700 mt-1">82% of capacity used</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border border-green-500/20">
                      <p className="text-sm font-medium text-green-900">API status normal</p>
                      <p className="text-xs text-green-700 mt-1">Response time: 45ms</p>
                    </div>
                    <button className="w-full text-sm text-primary hover:underline flex items-center justify-center gap-1 mt-2">
                      View System Status <ChevronRight className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Admin Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs sm:text-sm font-medium">{action.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Support Staff Management */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-primary" />
                    Support Staff Management
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/user-management")}
                    className="gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Manage Staff
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Manage support staff members and track their ticket resolution performance.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-xs text-muted-foreground">Active Staff</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-muted-foreground">Total Assigned</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">14</p>
                      <p className="text-xs text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* SUPPORT STAFF DASHBOARD */}
        {userRole === "support_staff" && (
          <>
            {/* My Workload Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-orange-500/20 bg-orange-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-orange-600" />
                    My Workload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <p className="text-2xl font-bold text-foreground">{supportStaffMetrics.workload.total}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Assigned</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <p className="text-2xl font-bold text-red-600">{supportStaffMetrics.workload.open}</p>
                      <p className="text-xs text-muted-foreground mt-1">Open</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background border">
                      <p className="text-2xl font-bold text-yellow-600">{supportStaffMetrics.workload.inProgress}</p>
                      <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Resolved</span>
                      <span className="font-bold text-green-600">{supportStaffMetrics.workload.resolved}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">This week</span>
                      <span className="font-bold">{supportStaffMetrics.workload.thisWeek} tickets</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Avg resolution time</span>
                      <span className="font-bold">{supportStaffMetrics.workload.avgResolutionTime} hrs</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => navigate("/my-tickets")}
                  >
                    <Ticket className="w-4 h-4" />
                    View All Tickets
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Focus Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Today's Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supportStaffMetrics.urgentTickets.length > 0 ? (
                    <>
                      {supportStaffMetrics.urgentTickets.map((ticket: any) => (
                        <div key={ticket.id} className="p-3 rounded-lg bg-background border-l-2 border-red-500">
                          <p className="text-sm font-semibold text-foreground">#{ticket.id}: {ticket.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{ticket.priority.toUpperCase()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">{ticket.priority === 'critical' ? 'Critical' : 'High'} Priority</span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      <p className="text-sm">No urgent tickets at the moment</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Urgent count</span>
                    <span className="font-bold text-red-600">{supportStaffMetrics.urgentTickets.length}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity Feed */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supportStaffMetrics.recentActivity.length > 0 ? (
                    <>
                      {supportStaffMetrics.recentActivity.map((activity: any, index: number) => {
                        const borderColors: Record<string, string> = {
                          assignment: 'border-orange-500',
                          message: 'border-blue-500',
                          resolution: 'border-green-500',
                        };
                        const iconColors: Record<string, string> = {
                          assignment: 'text-orange-600',
                          message: 'text-blue-600',
                          resolution: 'text-green-600',
                        };
                        
                        const getIcon = (type: string) => {
                          switch (type) {
                            case 'message':
                              return <MessageSquare className={`w-5 h-5 ${iconColors[type] || 'text-foreground'} mt-0.5`} />;
                            case 'resolution':
                              return <CheckCircle2 className={`w-5 h-5 ${iconColors[type] || 'text-foreground'} mt-0.5`} />;
                            default:
                              return <Ticket className={`w-5 h-5 ${iconColors[type] || 'text-foreground'} mt-0.5`} />;
                          }
                        };

                        const getTimeAgo = (timestamp: string) => {
                          const date = new Date(timestamp);
                          const now = new Date();
                          const diffMs = now.getTime() - date.getTime();
                          const diffMins = Math.floor(diffMs / 60000);
                          const diffHours = Math.floor(diffMins / 60);
                          const diffDays = Math.floor(diffHours / 24);
                          
                          if (diffMins < 1) return 'just now';
                          if (diffMins < 60) return `${diffMins} minutes ago`;
                          if (diffHours < 24) return `${diffHours} hours ago`;
                          return `${diffDays} days ago`;
                        };

                        return (
                          <div key={`${activity.ticketId}-${index}`} className={`flex gap-3 p-3 rounded-lg bg-muted/50 border-l-2 ${borderColors[activity.type] || 'border-gray-500'}`}>
                            <div className="flex-shrink-0">
                              {getIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">{activity.ticketTitle}</p>
                              <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(activity.timestamp)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Metrics Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Performance (This Month)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="text-xs text-muted-foreground mb-1">Resolved</p>
                      <p className="text-2xl font-bold text-foreground">{supportStaffMetrics.performance.resolvedThisMonth}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="text-xs text-muted-foreground mb-1">Resolution Rate</p>
                      <p className="text-2xl font-bold text-green-600">{supportStaffMetrics.performance.resolutionRate}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="text-xs text-muted-foreground mb-1">Avg Response Time</p>
                      <p className="text-2xl font-bold text-foreground">{supportStaffMetrics.performance.avgResponseTime}h</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                      <p className="text-2xl font-bold text-yellow-600">{supportStaffMetrics.performance.satisfactionScore}/5</p>
                      <p className="text-xs text-yellow-600 mt-1">⭐⭐⭐⭐⭐</p>
                    </div>
                  </div>
                  {supportStaffMetrics.performance.teamRank === 1 && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-semibold text-primary flex items-center gap-2">
                        🏆 Rank: #{supportStaffMetrics.performance.teamRank} in team
                      </p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Detailed Reports
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>


          </>
        )}

        {/* NON-SUPER ADMIN DASHBOARD (Excluding Support Staff) */}
        {userRole !== "super_admin" && userRole !== "support_staff" && (
        <>
        {/* Compliance Health & Upcoming Deadlines - Side by Side on Desktop */}
        {userRole !== "staff" && (
        <PermissionGuard userRole={userRole} permission="compliance:view">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Compliance Health Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden h-full">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-lg flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Compliance Health
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <div className="w-full flex justify-center">
                  <ComplianceProgress percentage={85} />
                </div>
                <div className="text-center w-full">
                  <p className="text-2xl font-display font-bold text-foreground">
                    3 filings
                  </p>
                  <p className="text-sm text-muted-foreground">due this month</p>
                  <button onClick={() => navigate("/compliance/calendar")} className="text-sm text-primary mt-2 flex items-center gap-1 hover:underline justify-center mx-auto">
                    View Calendar <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Deadlines Progress Meters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Card className="overflow-hidden h-full">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Upcoming Deadlines
                  </CardTitle>
                  <button className="text-sm text-primary hover:underline w-fit">
                    All Deadlines
                  </button>
                </div>
              </CardHeader>
              {/* Circular Progress Cards */}
              <CardContent className="pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {upcomingDeadlines.map((deadline, index) => (
                    <motion.div
                      key={deadline.name}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <DeadlineProgress daysLeft={deadline.daysLeft} maxDays={30} size={100} />
                      <div className="text-center">
                        <p className="text-sm font-semibold leading-tight">{deadline.name}</p>
                        <p className="text-xs text-muted-foreground">{deadline.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        </PermissionGuard>
        )}

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium">{action.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>


        {/* Upcoming Deadlines List - Only for users with compliance permissions (not staff) */}
        {userRole !== "staff" && (
        <PermissionGuard userRole={userRole} permission="compliance:view">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Deadline Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <motion.div
                  key={deadline.name}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-muted/50 ${
                    deadline.daysLeft <= 3 ? "animate-pulse" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${getBadgeColor(
                        deadline.daysLeft
                      )}`}
                    >
                      <span className="text-xs font-medium">{deadline.date.split(" ")[0]}</span>
                      <span className="text-lg font-bold">{deadline.date.split(" ")[1]}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${getDeadlineColor(deadline.daysLeft)}`}>
                        {deadline.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{deadline.amount}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full w-fit ${getBadgeColor(
                      deadline.daysLeft
                    )}`}
                  >
                    {deadline.daysLeft}d left
                  </span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        </PermissionGuard>
        )}

        {/* Two Column Layout for Tablet and Desktop */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Payroll Summary - Only for users with payroll permissions */}
          <PermissionGuard userRole={userRole} permission="payroll:view">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Payroll Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Payroll</p>
                    <p className="font-medium">December 2024</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Total Disbursed</p>
                    <p className="text-2xl font-display font-bold text-foreground">
                      ₦485,000
                    </p>
                  </div>
                  <button className="text-sm text-primary flex items-center gap-1 hover:underline w-fit">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </PermissionGuard>

          {/* Payslip History - Staff employees view their own payslips */}
          {userRole === "staff" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <PayslipHistory payslips={payslips} />
            </motion.div>
          )}

          {/* Learning Spotlight */}
          {userRole !== "staff" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card 
              onClick={() => navigate("/learning")}
              className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
            >
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Featured</p>
                  <h3 className="font-semibold mb-1">PAYE for Beginners</h3>
                  <p className="text-xs text-muted-foreground">5 min read</p>
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/learning");
                  }}
                  variant="default" 
                  size="sm" 
                  className="w-full sm:w-auto flex-shrink-0"
                >
                  Read Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          )}
        </div>
        </>
        )}
      </main>
      </div>

      {/* Bottom Navigation - Visible only on Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-xl border-t border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2 overflow-x-auto">
            {[
              { id: "home", icon: Home, label: "Home", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only", "support_staff"] },
              { id: "companies", icon: Building2, label: "Companies", roles: ["super_admin"] },
              { id: "compliance", icon: ClipboardList, label: "Compliance", roles: ["company_admin", "accountant", "read_only"] },
              { id: "payroll", icon: Wallet, label: "Payroll", roles: ["company_admin", "accountant", "read_only"] },
              { id: "employees", icon: Users, label: "Employees", roles: ["company_admin"] },
              { id: "documents", icon: FileText, label: "Documents", roles: ["company_admin", "accountant", "read_only"] },
              { id: "my-tickets", icon: Ticket, label: "My Tickets", roles: ["company_admin", "accountant", "staff", "read_only", "support_staff"] },
              { id: "learn", icon: BookOpen, label: "Learn", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
              { id: "support", icon: Headphones, label: "Support", roles: ["super_admin"] },
              { id: "settings", icon: Settings, label: "Settings", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only", "support_staff"] },
            ]
              .filter((tab) => tab.roles.includes(userRole))
              .map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "companies") navigate("/companies");
                  if (tab.id === "compliance") navigate("/compliance");
                  if (tab.id === "payroll") navigate("/payroll");
                  if (tab.id === "employees") navigate("/employees");
                  if (tab.id === "documents") navigate("/documents");
                  if (tab.id === "my-tickets") navigate("/my-tickets");
                  if (tab.id === "learn") navigate("/learning");
                  if (tab.id === "support") navigate("/support");
                  if (tab.id === "settings") navigate("/settings");
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
