import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Building2,
  Users,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: typeof Users;
  features: { name: string; included: boolean }[];
  highlighted?: boolean;
  current?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "₦0",
    period: "/month",
    description: "For small businesses just getting started",
    icon: Users,
    features: [
      { name: "Up to 5 employees", included: true },
      { name: "Basic payroll calculations", included: true },
      { name: "Manual compliance filing", included: true },
      { name: "1GB document storage", included: true },
      { name: "PAYE auto-filing", included: false },
      { name: "Priority support", included: false },
      { name: "API access", included: false },
    ],
    cta: "Downgrade",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₦15,000",
    period: "/month",
    description: "For growing businesses with regular payroll",
    icon: Sparkles,
    features: [
      { name: "Up to 50 employees", included: true },
      { name: "Automated payroll calculations", included: true },
      { name: "PAYE auto-filing", included: true },
      { name: "5GB document storage", included: true },
      { name: "Email support (12hr)", included: true },
      { name: "Pension tracking", included: true },
      { name: "API access", included: false },
    ],
    highlighted: true,
    current: true,
    cta: "Current Plan",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₦50,000",
    period: "/month",
    description: "For large organizations with complex needs",
    icon: Building2,
    features: [
      { name: "Unlimited employees", included: true },
      { name: "All Pro features", included: true },
      { name: "Auto bank payments", included: true },
      { name: "Unlimited storage", included: true },
      { name: "Priority support (2hr)", included: true },
      { name: "Custom integrations", included: true },
      { name: "Full API access", included: true },
    ],
    cta: "Contact Sales",
  },
];

const ChangePlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handlePlanSelect = (plan: Plan) => {
    if (plan.current) return;
    if (plan.id === "enterprise") {
      window.open("mailto:sales@compliancehub.ng?subject=Enterprise Plan Inquiry");
      return;
    }
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const handleConfirmChange = () => {
    toast({
      title: "Plan Updated",
      description: `You've successfully ${selectedPlan?.id === "free" ? "downgraded to" : "upgraded to"} the ${selectedPlan?.name} plan.`,
    });
    setShowConfirmDialog(false);
    navigate("/settings/subscription");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Change Plan</h1>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Proration Notice */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Plan changes take effect immediately. Your billing will be prorated.
          </p>
        </div>

        {/* Plans Comparison */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/30"
                    : "bg-card border border-border"
                }`}
              >
                {plan.current && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Current
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      plan.highlighted ? "bg-primary/20" : "bg-muted"
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "" : "text-muted-foreground"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.current ? "secondary" : plan.highlighted ? "default" : "outline"}
                  disabled={plan.current}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Downgrade Link */}
        <div className="text-center">
          <Button
            variant="link"
            className="text-muted-foreground"
            onClick={() => handlePlanSelect(plans[0])}
          >
            Downgrade to Free
          </Button>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPlan?.id === "free" ? "Downgrade" : "Upgrade"} to{" "}
              {selectedPlan?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPlan?.id === "free" ? (
                <>
                  You'll lose access to Pro features immediately. Your data will be
                  preserved, but some features will be limited.
                </>
              ) : (
                <>
                  Your new plan will be effective immediately. You'll be charged{" "}
                  {selectedPlan?.price} prorated for the remaining billing period.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmChange}>
              Confirm {selectedPlan?.id === "free" ? "Downgrade" : "Upgrade"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChangePlan;
