import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  CreditCard,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

export default function RunPayrollPayment() {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMarkedPaid, setIsMarkedPaid] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
    toast({
      title: "Download Complete",
      description: "Payment schedule has been downloaded.",
    });
  };

  const handleMarkPaid = () => {
    setIsMarkedPaid(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#6366F1'],
    });
    toast({
      title: "Payroll Complete! 🎉",
      description: "December 2025 payroll has been marked as paid.",
    });
  };

  const handleDone = () => {
    navigate("/payroll");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/payroll/run/approval">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">Payment Processing</h1>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Progress */}
        <ProgressIndicator currentStep={4} totalSteps={4} />

        {/* Success State */}
        {isMarkedPaid ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-display font-bold mb-2">Payroll Complete!</h2>
            <p className="text-muted-foreground mb-6">
              December 2025 payroll has been successfully processed.
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Employees paid:</span> <span className="font-medium">23</span></p>
              <p><span className="text-muted-foreground">Total disbursed:</span> <span className="font-medium">₦2,450,000</span></p>
            </div>
            <Button className="mt-8" onClick={handleDone}>
              Done
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Option A: Manual Payment */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Option A: Manual Payment</h2>
                  <p className="text-sm text-muted-foreground">Process payments through your bank</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Instructions:</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Download the payment schedule below</li>
                    <li>Log into your bank's online portal</li>
                    <li>Process bulk payments using the schedule</li>
                    <li>Return here and mark as paid</li>
                  </ol>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download Payment Schedule
                </Button>

                <Button 
                  className="w-full"
                  onClick={handleMarkPaid}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Paid
                </Button>
              </div>
            </Card>

            {/* Option B: Auto Payment (Future) */}
            <Card className="p-6 opacity-60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-semibold">Option B: Automatic Payment</h2>
                  <p className="text-sm text-muted-foreground">Coming soon for Enterprise users</p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Connect your bank account to automatically process payments. 
                  This feature will be available soon for Enterprise plan subscribers.
                </p>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                disabled
              >
                Connect Bank Account
              </Button>
            </Card>

            {/* Info Note */}
            <p className="text-center text-sm text-muted-foreground">
              We don't handle payments directly — you stay in control
            </p>
          </>
        )}
      </main>
    </div>
  );
}
