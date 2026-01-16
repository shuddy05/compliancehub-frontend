import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  ChevronDown,
  Edit2,
  Banknote,
  Receipt,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const payrollData = {
  totalGross: 3200000,
  totalDeductions: 750000,
  totalNet: 2450000,
  payeDue: 450000,
  pensionDue: 300000,
  employees: [
    { id: 1, name: "Adebayo Johnson", gross: 250000, paye: 35000, pension: 20000, deductions: 5000, net: 190000 },
    { id: 2, name: "Ngozi Okonkwo", gross: 180000, paye: 22000, pension: 14400, deductions: 0, net: 143600 },
    { id: 3, name: "Ibrahim Musa", gross: 200000, paye: 26000, pension: 16000, deductions: 10000, net: 148000 },
    { id: 4, name: "Fatima Ahmed", gross: 150000, paye: 15000, pension: 12000, deductions: 0, net: 123000 },
    { id: 5, name: "Chidi Eze", gross: 220000, paye: 30000, pension: 17600, deductions: 0, net: 172400 },
  ],
};

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono"
    >
      {prefix}{value.toLocaleString()}
    </motion.span>
  );
}

export default function RunPayrollReview() {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleApprove = () => {
    navigate("/payroll/run/approval");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/payroll/run">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">Review Calculations</h1>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6 pb-24">
        {/* Progress */}
        <ProgressIndicator currentStep={2} totalSteps={4} />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Gross</span>
            </div>
            <p className="text-xl font-bold">
              <AnimatedNumber value={payrollData.totalGross} prefix="₦" />
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Deductions</span>
            </div>
            <p className="text-xl font-bold text-destructive">
              <AnimatedNumber value={payrollData.totalDeductions} prefix="-₦" />
            </p>
          </Card>

          <Card className="p-4 col-span-2 md:col-span-1 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Total Net Pay</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              <AnimatedNumber value={payrollData.totalNet} prefix="₦" />
            </p>
          </Card>
        </div>

        {/* Tax & Pension Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-foreground">PAYE Due</span>
            </div>
            <p className="text-lg font-semibold">
              <AnimatedNumber value={payrollData.payeDue} prefix="₦" />
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-foreground">Pension Due</span>
            </div>
            <p className="text-lg font-semibold">
              <AnimatedNumber value={payrollData.pensionDue} prefix="₦" />
            </p>
          </Card>
        </div>

        {/* Employee Breakdown Table */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Employee Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">PAYE</TableHead>
                  <TableHead className="text-right">Pension</TableHead>
                  <TableHead className="text-right">Other</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.employees.map((employee) => (
                  <>
                    <TableRow 
                      key={employee.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedRow(expandedRow === employee.id ? null : employee.id)}
                    >
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="text-right font-mono">₦{employee.gross.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-destructive">₦{employee.paye.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-destructive">₦{employee.pension.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-destructive">₦{employee.deductions.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-primary">₦{employee.net.toLocaleString()}</TableCell>
                      <TableCell>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedRow === employee.id ? 'rotate-180' : ''}`} />
                      </TableCell>
                    </TableRow>
                    <AnimatePresence>
                      {expandedRow === employee.id && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="py-4 px-2 bg-muted/30 rounded-lg"
                            >
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Basic Salary</p>
                                  <p className="font-mono">₦{(employee.gross * 0.6).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Housing</p>
                                  <p className="font-mono">₦{(employee.gross * 0.25).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Transport</p>
                                  <p className="font-mono">₦{(employee.gross * 0.15).toLocaleString()}</p>
                                </div>
                                <div>
                                  <Button variant="outline" size="sm">
                                    <Edit2 className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      {/* Fixed Bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link to="/payroll/run">Back</Link>
          </Button>
          <Button className="flex-1" onClick={handleApprove}>
            Approve & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
