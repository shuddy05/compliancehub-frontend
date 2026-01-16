import React, { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { authService, usersService } from "@/services/api";

export type UserRole = "super_admin" | "company_admin" | "accountant" | "staff" | "read_only" | "support_staff";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  tin?: string;
  rcNumber?: string;
  industry?: string;
  numberOfEmployees?: number;
  state?: string;
  lga?: string;
}

export interface CompanyUser {
  id?: string;
  companyId?: string;
  role?: UserRole;
  company?: Company;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  userRole: UserRole;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  onboardingComplete: boolean;
  userSubscriptionTier: string | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<any>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  applyTokens: (access: string, refresh: string) => Promise<void>;
  setUserRole: (role: UserRole) => void;
  setCompany: (company: Company) => void;
  setUser: (user: User) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setUserSubscriptionTier: (tier: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("userRole");
    return (saved as UserRole) || "read_only";
  });
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    const saved = localStorage.getItem("onboardingComplete");
    return saved === "true";
  });
  const [userSubscriptionTier, setUserSubscriptionTier] = useState<string | null>(() =>
    localStorage.getItem("userSubscriptionTier")
  );
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem("refreshToken")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist tokens to localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem("onboardingComplete", onboardingComplete ? "true" : "false");
  }, [onboardingComplete]);

  useEffect(() => {
    if (userSubscriptionTier) {
      localStorage.setItem("userSubscriptionTier", userSubscriptionTier);
    } else {
      localStorage.removeItem("userSubscriptionTier");
    }
  }, [userSubscriptionTier]);

  // Login method
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });

      // If backend requires MFA for this user, return that payload to caller
      if (response.data?.mfaRequired) {
        return response.data;
      }

      const { accessToken: token, refreshToken: refresh } = response.data;

      // Set tokens synchronously to localStorage first
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refresh);
      
      // Then update state
      setAccessToken(token);
      setRefreshToken(refresh);

      // Fetch current user data
      const userResponse = await usersService.getCurrentUser();
      const currentUser = userResponse.data;
      setUser(currentUser);

      // Derive role and company from companyUsers if present
      const companyUsers: CompanyUser[] = currentUser.companyUsers || [];
      if (companyUsers.some((cu) => cu.role === "super_admin")) {
        setUserRole("super_admin");
        const sys = companyUsers.find((cu) => cu.role === "super_admin");
        if (sys?.company) setCompany(sys.company);
      } else if (companyUsers.length > 0) {
        const primary = companyUsers[0];
        setUserRole((primary.role as UserRole) || "read_only");
        if (primary.company) setCompany(primary.company);
      }
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
    // In case nothing was returned above, return a success shape
    return null;
  }, []);

  const applyTokens = useCallback(async (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);

    try {
      const userResponse = await usersService.getCurrentUser();
      const currentUser = userResponse.data;
      setUser(currentUser);

      const companyUsers: CompanyUser[] = currentUser.companyUsers || [];
      if (companyUsers.some((cu) => cu.role === "super_admin")) {
        setUserRole("super_admin");
        const sys = companyUsers.find((cu) => cu.role === "super_admin");
        if (sys?.company) setCompany(sys.company);
      } else if (companyUsers.length > 0) {
        const primary = companyUsers[0];
        setUserRole((primary.role as UserRole) || "read_only");
        if (primary.company) setCompany(primary.company);
      }
    } catch (err) {
      console.error("Failed to load current user after applying tokens", err);
    }
  }, []);

  // Auto-fetch current user when access token exists
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!accessToken) return;
      try {
        const userResponse = await usersService.getCurrentUser();
        const currentUser = userResponse.data;
        setUser(currentUser);

        const companyUsers: CompanyUser[] = currentUser.companyUsers || [];
        if (companyUsers.some((cu) => cu.role === "super_admin")) {
          setUserRole("super_admin");
          const sys = companyUsers.find((cu) => cu.role === "super_admin");
          if (sys?.company) setCompany(sys.company);
        } else if (companyUsers.length > 0) {
          const primary = companyUsers[0];
          setUserRole((primary.role as UserRole) || "read_only");
          if (primary.company) setCompany(primary.company);
        }
      } catch (err) {
        console.error("Failed to load current user", err);
      }
    };

    loadCurrentUser();
  }, [accessToken]);

  // Register method
  const register = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Register the user
      const registerResponse = await authService.register({
        firstName,
        lastName,
        email,
        password,
      });
      
      // Store tokens immediately after registration
      const { accessToken: token, refreshToken: refresh } = registerResponse.data;
      setAccessToken(token);
      setRefreshToken(refresh);
      
      // Note: User data will be fetched after email verification is complete
      // Don't call getCurrentUser() here as email verification is required first
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout method
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (accessToken) {
        await authService.logout();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setCompany(null);
      setUserRole("read_only");
      setOnboardingComplete(false);
      setUserSubscriptionTier(null);
      setIsLoading(false);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        userRole,
        accessToken,
        refreshToken,
        isLoading,
        error,
        onboardingComplete,
        userSubscriptionTier,
        login,
        register,
        logout,
        applyTokens,
        setUserRole,
        setCompany,
        setUser,
        setOnboardingComplete,
        setUserSubscriptionTier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
