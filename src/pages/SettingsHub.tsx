import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { SupportTicketSubmitModal } from "@/components/SupportTicketSubmitModal";
import {
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  Plug,
  Settings,
  Bell,
  Calendar,
  Wallet,
  Shield,
  User,
  BookOpen,
  HelpCircle,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Home,
  FileText,
  ClipboardList,
  MoreHorizontal,
  Headphones,
  Ticket,
} from "lucide-react";

const companies = [
  { id: 1, name: "Acme Technologies" },
  { id: 2, name: "TechVision Inc" },
  { id: 3, name: "Digital Solutions Ltd" },
];

const settingsGroups = [
  {
    title: "Company Settings",
    items: [
      { icon: Building2, label: "Company Profile", href: "/settings", roles: ["company_admin", "accountant", "staff"] },
      { icon: Users, label: "Team & Users", href: "/user-management", roles: ["company_admin"] },
      { icon: CreditCard, label: "Subscription & Billing", href: "/settings", badge: "Admin", roles: ["company_admin"] },
      { icon: Plug, label: "Integrations", href: "/settings", roles: ["company_admin", "accountant"] },
    ],
  },
  {
    title: "Compliance Settings",
    items: [
      { icon: Settings, label: "Compliance Preferences", href: "/settings", roles: ["company_admin", "accountant"] },
      { icon: Bell, label: "Notification Preferences", href: "/settings", roles: ["company_admin", "accountant", "staff", "read_only"] },
      { icon: Calendar, label: "Compliance Calendar", href: "/settings", roles: ["company_admin", "accountant", "read_only"] },
    ],
  },
  {
    title: "Payroll Settings",
    items: [
      { icon: Wallet, label: "Payroll Configuration", href: "/settings", roles: ["company_admin", "accountant"] },
      { icon: Shield, label: "Tax Relief Settings", href: "/settings", roles: ["company_admin", "accountant"] },
    ],
  },
  {
    title: "Account Settings",
    items: [
      { icon: User, label: "My Profile", href: "/settings/profile", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
      { icon: Shield, label: "Security & Privacy", href: "/settings/security", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
      { icon: BookOpen, label: "Learning Progress", href: "/settings", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", href: "/settings", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only", "support_staff"] },
      { icon: MessageCircle, label: "Contact Support", href: "/settings", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
      { icon: Headphones, label: "Manage Support Tickets", href: "/support", roles: ["super_admin"] },
      { icon: Headphones, label: "Support Dashboard", href: "/support/staff", roles: ["support_staff"] },
      { icon: Sparkles, label: "What's New", href: "/settings", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
    ],
  },
  {
    title: "Support Staff Settings",
    items: [
      { icon: Wallet, label: "My Performance", href: "/settings/performance", roles: ["support_staff"] },
      { icon: Users, label: "Assigned Tickets", href: "/support/staff", roles: ["support_staff"] },
      { icon: Bell, label: "Notification Preferences", href: "/settings/notifications", roles: ["support_staff"] },
      { icon: Shield, label: "Availability Status", href: "/settings/availability", roles: ["support_staff"] },
    ],
  },
];

export default function SettingsHub() {
  const navigate = useNavigate();
  const { userRole, logout, company, setCompany } = useAuth();
  const [activeTab, setActiveTab] = useState("settings");
  const [selectedCompany, setSelectedCompany] = useState<any>(company || companies[0]);
  const [userCompanies, setUserCompanies] = useState<any[]>([]);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Sync selected company with context and initialize from context on mount
  const handleCompanySwitch = (newCompany: any) => {
    setSelectedCompany(newCompany);
    setCompany(newCompany);
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
                if (tab.id === "home") navigate("/dashboard");
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
          onClick={() => setActiveTab("settings")}
          className={`m-4 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left w-[calc(100%-32px)] ${
            activeTab === "settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Settings</span>
        </button>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 md:ml-64 md:mt-20 flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border md:hidden">
          <div className="container mx-auto px-4 h-16 flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-semibold text-lg">Settings</h1>
          </div>
        </header>

        {/* Settings List */}
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl flex-1">
        <div className="grid md:grid-cols-2 gap-6">
          {settingsGroups
            .map((group) => ({
              ...group,
              items: group.items.filter((item) => item.roles.includes(userRole)),
            }))
            .filter((group) => group.items.length > 0)
            .map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                {group.title}
              </h2>
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {group.items.map((item, itemIndex) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.label === "Contact Support") {
                        navigate("/my-tickets");
                      } else {
                        navigate(item.href);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left ${
                      itemIndex < group.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-xl bg-muted flex-shrink-0">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* App Version */}
        <div className="text-center pt-4">
          <Logo size="sm" />
          <p className="text-xs text-muted-foreground mt-2">Version 1.0.0</p>
        </div>
      </div>

      {/* Support Ticket Modal */}
      {showSupportModal && (
        <SupportTicketSubmitModal
          isOpen={showSupportModal}
          onClose={() => setShowSupportModal(false)}
        />
      )}

      {/* Bottom Navigation - Hidden on Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-xl border-t border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2 overflow-x-auto">
            {[
              { id: "home", icon: Home, label: "Home", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
              { id: "compliance", icon: ClipboardList, label: "Compliance", roles: ["super_admin", "company_admin", "accountant", "read_only"] },
              { id: "payroll", icon: Wallet, label: "Payroll", roles: ["super_admin", "company_admin", "accountant", "read_only"] },
              { id: "employee", icon: Users, label: "Employee", roles: ["super_admin", "company_admin"] },
              { id: "documents", icon: FileText, label: "Documents", roles: ["super_admin", "company_admin", "accountant", "read_only"] },
              { id: "learn", icon: BookOpen, label: "Learn", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
              { id: "settings", icon: Settings, label: "Settings", roles: ["super_admin", "company_admin", "accountant", "staff", "read_only"] },
            ]
              .filter((tab) => tab.roles.includes(userRole))
              .map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "home") navigate("/dashboard");
                  if (tab.id === "compliance") navigate("/compliance");
                  if (tab.id === "payroll") navigate("/payroll");
                  if (tab.id === "employee") navigate("/employees");
                  if (tab.id === "documents") navigate("/documents");
                  if (tab.id === "learn") navigate("/learning");
                  // Settings tab keeps user on this page
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
