import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Upload, Download, FileSpreadsheet, Check, AlertTriangle, X,
  ChevronRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Mock preview data
const mockPreviewData = [
  { id: 1, firstName: "Adewale", lastName: "Johnson", email: "adewale@company.com", department: "Engineering", salary: "450000", status: "valid" },
  { id: 2, firstName: "Chioma", lastName: "Okafor", email: "chioma@company.com", department: "Product", salary: "520000", status: "valid" },
  { id: 3, firstName: "Emeka", lastName: "", email: "emeka@company.com", department: "Design", salary: "380000", status: "error", errorMessage: "Last name is required" },
  { id: 4, firstName: "Fatima", lastName: "Bello", email: "fatima", department: "Marketing", salary: "400000", status: "warning", errorMessage: "Invalid email format" },
  { id: 5, firstName: "Gbenga", lastName: "Adeyemi", email: "gbenga@company.com", department: "Engineering", salary: "480000", status: "valid" },
];

const BulkImportEmployees = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"upload" | "preview" | "importing">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState(mockPreviewData);
  const [isValidating, setIsValidating] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const validCount = previewData.filter(d => d.status === "valid").length;
  const warningCount = previewData.filter(d => d.status === "warning").length;
  const errorCount = previewData.filter(d => d.status === "error").length;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      processFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive",
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setIsValidating(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsValidating(false);
      setStep("preview");
    }, 2000);
  };

  const downloadTemplate = () => {
    // In real app, download actual template
    toast({
      title: "Template Downloaded",
      description: "Employee import template has been downloaded.",
    });
  };

  const handleImport = () => {
    if (errorCount > 0) {
      toast({
        title: "Fix errors first",
        description: "Please fix all errors before importing.",
        variant: "destructive",
      });
      return;
    }

    setStep("importing");
    
    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        toast({
          title: "Import Complete",
          description: `${validCount + warningCount} employees have been imported.`,
        });
        navigate("/employees");
      }
    }, 300);
  };

  const fixError = (id: number) => {
    // In real app, open inline editor
    setPreviewData(prev => 
      prev.map(row => row.id === id ? { ...row, status: "valid", errorMessage: undefined } : row)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/employees" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </Link>
            <h1 className="text-xl font-bold text-foreground">Import Employees</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { key: "upload", label: "Upload File", icon: Upload },
            { key: "preview", label: "Preview & Fix", icon: FileSpreadsheet },
            { key: "importing", label: "Import", icon: Check },
          ].map((s, index) => (
            <div key={s.key} className="flex items-center gap-2">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === s.key || (step === "preview" && index < 1) || (step === "importing" && index < 2)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                animate={{
                  scale: step === s.key ? 1.1 : 1,
                }}
              >
                <s.icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-sm font-medium hidden sm:block ${
                step === s.key ? "text-foreground" : "text-muted-foreground"
              }`}>
                {s.label}
              </span>
              {index < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Download Template */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Step 1: Download Template</h3>
                    <p className="text-sm text-muted-foreground">
                      Use our template to ensure your data is formatted correctly.
                    </p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </Card>

              {/* Upload Zone */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Step 2: Upload File</h3>
                
                <motion.div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  animate={{
                    scale: isDragging ? 1.02 : 1,
                  }}
                >
                  {isValidating ? (
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-12 h-12 text-primary" />
                      </motion.div>
                      <p className="text-foreground font-medium">Validating file...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-foreground font-medium mb-2">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supports CSV, XLS, and XLSX files
                      </p>
                      <div className="relative inline-block">
                        <Input
                          type="file"
                          accept=".csv,.xls,.xlsx"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline">
                          Browse Files
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Preview */}
          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Validation Summary */}
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <Check className="w-3 h-3 mr-1" />
                  Valid ({validCount})
                </Badge>
                {warningCount > 0 && (
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Warnings ({warningCount})
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                    <X className="w-3 h-3 mr-1" />
                    Errors ({errorCount})
                  </Badge>
                )}
              </div>

              {/* Preview Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`${
                            row.status === "error" ? "bg-destructive/5" : 
                            row.status === "warning" ? "bg-amber-500/5" : ""
                          }`}
                        >
                          <TableCell>
                            {row.status === "valid" && (
                              <Check className="w-4 h-4 text-emerald-500" />
                            )}
                            {row.status === "warning" && (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                            {row.status === "error" && (
                              <X className="w-4 h-4 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell className={!row.firstName ? "text-destructive" : ""}>
                            {row.firstName || "—"}
                          </TableCell>
                          <TableCell className={!row.lastName ? "text-destructive" : ""}>
                            {row.lastName || "—"}
                          </TableCell>
                          <TableCell className={row.status === "warning" ? "text-amber-500" : ""}>
                            {row.email}
                          </TableCell>
                          <TableCell>{row.department}</TableCell>
                          <TableCell className="font-mono">₦{parseInt(row.salary).toLocaleString()}</TableCell>
                          <TableCell>
                            {row.status !== "valid" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fixError(row.id)}
                                className="text-xs"
                              >
                                Fix
                              </Button>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Error Details */}
              {previewData.filter(d => d.status !== "valid").length > 0 && (
                <Card className="p-4">
                  <h4 className="font-semibold text-foreground mb-3">Issues to Fix</h4>
                  <div className="space-y-2">
                    {previewData
                      .filter(d => d.status !== "valid")
                      .map((row) => (
                        <div
                          key={row.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            row.status === "error" ? "bg-destructive/5" : "bg-amber-500/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {row.status === "error" ? (
                              <X className="w-4 h-4 text-destructive" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                            <span className="text-foreground">{row.firstName} {row.lastName}</span>
                            <span className="text-sm text-muted-foreground">— {row.errorMessage}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => fixError(row.id)}>
                            Fix
                          </Button>
                        </div>
                      ))}
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("upload")} className="flex-1">
                  Upload Different File
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={errorCount > 0}
                  className="flex-1"
                >
                  Import {validCount + warningCount} Employees
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Importing */}
          {step === "importing" && (
            <motion.div
              key="importing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FileSpreadsheet className="w-12 h-12 text-primary" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">Importing Employees</h2>
              <p className="text-muted-foreground mb-8">Please wait while we process your data...</p>
              
              <div className="w-full max-w-md">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${importProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {importProgress}% complete
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BulkImportEmployees;
