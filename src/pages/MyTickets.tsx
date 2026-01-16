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
  MessageSquare,
  Calendar,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";

interface TicketMessage {
  id: string;
  content: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
  resolution?: string;
}

export default function MyTickets() {
  const navigate = useNavigate();
  const { user, company } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [lastViewedMessageCount, setLastViewedMessageCount] = useState<Record<string, number>>({});

  // Fetch user's tickets based on role
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all open tickets
        const response = await supportService.getOpenTickets(0, 100);
        const ticketsData = Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response) 
            ? response 
            : (response?.data?.data || []);

        // Filter tickets based on user role
        const userTickets = ticketsData.filter((t: any) => {
          // Support staff see tickets assigned to them
          if (user?.role === "support_staff") {
            return t.assignedTo === user?.id;
          }
          // All other roles see tickets they created
          return t.createdBy === user?.id;
        });
        
        setTickets(userTickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tickets");
        console.error("Error loading tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTickets();
    }
  }, [user?.id, user?.role]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-red-500/10 text-red-600",
      in_progress: "bg-blue-500/10 text-blue-600",
      pending: "bg-amber-500/10 text-amber-600",
      resolved: "bg-green-500/10 text-green-600",
      closed: "bg-gray-500/10 text-gray-600",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      open: AlertCircle,
      in_progress: Clock,
      pending: Clock,
      resolved: CheckCircle2,
      closed: CheckCircle2,
    };
    return icons[status];
  };

  const getNewMessageCount = (ticket: SupportTicket) => {
    const lastViewed = lastViewedMessageCount[ticket.id] || 0;
    const totalMessages = ticket.messages?.length || 0;
    return totalMessages - lastViewed;
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
      
      // Refresh the ticket to get updated messages
      const response = await supportService.getTicketById(selectedTicket.id);
      const updatedTicket = response?.data ? response.data : response;
      
      if (updatedTicket && typeof updatedTicket === 'object') {
        setSelectedTicket(updatedTicket);
        setReplyContent("");
        
        // Also update in the list
        setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      }
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Failed to send reply: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSendingReply(false);
    }
  };

  const handleOpenNewTicketForm = () => {
    // Dispatch custom event to open the SupportChat
    window.dispatchEvent(new CustomEvent('openSupportChat'));
  };

  const isSupportStaff = user?.role === "support_staff";
  const pageTitle = isSupportStaff ? "Assigned Tickets" : "My Support Tickets";
  const pageDescription = isSupportStaff 
    ? "Tickets assigned to you by the support team manager"
    : "Tickets you've created and their status";

  return (
    <ModuleLayout title={pageTitle} activeTab="support">
      <div className="space-y-6">
        {/* Description */}
        {isSupportStaff && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-100">{pageDescription}</p>
          </div>
        )}

        {/* Action Button - Only for non-support staff */}
        {!isSupportStaff && (
          <div className="flex justify-end">
            <Button 
              onClick={handleOpenNewTicketForm}
              className="bg-primary hover:bg-primary/90"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Submit New Ticket
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              label: "Total Tickets", 
              value: tickets.length, 
              color: "bg-blue-500/10 text-blue-600" 
            },
            { 
              label: "Open", 
              value: tickets.filter(t => t.status === "open").length, 
              color: "bg-red-500/10 text-red-600" 
            },
            { 
              label: "Resolved", 
              value: tickets.filter(t => t.status === "resolved" || t.status === "closed").length, 
              color: "bg-green-500/10 text-green-600" 
            },
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

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isSupportStaff ? "Search assigned tickets..." : "Search your tickets..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-muted rounded-lg text-sm bg-background appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List & Detail - Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status);
                return (
                  <Card
                    key={ticket.id}
                    className={`hover:shadow-md transition-all cursor-pointer ${
                      selectedTicket?.id === ticket.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      // Mark messages as viewed
                      setLastViewedMessageCount(prev => ({
                        ...prev,
                        [ticket.id]: ticket.messages?.length || 0
                      }));
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <StatusIcon className={`w-4 h-4 mt-1 flex-shrink-0 ${getPriorityColor(ticket.priority)}`} />
                          <h4 className="font-semibold text-sm line-clamp-2">{ticket.title}</h4>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">{ticket.description}</p>

                        <div className="flex items-center gap-2 pt-2">
                          <Badge className={`${getStatusColor(ticket.status)} text-xs`} variant="secondary">
                            {String(ticket.status || "").replace("_", " ").toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={`${getPriorityColor(ticket.priority)} text-xs`}>
                            {ticket.priority}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.messages?.length || 0} messages
                          </div>
                          {getNewMessageCount(ticket) > 0 && (
                            <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {getNewMessageCount(ticket)}
                            </div>
                          )}
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
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {loading ? "Loading..." : isSupportStaff ? "No tickets assigned to you yet" : "No tickets found"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <Card className="h-full flex flex-col">
                {/* Header */}
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{selectedTicket.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(selectedTicket.status)} variant="secondary">
                          {String(selectedTicket.status || "").replace("_", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                          {selectedTicket.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
                  {/* Ticket Info */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Description</p>
                    <p className="text-sm">{selectedTicket.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Created</p>
                      <p className="font-medium">{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Updated</p>
                      <p className="font-medium">{new Date(selectedTicket.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedTicket.resolution && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Resolution</p>
                      <p className="text-sm">{selectedTicket.resolution}</p>
                    </div>
                  )}

                  {/* Messages */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3">Conversation</p>
                    <div className="space-y-3 bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                      {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                        selectedTicket.messages.map((msg) => (
                          <div key={msg.id} className="border-b border-border pb-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-medium text-foreground">{msg.userName || "You"}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(msg.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm text-foreground">{msg.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No messages yet. Support staff will respond soon.</p>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Reply Input */}
                {selectedTicket.status !== "closed" && (
                  <div className="border-t p-4 space-y-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full px-3 py-2 border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows={3}
                    />
                    <Button
                      onClick={handleAddReply}
                      disabled={sendingReply || !replyContent.trim()}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sendingReply ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Select a ticket to view details and continue conversation</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
