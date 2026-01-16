import { useState } from "react";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { 
  FileText,
  Download,
  Calendar,
  Building2,
  Loader2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  { id: "annual-tax", label: "Annual Tax Summary", icon: FileText, description: "All obligations for the year" },
  { id: "paye-history", label: "PAYE History", icon: Building2, description: "12-month PAYE filings" },
  { id: "pension", label: "Pension Remittance", icon: FileText, description: "Pension contributions report" },
  { id: "vat", label: "VAT Filing History", icon: Building2, description: "VAT submissions and payments" },
  { id: "audit-trail", label: "Compliance Audit Trail", icon: FileText, description: "Complete activity log" },
];

const previewData = [
  { month: "December 2025", paye: 450000, pension: 300000, vat: 125000, status: "Pending" },
  { month: "November 2025", paye: 420000, pension: 280000, vat: 115000, status: "Paid" },
  { month: "October 2025", paye: 410000, pension: 275000, vat: 110000, status: "Paid" },
];

export default function ComplianceReports() {
  const [selectedReport, setSelectedReport] = useState("annual-tax");
  const [year, setYear] = useState("2025");
  const [obligationType, setObligationType] = useState("all");
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
      description: `Compliance report exported as ${format}`,
    });
  };

  return (
    <ModuleLayout title="Compliance Reports" activeTab="compliance">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Compliance Reports</h1>
        <p className="text-muted-foreground">Generate audit-ready reports and compliance documentation</p>
      </div>

      {/* Report Type Selection */}
      <Card className="p-6 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>Obligation Type</Label>
              <Select value={obligationType} onValueChange={setObligationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Obligations</SelectItem>
                  <SelectItem value="paye">PAYE Only</SelectItem>
                  <SelectItem value="vat">VAT Only</SelectItem>
                  <SelectItem value="pension">Pension Only</SelectItem>
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
                <p className="text-sm text-muted-foreground">Annual Tax Summary - 2025</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">PAYE</TableHead>
                      <TableHead className="text-right">Pension</TableHead>
                      <TableHead className="text-right">VAT</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell className="text-right font-mono">₦{row.paye.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">₦{row.pension.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">₦{row.vat.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm ${row.status === "Paid" ? "text-primary" : "text-gold"}`}>
                            {row.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total YTD</span>
                  <span className="font-mono font-semibold">
                    ₦{(previewData.reduce((sum, r) => sum + r.paye + r.pension + r.vat, 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
    </ModuleLayout>
  );
}
