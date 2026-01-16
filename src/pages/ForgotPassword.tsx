import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = email.includes("@");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-lg mx-auto px-6 py-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </motion.div>

            <h1 className="text-3xl font-display font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-4">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>

            {/* Instructions */}
            <Card className="mb-8 text-left">
              <CardHeader>
                <CardTitle className="text-base">Didn't receive the email?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Check your spam or junk folder</p>
                <p>• Make sure you entered the correct email address</p>
                <p>• Try resetting the password again</p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                variant="outline"
                size="lg"
              >
                Try Another Email
              </Button>
              <Button onClick={() => navigate("/signin")} size="lg">
                Back to Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate("/signin")}
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
          <h1 className="text-3xl font-display font-bold mb-2">Reset your password</h1>
          <p className="text-muted-foreground mb-8">
            Enter your email address and we'll send you a link to reset your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll send a password reset link to this email address
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to Sign In */}
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </form>

          {/* Help */}
          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Need additional help?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@compliancehub.ng"
                className="text-primary hover:underline text-sm font-medium"
              >
                Contact Support
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a href="tel:08035428870" className="text-primary hover:underline text-sm font-medium">
                Call Us: 08035428870
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
