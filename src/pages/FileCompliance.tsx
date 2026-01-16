import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Loader2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import confetti from "canvas-confetti";

export default function FileCompliance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState({
    payroll: true,
    amount: true,
    credentials: true,
    confirm: false,
  });
  const [isFiling, setIsFiling] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const allChecked = Object.values(checklist).every(Boolean);

  const handleFile = async () => {
    setIsFiling(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsFiling(false);
    setIsComplete(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#6366F1'],
    });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-display font-bold mb-2">Filing Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your PAYE filing for December 2025 has been submitted to FIRS.
          </p>
          <Card glass className="p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference Number</span>
                <span className="font-mono font-medium">FIRS-202512-4567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono font-medium">₦450,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Filed On</span>
                <span className="font-medium">Dec 20, 2025</span>
              </div>
            </div>
          </Card>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Confirmation PDF
            </Button>
            <Button className="w-full" onClick={() => navigate("/compliance")}>
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
              File PAYE - December 2025
            </h1>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Pre-flight Checklist */}
        <Card glass className="p-6">
          <h2 className="font-semibold mb-4">Pre-flight Checklist</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                checked={checklist.payroll}
                onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, payroll: !!checked }))}
              />
              <div>
                <p className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Payroll run approved
                </p>
                <p className="text-sm text-muted-foreground">December 2025 payroll completed</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                checked={checklist.amount}
                onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, amount: !!checked }))}
              />
              <div>
                <p className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Amount calculated
                </p>
                <p className="text-sm text-muted-foreground">₦450,000 due to FIRS</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                checked={checklist.credentials}
                onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, credentials: !!checked }))}
              />
              <div>
                <p className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  FIRS credentials linked
                </p>
                <p className="text-sm text-muted-foreground">API connection verified</p>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Checkbox 
                  checked={checklist.confirm}
                  onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, confirm: !!checked }))}
                />
                <div>
                  <p className="font-semibold text-primary">I confirm the amount is correct</p>
                  <p className="text-sm text-muted-foreground">
                    The calculated PAYE of ₦450,000 is accurate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Filing Details */}
        <Card glass className="p-6">
          <h2 className="font-semibold mb-4">Filing Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium">Automated (via ComplianceHub)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected Completion</span>
              <span className="font-medium">2-5 minutes</span>
            </div>
          </div>
        </Card>

        {/* Warning */}
        <Card glass className="p-4 border-gold/30 bg-gold/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gold">Important</p>
              <p className="text-sm text-muted-foreground">
                Filing cannot be undone. Please review all details carefully before proceeding.
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Fixed Bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/compliance/${id}`}>Cancel</Link>
          </Button>
          <Button 
            className={`flex-1 ${allChecked ? 'shadow-lg shadow-primary/30' : ''}`}
            disabled={!allChecked || isFiling}
            onClick={handleFile}
          >
            {isFiling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Filing...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                File Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
