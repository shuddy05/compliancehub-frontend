import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { PermissionGuard } from "@/components/PermissionGuard";
import { 
  Plus, 
  Calendar, 
  ChevronRight, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText,
  ChevronDown,
  Users,
  Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const payrollRuns = [
  {
    id: 1,
    period: "December 2025",
    status: "paid",
    totalNet: 2450000,
    employees: 23,
    paymentDate: "Dec 25, 2025",
  },
  {
    id: 2,
    period: "November 2025",
    status: "paid",
    totalNet: 2380000,
    employees: 22,
    paymentDate: "Nov 25, 2025",
  },
  {
    id: 3,
    period: "October 2025",
    status: "paid",
    totalNet: 2350000,
    employees: 22,
    paymentDate: "Oct 25, 2025",
  },
  {
    id: 4,
    period: "September 2025",
    status: "approved",
    totalNet: 2300000,
    employees: 21,
    paymentDate: "Sep 25, 2025",
  },
];

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const, icon: FileText },
  approved: { label: "Approved", variant: "default" as const, icon: CheckCircle2 },
  paid: { label: "Paid", variant: "default" as const, icon: CheckCircle2 },
};

export default function PayrollHome() {
  const [year, setYear] = useState("2025");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PermissionGuard permission="payroll:view" fallback={<div className="text-center py-12"><p className="text-muted-foreground">You don't have permission to access Payroll</p></div>}>
      <ModuleLayout title="Payroll" activeTab="payroll">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Payroll Management</h1>
            <p className="text-muted-foreground">Manage and run payroll for your employees</p>
          </div>
          <PermissionGuard permission="payroll:run">
            <Button asChild>
              <Link to="/payroll/run">
                <Plus className="w-4 h-4 mr-2" />
                Run Payroll
              </Link>
            </Button>
          </PermissionGuard>
        </div>

      <div className="space-y-6">
        {/* Year Filter */}
        <div className="flex items-center gap-4">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payroll Runs List */}
        <div className="space-y-3">
          <AnimatePresence>
            {payrollRuns.map((run, index) => {
              const status = statusConfig[run.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              const isExpanded = expandedCard === run.id;

              return (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setExpandedCard(isExpanded ? null : run.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Banknote className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{run.period}</h3>
                            <p className="text-sm text-muted-foreground">
                              Paid on {run.paymentDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Badge 
                              variant={status.variant}
                              className={run.status === "paid" ? "bg-primary/20 text-primary" : ""}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </motion.div>
                          <ChevronDown 
                            className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </div>

                      {/* Summary Row */}
                      <div className="mt-4 flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{run.employees} employees</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {formatCurrency(run.totalNet)}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-border"
                          >
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Total Gross</p>
                                <p className="font-semibold">{formatCurrency(run.totalNet * 1.3)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Deductions</p>
                                <p className="font-semibold">{formatCurrency(run.totalNet * 0.3)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">PAYE</p>
                                <p className="font-semibold">{formatCurrency(run.totalNet * 0.18)}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/payroll/${run.id}`}>
                                  View Details
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-1" />
                                    Export
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>PDF</DropdownMenuItem>
                                  <DropdownMenuItem>Excel</DropdownMenuItem>
                                  <DropdownMenuItem>CSV</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {payrollRuns.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Banknote className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No payroll runs yet</h3>
            <p className="text-muted-foreground mb-4">
              Run your first payroll to get started
            </p>
            <Button asChild>
              <Link to="/payroll/run">
                <Plus className="w-4 h-4 mr-2" />
                Run Payroll
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </ModuleLayout>
    </PermissionGuard>
  );
}

