import { useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  CreditCard,
  X,
  CheckCircle2,
  Loader2,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function UploadReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setIsUploading(false);
    toast({
      title: "File uploaded",
      description: file.name,
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const handleSave = async () => {
    if (!uploadedFile || !paymentDate || !referenceNumber || !paymentMethod) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    
    toast({
      title: "Receipt saved!",
      description: "Payment has been recorded successfully.",
    });
    
    navigate(`/compliance/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/compliance/${id}`}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">
              Upload Receipt - PAYE December
            </h1>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Upload Zone */}
        <Card glass className="p-6">
          {!uploadedFile ? (
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={{ scale: isDragging ? 1.02 : 1 }}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="font-semibold mb-2">
                {isDragging ? "Drop your file here" : "Drag and drop your receipt"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">
                Accepted: PDF, JPG, PNG (max 5MB)
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* File Preview */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                {previewUrl ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute inset-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-6 h-6 text-white" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                  {isUploading && (
                    <div className="mt-2">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {!isUploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>File uploaded successfully</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Payment Details Form */}
        <Card glass className="p-6 space-y-4">
          <h2 className="font-semibold">Payment Details</h2>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Payment Reference Number</Label>
            <Input
              id="reference"
              placeholder="e.g., RRR-123456789"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <CreditCard className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="remita">Remita</SelectItem>
                <SelectItem value="ussd">USSD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSave}
            disabled={!uploadedFile || !paymentDate || !referenceNumber || !paymentMethod || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Receipt"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
