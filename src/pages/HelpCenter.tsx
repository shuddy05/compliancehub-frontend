import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Search,
  Rocket,
  Receipt,
  Shield,
  CreditCard,
  Settings,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const topics = [
  { id: "getting-started", name: "Getting Started", icon: Rocket, count: 8 },
  { id: "payroll", name: "Payroll Issues", icon: Receipt, count: 12 },
  { id: "compliance", name: "Compliance Questions", icon: Shield, count: 15 },
  { id: "billing", name: "Billing & Subscriptions", icon: CreditCard, count: 6 },
  { id: "account", name: "Account Settings", icon: Settings, count: 5 },
];

const faqs: Record<string, Array<{ question: string; answer: string }>> = {
  "getting-started": [
    {
      question: "How do I add my first employee?",
      answer: "Go to the Employees section from the dashboard and click 'Add Employee'. Fill in the required details like name, email, salary, and bank information. The system will automatically calculate tax and pension contributions.",
    },
    {
      question: "What documents do I need to get started?",
      answer: "You'll need your CAC certificate, TIN (Tax Identification Number), and company bank details. For employees, you'll need their personal details, bank account information, and optionally their pension PIN.",
    },
    {
      question: "How do I run my first payroll?",
      answer: "Navigate to Payroll → Run Payroll. Select the payroll period, review the calculated amounts for each employee, approve the payroll, and then either process payments manually or use our auto-payment feature (Enterprise).",
    },
    {
      question: "Can I import existing employee data?",
      answer: "Yes! Go to Employees → Import and download our Excel template. Fill in your employee data and upload the file. We'll validate the data and show you any errors before importing.",
    },
  ],
  payroll: [
    {
      question: "Why are my tax calculations different from expected?",
      answer: "ComplianceHub uses the latest PAYE tax tables from FIRS. Differences may occur if you're comparing with manual calculations or outdated rates. You can view the full breakdown for each employee in their payslip.",
    },
    {
      question: "How do I add a bonus or deduction?",
      answer: "During the payroll run process (Step 1), you can add one-time bonuses or deductions for specific employees. These will be included in that month's calculation only.",
    },
    {
      question: "Can I edit a payroll after it's been approved?",
      answer: "No, approved payrolls cannot be edited to maintain audit integrity. If you need to make corrections, you can add adjustments in the next payroll run or create a supplementary payment.",
    },
  ],
  compliance: [
    {
      question: "When are my filing deadlines?",
      answer: "PAYE is due by the 10th of the following month. Pension contributions are due by a specific date set by your PFA. VAT (if applicable) is due by the 21st. Check the Compliance Calendar for all deadlines.",
    },
    {
      question: "How do I file PAYE automatically?",
      answer: "With ComplianceHub Pro, you can file PAYE directly to FIRS through our integration. Go to Compliance → select the obligation → click 'File Now'. We'll submit the filing and provide a confirmation receipt.",
    },
    {
      question: "What happens if I miss a deadline?",
      answer: "Late filings incur penalties. PAYE late payment attracts 10% penalty plus 2% interest per month. We send reminders before deadlines to help you stay compliant.",
    },
  ],
  billing: [
    {
      question: "How do I upgrade my plan?",
      answer: "Go to Settings → Subscription → Change Plan. Select your new plan and confirm. The change takes effect immediately, and your billing will be prorated.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards (Visa, Mastercard) and bank transfers. Payments are processed securely through Paystack.",
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 14-day money-back guarantee for new subscriptions. Contact support within 14 days of your first payment for a full refund.",
    },
  ],
  account: [
    {
      question: "How do I add team members?",
      answer: "Go to Settings → Team and click 'Invite Member'. Enter their email and select their role (Admin, Accountant, or Viewer). They'll receive an invitation email.",
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login screen and enter your email. You'll receive a password reset link valid for 24 hours.",
    },
  ],
};

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Array<{ topic: string; question: string; answer: string }>>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results: Array<{ topic: string; question: string; answer: string }> = [];
      Object.entries(faqs).forEach(([topic, questions]) => {
        questions.forEach((faq) => {
          if (
            faq.question.toLowerCase().includes(query.toLowerCase()) ||
            faq.answer.toLowerCase().includes(query.toLowerCase())
          ) {
            results.push({ topic, ...faq });
          }
        });
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const currentFaqs = selectedTopic ? faqs[selectedTopic] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Help Center</h1>
        </div>
      </header>

      <main className="p-4 max-w-3xl mx-auto space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="How can we help?"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="p-3 bg-muted/50 text-sm text-muted-foreground">
                {searchResults.length} result{searchResults.length > 1 ? "s" : ""} found
              </div>
              <Accordion type="single" collapsible>
                {searchResults.map((result, index) => (
                  <AccordionItem key={index} value={`result-${index}`}>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="text-left">
                        <p className="font-medium">{result.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {topics.find((t) => t.id === result.topic)?.name}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-muted-foreground">
                      {result.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Topics Grid */}
        {!selectedTopic && searchResults.length === 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Common Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topics.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-card border border-border rounded-xl text-left hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-medium">{topic.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {topic.count} articles
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {/* Selected Topic FAQs */}
        {selectedTopic && (
          <section>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setSelectedTopic(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to topics
            </Button>
            <h2 className="text-lg font-semibold mb-4">
              {topics.find((t) => t.id === selectedTopic)?.name}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {currentFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-left font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </section>
        )}

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Still need help?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our support team is ready to assist you with any questions.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button onClick={() => navigate("/support/contact")}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://wa.me/2341234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HelpCenter;
