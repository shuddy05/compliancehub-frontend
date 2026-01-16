import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Plus,
  Upload,
  Info,
  X,
  FileText,
  User,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";

const employees = [
  { id: 1, name: "Adebayo Johnson", cra: 200000, nhf: 24000, nhis: 12000, pension: 240000, total: 476000 },
  { id: 2, name: "Ngozi Okonkwo", cra: 200000, nhf: 0, nhis: 12000, pension: 172800, total: 384800 },
  { id: 3, name: "Ibrahim Musa", cra: 200000, nhf: 19200, nhis: 0, pension: 192000, total: 411200 },
];

const reliefTypes = [
  { id: "cra", name: "Consolidated Relief Allowance", description: "₦200,000 + 20% of gross income" },
  { id: "nhf", name: "National Housing Fund", description: "2.5% of basic salary" },
  { id: "nhis", name: "National Health Insurance", description: "Up to 1% of gross income" },
  { id: "pension", name: "Pension Contribution", description: "8% of monthly emoluments" },
];

export default function TaxReliefClaims() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedReliefType, setSelectedReliefType] = useState("");
  const [reliefAmount, setReliefAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmployee || !selectedReliefType || !reliefAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsDialogOpen(false);
    
    toast({
      title: "Relief claim submitted",
      description: "The tax relief has been added successfully.",
    });

    // Reset form
    setSelectedEmployee("");
    setSelectedReliefType("");
    setReliefAmount("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/compliance">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">Tax Relief Claims</h1>
              <p className="text-sm text-muted-foreground">Reduce PAYE with valid reliefs</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Explainer */}
        <Card glass className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Reduce PAYE by claiming reliefs</p>
              <p className="text-sm text-muted-foreground">
                Tax reliefs reduce the taxable income of employees, resulting in lower PAYE deductions.
                Ensure you have supporting documents for all claims.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Relief Claim
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tax Relief Claim</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <User className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Relief Type</Label>
                  <Select value={selectedReliefType} onValueChange={setSelectedReliefType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relief type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reliefTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <p>{type.name}</p>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Annual Amount (₦)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 200000"
                    value={reliefAmount}
                    onChange={(e) => setReliefAmount(e.target.value)}
                  />
                  {reliefAmount && (
                    <p className="text-sm text-muted-foreground">
                      Monthly relief: {formatCurrency(parseInt(reliefAmount) / 12)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Supporting Document (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload</p>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        </div>

        {/* Employee Relief Table */}
        <Card glass className="overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-semibold">Employee Relief Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        CRA
                        <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Consolidated Relief Allowance</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        NHF
                        <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>National Housing Fund</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        NHIS
                        <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>National Health Insurance</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">Pension</TableHead>
                  <TableHead className="text-right">Total Relief</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {employee.cra > 0 ? formatCurrency(employee.cra) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {employee.nhf > 0 ? formatCurrency(employee.nhf) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {employee.nhis > 0 ? formatCurrency(employee.nhis) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(employee.pension)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-primary">
                      {formatCurrency(employee.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Relief Types Info */}
        <Card glass className="p-6">
          <h2 className="font-semibold mb-4">Available Relief Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reliefTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-muted/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
