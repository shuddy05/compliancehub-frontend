import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, BookOpen, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { companiesService } from "@/services/api";

const confettiColors = [
  "bg-primary",
  "bg-accent",
  "bg-primary-light",
  "bg-accent-light",
];

const todos = [
  {
    id: "add-employee",
    icon: UserPlus,
    title: "Add your first employee",
    description: "Start managing payroll in minutes",
    route: "/employees/add",
  },
  {
    id: "compliance-calendar",
    icon: Calendar,
    title: "Review compliance calendar",
    description: "See all upcoming deadlines",
    route: "/compliance/calendar",
  },
  {
    id: "learning-hub",
    icon: BookOpen,
    title: "Explore learning resources",
    description: "Master Nigerian tax compliance",
    route: "/learning",
  },
];

export default function OnboardingComplete() {
  const navigate = useNavigate();
  const { company } = useAuth();
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mark onboarding as complete on component mount
  useEffect(() => {
    const completeOnboarding = async () => {
      if (company?.id) {
        try {
          // Call backend to mark onboarding as complete
          await companiesService.updateCompany(company.id, {
            onboardingCompleted: true,
            onboardingCompletedAt: new Date().toISOString(),
          });
        } catch (err: any) {
          console.error("Failed to mark onboarding as complete:", err);
          // Don't block the UX if this fails
          setError("Some settings may not have been saved, but you can continue.");
        }
      }
    };

    completeOnboarding();
  }, [company?.id]);

  const selectTodo = (id: string) => {
    setSelectedTodo((prev) => (prev === id ? null : id));
  };

  const handleGetStarted = async () => {
    setIsProcessing(true);
    try {
      if (selectedTodo) {
        const found = todos.find((t) => t.id === selectedTodo);
        if (found) {
          navigate(found.route);
          return;
        }
      }
      // fallback
      navigate("/dashboard");
    } catch (err) {
      console.error("Navigation error:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              confettiColors[i % confettiColors.length]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: -20,
            }}
            animate={{
              y: [0, window.innerHeight + 100],
              rotate: [0, 720],
              opacity: [1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="container max-w-lg mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Check className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-display font-bold mb-3">
            Welcome to ComplianceHub!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your compliance journey starts now
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{error}</p>
            </motion.div>
          )}

          <h2 className="text-lg font-semibold mb-4">Here's what to do next</h2>

          <div className="space-y-3 mb-10">
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={() => selectTodo(todo.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors ${
                  selectedTodo === todo.id ? 'border-primary/60' : ''
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center transition-all border-2 ${selectedTodo === todo.id ? 'border-primary bg-primary/10' : 'border-muted-foreground bg-transparent'}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedTodo === todo.id ? 'bg-primary' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{todo.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {todo.description}
                  </p>
                </div>
                <todo.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleGetStarted}
            disabled={isProcessing}
          >
            {isProcessing ? "Loading..." : "Get Started"}
          </Button>

          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors disabled:opacity-50"
            disabled={isProcessing}
          >
            I'll explore on my own
          </button>
        </motion.div>
      </div>
    </div>
  );
}
