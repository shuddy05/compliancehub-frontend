import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Check } from "lucide-react";
import { authService } from "@/services/api";

export default function ResendVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.resendVerificationEmail(email);
      setSuccess(true);
      setCountdown(60); // 60 second cooldown
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to resend verification email";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-2">Resend Verification Email</h1>
          <p className="text-muted-foreground mb-8">
            {success
              ? "Check your email for the verification link"
              : "Enter your email to receive a new verification link"}
          </p>

          {success ? (
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Verification email sent successfully!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Please check your email and click the verification link.
                </p>
              </motion.div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/signin")}
                  variant="default"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                    setError(null);
                  }}
                  variant="outline"
                  className="w-full"
                  disabled={countdown > 0}
                >
                  {countdown > 0
                    ? `Resend again in ${countdown}s`
                    : "Send to different email"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  {email && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={!email || isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Email"}
              </Button>

              <Button
                type="button"
                onClick={() => navigate("/signin")}
                variant="ghost"
                className="w-full"
              >
                Back to Sign In
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
