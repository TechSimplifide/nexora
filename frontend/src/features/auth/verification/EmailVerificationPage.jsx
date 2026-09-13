import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2, Check, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/common/Logo";
import { verifyEmail, resendVerificationEmail } from "@/services/auth.service";

function EmailVerificationPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendError, setResendError] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    async function handleVerification() {
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid or expired verification link");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.message || "Invalid or expired verification link");
      }
    }

    handleVerification();
  }, [token]);

  const handleResendSubmit = async (e) => {
    e.preventDefault();
    if (isResending) return;

    setResendError("");
    setResendSuccess("");

    const trimmedEmail = resendEmail.trim();
    if (!trimmedEmail) {
      setResendError("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setResendError("Please enter a valid email address.");
      return;
    }

    setIsResending(true);

    try {
      await resendVerificationEmail(trimmedEmail);
      setResendSuccess("Verification email sent successfully. Please check your inbox.");
      setResendEmail("");
    } catch (err) {
      setResendError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8 sm:px-6">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center transition-opacity hover:opacity-90 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Logo size="lg" textClassName="text-xl" />
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-nexora-sm sm:p-8">
        {/* Loading State */}
        {status === "loading" && (
          <div className="py-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Verifying email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifying your email address, please wait...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Email verified successfully</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your account has been verified. You can now log in to your Nexora workspace.
            </p>
            <div className="mt-6 border-t border-border pt-6">
              <Link to="/login" className="block w-full">
                <Button variant="primary" size="md" className="w-full justify-center shadow-nexora-sm">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Invalid / Expired Token State + Resend Form */}
        {status === "error" && (
          <div className="text-left">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-50 text-danger-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-center text-xl font-bold text-foreground">
              Invalid or expired verification link
            </h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
              {errorMessage || "The verification link is invalid or has expired."} Enter your email
              address below to receive a new verification link.
            </p>

            {/* Resend Success Alert */}
            {resendSuccess && (
              <div
                role="status"
                className="mt-5 flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 p-3.5 text-xs font-medium text-success-700"
              >
                <Check className="h-4 w-4 shrink-0 text-success-600" />
                <span>{resendSuccess}</span>
              </div>
            )}

            {/* Resend Error Alert */}
            {resendError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-lg border border-danger-100 bg-danger-50 p-3.5 text-xs font-medium text-danger-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
                <span>{resendError}</span>
              </div>
            )}

            {/* Resend Verification Form */}
            <form onSubmit={handleResendSubmit} noValidate className="mt-5 space-y-4">
              <Input
                id="resendEmail"
                name="resendEmail"
                type="email"
                label="Email Address"
                icon={Mail}
                autoComplete="email"
                value={resendEmail}
                onChange={(e) => {
                  setResendEmail(e.target.value);
                  if (resendError) setResendError("");
                }}
                disabled={isResending}
                error={resendError}
                placeholder="you@college.edu"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isResending}
                disabled={isResending}
                className="w-full justify-center shadow-nexora-sm"
              >
                Resend Verification Email
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Login Link Footer */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
