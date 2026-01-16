import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, CreditCard, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance, { companiesService } from "@/services/api";

const planDetails = {
  pro: {
    name: "Pro",
    monthlyPrice: "₦15,000",
    annualPrice: "₦150,000",
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
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: "₦75,000",
    annualPrice: "₦750,000",
    description: "For large organizations",
    features: [
      "Unlimited employees",
      "Multi-company support",
      "Advanced compliance suite",
      "White-label options",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "On-site training",
    ],
  },
};

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, company } = useAuth();
  
  const planType = (searchParams.get("plan") || "pro") as "pro" | "enterprise";
  const billingCycle = searchParams.get("billing") || "monthly";
  const companyIdFromUrl = searchParams.get("company");
  
  const plan = planDetails[planType];
  const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const billingPeriod = billingCycle === "annual" ? "/year" : "/month";
  
  // Calculate VAT (7.5%)
  const VAT_RATE = 0.075;
  const priceAmount = parseFloat(price.replace(/[₦,]/g, ""));
  const vatAmount = priceAmount * VAT_RATE;
  const totalAmount = priceAmount + vatAmount;
  
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: company?.name || "",
    phone: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Autofill company data on mount
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        let companyData = company;
        
        // If company is not in context, fetch it from API
        if (!companyData && companyIdFromUrl) {
          const response = await companiesService.getCompanyById(companyIdFromUrl);
          companyData = response.data;
        }
        
        if (companyData) {
          setFormData((prev) => ({
            ...prev,
            company: companyData.name || prev.company,
            phone: companyData.phone || prev.phone,
          }));
        }
      } catch (err) {
        console.error("Error loading company data:", err);
      }
    };
    
    loadCompanyData();
  }, [company, companyIdFromUrl]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    // First, initiate payment on backend to create subscription record
    await initiatePaymentOnBackend();
  };

  const initiatePaymentOnBackend = async () => {
    try {
      const companyIdToUse = company?.id || companyIdFromUrl;
      if (!companyIdToUse) {
        alert("Company not found. Please go back and complete company setup.");
        setIsProcessing(false);
        return;
      }

      // Call backend to create subscription with payment reference using axios (respects VITE_API_BASE_URL)
      const resp = await axiosInstance.post("/subscriptions/initiate-payment", {
        companyId: company.id,
        planName: planType,
        billingCycle,
        customerEmail: formData.email,
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        customerPhone: formData.phone,
      });

      const result = resp.data;
      console.log("Payment initiated on backend:", result);

      // Server-init: server returns an `authorizationUrl` (or nested paystackInit fields).
      const authorizationUrl =
        result?.authorizationUrl || result?.paystackInit?.data?.authorization_url || result?.paystackInit?.authorization_url;
      if (authorizationUrl) {
        console.log('Redirecting to Paystack authorization_url:', authorizationUrl);
        // Keep the button disabled and redirect the browser to complete payment
        window.location.href = authorizationUrl;
        return;
      }

      // Fallback: if no authorization URL present, show an error.
      console.error('No Paystack authorization URL returned from server:', result);
      alert('Payment initialization failed. Please try again later.');
      setIsProcessing(false);
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error: " + (error as Error).message);
      setIsProcessing(false);
    }
  };

  const isValid = 
    formData.email.trim() !== "" &&
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.company.trim() !== "" &&
    formData.phone.trim() !== "";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/plan-selection")}
            className="p-2 rounded-xl hover:bg-muted transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Pricing</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold">{plan.name} Plan</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Billing: {billingCycle === "annual" ? "Annual" : "Monthly"}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Includes:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (7.5%)</span>
                    <span>{formatCurrency(vatAmount)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary text-lg">{formatCurrency(totalAmount)}{billingPeriod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange("email")}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange("firstName")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange("lastName")}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          placeholder="Your Company Ltd."
                          value={formData.company}
                          onChange={handleChange("company")}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+234 (0) 123 456 7890"
                          value={formData.phone}
                          onChange={handleChange("phone")}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </h3>
                    {import.meta.env.VITE_ENABLE_PAYSTACK_SANDBOX === "true" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 dark:bg-yellow-900/20 dark:border-yellow-700">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">🧪 Sandbox Mode Enabled</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Using Paystack test credentials for testing</p>
                      </div>
                    )}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 dark:bg-primary/5 dark:border-primary/30">
                      <p className="text-sm font-medium text-primary mb-2 dark:text-primary">Secure Payment via Paystack</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                        Your payment will be processed securely through Paystack. We don't store your card information.
                      </p>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                    <Lock className="w-4 h-4" />
                    <span>Your information is encrypted and secure. Card data is never stored on our servers.</span>
                  </div>

                  {/* Terms */}
                  <div className="text-xs text-muted-foreground">
                    <p>
                      By proceeding, you agree to our{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={!isValid || isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatCurrency(totalAmount)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
