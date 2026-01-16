import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, Download, CreditCard, Shield, User, 
  Calendar, Award, ChevronRight, Sparkles, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

// Mock employee data
const employeeData = {
  name: "Adewale Johnson",
  email: "adewale.johnson@company.com",
  department: "Engineering",
  jobTitle: "Senior Developer",
  avatar: null,
};

const lastPayslip = {
  month: "December 2024",
  grossPay: 530000,
  netPay: 423500,
  paye: 68750,
  pension: 37750,
  date: "2024-12-28",
};

const ytdSummary = {
  totalEarnings: 6360000,
  totalPaye: 825000,
  totalPension: 453000,
};

const documents = [
  { id: 1, name: "Tax Certificate 2024", type: "tax", status: "ready" },
  { id: 2, name: "Pension Statement Q4", type: "pension", status: "ready" },
  { id: 3, name: "Employment Letter", type: "employment", status: "pending" },
];

const EmployeeSelfService = () => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = (doc: typeof documents[0]) => {
    setDownloadingId(doc.id);
    
    // Simulate download with confetti
    setTimeout(() => {
      setDownloadingId(null);
      toast({
        title: "Download Complete",
        description: `${doc.name} has been downloaded.`,
      });
    }, 1500);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {getInitials(employeeData.name)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{employeeData.name}</h1>
              <p className="text-xs text-muted-foreground">{employeeData.jobTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Welcome back, {employeeData.name.split(" ")[0]}!
                </h2>
                <p className="text-muted-foreground">
                  Here's your payroll summary for this year.
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </motion.div>

        {/* Last Payslip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Last Payslip</h3>
              </div>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                Paid
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{lastPayslip.month}</span>
                <span className="text-xs text-muted-foreground">
                  Paid on {new Date(lastPayslip.date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Gross Pay</p>
                  <p className="text-xl font-bold font-mono text-foreground">
                    ₦{lastPayslip.grossPay.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Net Pay</p>
                  <p className="text-xl font-bold font-mono text-primary">
                    ₦{lastPayslip.netPay.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  PAYE: <span className="font-mono">₦{lastPayslip.paye.toLocaleString()}</span>
                </span>
                <span className="text-muted-foreground">
                  Pension: <span className="font-mono">₦{lastPayslip.pension.toLocaleString()}</span>
                </span>
              </div>

              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Payslip
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* YTD Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Year-to-Date Summary</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                <p className="text-sm text-muted-foreground mb-1">Total Earnings (2024)</p>
                <p className="text-3xl font-bold font-mono text-accent">
                  ₦{ytdSummary.totalEarnings.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total PAYE</p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    ₦{ytdSummary.totalPaye.toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">75% of annual projection</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Pension</p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    ₦{ytdSummary.totalPension.toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">75% of annual projection</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Documents</h3>
            </div>

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.type === "tax" ? "bg-blue-500/10 text-blue-500" :
                      doc.type === "pension" ? "bg-emerald-500/10 text-emerald-500" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {doc.type === "tax" && <Shield className="w-5 h-5" />}
                      {doc.type === "pension" && <Award className="w-5 h-5" />}
                      {doc.type === "employment" && <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.status === "ready" ? "Ready to download" : "Pending approval"}
                      </p>
                    </div>
                  </div>
                  
                  {doc.status === "ready" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                    >
                      {downloadingId === doc.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                        />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Profile Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <Link to="/self-service/profile" className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">My Profile</p>
                  <p className="text-xs text-muted-foreground">Update your personal information</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Card>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-dashed">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Coming Soon
              </Badge>
              <span className="text-sm text-muted-foreground">Pro / Enterprise</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Leave Management</h3>
            <p className="text-sm text-muted-foreground">
              Request time off, track your leave balance, and view your leave history.
            </p>
          </Card>
        </motion.div>

        <div className="h-8" />
      </main>
    </div>
  );
};

export default EmployeeSelfService;
