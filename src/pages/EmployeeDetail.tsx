import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  Pencil, FileText, UserMinus, ChevronRight, Download,
  User, Briefcase, CreditCard, FileCheck, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";

// Mock employee data
const mockEmployee = {
  id: 1,
  firstName: "Adewale",
  lastName: "Johnson",
  middleName: "Oluwaseun",
  email: "adewale.johnson@company.com",
  phone: "+234 801 234 5678",
  dob: "1990-05-15",
  gender: "Male",
  employeeCode: "EMP-001",
  department: "Engineering",
  jobTitle: "Senior Developer",
  employmentType: "Full-time",
  startDate: "2021-03-01",
  grossSalary: 450000,
  paymentMethod: "Bank Transfer",
  bankName: "GTBank",
  accountNumber: "0123456789",
  accountName: "ADEWALE JOHNSON",
  taxId: "TIN-12345678",
  pensionPin: "PEN-98765432",
  pensionProvider: "ARM Pension",
  status: "active",
  allowances: [
    { type: "Housing", amount: 50000, taxable: false },
    { type: "Transport", amount: 30000, taxable: false },
  ],
};

const payrollHistory = [
  { id: 1, month: "December 2024", grossPay: 530000, netPay: 423500, status: "paid", date: "2024-12-28" },
  { id: 2, month: "November 2024", grossPay: 530000, netPay: 423500, status: "paid", date: "2024-11-28" },
  { id: 3, month: "October 2024", grossPay: 530000, netPay: 423500, status: "paid", date: "2024-10-28" },
  { id: 4, month: "September 2024", grossPay: 530000, netPay: 423500, status: "paid", date: "2024-09-28" },
];

const documents = [
  { id: 1, name: "Employment Contract", type: "PDF", uploadDate: "2021-03-01" },
  { id: 2, name: "ID Card Copy", type: "PDF", uploadDate: "2021-03-01" },
  { id: 3, name: "Tax Certificate 2023", type: "PDF", uploadDate: "2024-01-15" },
];

const EmployeeDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const employee = mockEmployee; // In real app, fetch by id

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-3 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/employees" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </Link>
            <h1 className="text-xl font-bold text-foreground">{employee.firstName} {employee.lastName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link to={`/employees/${id}/edit`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {getInitials(employee.firstName, employee.lastName)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    {employee.firstName} {employee.middleName} {employee.lastName}
                  </h2>
                  <Badge
                    variant={employee.status === "active" ? "default" : "secondary"}
                    className={employee.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}
                  >
                    {employee.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{employee.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{employee.department}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                <FileText className="w-5 h-5" />
                <span className="text-xs">View Payslips</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3" asChild>
                <Link to={`/employees/${id}/edit`}>
                  <Pencil className="w-5 h-5" />
                  <span className="text-xs">Edit</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3 text-destructive hover:text-destructive">
                <UserMinus className="w-5 h-5" />
                <span className="text-xs">Deactivate</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="tax">Tax & Pension</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Personal Information */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Personal Information</h3>
                </div>
                <InfoRow label="Email" value={employee.email} />
                <InfoRow label="Phone" value={employee.phone} />
                <InfoRow label="Date of Birth" value={new Date(employee.dob).toLocaleDateString()} />
                <InfoRow label="Gender" value={employee.gender} />
              </Card>
            </motion.div>

            {/* Employment Details */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">Employment Details</h3>
                </div>
                <InfoRow label="Employee Code" value={employee.employeeCode} />
                <InfoRow label="Department" value={employee.department} />
                <InfoRow label="Job Title" value={employee.jobTitle} />
                <InfoRow label="Employment Type" value={employee.employmentType} />
                <InfoRow label="Start Date" value={new Date(employee.startDate).toLocaleDateString()} />
                <InfoRow label="Gross Salary" value={`₦${employee.grossSalary.toLocaleString()}`} />
              </Card>
            </motion.div>

            {/* Bank Details */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-foreground">Bank Details</h3>
                </div>
                <InfoRow label="Bank Name" value={employee.bankName} />
                <InfoRow label="Account Number" value={employee.accountNumber} />
                <InfoRow label="Account Name" value={employee.accountName} />
                <InfoRow label="Payment Method" value={employee.paymentMethod} />
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="payroll" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Payroll History</h3>
              </div>
              <div className="space-y-3">
                {payrollHistory.map((payroll, index) => (
                  <motion.div
                    key={payroll.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-foreground">{payroll.month}</p>
                      <p className="text-sm text-muted-foreground">
                        Paid on {new Date(payroll.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono font-medium text-foreground">₦{payroll.netPay.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Net Pay</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tax" className="mt-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">Tax Information</h3>
              </div>
              <InfoRow label="Tax ID (TIN)" value={employee.taxId || "Not provided"} />
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">YTD Tax Summary</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">₦1,272,000</p>
                    <p className="text-xs text-muted-foreground">Total PAYE</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">₦424,000</p>
                    <p className="text-xs text-muted-foreground">Total Pension</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-foreground">Pension Information</h3>
              </div>
              <InfoRow label="Pension PIN" value={employee.pensionPin || "Not provided"} />
              <InfoRow label="Pension Provider" value={employee.pensionProvider || "Not provided"} />
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Documents</h3>
                </div>
                <Button variant="outline" size="sm">
                  Upload
                </Button>
              </div>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EmployeeDetail;
