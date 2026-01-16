import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "hello@compliancehub.ng",
    action: "mailto:hello@compliancehub.ng",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "08035428870",
    action: "tel:08035428870",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Festac, Lagos",
    action: null,
  },
];

const reasons = [
  "See the platform in action",
  "Get personalized recommendations",
  "Understand pricing for your needs",
  "Ask questions to our experts",
];

export default function Demo() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    employees: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Demo Request Submitted!",
      description: "Our team will contact you within 24 hours.",
    });
    
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      phone: "",
      employees: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

      {/* Hero */}
      <section className="py-16 lg:py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
                Book a Demo
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                See how ComplianceHub can simplify your business compliance. 
                Our team will walk you through the platform and answer all your questions.
              </p>

              {/* Why Book a Demo */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Why Book a Demo?
                </h3>
                <ul className="space-y-3">
                  {reasons.map((reason, index) => (
                    <motion.li
                      key={reason}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {reason}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Response Time */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 inline-flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  Average response time: <strong>Under 24 hours</strong>
                </span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Request a Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employees">Number of Employees</Label>
                        <select
                          id="employees"
                          name="employees"
                          value={formData.employees}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select...</option>
                          <option value="1-5">1-5</option>
                          <option value="6-20">6-20</option>
                          <option value="21-50">21-50</option>
                          <option value="51-100">51-100</option>
                          <option value="100+">100+</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        What would you like to learn about?
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Tell us about your compliance challenges..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Request Demo"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting, you agree to our{" "}
                      <a href="#" className="underline hover:text-primary">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-display font-bold mb-2">
              Other Ways to Reach Us
            </h2>
            <p className="text-muted-foreground">
              Choose the method that works best for you
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    {method.action ? (
                      <a
                        href={method.action}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {method.description}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
