import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ModuleLayout } from "@/components/ModuleLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Upload,
  X,
  Clock,
  MessageCircle,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issueType, setIssueType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueType || !subject || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <ModuleLayout title="Contact Support" activeTab="learn">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Message Sent!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for contacting us. Our support team will get back to you
            within 12 hours.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Ticket Reference</p>
            <p className="font-mono font-bold">SUP-{Date.now().toString(36).toUpperCase()}</p>
          </div>
          <Button onClick={() => navigate("/learning/help-centre")} className="w-full">
            Back to Help Centre
          </Button>
        </motion.div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title="Contact Support" activeTab="learn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Contact Support
        </h1>
        <p className="text-muted-foreground">
          Get help from our support team through your preferred channel
        </p>
      </div>

      <div className="space-y-6">
        {/* Response Time Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Expected response time</p>
            <p className="text-sm text-muted-foreground">
              Within 12 hours (Pro subscribers get priority support)
            </p>
          </div>
        </motion.div>

        {/* Support Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="issueType">Issue Type *</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="payroll">Payroll Help</SelectItem>
                <SelectItem value="compliance">Compliance Query</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or relevant context."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Attach Screenshot (Optional)</Label>
            {screenshot ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(screenshot)}
                    alt="Screenshot preview"
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-sm">{screenshot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(screenshot.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setScreenshot(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload screenshot
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                />
              </label>
            )}
          </div>
        </form>

        {/* Alternative Contact */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Need immediate assistance?
          </p>
          <Button variant="outline" asChild>
            <a
              href="https://wa.me/2341234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default ContactSupport;
