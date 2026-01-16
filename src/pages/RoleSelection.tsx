import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useAuth } from "@/context/AuthContext";
import {
  Briefcase,
  Calculator,
  Users,
  Eye,
  Crown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface RoleOption {
  id: string;
  name: string;
  title: string;
  icon: any;
  description: string;
  permissions: string[];
  color: string;
}

const roles: RoleOption[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    title: "Platform Administrator",
    icon: Crown,
    description:
      "Full platform access, system management, and user administration across all companies",
    permissions: [
      "Manage all companies",
      "Manage all users",
      "System configuration",
      "View audit logs",
      "Manage billing and subscriptions",
    ],
    color: "bg-amber",
  },
  {
    id: "company_admin",
    name: "Company Admin",
    title: "Business Owner / CEO",
    icon: Briefcase,
    description:
      "Full access to all company data, user management, and billing",
    permissions: [
      "Manage company settings",
      "Invite and manage team members",
      "Approve payroll and compliance filings",
      "Access billing and subscriptions",
      "View all reports",
    ],
    color: "bg-blue",
  },
  {
    id: "accountant",
    name: "Accountant",
    title: "Financial Manager / Controller",
    icon: Calculator,
    description:
      "Manage payroll, compliance, and financial operations day-to-day",
    permissions: [
      "Create and edit employees",
      "Run payroll calculations",
      "Prepare compliance filings",
      "Upload documents and receipts",
      "Generate financial reports",
    ],
    color: "bg-purple",
  },
  {
    id: "staff",
    name: "Staff",
    title: "HR / Finance Assistant",
    icon: Users,
    description: "View payroll, compliance calendar, and distribute payslips",
    permissions: [
      "View employee records (read-only)",
      "View payroll history",
      "Download payslips",
      "Monitor compliance deadlines",
      "Generate basic reports",
    ],
    color: "bg-green",
  },
  {
    id: "read_only",
    name: "Read-Only",
    title: "Auditor / Consultant",
    icon: Eye,
    description: "View-only access for external audits and compliance checks",
    permissions: [
      "View all modules (read-only)",
      "Export reports",
      "No editing capabilities",
      "No sensitive document downloads",
      "Audit trail access",
    ],
    color: "bg-amber",
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invitationToken = searchParams.get("token");
  const email = searchParams.get("email");

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    setError(null);

    try {
      // Store the selected role in context
      setUserRole(selectedRole as any);
      
      // Navigate to company setup to continue onboarding
      navigate("/company-setup");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to set role";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const isFounder = searchParams.get("isFounder") === "true";
  const canSelectSuperAdmin = searchParams.get("adminOnly") === "true"; // Only show Super Admin if explicitly allowed

  // For founders, show only Company Admin role (they are the owner)
  const displayRoles = isFounder 
    ? roles.filter(r => r.id === "company_admin") 
    : canSelectSuperAdmin
    ? roles
    : roles.filter(r => r.id !== "super_admin");

  // For founders, auto-select Company Admin and allow them to proceed
  if (isFounder && !selectedRole) {
    setSelectedRole("company_admin");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Logo size="md" />
          <ProgressIndicator 
            currentStep={2} 
            totalSteps={isFounder ? 4 : 3} 
          />
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            {isFounder ? "Set Up Your Company Role" : "Welcome to ComplianceHub"}
          </h1>
          <p className="text-muted-foreground mb-2">
            {isFounder
              ? "As the company founder, you'll have full administrative access"
              : "You've been invited to join a company"}
          </p>
          {email && (
            <p className="text-sm text-muted-foreground">
              Signing up as: <span className="font-medium">{email}</span>
            </p>
          )}
        </motion.div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {isFounder ? "Your Role" : "Select Your Role"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayRoles.map((role, index) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <motion.div
                  key={role.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "ring-2 ring-primary border-primary shadow-lg"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {role.name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {role.title}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">
                          Key Permissions:
                        </p>
                        <ul className="space-y-1">
                          {role.permissions.slice(0, 3).map((perm, i) => (
                            <li
                              key={i}
                              className="text-xs text-muted-foreground flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-primary" />
                              {perm}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Role Details */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/50 rounded-xl p-6 mb-8 border border-border"
          >
            <div className="space-y-4">
              <h3 className="font-semibold">
                {roles.find((r) => r.id === selectedRole)?.name} - Full
                Permissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles
                  .find((r) => r.id === selectedRole)
                  ?.permissions.map((perm, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{perm}</span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/signup")}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? "Confirming..." : "Confirm Role"}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue/5 border border-blue/20 rounded-lg text-sm text-muted-foreground text-center">
          <p>
            You can change your role later. The company admin can adjust your
            permissions anytime.
          </p>
        </div>
      </main>
    </div>
  );
}
