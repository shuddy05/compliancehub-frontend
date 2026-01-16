import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "@/components/NavLink";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const teamMembers = [
  {
    name: "Ifeanyi Felix",
    role: "Founder & CEO",
    description: "Visionary leader driving ComplianceHub's mission to simplify compliance.",
  },
  {
    name: "Ibrahim Moshood",
    role: "CTO",
    description: "Technical innovator leading our engineering excellence and platform architecture.",
  },
  {
    name: "Oyinlade Oladejo",
    role: "Product Manager",
    description: "User-focused product strategist ensuring ComplianceHub meets customer needs.",
  },
  {
    name: "Cedar Akinola",
    role: "Sales & Customer Relations",
    description: "Customer champion building relationships and driving business growth.",
  },
];

const missionPoints = [
  {
    title: "Simplify Compliance",
    description: "We make tax and regulatory compliance effortless for Nigerian businesses.",
  },
  {
    title: "Reduce Errors",
    description: "Automation eliminates manual errors and ensures accuracy every time.",
  },
  {
    title: "Save Time",
    description: "Focus on growing your business while we handle compliance overhead.",
  },
  {
    title: "Expert Support",
    description: "Access expert guidance and support whenever you need it.",
  },
];

export default function About() {
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
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 text-balance">
                About <span className="text-primary"><span className="hidden md:inline">ComplianceHub</span><span className="md:hidden">ComplianceHub</span></span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 text-balance">
                Empowering Nigerian businesses with intelligent compliance solutions that save time, reduce errors, and drive growth.
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/demo">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Schedule a Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Get Started
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

      {/* Company Info */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ComplianceHub is developed and maintained by <span className="font-semibold text-foreground">Reed Breed Technologies</span>, a forward-thinking software company dedicated to transforming how Nigerian businesses manage compliance and payroll operations.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                We understand the challenges that Nigerian SMEs face with tax compliance, payroll management, and regulatory requirements. Our platform automates these processes, giving you peace of mind and freeing up time to focus on what matters most—growing your business.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="border border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="font-medium">Reed Breed Technologies</p>
                    <p className="text-sm">AMG Workspace, 22 Road</p>
                    <p className="text-sm">Festac, Lagos</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="font-medium">08035428870</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">hello@compliancehub.ng</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              To empower Nigerian businesses with intelligent, automated compliance solutions that reduce complexity, minimize errors, and unlock growth potential.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-primary/10 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Our Leadership Team</h2>
            <p className="text-lg text-muted-foreground">
                Meet the brilliant minds driving innovation at ComplianceHub
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-primary/10 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-base font-semibold text-primary">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Our Values</h2>
            <div className="grid gap-8 md:grid-cols-3 mt-12">
              <div>
                <h3 className="font-bold text-xl mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve our platform with cutting-edge technology and user feedback.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3">Reliability</h3>
                <p className="text-muted-foreground">
                  Trust is earned through consistent performance, security, and dependable support.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3">Impact</h3>
                <p className="text-muted-foreground">
                  We measure success by the positive impact we have on our customers' businesses.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of Nigerian businesses using ComplianceHub for compliance and payroll management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Schedule a Demo
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
