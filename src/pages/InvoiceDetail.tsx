import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Mail,
  Building2,
  CreditCard,
  Calendar,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock invoice data
const mockInvoice = {
  id: "INV-20251218-001",
  date: "December 18, 2025",
  dueDate: "December 18, 2025",
  status: "Paid",
  plan: "Pro",
  period: "Monthly",
  amount: "₦15,000",
  paymentMethod: "Visa •••• 4242",
  paymentDate: "December 18, 2025",
  company: {
    name: "TechCorp Nigeria Ltd",
    address: "123 Victoria Island, Lagos",
    email: "accounts@techcorp.ng",
  },
};

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Downloading PDF",
      description: "Your invoice is being prepared for download.",
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `Invoice ${mockInvoice.id}.pdf has been downloaded.`,
      });
    }, 1500);
  };

  const handleEmailReceipt = () => {
    toast({
      title: "Receipt Sent",
      description: `A copy has been sent to ${mockInvoice.company.email}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Invoice - December 2025</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleEmailReceipt}>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Invoice Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-mono font-medium">{mockInvoice.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Issued on {mockInvoice.date}
                </p>
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {mockInvoice.status}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Invoice Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Billed To</p>
                    <p className="font-medium">{mockInvoice.company.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mockInvoice.company.address}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">{mockInvoice.paymentDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{mockInvoice.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div>
              <h3 className="font-semibold mb-4">Invoice Items</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      ComplianceHub {mockInvoice.plan} Plan ({mockInvoice.period})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      December 18, 2025 - January 17, 2026
                    </p>
                  </div>
                  <p className="font-medium">{mockInvoice.amount}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{mockInvoice.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT (0%)</span>
                <span>₦0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{mockInvoice.amount}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-muted/30 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              This is a computer-generated invoice. For questions, contact{" "}
              <a href="mailto:billing@compliancehub.ng" className="text-primary hover:underline">
                billing@compliancehub.ng
              </a>
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Button className="flex-1" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleEmailReceipt}>
            <Mail className="h-4 w-4 mr-2" />
            Email Receipt
          </Button>
        </div>

        {/* Need Receipt Link */}
        <div className="text-center mt-6">
          <Button variant="link" onClick={handleEmailReceipt}>
            Need a receipt? Click here to email a copy.
          </Button>
        </div>
      </main>
    </div>
  );
};

export default InvoiceDetail;
