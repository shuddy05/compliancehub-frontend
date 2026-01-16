import { UserRole, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions";

/**
 * Custom hook to check user permissions
 * 
 * Usage:
 * const { can } = usePermissions("company_admin");
 * 
 * if (can("payroll:approve")) {
 *   // Render approve button
 * }
 */
export function usePermissions(userRole: UserRole) {
  return {
    /**
     * Check if user has a specific permission
     */
    can: (permission: string) => hasPermission(userRole, permission),

    /**
     * Check if user has any of the specified permissions
     */
    canAny: (permissions: string[]) => hasAnyPermission(userRole, permissions),

    /**
     * Check if user has all of the specified permissions
     */
    canAll: (permissions: string[]) => hasAllPermissions(userRole, permissions),

    /**
     * Check if user CANNOT do something (inverse of can)
     */
    cannot: (permission: string) => !hasPermission(userRole, permission),

    /**
     * Check if user is a specific role
     */
    isRole: (role: UserRole) => userRole === role,

    /**
     * Check if user is an admin (super_admin or company_admin)
     */
    isAdmin: () => userRole === "super_admin" || userRole === "company_admin",

    /**
     * Check if user is super_admin
     */
    isSuperAdmin: () => userRole === "super_admin",

    /**
     * Check if user is company_admin
     */
    isCompanyAdmin: () => userRole === "company_admin",

    /**
     * Check if user is accountant
     */
    isAccountant: () => userRole === "accountant",

    /**
     * Check if user is staff
     */
    isStaff: () => userRole === "staff",

    /**
     * Check if user is read_only
     */
    isReadOnly: () => userRole === "read_only",
  };
}
