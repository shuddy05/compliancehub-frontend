import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Calendar,
  Building2,
  Banknote,
  Clock,
  FileText,
  Upload,
  Download,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const obligationData = {
  id: 1,
  name: "PAYE",
  period: "December 2025",
  status: "pending",
  agency: "FIRS",
  dueDate: "Jan 10, 2026",
  amount: 450000,
  calculatedOn: "Dec 18, 2025",
  daysRemaining: 22,
  documents: [
    { id: 1, name: "Filing Schedule.pdf", type: "schedule" },
  ],
  history: [
    { period: "November 2025", status: "paid", amount: 420000 },
    { period: "October 2025", status: "paid", amount: 410000 },
    { period: "September 2025", status: "paid", amount: 400000 },
  ],
};

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, color: "text-gold" },
  calculated: { label: "Calculated", variant: "secondary" as const, color: "text-primary" },
  filed: { label: "Filed", variant: "default" as const, color: "text-primary" },
  paid: { label: "Paid", variant: "default" as const, color: "text-primary" },
  overdue: { label: "Overdue", variant: "destructive" as const, color: "text-destructive" },
};

export default function ObligationDetail() {
  const { id } = useParams();
  const status = statusConfig[obligationData.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/compliance">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {obligationData.name} - {obligationData.period}
              </h1>
            </div>
          </div>
          <Badge variant={status.variant} className="text-sm">
            {status.label}
          </Badge>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        {/* Details Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Calculated</span>
              </div>
              <span className="font-medium">{obligationData.calculatedOn}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Due Date</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{obligationData.dueDate}</span>
                <Badge variant="secondary" className="ml-2">
                  {obligationData.daysRemaining} days
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Period</span>
              </div>
              <span className="font-medium">December 1-31, 2025</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Banknote className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Amount Due</span>
              </div>
              <motion.span 
                className="text-2xl font-bold text-primary font-mono"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                ₦{obligationData.amount.toLocaleString()}
              </motion.span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Calculated On</span>
              </div>
              <span className="font-medium">{obligationData.calculatedOn}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            {obligationData.status === "pending" && (
              <Button className="w-full" asChild>
                <Link to={`/compliance/${id}/file`}>
                  <FileText className="w-4 h-4 mr-2" />
                  File Now
                </Link>
              </Button>
            )}
            {obligationData.status === "pending" && (
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/compliance/${id}/manual`}>
                  Mark as Filed Manually
                </Link>
              </Button>
            )}
            {obligationData.status === "filed" && (
              <Button className="w-full" asChild>
                <Link to={`/compliance/${id}/receipt`}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Payment Receipt
                </Link>
              </Button>
            )}
            {obligationData.status === "paid" && (
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
            )}
          </div>
        </Card>

        {/* Related Documents */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Related Documents</h2>
          <div className="space-y-2">
            {obligationData.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span>{doc.name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </Card>

        {/* Filing History */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Filing History</h2>
          <div className="space-y-3">
            {obligationData.history.map((item, index) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{item.period}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono">₦{item.amount.toLocaleString()}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
