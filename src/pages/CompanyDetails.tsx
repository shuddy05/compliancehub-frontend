import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ClipboardList,
  Wallet,
  FileText,
} from "lucide-react";

interface SubscriptionPlan {
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
  features: string[];
}

const plans: Record<string, SubscriptionPlan> = {
  starter: {
    name: "Starter",
    price: 9900,
    billingCycle: "monthly",
    features: [
      "Up to 10 employees",
      "Basic payroll processing",
      "Email support",
      "Monthly compliance reports",
    ],
  },
  professional: {
    name: "Professional",
    price: 24900,
    billingCycle: "monthly",
    features: [
      "Up to 100 employees",
      "Advanced payroll processing",
      "Priority email & phone support",
      "Weekly compliance reports",
      "Tax filing assistance",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 99900,
    billingCycle: "monthly",
    features: [
      "Unlimited employees",
      "Custom payroll solutions",
      "24/7 dedicated support",
      "Real-time compliance monitoring",
      "Full tax filing & audit support",
      "Custom integrations",
    ],
  },
};

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock company data
  const company = {
    id,
    name: "Acme Technologies",
    industry: "Technology",
    email: "admin@acmetech.com",
    phone: "+234 (0) 1 456 7890",
    address: "123 Innovation Street, Lagos, Nigeria",
    website: "www.acmetech.com",
    employees: 45,
    subscriptionPlan: "professional" as const,
    status: "active" as const,
    joinDate: "Jan 15, 2024",
    renewalDate: "Jan 14, 2025",
    lastPaymentDate: "Jan 15, 2024",
    nextBillingDate: "Feb 15, 2024",
  };

  const currentPlan = plans[company.subscriptionPlan];
  const activePlan = company.subscriptionPlan;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/companies")}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl">{company.name}</h1>
              <p className="text-sm text-muted-foreground">{company.industry}</p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-600">
            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{company.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{company.phone}</p>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="font-medium">{company.address}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Current Plan */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Current Plan</p>
                        <Badge className="capitalize bg-primary/20 text-primary">
                          {activePlan}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold">
                        ₦{currentPlan.price.toLocaleString()} / {currentPlan.billingCycle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentPlan.features.length} features included
                      </p>
                    </div>

                    {/* Key Dates */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Join Date
                        </p>
                        <p className="font-semibold">{company.joinDate}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Renewal Date
                        </p>
                        <p className="font-semibold">{company.renewalDate}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Last Payment
                        </p>
                        <p className="font-semibold">{company.lastPaymentDate}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Next Billing
                        </p>
                        <p className="font-semibold">{company.nextBillingDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Included Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Employees</p>
                    <p className="text-2xl font-bold text-primary">{company.employees}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className="bg-green-500/10 text-green-600">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Module Access Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">View Company Data</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/compliance?company=${company.id}`)}
                    className="flex items-center gap-2 h-auto py-2"
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span className="text-xs">Compliance</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/payroll?company=${company.id}`)}
                    className="flex items-center gap-2 h-auto py-2"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="text-xs">Payroll</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/employees?company=${company.id}`)}
                    className="flex items-center gap-2 h-auto py-2"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Employees</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/documents?company=${company.id}`)}
                    className="flex items-center gap-2 h-auto py-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-xs">Documents</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="space-y-2"
            >
              <Button 
                className="w-full"
                onClick={() => setShowUpgradeModal(true)}
              >
                Upgrade Plan
              </Button>
              <Button variant="outline" className="w-full">
                Manage Billing
              </Button>
              <Button variant="outline" className="w-full">
                View Activity
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-600">
                Suspend Account
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
