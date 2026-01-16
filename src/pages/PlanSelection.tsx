import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowLeft, Check, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subscriptionsService, companiesService } from "@/services/api";

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: "₦0",
    annualPrice: "₦0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 5 employees",
      "Basic compliance tracking",
      "Monthly reminders",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "₦15,000",
    annualPrice: "₦150,000",
    period: "month",
    description: "For growing businesses",
    features: [
      "Up to 50 employees",
      "Full compliance automation",
      "Real-time reminders",
      "Automated tax filings",
      "Payroll processing",
      "Custom reports",
      "Priority email support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: "₦75,000",
    annualPrice: "₦750,000",
    period: "month",
    description: "For large organizations",
    features: [
      "Unlimited employees",
      "Multi-company support",
      "Advanced compliance suite",
      "White-label options",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
    ],
    popular: false,
  },
];

export default function PlanSelection() {
  const navigate = useNavigate();
  const { company } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get company ID either from context or from API
      let companyId = company?.id;
      
      if (!companyId) {
        const companiesResponse = await companiesService.getUserCompanies();
        let companies: any = companiesResponse.data;

        // Some endpoints return { data: [...] } while others return [...] directly
        if (companies && companies.data) {
          companies = companies.data;
        }

        if (!Array.isArray(companies) || companies.length === 0) {
          throw new Error("No company found. Please complete company setup first.");
        }

        companyId = companies[0].id;
      }

      if (selectedPlan === "free") {
        // For free plan, create a subscription record
        try {
          await subscriptionsService.createSubscription({
            companyId,
            planId: "free",
            billingCycle: "monthly",
          });
        } catch (err) {
          console.error("Error creating free subscription:", err);
          // Continue anyway - subscription might exist
        }
        navigate("/onboarding-complete");
      } else {
        // For paid plans, just redirect to checkout
        // Subscription will be created during checkout/payment
        navigate(
          `/checkout?plan=${selectedPlan}&billing=${isAnnual ? "annual" : "monthly"}&company=${companyId}`
        );
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to process plan. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <button
            onClick={() => navigate("/company-setup")}
            className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ProgressIndicator currentStep={4} totalSteps={4} />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold mb-2 text-center">
            Choose Your Plan
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 text-center">
            All plans include core compliance features
          </p>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                isAnnual ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual <span className="text-xs text-primary ml-1">(Save 17%)</span>
            </span>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-4 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                    : "border-border bg-card hover:border-primary/50"
                } ${plan.popular ? "ring-2 ring-accent ring-offset-2" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-display font-semibold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-display font-bold">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period === "forever" || plan.id === "free" ? "" : `/${isAnnual ? "year" : "month"}`}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className={`absolute top-6 right-6 w-5 h-5 rounded-full border-2 transition-colors ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <Check className="w-3 h-3 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => navigate("/pricing")}
            className="text-xs sm:text-sm text-primary hover:underline block mx-auto mt-6"
          >
            Compare all features
          </button>

          <div className="mt-6 sm:mt-8">
            <Button
              variant="hero"
              size="lg"
              className="w-full text-sm sm:text-base"
              onClick={handleSelectPlan}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : `Select ${plans.find(p => p.id === selectedPlan)?.name}`}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3 sm:mt-4">
              {selectedPlan === "free" ? "No credit card required" : "14-day free trial"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
