import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Plus, X, Info, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const nigerianBanks = [
  "Access Bank", "First Bank", "GTBank", "UBA", "Zenith Bank",
  "Fidelity Bank", "Stanbic IBTC", "Sterling Bank", "Union Bank", "Wema Bank",
];

const pensionProviders = [
  "ARM Pension", "Leadway Pensure", "Stanbic IBTC Pension", "AIICO Pension",
  "Trustfund Pensions", "Premium Pension", "Sigma Pensions", "NLPC",
];

const departments = [
  "Engineering", "Product", "Design", "Marketing", "Sales",
  "Human Resources", "Finance", "Operations", "Customer Support",
];

interface Allowance {
  id: string;
  type: string;
  amount: string;
  taxable: boolean;
}

// Mock employee data (in real app, fetch by id)
const mockEmployee = {
  firstName: "Adewale",
  lastName: "Johnson",
  middleName: "Oluwaseun",
  email: "adewale.johnson@company.com",
  phone: "+234 801 234 5678",
  dob: "1990-05-15",
  gender: "male",
  employeeCode: "EMP-001",
  department: "engineering",
  jobTitle: "Senior Developer",
  employmentType: "full-time",
  startDate: "2021-03-01",
  grossSalary: "450000",
  paymentMethod: "bank-transfer",
  bankName: "gtbank",
  accountNumber: "0123456789",
  accountName: "ADEWALE JOHNSON",
  taxId: "TIN-12345678",
  pensionPin: "PEN-98765432",
  pensionProvider: "arm pension",
  allowances: [
    { id: "1", type: "housing", amount: "50000", taxable: false },
    { id: "2", type: "transport", amount: "30000", taxable: false },
  ],
};

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    employment: true,
    bank: true,
    tax: true,
    allowances: true,
  });

  const [formData, setFormData] = useState(mockEmployee);
  const [allowances, setAllowances] = useState<Allowance[]>(mockEmployee.allowances);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [changedFields, setChangedFields] = useState<string[]>([]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Track changed fields
    if (!changedFields.includes(field)) {
      setChangedFields((prev) => [...prev, field]);
    }

    // Format salary
    if (field === "grossSalary") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, grossSalary: numericValue }));
    }
  };

  const addAllowance = () => {
    setAllowances((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "", amount: "", taxable: false },
    ]);
  };

  const removeAllowance = (id: string) => {
    setAllowances((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAllowance = (id: string, field: string, value: string | boolean) => {
    setAllowances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const formatSalaryDisplay = (value: string) => {
    if (!value) return "";
    return `₦${parseInt(value).toLocaleString()}`;
  };

  const handleSubmit = () => {
    toast({
      title: "Employee Updated",
      description: `${formData.firstName} ${formData.lastName}'s information has been updated.`,
    });
    navigate(`/employees/${id}`);
  };

  const handleDelete = () => {
    toast({
      title: "Employee Deleted",
      description: `${formData.firstName} ${formData.lastName} has been removed.`,
      variant: "destructive",
    });
    navigate("/employees");
  };

  const isFieldChanged = (field: string) => changedFields.includes(field);

  const SectionHeader = ({
    title,
    section,
    icon,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    icon: React.ReactNode;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-lg"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold text-foreground">{title}</span>
      </div>
      <motion.div
        animate={{ rotate: expandedSections[section] ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </motion.div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Edit Employee</h1>
          <Link to={`/employees/${id}`}>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {/* Audit Log */}
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
          <span>Last updated by John Doe on Dec 15, 2024</span>
        </div>

        {/* Personal Information */}
        <Card className="overflow-hidden">
          <SectionHeader
            title="Personal Information"
            section="personal"
            icon={<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">👤</div>}
          />
          <motion.div
            initial={false}
            animate={{ height: expandedSections.personal ? "auto" : 0, opacity: expandedSections.personal ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={isFieldChanged("firstName") ? "border-primary" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={isFieldChanged("lastName") ? "border-primary" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                  className={isFieldChanged("middleName") ? "border-primary" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={isFieldChanged("email") ? "border-primary" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={isFieldChanged("phone") ? "border-primary" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className={isFieldChanged("dob") ? "border-primary" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="flex gap-2">
                    {["male", "female"].map((g) => (
                      <button
                        key={g}
                        onClick={() => handleInputChange("gender", g)}
                        className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                          formData.gender === g
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Card>

        {/* Employment Details */}
        <Card className="overflow-hidden">
          <SectionHeader
            title="Employment Details"
            section="employment"
            icon={<div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">💼</div>}
          />
          <motion.div
            initial={false}
            animate={{ height: expandedSections.employment ? "auto" : 0, opacity: expandedSections.employment ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeCode">Employee Code</Label>
                <Input
                  id="employeeCode"
                  value={formData.employeeCode}
                  onChange={(e) => handleInputChange("employeeCode", e.target.value)}
                  className={isFieldChanged("employeeCode") ? "border-primary" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(v) => handleInputChange("department", v)}
                  >
                    <SelectTrigger className={isFieldChanged("department") ? "border-primary" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept.toLowerCase()}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    className={isFieldChanged("jobTitle") ? "border-primary" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Employment Type</Label>
                <div className="flex gap-2 flex-wrap">
                  {["full-time", "part-time", "contract"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleInputChange("employmentType", type)}
                      className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                        formData.employmentType === type
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className={isFieldChanged("startDate") ? "border-primary" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grossSalary">Gross Salary (₦) *</Label>
                  <div className="relative">
                    <Input
                      id="grossSalary"
                      value={formData.grossSalary}
                      onChange={(e) => handleInputChange("grossSalary", e.target.value)}
                      className={`font-mono ${isFieldChanged("grossSalary") ? "border-primary" : ""}`}
                    />
                    {formData.grossSalary && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {formatSalaryDisplay(formData.grossSalary)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Card>

        {/* Bank Details */}
        <Card className="overflow-hidden">
          <SectionHeader
            title="Bank Details"
            section="bank"
            icon={<div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">🏦</div>}
          />
          <motion.div
            initial={false}
            animate={{ height: expandedSections.bank ? "auto" : 0, opacity: expandedSections.bank ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Select
                  value={formData.bankName}
                  onValueChange={(v) => handleInputChange("bankName", v)}
                >
                  <SelectTrigger className={isFieldChanged("bankName") ? "border-primary" : ""}>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianBanks.map((bank) => (
                      <SelectItem key={bank} value={bank.toLowerCase()}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  maxLength={10}
                  className={isFieldChanged("accountNumber") ? "border-primary" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
            </div>
          </motion.div>
        </Card>

        {/* Tax & Pension */}
        <Card className="overflow-hidden">
          <SectionHeader
            title="Tax & Pension"
            section="tax"
            icon={<div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">📊</div>}
          />
          <motion.div
            initial={false}
            animate={{ height: expandedSections.tax ? "auto" : 0, opacity: expandedSections.tax ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID (TIN)</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  className={isFieldChanged("taxId") ? "border-primary" : ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pensionPin">Pension PIN</Label>
                  <Input
                    id="pensionPin"
                    value={formData.pensionPin}
                    onChange={(e) => handleInputChange("pensionPin", e.target.value)}
                    className={isFieldChanged("pensionPin") ? "border-primary" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pensionProvider">Pension Provider</Label>
                  <Select
                    value={formData.pensionProvider}
                    onValueChange={(v) => handleInputChange("pensionProvider", v)}
                  >
                    <SelectTrigger className={isFieldChanged("pensionProvider") ? "border-primary" : ""}>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {pensionProviders.map((provider) => (
                        <SelectItem key={provider} value={provider.toLowerCase()}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        </Card>

        {/* Allowances */}
        <Card className="overflow-hidden">
          <SectionHeader
            title="Allowances"
            section="allowances"
            icon={<div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">💰</div>}
          />
          <motion.div
            initial={false}
            animate={{ height: expandedSections.allowances ? "auto" : 0, opacity: expandedSections.allowances ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {allowances.map((allowance, index) => (
                <motion.div
                  key={allowance.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-muted/50 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Allowance {index + 1}</span>
                    <button onClick={() => removeAllowance(allowance.id)}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={allowance.type}
                      onValueChange={(v) => updateAllowance(allowance.id, "type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="meal">Meal</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={allowance.amount}
                      onChange={(e) => updateAllowance(allowance.id, "amount", e.target.value)}
                      placeholder="Amount (₦)"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`taxable-${allowance.id}`}
                      checked={allowance.taxable}
                      onCheckedChange={(v) => updateAllowance(allowance.id, "taxable", !!v)}
                    />
                    <Label htmlFor={`taxable-${allowance.id}`} className="text-sm">
                      Taxable
                    </Label>
                  </div>
                </motion.div>
              ))}

              <Button variant="outline" onClick={addAllowance} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Allowance
              </Button>
            </div>
          </motion.div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button className="flex-1" onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Employee
        </Button>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete Employee
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {formData.firstName} {formData.lastName}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="h-8" />
      </main>
    </div>
  );
};

export default EditEmployee;
