import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  AlertTriangle,
  Calendar,
  FileText,
  ChevronRight,
  Clock,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

const overdueItems = [
  {
    id: 1,
    name: "VAT",
    period: "November 2025",
    originalDue: "Dec 21, 2025",
    daysOverdue: 5,
    estimatedPenalty: 12500,
    amount: 125000,
  },
];

const historicalPenalties = [
  { id: 1, date: "Aug 2025", obligation: "PAYE", penalty: 25000, receipt: "RCP-001" },
  { id: 2, date: "Mar 2025", obligation: "VAT", penalty: 15000, receipt: "RCP-002" },
];

export default function PenaltiesOverdue() {
  const totalPenaltiesYTD = historicalPenalties.reduce((sum, p) => sum + p.penalty, 0);
  const hasOverdue = overdueItems.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/compliance">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">Penalties & Overdue</h1>
              <p className="text-sm text-muted-foreground">Track missed deadlines</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Warning Banner */}
        {hasOverdue && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </motion.div>
                <div>
                  <p className="font-semibold text-destructive">
                    {overdueItems.length} overdue obligation{overdueItems.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    File now to minimize penalties
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Overdue Items */}
        <Card glass className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-destructive" />
            Overdue Obligations
          </h2>

          {overdueItems.length > 0 ? (
            <div className="space-y-3">
              {overdueItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/compliance/${item.id}`}>
                    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{item.name} - {item.period}</h3>
                          <p className="text-sm text-muted-foreground">
                            Original due: {item.originalDue}
                          </p>
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Badge variant="destructive">
                            {item.daysOverdue} days overdue
                          </Badge>
                        </motion.div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Amount Due</p>
                            <p className="font-mono font-semibold">₦{item.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Est. Penalty</p>
                            <p className="font-mono font-semibold text-destructive">
                              +₦{item.estimatedPenalty.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm">
                          File Now
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-primary">All caught up!</h3>
              <p className="text-sm text-muted-foreground">
                No overdue obligations. Great job!
              </p>
            </div>
          )}
        </Card>

        {/* Historical Penalties */}
        <Card glass className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Historical Penalties
          </h2>

          {historicalPenalties.length > 0 ? (
            <div className="space-y-3">
              {historicalPenalties.map((penalty, index) => (
                <motion.div
                  key={penalty.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{penalty.obligation}</p>
                      <p className="text-sm text-muted-foreground">{penalty.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-destructive">
                      ₦{penalty.penalty.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{penalty.receipt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No penalties recorded
            </p>
          )}
        </Card>

        {/* YTD Summary */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Penalties YTD</p>
              <p className={`text-2xl font-bold font-mono ${totalPenaltiesYTD === 0 ? 'text-primary' : 'text-destructive'}`}>
                ₦{totalPenaltiesYTD.toLocaleString()}
              </p>
            </div>
            {totalPenaltiesYTD === 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                🎯 Goal achieved!
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            We help you avoid penalties entirely
          </p>
        </Card>
      </main>
    </div>
  );
}
