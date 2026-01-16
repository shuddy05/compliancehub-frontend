import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/services/api";

export default function SubscriptionsComplete() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setMessage("Missing reference");
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const resp = await axiosInstance.get(`/subscriptions/status?reference=${encodeURIComponent(reference)}`);
        const data = resp.data;
        if (data?.ok && data?.found) {
          const txStatus = data.transaction?.status;
          setStatus(txStatus);
          setMessage(txStatus === 'successful' ? 'Payment confirmed. Redirecting...' : `Payment status: ${txStatus}`);
          // If successful, redirect to dashboard after short delay
          if (txStatus === 'successful') {
            setTimeout(() => navigate('/dashboard'), 1800);
          }
        } else {
          setMessage('No transaction found for this reference.');
        }
      } catch (err: any) {
        setMessage('Error checking payment status: ' + (err?.message || 'unknown'));
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [reference, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Payment Confirmation</h2>
        {loading ? (
          <p>Verifying payment, please wait...</p>
        ) : (
          <>
            <p className="mb-2">{message}</p>
            <p className="text-sm text-muted-foreground">Reference: {reference}</p>
            <div className="mt-4">
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Go to Dashboard</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
