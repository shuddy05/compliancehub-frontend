import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2,
  File,
  Image,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadDocument = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [relatedTo, setRelatedTo] = useState("");
  const [description, setDescription] = useState("");

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
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    if (ext === "pdf") {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleUpload = async () => {
    if (!file || !documentType || !relatedTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setIsUploading(false);
    toast({
      title: "Upload Successful",
      description: "Your document has been uploaded.",
    });
    navigate("/documents");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Upload Document</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Drag and Drop Zone */}
        <motion.div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : file
              ? "border-green-500 bg-green-500/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        >
          {!file ? (
            <>
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              </motion.div>
              <p className="text-lg font-medium mb-2">
                Drag and drop your file here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  />
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Accepted formats: PDF, JPG, PNG, DOC, XLS (max 5MB)
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-4 bg-card rounded-lg"
            >
              <div className="flex items-center gap-4">
                {getFileIcon(file.name)}
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Upload Progress */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </motion.div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type *</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="payslip">Payslip</SelectItem>
                <SelectItem value="receipt">Payment Receipt</SelectItem>
                <SelectItem value="filing">Compliance Filing</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relatedTo">Related To *</Label>
            <Select value={relatedTo} onValueChange={setRelatedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description for this document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Preview (for images/PDFs) */}
        {file && file.type.startsWith("image/") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg overflow-hidden border border-border"
          >
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          </motion.div>
        )}

        {/* Upload Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>Uploading...</>
          ) : uploadProgress === 100 ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Uploaded
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </main>
    </div>
  );
};

export default UploadDocument;
