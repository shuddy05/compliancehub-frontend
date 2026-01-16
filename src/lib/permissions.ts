/**
 * Role-Based Access Control (RBAC) System
 * Defines permissions for each role across all features
 */

export type UserRole = "super_admin" | "company_admin" | "accountant" | "staff" | "read_only";

export interface Permission {
  [key: string]: boolean;
}

export interface RolePermissions {
  [role: string]: Permission;
}

/**
 * Master permissions matrix
 * Maps each role to their allowed permissions
 */
export const rolePermissions: Record<UserRole, Permission> = {
  super_admin: {
    // Company Management
    "company:edit": true,
    "company:view": true,
    "billing:manage": true,
    "billing:view": true,
    
    // User Management
    "users:invite": true,
    "users:assign-roles": true,
    "users:remove": true,
    "users:view": true,
    "users:edit": true,
    
    // Employee Management
    "employees:create": true,
    "employees:edit": true,
    "employees:delete": true,
    "employees:view": true,
    
    // Payroll
    "payroll:run": true,
    "payroll:edit": true,
    "payroll:approve": true,
    "payroll:view": true,
    "payroll:download-payslips": true,
    
    // Compliance
    "compliance:calculate": true,
    "compliance:file": true,
    "compliance:upload-receipts": true,
    "compliance:view": true,
    
    // Documents
    "documents:upload": true,
    "documents:download": true,
    "documents:delete": true,
    "documents:view": true,
    
    // Reports
    "reports:generate": true,
    "reports:export": true,
    
    // API
    "api:manage-keys": true,
    "api:use": true,
    
    // System
    "system:audit-logs": true,
    "system:feature-flags": true,
    "system:override-limits": true,
  },

  company_admin: {
    // Company Management
    "company:edit": true,
    "company:view": true,
    "billing:manage": true,
    "billing:view": true,
    
    // User Management
    "users:invite": true,
    "users:assign-roles": true,
    "users:remove": true,
    "users:view": true,
    "users:edit": true,
    
    // Employee Management
    "employees:create": true,
    "employees:edit": true,
    "employees:delete": true,
    "employees:view": true,
    
    // Payroll
    "payroll:run": true,
    "payroll:edit": true,
    "payroll:approve": true,
    "payroll:view": true,
    "payroll:download-payslips": true,
    
    // Compliance
    "compliance:calculate": true,
    "compliance:file": true,
    "compliance:upload-receipts": true,
    "compliance:view": true,
    
    // Documents
    "documents:upload": true,
    "documents:download": true,
    "documents:delete": true,
    "documents:view": true,
    
    // Reports
    "reports:generate": true,
    "reports:export": true,
    
    // API
    "api:manage-keys": false, // Enterprise only
    "api:use": true,
    
    // System
    "system:audit-logs": true,
    "system:feature-flags": false,
    "system:override-limits": false,
  },

  accountant: {
    // Company Management
    "company:edit": false,
    "company:view": true,
    "billing:manage": false,
    "billing:view": false,
    
    // User Management
    "users:invite": false,
    "users:assign-roles": false,
    "users:remove": false,
    "users:view": true,
    "users:edit": false,
    
    // Employee Management
    "employees:create": true,
    "employees:edit": true,
    "employees:delete": false,
    "employees:view": true,
    
    // Payroll
    "payroll:run": true,
    "payroll:edit": true,
    "payroll:approve": false,
    "payroll:view": true,
    "payroll:download-payslips": true,
    
    // Compliance
    "compliance:calculate": true,
    "compliance:file": true,
    "compliance:upload-receipts": true,
    "compliance:view": true,
    
    // Documents
    "documents:upload": true,
    "documents:download": true,
    "documents:delete": false,
    "documents:view": true,
    
    // Reports
    "reports:generate": true,
    "reports:export": true,
    
    // API
    "api:manage-keys": false,
    "api:use": false,
    
    // System
    "system:audit-logs": false,
    "system:feature-flags": false,
    "system:override-limits": false,
  },

  staff: {
    // Company Management
    "company:edit": false,
    "company:view": true,
    "billing:manage": false,
    "billing:view": false,
    
    // User Management
    "users:invite": false,
    "users:assign-roles": false,
    "users:remove": false,
    "users:view": true,
    "users:edit": false,
    
    // Employee Management
    "employees:create": false,
    "employees:edit": false,
    "employees:delete": false,
    "employees:view": true,
    
    // Payroll
    "payroll:run": false,
    "payroll:edit": false,
    "payroll:approve": false,
    "payroll:view": false,
    "payroll:download-payslips": true,
    
    // Compliance
    "compliance:calculate": false,
    "compliance:file": false,
    "compliance:upload-receipts": false,
    "compliance:view": true,
    
    // Documents
    "documents:upload": false,
    "documents:download": true,
    "documents:delete": false,
    "documents:view": true,
    
    // Reports
    "reports:generate": true,
    "reports:export": false,
    
    // API
    "api:manage-keys": false,
    "api:use": false,
    
    // System
    "system:audit-logs": false,
    "system:feature-flags": false,
    "system:override-limits": false,
  },

  read_only: {
    // Company Management
    "company:edit": false,
    "company:view": true,
    "billing:manage": false,
    "billing:view": false,
    
    // User Management
    "users:invite": false,
    "users:assign-roles": false,
    "users:remove": false,
    "users:view": true,
    "users:edit": false,
    
    // Employee Management
    "employees:create": false,
    "employees:edit": false,
    "employees:delete": false,
    "employees:view": true,
    
    // Payroll
    "payroll:run": false,
    "payroll:edit": false,
    "payroll:approve": false,
    "payroll:view": true,
    "payroll:download-payslips": true,
    
    // Compliance
    "compliance:calculate": false,
    "compliance:file": false,
    "compliance:upload-receipts": false,
    "compliance:view": true,
    
    // Documents
    "documents:upload": false,
    "documents:download": false, // Can be enabled by admin
    "documents:delete": false,
    "documents:view": true,
    
    // Reports
    "reports:generate": true,
    "reports:export": false, // Can be enabled by admin
    
    // API
    "api:manage-keys": false,
    "api:use": false,
    
    // System
    "system:audit-logs": false,
    "system:feature-flags": false,
    "system:override-limits": false,
  },
};

