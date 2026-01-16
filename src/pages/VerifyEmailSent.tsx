import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function VerifyEmailSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || "";
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
          <div className="text-center space-y-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Mail className="w-16 h-16 text-primary mx-auto" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-muted-foreground">
                We've sent a verification link to
              </p>
              <p className="font-medium text-foreground mt-1">{email}</p>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
              <div className="space-y-3 text-left text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Click the verification link in the email
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    The link expires in 24 hours
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Check your spam folder if you don't see it
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <Button
                onClick={() => navigate("/")}
                variant="default"
                size="lg"
                className="w-full"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => navigate(`/resend-verification?email=${email}`)}
                variant="outline"
                size="lg"
                className="w-full"
                disabled={countdown > 0}
              >
                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Didn't receive email? Resend"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Already verified? <a href="/signin" className="underline text-primary hover:no-underline">Sign in here</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
