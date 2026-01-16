import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api";

export default function SecuritySettings() {
  const { user } = useAuth();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [base32, setBase32] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await authService.mfaSetup();
      const { otpauth_url, base32 } = res.data;
      setBase32(base32 || null);
      // Use public QR generator to display QR (dev only)
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        otpauth_url,
      )}`);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to initialize MFA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await authService.mfaVerify(code);
      setMessage("MFA enabled successfully");
      setQrUrl(null);
      setBase32(null);
      setCode("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Security & Privacy</h1>

      <section className="bg-card p-6 rounded-2xl border border-border mb-6">
        <h2 className="font-medium mb-2">Two-factor Authentication (TOTP)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add an extra layer of security to your account using an authenticator app (Google Authenticator, Authy, etc.).
        </p>

        {qrUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img src={qrUrl} alt="MFA QR" className="w-48 h-48 bg-white p-2 rounded-md" />
            {base32 && <div className="text-xs text-muted-foreground">Secret: {base32}</div>}
            <div className="flex gap-2 mt-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="px-3 py-2 border rounded-md"
              />
              <button onClick={handleVerify} disabled={loading} className="btn btn-primary px-4 py-2">
                Verify
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={handleSetup} disabled={loading} className="btn btn-primary px-4 py-2">
              Set up authenticator
            </button>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}
      </section>
    </div>
  );
}