/**
 * Check if a user has a specific permission
 * @param userRole - The user's role
 * @param permission - The permission to check
 * @returns boolean - Whether the user has the permission
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  return rolePermissions[userRole]?.[permission] ?? false;
}

/**
 * Check if a user has any of the specified permissions
 * @param userRole - The user's role
 * @param permissions - Array of permissions to check
 * @returns boolean - Whether the user has at least one permission
 */
export function hasAnyPermission(userRole: UserRole, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

/**
 * Check if a user has all of the specified permissions
 * @param userRole - The user's role
 * @param permissions - Array of permissions to check
 * @returns boolean - Whether the user has all permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: string[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a role
 * @param userRole - The user's role
 * @returns Permission object with all permissions for that role
 */
export function getRolePermissions(userRole: UserRole): Permission {
  return rolePermissions[userRole] || {};
}

/**
 * Get a list of all permissions a user is allowed to perform
 * @param userRole - The user's role
 * @returns Array of allowed permission keys
 */
export function getAllowedPermissions(userRole: UserRole): string[] {
  const permissions = rolePermissions[userRole];
  return Object.entries(permissions)
    .filter(([_, allowed]) => allowed)
    .map(([permission, _]) => permission);
}

/**
 * Get a list of all denied permissions for a user
 * @param userRole - The user's role
 * @returns Array of denied permission keys
 */
export function getDeniedPermissions(userRole: UserRole): string[] {
  const permissions = rolePermissions[userRole];
  return Object.entries(permissions)
    .filter(([_, allowed]) => !allowed)
    .map(([permission, _]) => permission);
}
