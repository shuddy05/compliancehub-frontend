import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Download,
  Share2,
  Mail,
  MessageCircle,
  Loader2,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";

const payslipData = {
  employee: {
    name: "Adebayo Johnson",
    code: "EMP-001",
    department: "Engineering",
    bankAccount: "•••• 4567",
    bank: "First Bank",
  },
  period: "December 2025",
  paymentDate: "Dec 25, 2025",
  earnings: [
    { label: "Basic Salary", amount: 150000 },
    { label: "Housing Allowance", amount: 50000 },
    { label: "Transport Allowance", amount: 30000 },
    { label: "Performance Bonus", amount: 20000 },
  ],
  deductions: [
    { label: "PAYE Tax", amount: 35000 },
    { label: "Pension (8%)", amount: 20000 },
    { label: "Loan Repayment", amount: 10000 },
  ],
};

export default function PayslipView() {
  const { id } = useParams();
  const [isDownloading, setIsDownloading] = useState(false);

  const totalEarnings = payslipData.earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductions = payslipData.deductions.reduce((sum, d) => sum + d.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
    toast({
      title: "Download Complete",
      description: "Payslip PDF has been downloaded.",
    });
  };

  const handleShare = (method: string) => {
    toast({
      title: `Share via ${method}`,
      description: "Sharing functionality will be implemented.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/payroll">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">
              Payslip - {payslipData.period}
            </h1>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Payslip Document */}
        <Card glass className="overflow-hidden">
          {/* Company Header */}
          <div className="p-6 border-b border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <div>
                  <h2 className="font-display font-bold">TechVentures Ltd</h2>
                  <p className="text-sm text-muted-foreground">RC: 12345678</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Payslip</p>
                <p className="font-semibold">{payslipData.period}</p>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="p-6 border-b border-border/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Employee Name</p>
                <p className="font-medium">{payslipData.employee.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Employee Code</p>
                <p className="font-medium">{payslipData.employee.code}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{payslipData.employee.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Date</p>
                <p className="font-medium">{payslipData.paymentDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bank</p>
                <p className="font-medium">{payslipData.employee.bank}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account</p>
                <p className="font-medium">{payslipData.employee.bankAccount}</p>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="p-6 border-b border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Earnings
            </h3>
            <div className="space-y-2">
              {payslipData.earnings.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono">₦{item.amount.toLocaleString()}</span>
                </motion.div>
              ))}
              <div className="flex justify-between pt-2 border-t border-border/50 font-semibold">
                <span>Gross Salary</span>
                <span className="font-mono">₦{totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-6 border-b border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive"></span>
              Deductions
            </h3>
            <div className="space-y-2">
              {payslipData.deductions.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono text-destructive">-₦{item.amount.toLocaleString()}</span>
                </motion.div>
              ))}
              <div className="flex justify-between pt-2 border-t border-border/50 font-semibold">
                <span>Total Deductions</span>
                <span className="font-mono text-destructive">-₦{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="p-6 bg-primary/5">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Net Pay</span>
              <motion.span 
                className="text-2xl font-bold text-primary font-mono"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                ₦{netPay.toLocaleString()}
              </motion.span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">
              This is a computer-generated document. No signature required.
            </p>
          </div>
        </Card>
      </main>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleShare("Email")}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("WhatsApp")}>
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
