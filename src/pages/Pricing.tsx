import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/NavLink";
import { Check, X, Sparkles, Menu, X as XIcon } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      { name: "Up to 5 employees", included: true },
      { name: "Basic compliance tracking", included: true },
      { name: "Monthly reminders", included: true },
      { name: "Email support", included: true },
      { name: "Automated filings", included: false },
      { name: "Payroll processing", included: false },
      { name: "Custom reports", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: "₦15,000",
    annualPrice: "₦150,000",
    description: "For growing businesses",
    features: [
      { name: "Up to 50 employees", included: true },
      { name: "Full compliance automation", included: true },
      { name: "Real-time reminders", included: true },
      { name: "Automated tax filings", included: true },
      { name: "Payroll processing", included: true },
      { name: "Custom reports", included: true },
      { name: "Priority email support", included: true },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: "₦75,000",
    annualPrice: "₦750,000",
    description: "For large organizations",
    features: [
      { name: "Unlimited employees", included: true },
      { name: "Multi-company support", included: true },
      { name: "Advanced compliance suite", included: true },
      { name: "White-label options", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "24/7 phone support", included: true },
      { name: "On-site training", included: true },
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, the Pro plan comes with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, cards (Visa, Mastercard), and all major Nigerian payment methods including Paystack and Flutterwave.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your dashboard.",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <NavLink to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" activeClassName="text-primary">Home</NavLink>
            <NavLink to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" activeClassName="text-primary">About</NavLink>
            <NavLink to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" activeClassName="text-primary">Pricing</NavLink>
            <NavLink to="/demo" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" activeClassName="text-primary">Demo</NavLink>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Link to="/signin" className="hidden sm:inline">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="hidden sm:block">
              <Button size="sm">Get Started</Button>
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                About
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                Pricing
              </Link>
              <Link
                to="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                Demo
              </Link>
              <div className="border-t border-border pt-4 flex flex-col gap-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="sm:hidden">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="sm:hidden">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="py-16 lg:py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your business. All plans include core compliance features.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
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
                Annual
              </span>
              {isAnnual && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium ml-2">
                  Save 17%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={plan.popular ? "md:-mt-4 md:mb-4" : ""}
              >
                <Card
                  className={`h-full relative ${
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/20"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-4xl font-display font-bold">
                        {plan.period ? plan.price : (isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period || (isAnnual ? "/year" : "/month")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature.name}
                          className="flex items-center gap-2 text-sm"
                        >
                          {feature.included ? (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span
                            className={
                              feature.included ? "" : "text-muted-foreground"
                            }
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={plan.name === "Enterprise" ? "/demo" : `/checkout?plan=${plan.name.toLowerCase()}&billing=${isAnnual ? "annual" : "monthly"}`}
                      className="block"
                    >
                      <Button
                        variant={plan.popular ? "default" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start your free trial today. No credit card required.
          </p>
          <Link to="/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="font-display font-bold">ComplianceHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ComplianceHub. Built for Nigerian SMEs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
