import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Upload,
  Play,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

const steps = [
  { 
    id: 1, 
    title: "Calculate Amount", 
    description: "₦450,000 (done by app)",
    completed: true,
    action: null,
  },
  { 
    id: 2, 
    title: "Download Schedule", 
    description: "PDF with full breakdown",
    completed: false,
    action: "download",
  },
  { 
    id: 3, 
    title: "Visit FIRS Portal", 
    description: "Log in to file your return",
    completed: false,
    action: "link",
    link: "https://taxpromax.firs.gov.ng",
  },
  { 
    id: 4, 
    title: "Make Payment", 
    description: "Via Remita or bank transfer",
    completed: false,
    action: null,
  },
  { 
    id: 5, 
    title: "Upload Receipt", 
    description: "Proof of payment",
    completed: false,
    action: "upload",
  },
  { 
    id: 6, 
    title: "Confirm Filing", 
    description: "Mark as complete",
    completed: false,
    action: "confirm",
  },
];

export default function ManualFiling() {
  const { id } = useParams();
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [videoOpen, setVideoOpen] = useState(false);

  const handleStepAction = (stepId: number, action: string | null) => {
    if (action === "download") {
      toast({
        title: "Download Started",
        description: "PAYE schedule is being downloaded.",
      });
      setCompletedSteps(prev => [...prev, stepId]);
    } else if (action === "link") {
      window.open("https://taxpromax.firs.gov.ng", "_blank");
      setCompletedSteps(prev => [...prev, stepId]);
    } else if (action === "upload") {
      toast({
        title: "Upload Receipt",
        description: "Receipt upload functionality.",
      });
    } else if (action === "confirm") {
      toast({
        title: "Filing Confirmed!",
        description: "PAYE has been marked as filed.",
      });
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/compliance/${id}`}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">
              File PAYE Manually
            </h1>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <Card glass className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="font-medium">{completedSteps.length} of {steps.length} steps</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </Card>

        {/* Step-by-step Guide */}
        <Card glass className="p-6">
          <h2 className="font-semibold mb-4">Step-by-step Guide</h2>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = !isCompleted && completedSteps.length === index;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary/10 border border-primary/30' : 
                    isCompleted ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-primary text-primary-foreground' : 
                    isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    {step.action && !isCompleted && (
                      <div className="mt-3">
                        {step.action === "download" && (
                          <Button size="sm" onClick={() => handleStepAction(step.id, step.action)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Schedule
                          </Button>
                        )}
                        {step.action === "link" && (
                          <Button size="sm" onClick={() => handleStepAction(step.id, step.action)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open FIRS Portal
                          </Button>
                        )}
                        {step.action === "upload" && (
                          <Button size="sm" variant="outline" onClick={() => handleStepAction(step.id, step.action)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Receipt
                          </Button>
                        )}
                        {step.action === "confirm" && (
                          <Button size="sm" onClick={() => handleStepAction(step.id, step.action)}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Video Tutorial */}
        <Collapsible open={videoOpen} onOpenChange={setVideoOpen}>
          <Card glass className="p-4">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Video Tutorial</h3>
                    <p className="text-sm text-muted-foreground">How to file PAYE on FIRS portal (3 min)</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${videoOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Video player placeholder</p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Upgrade CTA */}
        <Card glass className="p-6 border-gold/30 bg-gold/5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gold">Upgrade to Pro</h3>
              <p className="text-sm text-muted-foreground">
                Automate your filings and save hours every month
              </p>
            </div>
            <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
              Learn More
            </Button>
          </div>
        </Card>

        {/* Need Help */}
        <div className="text-center">
          <Button variant="link" asChild>
            <Link to="/support">Need help? Contact support</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
