import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowLeft, Check, Eye, EyeOff, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Check if user was invited
  const invitationToken = searchParams.get("token");
  const invitationEmail = searchParams.get("email");

  useEffect(() => {
    // Pre-fill email if coming from invitation
    if (invitationEmail) {
      setFormData((prev) => ({ ...prev, email: invitationEmail }));
    }
  }, [invitationEmail]);

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return 4;
    return 3;
  };

  const strength = passwordStrength();
  const strengthColors = ["bg-muted", "bg-destructive", "bg-accent", "bg-accent", "bg-primary"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const isValid =
    formData.firstName &&
    formData.lastName &&
    formData.email.includes("@") &&
    formData.phone.length >= 10 &&
    formData.password.length >= 6;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ProgressIndicator currentStep={1} totalSteps={4} />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {invitationToken && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Welcome! You've been invited to join a company
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                  After signing up, you'll select your role and permissions
                </p>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-display font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Let's get started with your compliance journey
          </p>

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setIsLoading(true);

              try {
                // Register the user
                await registerUser(
                  formData.firstName,
                  formData.lastName,
                  formData.email,
                  formData.password
                );

                // Store email for potential resend
                localStorage.setItem("pendingVerificationEmail", formData.email);

                // Show message and redirect to verification page
                navigate("/verify-email-sent", {
                  state: { email: formData.email },
                });
              } catch (err: any) {
                const errorMessage =
                  err.response?.data?.message || err.message || "Registration failed";
                setError(errorMessage);
                setIsLoading(false);
              }
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                  />
                  {formData.firstName && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                  />
                  {formData.lastName && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                />
                {formData.email.includes("@") && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                />
                {formData.phone.length >= 10 && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {formData.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength ? strengthColors[strength] : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${strength >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Coach mark */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Strong passwords protect your business data
              </p>
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
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Creating account..." : "Continue"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
