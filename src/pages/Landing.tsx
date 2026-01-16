import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import {
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Users,
  FileText,
  Calculator,
  Building2,
  Menu,
  X,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Automated Compliance",
    description: "Stay compliant with Nigerian tax laws automatically. We handle PAYE, VAT, WHT, and more.",
  },
  {
    icon: Clock,
    title: "Never Miss Deadlines",
    description: "Smart reminders and automated filings ensure you never face penalties for late submissions.",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Track your compliance health, payroll trends, and financial obligations in one dashboard.",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Manage your workforce with ease. Handle payroll, benefits, and tax calculations seamlessly.",
  },
];

const benefits = [
  "Save 20+ hours monthly on compliance tasks",
  "Reduce compliance errors by 95%",
  "Avoid costly penalties and fines",
  "Access expert support when needed",
];

const stats = [
  { value: "5,000+", label: "Nigerian SMEs" },
  { value: "₦2B+", label: "Taxes Processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Landing() {
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
                <X className="w-5 h-5" />
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

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Trusted by 5,000+ Nigerian SMEs
              </span>
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 text-balance">
                Nigerian SME Compliance,{" "}
                <span className="text-primary">Simplified</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 text-balance">
                Automate your tax filings, manage payroll, and stay audit-ready. 
                ComplianceHub handles the complexity so you can focus on growing your business.
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Book a Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/10 blur-xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-display font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Everything You Need for Compliance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From tax automation to payroll management, ComplianceHub has all the tools 
              Nigerian SMEs need to stay compliant.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
                Why Nigerian SMEs Choose ComplianceHub
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of businesses that have simplified their compliance journey 
                with our all-in-one platform.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/signup">
                  <Button size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FileText, label: "Tax Filings", count: "12k+ Monthly" },
                { icon: Calculator, label: "Payroll Runs", count: "8k+ Monthly" },
                { icon: Building2, label: "Companies", count: "5,000+" },
                { icon: Users, label: "Employees", count: "50,000+" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border text-center"
                >
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-display font-bold">{item.count}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Ready to Simplify Your Compliance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
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
