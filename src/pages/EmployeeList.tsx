import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronRight, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModuleLayout } from "@/components/ModuleLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock employee data
const mockEmployees = [
  { id: 1, name: "Adewale Johnson", title: "Senior Developer", department: "Engineering", salary: 450000, status: "active" },
  { id: 2, name: "Chioma Okafor", title: "Product Manager", department: "Product", salary: 520000, status: "active" },
  { id: 3, name: "Emeka Nwosu", title: "UX Designer", department: "Design", salary: 380000, status: "active" },
  { id: 4, name: "Fatima Bello", title: "Marketing Lead", department: "Marketing", salary: 400000, status: "inactive" },
  { id: 5, name: "Gbenga Adeyemi", title: "DevOps Engineer", department: "Engineering", salary: 480000, status: "active" },
  { id: 6, name: "Halima Yusuf", title: "HR Manager", department: "Human Resources", salary: 350000, status: "active" },
  { id: 7, name: "Ibrahim Musa", title: "Accountant", department: "Finance", salary: 320000, status: "inactive" },
  { id: 8, name: "Jennifer Eze", title: "Sales Executive", department: "Sales", salary: 280000, status: "active" },
];

const EmployeeList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState("name");
  const [revealedSalaries, setRevealedSalaries] = useState<number[]>([]);

  const filteredEmployees = mockEmployees
    .filter((emp) => {
      if (filter === "active") return emp.status === "active";
      if (filter === "inactive") return emp.status === "inactive";
      return true;
    })
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "department") return a.department.localeCompare(b.department);
      if (sortBy === "salary") return b.salary - a.salary;
      return 0;
    });

  const activeCount = mockEmployees.filter((e) => e.status === "active").length;
  const inactiveCount = mockEmployees.filter((e) => e.status === "inactive").length;

  const toggleSalaryReveal = (id: number) => {
    setRevealedSalaries((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatSalary = (amount: number, revealed: boolean) => {
    if (revealed) {
      return `₦${amount.toLocaleString()}`;
    }
    return "₦●●●,●●●";
  };

  return (
    <ModuleLayout title="Employees" activeTab="employees">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Employees</h1>
        <p className="text-muted-foreground">Manage and view all employee information</p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, title, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link to="/employees/add">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employee List */}
      {filteredEmployees.length > 0 ? (
        <div className="space-y-3">
          {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/employees/${employee.id}`}>
                  <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {getInitials(employee.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {employee.name}
                          </h3>
                          <Badge
                            variant={employee.status === "active" ? "default" : "secondary"}
                            className={employee.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}
                          >
                            {employee.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {employee.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employee.department}
                        </p>
                      </div>

                      {/* Salary */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSalaryReveal(employee.id);
                        }}
                        className="text-right font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <motion.span
                          key={revealedSalaries.includes(employee.id) ? "revealed" : "hidden"}
                          initial={{ opacity: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          transition={{ duration: 0.2 }}
                        >
                          {formatSalary(employee.salary, revealedSalaries.includes(employee.id))}
                        </motion.span>
                      </button>

                      {/* Chevron */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No employees found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Add your first employee to start running payroll"}
            </p>
            <Button asChild>
              <Link to="/employees/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Link>
            </Button>
          </motion.div>
        )}
    </ModuleLayout>
  );
};

export default EmployeeList;
