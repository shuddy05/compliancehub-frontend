import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModuleLayout } from "@/components/ModuleLayout";
import {
  Search,
  ChevronRight,
  Building2,
  Users,
  Calendar,
  CreditCard,
  MoreHorizontal,
  Plus,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  subscriptionPlan: "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  expiryDate: string;
}

const companies: Company[] = [
  {
    id: "1",
    name: "Acme Technologies",
    industry: "Technology",
    employees: 45,
    subscriptionPlan: "professional",
    status: "active",
    joinDate: "Jan 15, 2024",
    expiryDate: "Jan 14, 2025",
  },
  {
    id: "2",
    name: "TechVision Inc",
    industry: "Software Development",
    employees: 120,
    subscriptionPlan: "enterprise",
    status: "active",
    joinDate: "Mar 10, 2023",
    expiryDate: "Mar 9, 2025",
  },
  {
    id: "3",
    name: "Digital Solutions Ltd",
    industry: "Consulting",
    employees: 28,
    subscriptionPlan: "starter",
    status: "active",
    joinDate: "Jun 20, 2024",
    expiryDate: "Jun 19, 2025",
  },
  {
    id: "4",
    name: "Enterprise Corp",
    industry: "Manufacturing",
    employees: 250,
    subscriptionPlan: "enterprise",
    status: "active",
    joinDate: "Dec 1, 2023",
    expiryDate: "Dec 1, 2025",
  },
  {
    id: "5",
    name: "Startup Ventures",
    industry: "FinTech",
    employees: 12,
    subscriptionPlan: "starter",
    status: "inactive",
    joinDate: "Aug 15, 2024",
    expiryDate: "Aug 14, 2025",
  },
];

const getPlanColor = (plan: string) => {
  switch (plan) {
    case "starter":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "professional":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "enterprise":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    default:
      return "";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-600";
    case "inactive":
      return "bg-gray-500/10 text-gray-600";
    case "suspended":
      return "bg-red-500/10 text-red-600";
    default:
      return "";
  }
};

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "all" || company.subscriptionPlan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  return (
    <ModuleLayout title="Company Management" activeTab="companies">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Company Management</h1>
            <p className="text-muted-foreground">Manage all registered companies and their subscriptions</p>
          </div>
          <Button 
            onClick={() => navigate("/companies/add")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "starter", "professional", "enterprise"].map((plan) => (
              <Button
                key={plan}
                variant={filterPlan === plan ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPlan(plan)}
                className="capitalize"
              >
                {plan}
              </Button>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="space-y-3">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/companies/${company.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Company Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                            <p className="text-sm text-muted-foreground">{company.industry}</p>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Employees</p>
                            <p className="font-semibold flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {company.employees}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Plan</p>
                            <Badge variant="outline" className={getPlanColor(company.subscriptionPlan)}>
                              {company.subscriptionPlan}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Join Date</p>
                            <p className="font-semibold text-sm flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {company.joinDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Expiry</p>
                            <p className="font-semibold text-sm text-amber-600">{company.expiryDate}</p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(company.status)}>
                            {company.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                        </button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No companies found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Total Companies</p>
                <p className="text-3xl font-bold">{companies.length}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Active Companies</p>
                <p className="text-3xl font-bold text-green-600">
                  {companies.filter((c) => c.status === "active").length}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Total Employees</p>
                <p className="text-3xl font-bold">
                  {companies.reduce((sum, c) => sum + c.employees, 0)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Enterprise Plans</p>
                <p className="text-3xl font-bold text-amber-600">
                  {companies.filter((c) => c.subscriptionPlan === "enterprise").length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ModuleLayout>
  );
}
