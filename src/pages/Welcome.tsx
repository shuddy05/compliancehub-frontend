import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { FileCheck, Calendar, Shield } from "lucide-react";

const benefits = [
  {
    icon: FileCheck,
    title: "Automate Tax Filings",
    description: "PAYE, VAT, WHT calculated and filed automatically",
  },
  {
    icon: Calendar,
    title: "Never Miss Deadlines",
    description: "Smart reminders via SMS, Email & WhatsApp",
  },
  {
    icon: Shield,
    title: "Audit-Ready Always",
    description: "All documents organized and accessible",
  },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary-light/20 to-background">
      <div className="container max-w-lg mx-auto px-6 py-12 flex flex-col min-h-screen">
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <Logo size="lg" animated />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Nigerian SME Compliance,{" "}
            <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Focus on growing your business while we handle your compliance
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="flex-1 flex flex-col gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="p-3 rounded-xl bg-primary/10">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/signup")}
            className="w-full"
          >
            Get Started Free
          </Button>
          <Button
            variant="heroSecondary"
            size="lg"
            onClick={() => navigate("/signin")}
            className="w-full"
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
