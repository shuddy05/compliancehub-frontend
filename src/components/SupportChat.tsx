import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Headphones,
  X,
  Send,
  Minimize2,
  Maximize2,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { supportService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";

interface ChatMessage {
  id: string;
  ticketId: string;
  content: string;
  sender: "user" | "support";
  senderName: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  messages: ChatMessage[];
  createdAt: string;
}

export function SupportChat() {
  const { user, userRole, company } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(true); // Show form when starting new chat
  const [formData, setFormData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "",
    contact: user?.email || "",
    message: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Listen for openSupportChat event from other pages
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setShowForm(true);
      setActiveTicket(null);
    };

    window.addEventListener('openSupportChat', handleOpenChat);
    return () => window.removeEventListener('openSupportChat', handleOpenChat);
  }, []);

  // Handle initial form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.contact.trim() || !formData.message.trim()) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      setSending(true);
      setFormError(null);

      // Create a support ticket with the form data
      const response = await supportService.createTicket({
        title: `Support Request from ${formData.name}`,
        description: formData.message.trim(),
        priority: "medium",
      });

      const newTicket = response?.data || response;
      
      // Set as active ticket and fetch full details
      const ticketResponse = await supportService.getTicketById(newTicket.id);
      const ticketWithMessages = (ticketResponse?.data || ticketResponse) as SupportTicket;
      
      setActiveTicket(ticketWithMessages);
      setShowForm(false);
      setFormData({ name: "", contact: "", message: "" });
      
      // Refresh tickets list
      await refreshTickets();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to start chat");
      console.error("Error submitting form:", err);
    } finally {
      setSending(false);
    }
  };

  // Refresh tickets list
  const refreshTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getOpenTickets(0, 10);
      const ticketsData = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setTickets(ticketsData);

      // Auto-select first ticket if available and no ticket is currently selected
      if (ticketsData.length > 0 && !activeTicket) {
        const ticketResponse = await supportService.getTicketById(
          ticketsData[0].id
        );
        const ticketWithMessages = (ticketResponse?.data || ticketResponse) as SupportTicket;
        setActiveTicket(ticketWithMessages);
      }
    } catch (err) {
      console.error("Error loading support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTicket?.messages]);

  // Load user's support tickets
  useEffect(() => {
    if (isOpen) {
      refreshTickets();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeTicket) return;

    try {
      setSending(true);
      const companyId = company?.id;
      await supportService.addMessage(activeTicket.id, messageInput, companyId);

      // Reload ticket to get updated messages
      const ticketResponse = await supportService.getTicketById(activeTicket.id);
      const updatedTicket = (ticketResponse?.data || ticketResponse) as SupportTicket;
      setActiveTicket(updatedTicket);
      setMessageInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

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

  // Hide chat button for super_admin and support_staff - they use SupportStaffDashboard
  if (userRole === "super_admin" || userRole === "support_staff") {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="fixed bottom-6 right-6 z-49 p-4 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Headphones className="w-6 h-6" />
            </motion.div>
            {tickets.length > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0"
              >
                {tickets.length}
              </Badge>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal with Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Prevents interaction outside modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-39 md:hidden"
              onClick={() => {
                setIsOpen(false);
                setActiveTicket(null);
              }}
            />
            {/* Chat Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
            <Card className="shadow-2xl overflow-hidden border-primary/20">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold text-sm">Support Chat</h3>
                    <p className="text-xs opacity-90">We're here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      setActiveTicket(null);
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-96 flex flex-col bg-background"
                >
                  {/* Ticket List or Chat */}
                  {!activeTicket ? (
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                      ) : !Array.isArray(tickets) || tickets.length === 0 ? (
                        <form onSubmit={handleFormSubmit} className="h-full flex flex-col justify-center space-y-4">
                          <div>
                            <label className="text-sm font-medium">Your Name</label>
                            <Input
                              type="text"
                              placeholder="Enter your name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              disabled={sending}
                              className="mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Contact Email</label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={formData.contact}
                              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                              disabled={sending}
                              className="mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                              placeholder="Tell us how we can help..."
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              disabled={sending}
                              rows={4}
                              className="mt-1 w-full p-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>

                          {formError && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <p>{formError}</p>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={sending || !formData.name.trim() || !formData.contact.trim() || !formData.message.trim()}
                            className="w-full"
                          >
                            {sending ? (
                              <div className="animate-spin w-4 h-4 rounded-full border-2 border-background border-t-foreground" />
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Start Chat
                              </>
                            )}
                          </Button>
                        </form>
                      ) : (
                        tickets.map((ticket) => (
                          <button
                            key={ticket.id}
                            onClick={() => setActiveTicket(ticket)}
                            className="w-full p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {ticket.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {ticket.description}
                                </p>
                              </div>
                              <Badge
                                className={getStatusColor(ticket.status)}
                                variant="secondary"
                              >
                                {ticket.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <div className="mb-4">
                          <p className="font-semibold text-sm mb-2">
                            {activeTicket.title}
                          </p>
                          <Badge className={getStatusColor(activeTicket.status)}>
                            {activeTicket.status.replace("_", " ")}
                          </Badge>
                        </div>

                        {activeTicket.messages &&
                        activeTicket.messages.length > 0 ? (
                          activeTicket.messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${
                                msg.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                  msg.sender === "user"
                                    ? "bg-primary text-white"
                                    : "bg-muted text-foreground"
                                }`}
                              >
                                <p className="font-medium text-xs mb-1 opacity-70">
                                  {msg.senderName}
                                </p>
                                <p>{msg.content}</p>
                                <p className="text-xs opacity-60 mt-1">
                                  {new Date(msg.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">
                              No messages yet. Type below to start.
                            </p>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="border-t border-border p-3 space-y-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTicket(null)}
                          className="w-full text-xs"
                        >
                          ← Back to Tickets
                        </Button>
                        {activeTicket.status !== "closed" &&
                        activeTicket.status !== "resolved" ? (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type message..."
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !sending) {
                                  handleSendMessage();
                                }
                              }}
                              disabled={sending}
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              onClick={handleSendMessage}
                              disabled={sending || !messageInput.trim()}
                            >
                              {sending ? (
                                <div className="animate-spin w-4 h-4 rounded-full border-2 border-background border-t-foreground" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            This ticket is {activeTicket.status}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
