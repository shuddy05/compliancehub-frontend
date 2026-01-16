import React from "react";
import { UserRole, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions";
import { useAuth } from "@/context/AuthContext";

interface PermissionGuardProps {
  /**
   * The user's role (optional - will use AuthContext if not provided)
   */
  userRole?: UserRole;

  /**
   * Single permission to check (if permission is provided, requireAll is ignored)
   */
  permission?: string;

  /**
   * Multiple permissions to check
   */
  permissions?: string[];

  /**
   * Whether ALL permissions are required (default: true)
   * If false, checks if user has ANY of the permissions
   */
  requireAll?: boolean;

  /**
   * The children to render if permission check passes
   */
  children: React.ReactNode;

  /**
   * Component/content to render if permission check fails
   * If not provided, nothing is rendered
   */
  fallback?: React.ReactNode;
}

/**
 * Conditional rendering component based on user permissions
 * 
 * Usage:
 * <PermissionGuard userRole={userRole} permission="payroll:approve">
 *   <ApproveButton />
 * </PermissionGuard>
 * 
 * <PermissionGuard 
 *   userRole={userRole} 
 *   permissions={["payroll:run", "payroll:edit"]}
 *   requireAll={false}
 *   fallback={<div>You don't have permission</div>}
 * >
 *   <PayrollForm />
 * </PermissionGuard>
 */
export function PermissionGuard({
  userRole: userRoleProp,
  permission,
  permissions = [],
  requireAll = true,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const auth = useAuth();
  const userRole = userRoleProp || auth.userRole;
  
  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = hasPermission(userRole, permission);
  } else if (permissions.length > 0) {
    // Multiple permissions check
    hasAccess = requireAll
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

export default PermissionGuard;
