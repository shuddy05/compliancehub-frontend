import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Banknote,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import confetti from "canvas-confetti";

export default function RunPayrollApproval() {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState({
    reviewed: true,
    paymentDate: true,
    funds: false,
    approve: false,
  });

  const allChecked = Object.values(checklist).every(Boolean);

  const handleApprove = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#6366F1'],
    });

    setTimeout(() => {
      navigate("/payroll/run/payment");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/payroll/run/review">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">Approval</h1>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Progress */}
        <ProgressIndicator currentStep={3} totalSteps={4} />

        {/* Summary Card */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Payroll Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Period</span>
              </div>
              <span className="font-medium">December 2025</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Employees</span>
              </div>
              <span className="font-medium">23</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Total Net Pay</span>
              </div>
              <span className="text-xl font-bold text-primary">₦2,450,000</span>
            </div>
          </div>
        </Card>

        {/* Approval Checklist */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold mb-2">Approval Checklist</h2>
          
          <motion.div
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Checkbox 
              checked={checklist.reviewed}
              onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, reviewed: !!checked }))}
            />
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                All calculations reviewed
              </p>
              <p className="text-sm text-muted-foreground">
                Employee breakdown verified
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Checkbox 
              checked={checklist.paymentDate}
              onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, paymentDate: !!checked }))}
            />
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Payment date confirmed
              </p>
              <p className="text-sm text-muted-foreground">
                Dec 25, 2025
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Checkbox 
              checked={checklist.funds}
              onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, funds: !!checked }))}
            />
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                Bank account has sufficient funds
              </p>
              <p className="text-sm text-muted-foreground">
                Ensure ₦2,450,000 is available
              </p>
            </div>
          </motion.div>

          <div className="border-t border-border pt-4 mt-4">
            <motion.div
              className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
              whileTap={{ scale: 0.98 }}
            >
              <Checkbox 
                checked={checklist.approve}
                onCheckedChange={(checked) => setChecklist(prev => ({ ...prev, approve: !!checked }))}
              />
              <div className="flex-1">
                <p className="font-semibold text-primary">
                  I approve this payroll
                </p>
                <p className="text-sm text-muted-foreground">
                  By checking this, you confirm all details are correct
                </p>
              </div>
            </motion.div>
          </div>
        </Card>

        {/* Warning */}
        <Card className="p-4 border-gold/30 bg-gold/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gold">Important</p>
              <p className="text-sm text-muted-foreground">
                Approved payroll cannot be edited. Please review all details carefully before approving.
              </p>
            </div>
          </div>
        </Card>

        {/* Approver Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Approver: <span className="font-medium text-foreground">John Doe (Admin)</span></p>
        </div>
      </main>

      {/* Fixed Bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link to="/payroll/run/review">Back</Link>
          </Button>
          <Button 
            className={`flex-1 transition-all ${allChecked ? 'bg-primary shadow-lg shadow-primary/30' : ''}`}
            disabled={!allChecked}
            onClick={handleApprove}
          >
            Approve Payroll
          </Button>
        </div>
      </div>
    </div>
  );
}
