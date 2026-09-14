import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  MailCheck,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/common/Logo";
import { registerCollege } from "@/services/auth.service";

function CollegeRegistrationPage() {
  const [formData, setFormData] = useState({
    collegeName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [collegeCode, setCollegeCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedCollegeName = formData.collegeName.trim();
    const trimmedAdminName = formData.adminName.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedCollegeName) {
      newErrors.collegeName = "College name is required.";
    } else if (trimmedCollegeName.length < 3 || trimmedCollegeName.length > 100) {
      newErrors.collegeName = "College name must be between 3 and 100 characters.";
    }

    if (!trimmedAdminName) {
      newErrors.adminName = "Admin name is required.";
    } else if (trimmedAdminName.length < 3 || trimmedAdminName.length > 50) {
      newErrors.adminName = "Admin name must be between 3 and 50 characters.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8 || formData.password.length > 32) {
      newErrors.password = "Password must be between 8 and 32 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setServerError("");
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await registerCollege({
        collegeName: formData.collegeName.trim(),
        adminName: formData.adminName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const generatedCode =
        response?.data?.collegeCode || response?.collegeCode || "";
      setCollegeCode(generatedCode);
      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = async () => {
    if (!collegeCode) return;
    try {
      await navigator.clipboard.writeText(collegeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  // Success State View
  if (isSuccess) {
    return (
      <div className="w-full max-w-md px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-nexora-sm sm:p-8 space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary border border-primary/20">
            <MailCheck className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Check your email
            </h1>
            <p className="text-sm font-semibold text-foreground">
              Your Nexora account has been created successfully.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We&apos;ve sent a verification link to your email address. Please check your inbox and verify your email before signing in.
            </p>
          </div>

          {/* College Code Display Card */}
          {collegeCode && (
            <div className="rounded-xl border border-border bg-surface-secondary p-4 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your College Code
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  aria-label="Copy college code"
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-success-600" />
                      <span className="text-success-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-2 font-mono text-xl font-bold tracking-wider text-foreground">
                {collegeCode}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Share this code with students from your college so they can join your workspace during registration.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <Link to="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full justify-center shadow-nexora-sm">
                Sign in
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam or junk folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4 py-8 sm:px-6">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to account type selection
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center transition-opacity hover:opacity-90 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Logo size="lg" textClassName="text-xl" />
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Register College
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Create your college workspace and administrator account.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm sm:p-8">
        {/* Server Error Alert */}
        {serverError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger-100 bg-danger-50 p-3.5 text-xs font-medium text-danger-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* College Name */}
          <Input
            id="collegeName"
            name="collegeName"
            type="text"
            label="College / Institution Name"
            icon={Building2}
            autoComplete="organization"
            value={formData.collegeName}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.collegeName}
            placeholder="ABC College of Arts & Science"
          />

          {/* Admin Name */}
          <Input
            id="adminName"
            name="adminName"
            type="text"
            label="Administrator Full Name"
            icon={User}
            autoComplete="name"
            value={formData.adminName}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.adminName}
            placeholder="Dr. Suresh Patil"
          />

          {/* Email */}
          <Input
            id="email"
            name="email"
            type="email"
            label="Official Email"
            icon={Mail}
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.email}
            placeholder="admin@gmail.com"
          />

          {/* Password */}
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            icon={Lock}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.password}
            placeholder="••••••••"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {/* Confirm Password */}
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            icon={Lock}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.confirmPassword}
            placeholder="••••••••"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={
                  showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full justify-center shadow-nexora-sm"
            >
              Create college account
            </Button>
          </div>
        </form>
      </div>

      {/* Sign In Link Footer */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default CollegeRegistrationPage;
