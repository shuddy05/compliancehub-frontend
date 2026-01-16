import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ModuleLayout } from "@/components/ModuleLayout";
import { 
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Bell,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const obligations = [
  { id: 1, name: "PAYE", date: 10, status: "pending", amount: 450000 },
  { id: 2, name: "Pension", date: 15, status: "filed", amount: 300000 },
  { id: 3, name: "VAT", date: 21, status: "overdue", amount: 125000 },
  { id: 4, name: "NSITF", date: 28, status: "pending", amount: 50000 },
  { id: 5, name: "ITF", date: 28, status: "pending", amount: 25000 },
];

const statusConfig = {
  overdue: { color: "bg-destructive", text: "text-destructive" },
  pending: { color: "bg-gold", text: "text-gold" },
  filed: { color: "bg-primary", text: "text-primary" },
};

export default function ComplianceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11)); // December 2025
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getObligationsForDate = (date: number) => {
    return obligations.filter(o => o.date === date);
  };

  const filteredObligations = filter === "all" 
    ? obligations 
    : obligations.filter(o => o.name.toLowerCase() === filter);

  return (
    <ModuleLayout title="Compliance Calendar" activeTab="compliance">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Compliance Calendar</h1>
        <p className="text-muted-foreground">Track all compliance deadlines and obligations</p>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold min-w-[150px] text-center">{monthName}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paye">PAYE</SelectItem>
                <SelectItem value="vat">VAT</SelectItem>
                <SelectItem value="pension">Pension</SelectItem>
                <SelectItem value="nsitf">NSITF</SelectItem>
                <SelectItem value="itf">ITF</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={view === "calendar" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setView("calendar")}
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setView("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {view === "calendar" && (
          <Card className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = i + 1;
                const dayObligations = getObligationsForDate(date);
                const isSelected = selectedDate === date;

                return (
                  <motion.div
                    key={date}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(isSelected ? null : date)}
                    className={`aspect-square p-1 rounded-lg cursor-pointer transition-colors border border-border bg-card hover:bg-muted/50 ${
                      isSelected ? 'bg-primary/20 ring-2 ring-primary border-primary' : ''
                    }`}
                  >
                    <div className="text-sm font-medium">{date}</div>
                    <div className="flex gap-0.5 mt-1 flex-wrap">
                      {dayObligations.map((ob) => (
                        <motion.div
                          key={ob.id}
                          animate={{ scale: ob.status === "overdue" ? [1, 1.2, 1] : 1 }}
                          transition={{ duration: 1, repeat: ob.status === "overdue" ? Infinity : 0 }}
                          className={`w-2 h-2 rounded-full ${statusConfig[ob.status as keyof typeof statusConfig].color}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-border text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Overdue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Filed</span>
              </div>
            </div>
          </Card>
        )}

        {/* Selected Date Details */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4">
              <h3 className="font-semibold mb-3">
                Obligations for {monthName.split(" ")[0]} {selectedDate}
              </h3>
              {getObligationsForDate(selectedDate).length > 0 ? (
                <div className="space-y-2">
                  {getObligationsForDate(selectedDate).map((ob) => (
                    <Link
                      key={ob.id}
                      to={`/compliance/${ob.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${statusConfig[ob.status as keyof typeof statusConfig].color}`} />
                        <span className="font-medium">{ob.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">₦{ob.amount.toLocaleString()}</span>
                        <Badge variant={ob.status === "overdue" ? "destructive" : "secondary"}>
                          {ob.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No obligations on this date</p>
              )}
            </Card>
          </motion.div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="space-y-3">
            {filteredObligations.map((ob, index) => (
              <motion.div
                key={ob.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/compliance/${ob.id}`}>
                  <Card className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          ob.status === "overdue" ? 'bg-destructive/10' : 
                          ob.status === "filed" ? 'bg-primary/10' : 'bg-gold/10'
                        }`}>
                          <CalendarIcon className={`w-6 h-6 ${statusConfig[ob.status as keyof typeof statusConfig].text}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{ob.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Due: {monthName.split(" ")[0]} {ob.date}, {currentMonth.getFullYear()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold">₦{ob.amount.toLocaleString()}</p>
                        <Badge variant={ob.status === "overdue" ? "destructive" : "secondary"}>
                          {ob.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
    </ModuleLayout>
  );
}
