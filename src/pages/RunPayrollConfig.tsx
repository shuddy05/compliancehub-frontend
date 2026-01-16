import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Calendar, 
  Users, 
  Plus,
  Trash2,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const employees = [
  { id: 1, name: "Adebayo Johnson", department: "Engineering", salary: 250000 },
  { id: 2, name: "Ngozi Okonkwo", department: "Marketing", salary: 180000 },
  { id: 3, name: "Ibrahim Musa", department: "Sales", salary: 200000 },
  { id: 4, name: "Fatima Ahmed", department: "Operations", salary: 150000 },
  { id: 5, name: "Chidi Eze", department: "Finance", salary: 220000 },
];

export default function RunPayrollConfig() {
  const navigate = useNavigate();
  const [payrollPeriod, setPayrollPeriod] = useState("2025-12");
  const [paymentDate, setPaymentDate] = useState("2025-12-25");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>(employees.map(e => e.id));
  const [bonuses, setBonuses] = useState<Array<{ employeeId: number; amount: string; reason: string }>>([]);
  const [deductions, setDeductions] = useState<Array<{ employeeId: number; amount: string; reason: string }>>([]);
  const [bonusesOpen, setBonusesOpen] = useState(false);
  const [deductionsOpen, setDeductionsOpen] = useState(false);

  const toggleEmployee = (id: number) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const addBonus = () => {
    setBonuses([...bonuses, { employeeId: employees[0].id, amount: "", reason: "" }]);
    setBonusesOpen(true);
  };

  const addDeduction = () => {
    setDeductions([...deductions, { employeeId: employees[0].id, amount: "", reason: "" }]);
    setDeductionsOpen(true);
  };

  const removeBonus = (index: number) => {
    setBonuses(bonuses.filter((_, i) => i !== index));
  };

  const removeDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const handleCalculate = () => {
    navigate("/payroll/run/review");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-display font-bold text-foreground">Run Payroll</h1>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/payroll">
              <X className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Progress */}
        <ProgressIndicator currentStep={1} totalSteps={4} />

        {/* Period Selection */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Payroll Period</h2>
              <p className="text-sm text-muted-foreground">Select the month and payment date</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Payroll Period</Label>
              <Input
                id="period"
                type="month"
                value={payrollPeriod}
                onChange={(e) => setPayrollPeriod(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Employee Selection */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Include Employees</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedEmployees.length} of {employees.length} selected
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEmployees(
                selectedEmployees.length === employees.length ? [] : employees.map(e => e.id)
              )}
            >
              {selectedEmployees.length === employees.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {employees.map((employee) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={() => toggleEmployee(employee.id)}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.department}</p>
                </div>
                <p className="text-sm font-mono">
                  ₦{employee.salary.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Bonuses */}
        <Collapsible open={bonusesOpen} onOpenChange={setBonusesOpen}>
          <Card className="p-6">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Bonuses</h2>
                    <p className="text-sm text-muted-foreground">
                      {bonuses.length} bonus{bonuses.length !== 1 ? "es" : ""} added
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${bonusesOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AnimatePresence>
                {bonuses.map((bonus, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Bonus {index + 1}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeBonus(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <Select
                      value={bonus.employeeId.toString()}
                      onValueChange={(v) => {
                        const updated = [...bonuses];
                        updated[index].employeeId = parseInt(v);
                        setBonuses(updated);
                      }}
                    >
                      <SelectTrigger>
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
                    <Input
                      placeholder="Amount (₦)"
                      value={bonus.amount}
                      onChange={(e) => {
                        const updated = [...bonuses];
                        updated[index].amount = e.target.value;
                        setBonuses(updated);
                      }}
                    />
                    <Input
                      placeholder="Reason"
                      value={bonus.reason}
                      onChange={(e) => {
                        const updated = [...bonuses];
                        updated[index].reason = e.target.value;
                        setBonuses(updated);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full mt-4" onClick={addBonus}>
                <Plus className="w-4 h-4 mr-2" />
                Add Bonus
              </Button>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Deductions */}
        <Collapsible open={deductionsOpen} onOpenChange={setDeductionsOpen}>
          <Card className="p-6">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Deductions</h2>
                    <p className="text-sm text-muted-foreground">
                      {deductions.length} deduction{deductions.length !== 1 ? "s" : ""} added
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${deductionsOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AnimatePresence>
                {deductions.map((deduction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Deduction {index + 1}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeDeduction(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <Select
                      value={deduction.employeeId.toString()}
                      onValueChange={(v) => {
                        const updated = [...deductions];
                        updated[index].employeeId = parseInt(v);
                        setDeductions(updated);
                      }}
                    >
                      <SelectTrigger>
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
                    <Input
                      placeholder="Amount (₦)"
                      value={deduction.amount}
                      onChange={(e) => {
                        const updated = [...deductions];
                        updated[index].amount = e.target.value;
                        setDeductions(updated);
                      }}
                    />
                    <Input
                      placeholder="Reason"
                      value={deduction.reason}
                      onChange={(e) => {
                        const updated = [...deductions];
                        updated[index].reason = e.target.value;
                        setDeductions(updated);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full mt-4" onClick={addDeduction}>
                <Plus className="w-4 h-4 mr-2" />
                Add Deduction
              </Button>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border\">
        <div className="max-w-2xl mx-auto">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleCalculate}
            disabled={selectedEmployees.length === 0}
          >
            Calculate Payroll
          </Button>
        </div>
      </div>
    </div>
  );
}
