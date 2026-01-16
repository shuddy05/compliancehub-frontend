import {
  Briefcase,
  Calculator,
  Users,
  Eye,
  Crown,
  LucideIcon,
} from "lucide-react";

interface RoleBadgeProps {
  role: "super_admin" | "company_admin" | "accountant" | "staff" | "read_only";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

interface RoleConfig {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const roleConfigs: Record<string, RoleConfig> = {
  super_admin: {
    name: "Super Admin",
    icon: Crown,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  company_admin: {
    name: "Admin",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  accountant: {
    name: "Accountant",
    icon: Calculator,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  staff: {
    name: "Team",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  read_only: {
    name: "View Only",
    icon: Eye,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-950",
  },
};

export function RoleBadge({
  role,
  size = "md",
  showLabel = true,
  className = "",
}: RoleBadgeProps) {
  const config = roleConfigs[role];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const paddingClasses = {
    sm: "px-2 py-1",
    md: "px-3 py-1.5",
    lg: "px-4 py-2",
  };

  if (showLabel) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg ${config.bgColor} ${paddingClasses[size]} ${className}`}
      >
        <Icon className={`${sizeClasses[size]} ${config.color}`} />
        <span className={`${textSizeClasses[size]} font-medium ${config.color}`}>
          {config.name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg ${config.bgColor} ${paddingClasses[size]} ${className}`}
      title={config.name}
    >
      <Icon className={`${sizeClasses[size]} ${config.color}`} />
    </div>
  );
}

export default RoleBadge;
