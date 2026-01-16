import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export type UserRole = "super_admin" | "company_admin" | "accountant" | "staff" | "read_only";

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * Required roles - if user role not in this list, redirect to dashboard
   * If empty array or undefined, only authentication is required
   */
  allowedRoles?: UserRole[];
  /**
   * If true, requires ALL roles; if false, requires ANY of the roles
   */
  requireAll?: boolean;
}

/**
 * ProtectedRoute component that enforces authentication and role-based access control
 * 
 * Behavior:
 * 1. If no accessToken -> redirect to /signin
 * 2. If accessToken exists but user role not in allowedRoles -> redirect to /dashboard
 * 3. Otherwise render the protected component
 * 
 * Usage:
 * <ProtectedRoute allowedRoles={["super_admin"]}>
 *   <CompanyManagement />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  allowedRoles = [],
  requireAll = false,
}: ProtectedRouteProps) {
  const { accessToken, userRole } = useAuth();
  
  // Check both state AND localStorage for accessToken
  // This ensures protection even if state isn't loaded yet
  const hasToken = accessToken || localStorage.getItem("accessToken");

  // Not authenticated - redirect to signin
  if (!hasToken) {
    return <Navigate to="/signin" replace />;
  }

  // No role restrictions - user is authenticated, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check role-based access
  const hasRequiredRole = requireAll
    ? allowedRoles.every((role) => userRole === role)
    : allowedRoles.includes(userRole);

  // User is authenticated but doesn't have required role - redirect to dashboard
  if (!hasRequiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required role - render component
  return <>{children}</>;
}
