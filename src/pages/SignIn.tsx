import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { companiesService, subscriptionsService } from "@/services/api";
import { authService } from "@/services/api";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, isLoading, error, applyTokens, setOnboardingComplete, setUserSubscriptionTier } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [mfaTempToken, setMfaTempToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  const isValid = formData.email.includes("@") && formData.password.length >= 6;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setLocalError(null); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const res = await login(formData.email, formData.password);

      // If MFA is required, show code input
      if (res?.mfaRequired) {
        setMfaTempToken(res.tempToken);
        return;
      }

      // Small delay to ensure localStorage is set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get current user info to check role
      try {
        const userResponse = await authService.getCurrentUser();
        const userRole = userResponse.data?.companyUsers?.[0]?.role;
        
        // Support staff should go directly to dashboard
        if (userRole === 'support_staff') {
          setOnboardingComplete(true);
          navigate("/dashboard");
          return;
        }
      } catch (err) {
        console.log('Could not fetch user role, continuing with normal flow');
      }
      
      // Check onboarding status: company setup and subscription
      let companiesResponse;
      try {
        companiesResponse = await companiesService.getUserCompanies();
      } catch (compErr: any) {
        // If we get a 401 or 403, try fetching user again as they might be support_staff
        if (compErr.response?.status === 401 || compErr.response?.status === 403) {
          try {
            const userRetry = await authService.getCurrentUser();
            const roleRetry = userRetry.data?.companyUsers?.[0]?.role;
            if (roleRetry === 'support_staff') {
              setOnboardingComplete(true);
              navigate("/dashboard");
              return;
            }
          } catch (retryErr) {
            // Fall through to show error
          }
        }
        throw compErr;
      }

      const companiesData = companiesResponse.data?.data || companiesResponse.data;
      const companies = Array.isArray(companiesData) ? companiesData : [];

      // If no companies, redirect to company setup
      if (!companies || companies.length === 0) {
        navigate("/company-setup");
        return;
      }

      // User has at least one company, check for subscription
      const companyId = companies[0]?.id;
      if (!companyId) {
        navigate("/company-setup");
        return;
      }

      try {
        const subscriptionResponse = await subscriptionsService.getCurrentSubscription(companyId);
        const subscription = subscriptionResponse.data;

        // If subscription exists, go to dashboard
        if (subscription && subscription.id) {
          navigate("/dashboard");
          return;
        }
      } catch (err: any) {
        // No subscription found, redirect to plan selection
        navigate("/plan-selection");
        return;
      }

      // Fallback: no subscription, go to plan selection
      navigate("/plan-selection");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Sign in failed. Please try again.";
      setLocalError(errorMessage);
    }
  };

  const finalizeAfterLogin = async () => {
    // Check onboarding status: company setup and subscription
    try {
      // Get current user info to check role
      try {
        const userResponse = await authService.getCurrentUser();
        const userRole = userResponse.data?.companyUsers?.[0]?.role;
        
        // Support staff should go directly to dashboard
        if (userRole === 'support_staff') {
          setOnboardingComplete(true);
          navigate("/dashboard");
          return;
        }
      } catch (err) {
        console.log('Could not fetch user role, continuing with normal flow');
      }

      const companiesResponse = await companiesService.getUserCompanies();
      const companiesData = companiesResponse.data?.data || companiesResponse.data;
      const companies = Array.isArray(companiesData) ? companiesData : [];

      // If no companies, redirect to company setup
      if (!companies || companies.length === 0) {
        setOnboardingComplete(false);
        navigate("/company-setup");
        return;
      }

      // User has at least one company, check for subscription
      const companyId = companies[0]?.id;
      if (!companyId) {
        setOnboardingComplete(false);
        navigate("/company-setup");
        return;
      }

      try {
        const subscriptionResponse = await subscriptionsService.getCurrentSubscription(companyId);
        const subscription = subscriptionResponse.data;

        console.log('[LOGIN-DEBUG] Subscription response:', subscription);

        // If subscription exists and has a tier (not free), mark onboarding as complete
        if (subscription && subscription.subscriptionTier) {
          // Allow free tier users to continue to dashboard (they'll see plan selection in-app)
          // Only block if explicitly a free tier
          setUserSubscriptionTier(subscription.subscriptionTier);
          setOnboardingComplete(true);
          navigate("/dashboard");
          return;
        }
      } catch (err: any) {
        // No subscription found or error, redirect to plan selection
        console.log('[LOGIN-DEBUG] Subscription check failed:', err.message);
      }

      // No active subscription found, go to plan selection
      setOnboardingComplete(false);
      navigate("/plan-selection");
    } catch (err: any) {
      console.error('[LOGIN-DEBUG] Onboarding finalization error:', err);
      setOnboardingComplete(false);
      navigate("/plan-selection");
    }
  };

  const handleMfaVerify = async () => {
    setLocalError(null);
    try {
      if (!mfaTempToken) throw new Error('Missing MFA token');
      const response = await authService.mfaLoginVerify(mfaTempToken, mfaCode);
      const { accessToken, refreshToken } = response.data;
      await applyTokens(accessToken, refreshToken);
      // proceed with post-login navigation
      await finalizeAfterLogin();
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'MFA verification failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div></div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            <span className="hidden md:inline">Sign in to your ComplianceHub account</span>
            <span className="md:hidden">Sign in to your account</span>
          </p>

          {/* Error Alert */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{displayError}</p>
            </motion.div>
          )}

          {!mfaTempToken ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange("email")}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-primary hover:underline font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange("password")}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-input bg-background cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me on this device
              </Label>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary hover:underline font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                Create one
              </button>
            </p>
          </form>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="mfa">Authenticator code</Label>
                <Input
                  id="mfa"
                  type="text"
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleMfaVerify} variant="hero" size="lg" className="w-full" disabled={isLoading || mfaCode.length < 6}>
                Verify code
              </Button>
            </div>
          )}

          {/* Support Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-4">
              Need help?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => navigate("/support/contact")}
                className="text-xs text-primary hover:underline disabled:opacity-50"
                disabled={isLoading}
              >
                Contact Support
              </button>
              <span className="text-xs text-muted-foreground">•</span>
              <button
                type="button"
                onClick={() => navigate("/help")}
                className="text-xs text-primary hover:underline disabled:opacity-50"
                disabled={isLoading}
              >
                Help Center
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
