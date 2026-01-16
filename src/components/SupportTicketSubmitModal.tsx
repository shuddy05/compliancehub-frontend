import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, AlertCircle } from "lucide-react";
import { supportService } from "@/services/api";

interface SupportTicketSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SupportTicketSubmitModal({ isOpen, onClose, onSuccess }: SupportTicketSubmitModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await supportService.createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      setSuccess(true);
      setTitle("");
      setDescription("");
      setPriority("medium");

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit ticket");
      console.error("Error submitting ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-xl shadow-lg max-w-md w-full mx-4"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Submit Support Ticket</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Ticket Submitted!</h3>
            <p className="text-sm text-muted-foreground">
              Your support ticket has been created. Our team will respond to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                type="text"
                placeholder="Brief description of your issue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                placeholder="Provide detailed information about your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background min-h-24 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 pr-8 border border-muted rounded-lg text-sm bg-background appearance-none cursor-pointer transition-colors hover:border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
