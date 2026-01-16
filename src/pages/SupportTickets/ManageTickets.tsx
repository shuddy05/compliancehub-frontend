import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { useAuth } from "@/context/AuthContext";
import { supportService, usersService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
} from "lucide-react";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  assignedTo?: string;
  assignedUserName?: string;
}

interface SupportStaff {
  id: string;
  name: string;
  email: string;
  activeTickets?: number;
}

export default function ManageTickets() {
  const { userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [assigningLoading, setAssigningLoading] = useState(false);

  // Fetch tickets and support staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all tickets
        const ticketsResponse = await supportService.getOpenTickets(0, 100);
        const ticketsRawData = ticketsResponse?.data || ticketsResponse;
        const ticketsData = Array.isArray(ticketsRawData)
          ? ticketsRawData
          : (ticketsRawData?.data || []);
        setTickets(ticketsData);

        // Fetch support staff from API
        const staffResponse = await usersService.getSupportStaff(0, 100);
        const staffRawData = staffResponse?.data || staffResponse;
        const staffData = Array.isArray(staffRawData)
          ? staffRawData
          : (staffRawData?.data || []);
        
        // Map API response to SupportStaff interface
        const mappedStaff = (Array.isArray(staffData) ? staffData : []).map((user: any) => ({
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          email: user.email,
          activeTickets: user.activeTickets || 0,
        }));
        setSupportStaff(mappedStaff);

        // Calculate stats
        const openCount = ticketsData.filter((t: any) => t.status === "open").length;
        const inProgressCount = ticketsData.filter((t: any) => t.status === "in_progress").length;
        const resolvedCount = ticketsData.filter((t: any) => t.status === "resolved").length;

        setStats({
          total: ticketsData.length,
          open: openCount,
          in_progress: inProgressCount,
          resolved: resolvedCount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tickets");
        console.error("Error loading tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "super_admin") {
      fetchData();
    }
  }, [userRole]);

  // Filter tickets
  const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "unassigned" && !ticket.assignedTo) ||
      ticket.assignedTo === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Handle ticket assignment
  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedStaff) return;

    try {
      setAssigningLoading(true);
      // Call API to assign ticket
      await supportService.updateTicket(selectedTicket.id, {
        assignedTo: selectedStaff,
        status: "in_progress",
      });

      // Update local state
      const updatedTickets = tickets.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              assignedTo: selectedStaff,
              assignedUserName: supportStaff.find((s) => s.id === selectedStaff)?.name,
              status: "in_progress",
            }
          : t
      );
      setTickets(updatedTickets);
      setShowAssignModal(false);
      setSelectedTicket(null);
      setSelectedStaff("");
    } catch (err) {
      console.error("Error assigning ticket:", err);
      alert("Failed to assign ticket");
    } finally {
      setAssigningLoading(false);
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500/10 text-red-600";
      case "in_progress":
        return "bg-yellow-500/10 text-yellow-600";
      case "pending":
        return "bg-blue-500/10 text-blue-600";
      case "resolved":
        return "bg-green-500/10 text-green-600";
      case "closed":
        return "bg-gray-500/10 text-gray-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  // Priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-600";
      case "high":
        return "bg-orange-500/10 text-orange-600";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600";
      case "low":
        return "bg-green-500/10 text-green-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  if (userRole !== "super_admin") {
    return (
      <ModuleLayout title="Manage Tickets" activeTab="support">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-sm">Only super admins can access this page</p>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Manage Support Tickets" activeTab="support">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Tickets", value: stats.total, color: "bg-blue-500/10 text-blue-600" },
            { label: "Open", value: stats.open, color: "bg-red-500/10 text-red-600" },
            {
              label: "In Progress",
              value: stats.in_progress,
              color: "bg-amber-500/10 text-amber-600",
            },
            { label: "Resolved", value: stats.resolved, color: "bg-green-500/10 text-green-600" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className={`p-3 rounded-lg ${stat.color} mb-3 inline-block`}>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {supportStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tickets List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-3"
        >
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Loading tickets...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-destructive">{error}</p>
              </CardContent>
            </Card>
          ) : filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No tickets found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedTicket(ticket);
                  setSelectedStaff(ticket.assignedTo || "");
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        {ticket.assignedUserName && (
                          <Badge variant="outline" className="flex gap-1">
                            <User className="w-3 h-3" />
                            {ticket.assignedUserName}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        {ticket.assignedTo && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Assigned
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                        setSelectedStaff(ticket.assignedTo || "");
                        setShowAssignModal(true);
                      }}
                      variant={ticket.assignedTo ? "outline" : "default"}
                      size="sm"
                    >
                      {ticket.assignedTo ? "Reassign" : "Assign"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </motion.div>
      </div>

      {/* Assign Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket to Support Staff</DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Ticket</h4>
                <p className="text-sm text-muted-foreground">{selectedTicket.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Select Support Staff</label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a support staff member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {supportStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex items-center gap-2">
                          <span>{staff.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({staff.activeTickets} active)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignTicket}
              disabled={!selectedStaff || assigningLoading}
              loading={assigningLoading}
            >
              {assigningLoading ? "Assigning..." : "Assign Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}
