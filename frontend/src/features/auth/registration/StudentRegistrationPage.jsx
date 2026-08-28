import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, MailCheck, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/common/Logo";
import { registerStudent } from "@/services/auth.service";

function StudentRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    collegeCode: "",
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
    const trimmedFullName = formData.fullName.trim();
    const trimmedCollegeCode = formData.collegeCode.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedFullName) {
      newErrors.fullName = "Full name is required.";
    } else if (trimmedFullName.length < 3 || trimmedFullName.length > 50) {
      newErrors.fullName = "Full name must be between 3 and 50 characters.";
    }

    if (!trimmedCollegeCode) {
      newErrors.collegeCode = "College code is required.";
    } else if (trimmedCollegeCode.length < 5 || trimmedCollegeCode.length > 15) {
      newErrors.collegeCode = "College code must be between 5 and 15 characters.";
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
      await registerStudent({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        collegeCode: formData.collegeCode.trim().toUpperCase(),
      });
      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State View
  if (isSuccess) {
    return (
      <div className="w-full max-w-md px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-nexora-sm sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your Nexora student account has been created successfully. Please check your email to
            verify your account before logging in.
          </p>
          <div className="mt-6 border-t border-border pt-6">
            <Link to="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full justify-center">
                Go to Login
              </Button>
            </Link>
          </div>
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
          Student Registration
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Create your student account to join your college workspace.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm sm:p-8">
        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger-100 bg-danger-50 p-3.5 text-xs font-medium text-danger-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-1 block text-xs font-semibold text-foreground">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                errors.fullName ? "border-danger-500" : "border-border hover:border-border-strong"
              }`}
              placeholder="e.g. Raja Kumar"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs font-medium text-danger-600">{errors.fullName}</p>
            )}
          </div>

          {/* College Code */}
          <div>
            <label
              htmlFor="collegeCode"
              className="mb-1 block text-xs font-semibold text-foreground"
            >
              College Code
            </label>
            <input
              id="collegeCode"
              name="collegeCode"
              type="text"
              value={formData.collegeCode}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                errors.collegeCode ? "border-danger-500" : "border-border hover:border-border-strong"
              }`}
              placeholder="e.g. ABC-GS1HE"
            />
            {errors.collegeCode && (
              <p className="mt-1 text-xs font-medium text-danger-600">{errors.collegeCode}</p>
            )}
          </div>

          {/* Email */}
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
              placeholder="raja@student.com"
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
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-xs font-semibold text-foreground"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full rounded-md border bg-surface px-3 py-2 pr-10 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  errors.confirmPassword
                    ? "border-danger-500"
                    : "border-border hover:border-border-strong"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
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
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs font-medium text-danger-600">{errors.confirmPassword}</p>
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
              Create Student Account
            </Button>
          </div>
        </form>
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

export default StudentRegistrationPage;
