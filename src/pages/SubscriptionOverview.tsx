import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Crown,
  Users,
  HardDrive,
  Zap,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";

const planFeatures = [
  "Up to 50 employees",
  "Automated payroll calculations",
  "PAYE auto-filing",
  "Compliance calendar",
  "5GB document storage",
  "Email support (12hr response)",
  "Pension remittance tracking",
  "Payslip generation & distribution",
];

const recentInvoices = [
  { id: "1", date: "Dec 18, 2025", amount: "₦15,000", status: "Paid" },
  { id: "2", date: "Nov 18, 2025", amount: "₦15,000", status: "Paid" },
  { id: "3", date: "Oct 18, 2025", amount: "₦15,000", status: "Paid" },
];

const SubscriptionOverview = () => {
  const navigate = useNavigate();

  const employeeUsage = 23;
  const employeeLimit = 50;
  const storageUsage = 1.2;
  const storageLimit = 5;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Subscription</h1>
        </div>
      </header>

      <main className="p-4 max-w-3xl mx-auto space-y-6">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-6"
        >
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Pro</h2>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Current Plan
                  </Badge>
                </div>
                <p className="text-muted-foreground">Monthly subscription</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">₦15,000</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>Next billing: Jan 18, 2026</span>
              <span>•</span>
              <span>Visa •••• 4242</span>
            </div>

            <Button onClick={() => navigate("/settings/subscription/plans")}>
              Manage Plan
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <section>
          <h3 className="font-semibold mb-4">What's included</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {planFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
              >
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Usage Stats */}
        <section>
          <h3 className="font-semibold mb-4">Usage</h3>
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Employees</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {employeeUsage} / {employeeLimit}
                </span>
              </div>
              <Progress value={(employeeUsage / employeeLimit) * 100} className="h-2" />
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Document Storage</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {storageUsage} GB / {storageLimit} GB
                </span>
              </div>
              <Progress value={(storageUsage / storageLimit) * 100} className="h-2" />
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">API Calls</span>
                </div>
                <span className="text-sm text-muted-foreground">450 / 1,000</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </section>

        {/* Billing History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Billing History</h3>
            <Button variant="link" className="text-sm">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {recentInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/settings/subscription/invoices/${invoice.id}`)}
              >
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    {invoice.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => navigate("/settings/subscription/payment")}
          >
            <div className="text-left">
              <p className="font-medium">Update Payment Method</p>
              <p className="text-xs text-muted-foreground">
                Change your credit card details
              </p>
            </div>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4"
            onClick={() => window.open("mailto:billing@compliancehub.ng")}
          >
            <div className="text-left">
              <p className="font-medium">Billing Support</p>
              <p className="text-xs text-muted-foreground">
                Contact our billing team
              </p>
            </div>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
        </div>

        {/* Coach Mark */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary">
            💡 <strong>Tip:</strong> Upgrade anytime as your business grows. Changes take effect immediately.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionOverview;
