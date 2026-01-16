import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ModuleLayout } from "@/components/ModuleLayout";
import { useAuth } from "@/context/AuthContext";
import { supportService } from "@/services/api";
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";

interface TicketMessage {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  userId?: string;
  userName?: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  messages?: TicketMessage[];
}

const mockTickets: SupportTicket[] = [];

export default function SupportTickets() {
  const navigate = useNavigate();
  const { userRole, company } = useAuth();
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, "in_progress": 0, resolved: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState<TicketMessage[]>([]);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching support ticket stats...");

        // Fetch ticket stats
        const statsResponse = await supportService.getTicketStats();
        console.log("Stats response:", statsResponse);
        
        // axios wraps response in .data property
        const statsData = statsResponse?.data || statsResponse;
        const openCount = statsData?.openTickets || 0;
        const pendingCount = statsData?.pendingTickets || 0;
        const resolvedCount = statsData?.resolvedThisWeek || 0;
        
        console.log("Counts - Open:", openCount, "Pending:", pendingCount, "Resolved:", resolvedCount);
        
        setStats({
          total: openCount + pendingCount + resolvedCount,
          open: openCount,
          in_progress: 0,
          resolved: resolvedCount,
          urgent: 0,
        });

        // Fetch tickets based on active tab
        let ticketsResponse;
        if (activeTab === "open") {
          ticketsResponse = await supportService.getOpenTickets(0, 50);
        } else {
          // For closed tickets
          ticketsResponse = await supportService.getClosedTickets(0, 50);
        }
        console.log("Tickets response:", ticketsResponse);
        
        // axios wraps response in .data property
        const ticketsRawData = ticketsResponse?.data || ticketsResponse;
        const ticketsData = Array.isArray(ticketsRawData) 
          ? ticketsRawData 
          : (ticketsRawData?.data || []);
        console.log("Tickets data:", ticketsData);
        
        setTickets(ticketsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load support tickets");
        console.error("Error loading support tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "super_admin") {
      console.log("User is super_admin, fetching data...");
      fetchData();
    } else {
      console.log("User role is:", userRole, "- not super_admin");
    }
  }, [userRole, activeTab]);

  // Filter tickets based on search and filters
  const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-red-500/10 text-red-600",
      "in_progress": "bg-blue-500/10 text-blue-600",
      pending: "bg-amber-500/10 text-amber-600",
      resolved: "bg-green-500/10 text-green-600",
      closed: "bg-gray-500/10 text-gray-600",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      open: AlertCircle,
      "in_progress": Clock,
      pending: Clock,
      resolved: CheckCircle2,
      closed: CheckCircle2,
    };
    return icons[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "text-blue-600",
      medium: "text-amber-600",
      high: "text-orange-600",
      critical: "text-red-600",
    };
    return colors[priority] || "text-gray-600";
  };

  const handleAddReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;

    try {
      setSendingReply(true);
      const content = replyContent.trim();
      const companyId = company?.id;
      await supportService.addMessage(selectedTicket.id, content, companyId);
      
      // Refresh the full ticket to get updated messages with sender info
      const response = await supportService.getTicketById(selectedTicket.id);
      // Axios wraps response in .data property
      const updatedTicket = response?.data ? response.data : response;
      
      if (updatedTicket && typeof updatedTicket === 'object') {
        setSelectedTicket(updatedTicket);
        setReplyContent("");
      } else {
        alert("Failed to load updated ticket");
      }
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Failed to add reply: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSendingReply(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    try {
      await supportService.closeTicket(selectedTicket.id, "Closed by admin");
      
      // Refresh the tickets list
      const ticketsResponse = await supportService.getOpenTickets(0, 50);
      const ticketsData = Array.isArray(ticketsResponse?.data) 
        ? ticketsResponse.data
        : Array.isArray(ticketsResponse) 
          ? ticketsResponse
          : (ticketsResponse?.data?.data || []);
      setTickets(ticketsData);
      setSelectedTicket(null);
    } catch (err) {
      console.error("Error closing ticket:", err);
      alert("Failed to close ticket: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleChangeStatus = async (newStatus: string) => {
    if (!selectedTicket) return;

    try {
      await supportService.updateTicket(selectedTicket.id, { status: newStatus });
      
      // Refresh the selected ticket
      const response = await supportService.getTicketById(selectedTicket.id);
      const updatedTicket = response?.data ? response.data : response;
      
      if (updatedTicket && typeof updatedTicket === 'object' && 'id' in updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
      
      // Refresh the tickets list
      const ticketsResponse = await supportService.getOpenTickets(0, 50);
      const ticketsData = Array.isArray(ticketsResponse?.data) 
        ? ticketsResponse.data
        : Array.isArray(ticketsResponse) 
          ? ticketsResponse
          : (ticketsResponse?.data?.data || []);
      setTickets(ticketsData);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  if (userRole !== "super_admin") {
    return (
      <ModuleLayout title="Support Tickets" activeTab="support">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-sm">Only super admins can manage support tickets</p>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Support Tickets" activeTab="support">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Total Tickets", value: stats.total, color: "bg-blue-500/10 text-blue-600" },
            { label: "Open", value: stats.open, color: "bg-red-500/10 text-red-600" },
            { label: "In Progress", value: stats.in_progress, color: "bg-amber-500/10 text-amber-600" },
            { label: "Resolved", value: stats.resolved, color: "bg-green-500/10 text-green-600" },
            { label: "Urgent", value: stats.urgent, color: "bg-orange-500/10 text-orange-600" },
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
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters with Funnel Icon */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Filters</label>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-muted rounded-lg text-sm bg-background appearance-none cursor-pointer transition-colors hover:border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-muted rounded-lg text-sm bg-background appearance-none cursor-pointer transition-colors hover:border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                      >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs with Ticket Counts */}
        <div className="flex items-center justify-between border-b border-border">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("open")}
              className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "open"
                  ? "text-foreground border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Open Tickets
              <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-600">
                {stats.open}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "closed"
                  ? "text-foreground border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Closed & Resolved
              <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold bg-green-500/20 text-green-600">
                {stats.resolved}
              </span>
            </button>
          </div>
          <Button
            onClick={() => navigate("/support/manage-tickets")}
            className="mb-1"
            variant="default"
            size="sm"
          >
            Manage & Assign
          </Button>
        </div>

        {/* Tickets List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="space-y-3">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status);
                return (
                  <Card
                    key={ticket.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <StatusIcon className={`w-5 h-5 ${getPriorityColor(ticket.priority)}`} />
                            <h4 className="font-semibold text-sm">{ticket.title}</h4>
                          </div>

                          <p className="text-xs text-muted-foreground">{ticket.description.substring(0, 100)}...</p>

                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="w-3 h-3" />
                              {ticket.messages?.length || 0} messages
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(ticket.status)} variant="secondary">
                            {ticket.status.replace("_", " ").toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${getPriorityColor(ticket.priority)} capitalize text-xs`}
                          >
                            {ticket.priority}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{loading ? "Loading..." : "No support tickets found"}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border sticky top-0 bg-background">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{selectedTicket.title}</h2>
                      <Badge className={getStatusColor(String(selectedTicket.status))} variant="secondary">
                        {String(selectedTicket.status).replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Priority</p>
                    <p className={`font-medium capitalize ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                    <p className="font-medium">{String(selectedTicket.status || "").replace("_", " ").toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Created</p>
                    <p className="font-medium">{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Last Updated</p>
                    <p className="font-medium">{new Date(selectedTicket.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedTicket.description}</p>
                </div>

                {/* Messages */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-muted-foreground">Messages ({selectedTicket.messages?.length || 0})</p>
                  </div>
                  <div className="space-y-3 bg-muted/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                      selectedTicket.messages.map((msg, idx) => (
                        <div key={idx} className="border-b border-border pb-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-foreground">{msg.userName || "Support Staff"}</p>
                            <p className="text-xs text-muted-foreground">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</p>
                          </div>
                          <p className="text-sm text-foreground">{msg.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    )}
                  </div>

                  {/* Reply Input */}
                  <div className="mt-4 space-y-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Add a reply..."
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background min-h-20 resize-none"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddReply}
                      disabled={sendingReply || !replyContent.trim()}
                      className="w-full"
                    >
                      {sendingReply ? "Sending..." : "Add Reply"}
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border flex-wrap">
                  <select
                    onChange={(e) => {
                      handleChangeStatus(e.target.value);
                      e.target.value = "";
                    }}
                    defaultValue=""
                    className="px-3 py-2 pr-8 border border-muted rounded-lg text-sm bg-background appearance-none cursor-pointer transition-colors hover:border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none flex-1"
                  >
                    <option value="">Change Status...</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Button variant="destructive" onClick={handleCloseTicket} className="flex-1">
                    Close Ticket
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </ModuleLayout>
  );
}
