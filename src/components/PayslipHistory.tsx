import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PermissionGuard } from "@/components/PermissionGuard";

interface Payslip {
  id: string;
  date: string;
  period: string;
  amount: string;
}

export function PayslipHistory({ payslips }: { payslips: Payslip[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">Payslip History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payslips.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/50">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.period} • {p.date}</p>
                <p className="text-sm text-muted-foreground">{p.amount}</p>
              </div>
              <div>
                <PermissionGuard permission="payroll:download-payslips">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </PermissionGuard>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
