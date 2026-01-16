import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModuleLayout } from "@/components/ModuleLayout";
import { PermissionGuard } from "@/components/PermissionGuard";
import { Calendar, AlertCircle, CheckCircle, Clock, BarChart3 } from "lucide-react";

const complianceItems = [
  {
    id: 1,
    name: "PAYE Remittance",
    dueDate: "Dec 20, 2024",
    daysLeft: 2,
    status: "urgent",
    amount: "₦485,000",
  },
  {
    id: 2,
    name: "VAT Filing",
    dueDate: "Dec 21, 2024",
    daysLeft: 3,
    status: "warning",
    amount: "₦125,000",
  },
  {
    id: 3,
    name: "WHT Remittance",
    dueDate: "Dec 31, 2024",
    daysLeft: 13,
    status: "safe",
    amount: "₦89,000",
  },
  {
    id: 4,
    name: "Annual Returns",
    dueDate: "Dec 31, 2024",
    daysLeft: 13,
    status: "safe",
    amount: "N/A",
  },
];

export default function ComplianceHome() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<"all" | "urgent" | "warning" | "safe">("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-destructive/10 text-destructive";
      case "warning":
        return "bg-accent/10 text-accent";
      case "safe":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return AlertCircle;
      case "warning":
        return Clock;
      case "safe":
        return CheckCircle;
      default:
        return Calendar;
    }
  };

  const filteredItems =
    filterStatus === "all" ? complianceItems : complianceItems.filter((item) => item.status === filterStatus);

  return (
    <PermissionGuard permission="compliance:view" fallback={<div className="text-center py-12"><p className="text-muted-foreground">You don't have permission to access Compliance</p></div>}>
      <ModuleLayout title="Compliance" activeTab="compliance">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Compliance Management</h1>
        <p className="text-muted-foreground">Track and manage all compliance deadlines and filings</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Button 
          onClick={() => navigate("/compliance/calendar")}
          className="w-full justify-start"
          variant="outline"
        >
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
        <Button 
          onClick={() => navigate("/compliance/reports")}
          className="w-full justify-start"
          variant="outline"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "urgent", "warning", "safe"].map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterStatus(filter as any)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === filter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Compliance Items Grid */}
      <div className="grid gap-4">
        {filteredItems.map((item, index) => {
          const StatusIcon = getStatusIcon(item.status);
          return (
            <motion.div
              key={item.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${getStatusColor(item.status)}`}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{item.amount}</p>
                      <p className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.daysLeft}d left
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/compliance/view/${item.id}`)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
                    >
                      View Details
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </ModuleLayout>
    </PermissionGuard>
  );
}
