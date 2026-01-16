import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader, AlertCircle, CheckCircle } from "lucide-react";
import { authService, usersService } from "@/services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing");
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        const { tokens } = response.data;

        // Store tokens in localStorage (AuthContext will pick them up)
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        // Fetch user data with new tokens
        const userResponse = await usersService.getCurrentUser();
        setUser(userResponse.data);

        setStatus("success");
        setMessage("Email verified successfully!");

        // Redirect to role selection after 2 seconds
        setTimeout(() => {
          navigate("/role-selection?verified=true");
        }, 2000);
      } catch (error: any) {
        setStatus("error");
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Email verification failed";
        setMessage(errorMessage);
      }
    };

    verifyToken();
  }, [token, navigate, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 text-center">
          {status === "loading" && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Loader className="w-12 h-12 text-primary" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2 text-green-600">
                Email Verified!
              </h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to role selection...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2 text-destructive">
                Verification Failed
              </h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/sign-up")}
                  variant="default"
                  className="w-full"
                >
                  Back to Sign Up
                </Button>
                <Button
                  onClick={() => {
                    const email = localStorage.getItem("pendingVerificationEmail");
                    if (email) {
                      navigate(`/resend-verification?email=${email}`);
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Resend Verification Email
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
