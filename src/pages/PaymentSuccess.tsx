import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/services/api";

export default function PaymentSuccess() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [loading, setLoading] = useState<boolean>(!!reference);
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // If we have a reference, verify payment status from server
    if (!reference) return;
    const check = async () => {
      try {
        const resp = await axiosInstance.get(`/subscriptions/status?reference=${encodeURIComponent(reference)}`);
        const data = resp.data;
        if (data?.found) {
          const txStatus = data.transaction?.status;
          setStatus(txStatus || null);
          setMessage(txStatus === 'successful' ? 'Payment confirmed. Continue to onboarding.' : `Payment status: ${txStatus}`);
        } else {
          setMessage('No transaction found for this reference.');
        }
      } catch (err: any) {
        setMessage('Error verifying payment: ' + (err?.message || 'unknown'));
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [reference]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card>
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-8 h-8 text-primary" />
            </motion.div>

            {/* Success Message */}
            <h1 className="text-3xl font-display font-bold mb-2">
              {`Payment Successful${user?.firstName ? ', ' + user.firstName : ''}!`}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {loading ? 'Verifying payment...' : message || 'Your subscription has been activated.'}
            </p>

            {/* Confirmation Details */}
            <div className="space-y-4 mb-8 text-left bg-muted/30 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Confirmation Email Sent</p>
                  <p className="text-sm text-muted-foreground">
                    Check your email for receipt and setup instructions
                  </p>
                </div>
              </div>
              {status === 'successful' && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Subscription Activated</p>
                    <p className="text-sm text-muted-foreground">Your subscription is now active. Check your email for confirmation and invoice.</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Invoice Available</p>
                  <p className="text-sm text-muted-foreground">
                    Your invoice has been sent to your email
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h2 className="font-semibold mb-4 text-left">What's Next?</h2>
              <ol className="space-y-3 text-left">
                <li className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                    1
                  </span>
                  <span className="text-muted-foreground">
                    Complete your company setup with your business details
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                    2
                  </span>
                  <span className="text-muted-foreground">
                    Add your employees and configure payroll settings
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                    3
                  </span>
                  <span className="text-muted-foreground">
                    Explore compliance tracking and automated filings
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                    4
                  </span>
                  <span className="text-muted-foreground">
                    Schedule a demo with our team for personalized guidance
                  </span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding-complete">
                  <Button size="lg" className="w-full sm:w-auto">
                    Continue to Onboarding
                  </Button>
                </Link>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Questions or need help getting started?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@compliancehub.ng"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Contact Support
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <Link to="/help" className="text-primary hover:underline text-sm font-medium">
                  Help Center
                </Link>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="tel:08035428870" className="text-primary hover:underline text-sm font-medium">
                  Call Us: 08035428870
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
