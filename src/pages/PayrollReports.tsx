import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Users,
  Building2,
  Loader2,
  Save,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";

const reportTypes = [
  { id: "summary", label: "Payroll Summary", icon: FileText, description: "Monthly payroll overview" },
  { id: "earnings", label: "Employee-wise Earnings", icon: Users, description: "Detailed earnings by employee" },
  { id: "tax", label: "Tax Summary (PAYE)", icon: Building2, description: "PAYE breakdown by period" },
  { id: "pension", label: "Pension Summary", icon: Building2, description: "Pension contributions report" },
  { id: "deductions", label: "Deductions Report", icon: FileText, description: "All deductions breakdown" },
];

const savedTemplates = [
  { id: 1, name: "Monthly PAYE Report" },
  { id: 2, name: "Q4 2025 Summary" },
];

const previewData = [
  { name: "Adebayo Johnson", gross: 250000, paye: 35000, pension: 20000, net: 195000 },
  { name: "Ngozi Okonkwo", gross: 180000, paye: 22000, pension: 14400, net: 143600 },
  { name: "Ibrahim Musa", gross: 200000, paye: 26000, pension: 16000, net: 158000 },
];

export default function PayrollReports() {
  const [selectedReport, setSelectedReport] = useState("summary");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handlePreview = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowPreview(true);
    setIsLoading(false);
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    toast({
      title: "Export Complete",
      description: `Report exported as ${format}`,
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Report template has been saved for quick access.",
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
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">Payroll Reports</h1>
              <p className="text-sm text-muted-foreground">Generate custom reports</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Saved Templates */}
        {savedTemplates.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {savedTemplates.map((template) => (
              <Badge
                key={template.id}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap"
              >
                {template.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Report Type Selection */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Select Report Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isSelected = selectedReport === report.id;
              return (
                <motion.div
                  key={report.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.label}</p>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={handlePreview}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              Preview
            </Button>
            <Button variant="outline" onClick={handleSaveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("PDF")}>
                  PDF (Formatted)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("Excel")}>
                  Excel (Detailed)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("CSV")}>
                  CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Preview Table */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Report Preview</h2>
                <p className="text-sm text-muted-foreground">Showing first 10 rows</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">PAYE</TableHead>
                      <TableHead className="text-right">Pension</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-right font-mono">₦{row.gross.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-destructive">₦{row.paye.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono text-destructive">₦{row.pension.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono font-semibold text-primary">₦{row.net.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
