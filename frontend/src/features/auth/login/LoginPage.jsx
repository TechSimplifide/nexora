import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Check, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/features/auth/context/AuthContext";
import { resendVerificationEmail } from "@/services/auth.service";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false);

  // Resend verification state
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");

  const from = location.state?.from?.pathname || "/app";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
      setIsUnverified(false);
      setResendSuccess("");
      setResendError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = formData.email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setServerError("");
    setIsUnverified(false);
    setResendSuccess("");
    setResendError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      navigate(from, { replace: true });
    } catch (err) {
      const message = err.message || "Something went wrong. Please try again.";
      setServerError(message);

      if (
        err.status === 403 ||
        message.toLowerCase().includes("verify your email")
      ) {
        setIsUnverified(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (isResending) return;

    const trimmedEmail = formData.email.trim().toLowerCase();
    if (!trimmedEmail) {
      setResendError("Please enter your email address to resend verification.");
      return;
    }

    setIsResending(true);
    setResendError("");
    setResendSuccess("");

    try {
      await resendVerificationEmail(trimmedEmail);
      setResendSuccess("Verification email sent successfully. Please check your inbox.");
    } catch (err) {
      setResendError(err.message || "Failed to resend verification email.");
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

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Log in to continue to your Nexora workspace.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm sm:p-8">
        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-5 rounded-lg border border-danger-100 bg-danger-50 p-3.5 text-xs font-medium text-danger-700">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
              <div className="flex-1">
                <span>{serverError}</span>

                {/* Resend Verification Action if Email Unverified */}
                {isUnverified && (
                  <div className="mt-2.5 border-t border-danger-200/60 pt-2.5">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="inline-flex items-center gap-1.5 font-semibold text-danger-800 underline underline-offset-2 hover:text-danger-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 rounded-sm"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Sending verification email...</span>
                        </>
                      ) : (
                        <span>Resend verification email</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resend Success Alert */}
        {resendSuccess && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 p-3.5 text-xs font-medium text-success-700">
            <Check className="h-4 w-4 shrink-0 text-success-600" />
            <span>{resendSuccess}</span>
          </div>
        )}

        {/* Resend Error Alert */}
        {resendError && (
          <div className="mb-5 flex items-start gap-2 rounded-lg border border-danger-100 bg-danger-50 p-3.5 text-xs font-medium text-danger-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
            <span>{resendError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Address */}
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-foreground">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                errors.email ? "border-danger-500" : "border-border hover:border-border-strong"
              }`}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-danger-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full rounded-md border bg-surface px-3 py-2 pr-10 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  errors.password ? "border-danger-500" : "border-border hover:border-border-strong"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-danger-600">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full justify-center"
            >
              Login
            </Button>
          </div>
        </form>
      </div>

      {/* Registration Link Footer */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
