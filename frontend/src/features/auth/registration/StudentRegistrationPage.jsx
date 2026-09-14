import { useState } from "react";
import { Link } from "react-router-dom";
import { User, KeyRound, Mail, Lock, Eye, EyeOff, ArrowLeft, MailCheck, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger-100 bg-danger-50 p-3.5 text-xs font-medium text-danger-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <Input
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            icon={User}
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.fullName}
            placeholder="Rohit Sharma"
          />

          {/* College Code */}
          <Input
            id="collegeCode"
            name="collegeCode"
            type="text"
            label="College Code"
            icon={KeyRound}
            autoComplete="off"
            autoCapitalize="characters"
            className="uppercase tracking-wide"
            value={formData.collegeCode}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.collegeCode}
            placeholder="ABC-GS1HE"
          />

          {/* Email */}
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            icon={Mail}
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            error={errors.email}
            placeholder="student@gmail.com"
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
              Create student account
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

export default StudentRegistrationPage;
