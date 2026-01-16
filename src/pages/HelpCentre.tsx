import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModuleLayout } from "@/components/ModuleLayout";
import {
  Search,
  BookOpen,
  AlertCircle,
  DollarSign,
  Users,
  FileText,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: any;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "How do I set up my company on ComplianceHub?",
    answer:
      "To set up your company, navigate to Company Setup from the main dashboard. You'll need to provide your company details, tax ID, and banking information. Our setup wizard will guide you through each step.",
    icon: BookOpen,
  },
  {
    id: "2",
    category: "Getting Started",
    question: "What documents do I need to provide?",
    answer:
      "You'll need your company registration documents, tax identification number (TIN), business license, and banking details. For payroll setup, you'll also need employee information and banking details for salary transfers.",
    icon: FileText,
  },
  {
    id: "3",
    category: "Compliance",
    question: "What compliance obligations does ComplianceHub track?",
    answer:
      "We track PAYE filing, VAT returns, pension contributions, employee benefits, and other statutory requirements specific to Nigerian businesses. The compliance calendar shows all upcoming deadlines.",
    icon: AlertCircle,
  },
  {
    id: "4",
    category: "Compliance",
    question: "How often should I file PAYE returns?",
    answer:
      "PAYE returns should be filed monthly by the 10th of the following month. ComplianceHub sends you reminders before the deadline and provides a pre-filled return based on your payroll data.",
    icon: AlertCircle,
  },
  {
    id: "5",
    category: "Payroll",
    question: "Can I set up multiple payroll cycles?",
    answer:
      "Yes, ComplianceHub supports various payroll frequencies including monthly, bi-weekly, and weekly. You can configure different cycles for different employee groups.",
    icon: DollarSign,
  },
  {
    id: "6",
    category: "Payroll",
    question: "How do I add or remove employees?",
    answer:
      "Use the Employee Management section to add new employees. You'll need their personal details, bank account information, and tax status. You can bulk import employees using our CSV template.",
    icon: Users,
  },
  {
    id: "7",
    category: "Documents",
    question: "Where can I find my compliance documents?",
    answer:
      "All your compliance documents, receipts, and filed returns are stored in the Documents Library. You can search, filter, and download them anytime.",
    icon: FileText,
  },
  {
    id: "8",
    category: "Documents",
    question: "How long are documents stored?",
    answer:
      "Documents are stored indefinitely for audit and compliance purposes. You have unlimited access to download and archive your records.",
    icon: FileText,
  },
];

const HelpCentre = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...new Set(faqItems.map((item) => item.category))];

  const filteredFAQ = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ModuleLayout activeTab="learn" title="Help Centre">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Help Centre
        </h1>
        <p className="text-muted-foreground">
          Find answers to common questions about ComplianceHub
        </p>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div>
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFAQ.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={item.id}
                    className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/50"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-start gap-3 text-left">
                        <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.question}
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>

          {filteredFAQ.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No articles found matching your search
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </motion.div>
          )}
        </div>

        {/* Still Need Help? */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Still need help?</h3>
                <p className="text-muted-foreground text-sm">
                  Contact our support team for personalized assistance
                </p>
              </div>
              <Button
                onClick={() => navigate("/learning/contact-support")}
                className="sm:w-auto"
              >
                Contact Support <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default HelpCentre;
