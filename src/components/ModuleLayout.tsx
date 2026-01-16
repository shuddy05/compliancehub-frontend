import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  ClipboardList,
  Wallet,
  Users,
  FileText,
  BookOpen,
  Settings,
  ChevronDown,
  ArrowLeft,
  Headphones,
  LogOut,
  Ticket,
} from "lucide-react";

interface ModuleLayoutProps {
  children: React.ReactNode;
  title: string;
  activeTab: string;
}

const companies = [
  { id: 1, name: "Acme Technologies" },
  { id: 2, name: "TechVision Inc" },
  { id: 3, name: "Digital Solutions Ltd" },
];

export function ModuleLayout({ children, title, activeTab }: ModuleLayoutProps) {
  const navigate = useNavigate();
  const { userRole, company, setCompany, logout } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<any>(company || { id: "all", name: "All Companies" });
  const [userCompanies, setUserCompanies] = useState<any[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  useEffect(() => {
    if (company) {
      setSelectedCompany(company);
    }
  }, [company]);

  const handleCompanySwitch = (newCompany: any) => {
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

  const allNavigationTabs = [
    { id: "home", icon: Home, label: "Home", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only", "support_staff"] },
    { id: "companies", icon: Users, label: "Companies", roles: ["super_admin"] },
    { id: "compliance", icon: ClipboardList, label: "Compliance", roles: ["company_admin", "accountant", "read_only"] },
    { id: "payroll", icon: Wallet, label: "Payroll", roles: ["company_admin", "accountant", "read_only"] },
    { id: "employees", icon: Users, label: "Employees", roles: ["company_admin"] },
    { id: "documents", icon: FileText, label: "Documents", roles: ["company_admin", "accountant", "read_only"] },
    { id: "my-tickets", icon: Ticket, label: "My Tickets", roles: ["company_admin", "accountant", "staff", "read_only", "support_staff"] },
    { id: "learn", icon: BookOpen, label: "Learn", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
    { id: "support", icon: Headphones, label: "Support", roles: ["super_admin"] },
  ];

  const navigationTabs = allNavigationTabs.filter((tab) => tab.roles.includes(userRole));

  const handleNavClick = (tabId: string) => {
    switch (tabId) {
      case "home":
        navigate("/dashboard");
        break;
      case "companies":
        navigate("/companies");
        break;
      case "compliance":
        navigate("/compliance");
        break;
      case "payroll":
        navigate("/payroll");
        break;
      case "employees":
        navigate("/employees");
        break;
      case "documents":
        navigate("/documents");
        break;
      case "my-tickets":
        navigate("/my-tickets");
        break;
      case "learn":
        navigate("/learning");
        break;
      case "support":
        navigate("/support");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        break;
    }
  };

  const mobileBottomNavTabs = [
    { id: "home", icon: Home, label: "Home", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only", "support_staff"] },
    { id: "companies", icon: Users, label: "Companies", roles: ["super_admin"] },
    { id: "compliance", icon: ClipboardList, label: "Compliance", roles: ["company_admin", "accountant", "read_only"] },
    { id: "payroll", icon: Wallet, label: "Payroll", roles: ["company_admin", "accountant", "read_only"] },
    { id: "employees", icon: Users, label: "Employees", roles: ["company_admin"] },
    { id: "documents", icon: FileText, label: "Documents", roles: ["company_admin", "accountant", "read_only"] },
    { id: "my-tickets", icon: Ticket, label: "My Tickets", roles: ["company_admin", "accountant", "staff", "read_only", "support_staff"] },
    { id: "learn", icon: BookOpen, label: "Learn", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
    { id: "support", icon: Headphones, label: "Support", roles: ["super_admin"] },
    { id: "settings", icon: Settings, label: "Settings", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only", "support_staff"] },
  ].filter((tab) => tab.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Header - Visible on Desktop and Tablet */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-border z-40 md:flex-col">
        <div className="h-full flex items-center justify-between w-full px-4">
          {/* Site Logo and Name - Extreme Left */}
          <div className="flex items-center gap-2 w-64">
            <Logo size="md" />
          </div>

          {/* Company Selector - Center-Right */}
          <div className="flex items-center gap-6 flex-1">
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <h2 className="font-semibold text-sm text-left">{selectedCompany?.name || "Select Company"}</h2>
                  <p className="text-xs text-muted-foreground">{title}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Company Dropdown */}
              {showCompanyDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowCompanyDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedCompany.id === company.id ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <p className="font-medium text-sm">{company.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell notifications={[]} unreadCount={0} />
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

      {/* Sidebar Navigation - Visible on Tablet and Desktop */}
      <aside className="hidden md:fixed md:left-0 md:top-20 md:h-[calc(100vh-80px)] md:w-64 md:flex md:flex-col md:bg-background md:border-r md:border-border">
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
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
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-semibold text-sm">{selectedCompany?.name || "Select Company"}</h2>
                <p className="text-xs text-muted-foreground">{title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell notifications={[]} unreadCount={0} />
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

        {/* Page Content */}
        <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl flex-1">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-xl border-t border-border z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-around py-2 overflow-x-auto">
              {mobileBottomNavTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    handleNavClick(tab.id);
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
    </div>
  );
}
