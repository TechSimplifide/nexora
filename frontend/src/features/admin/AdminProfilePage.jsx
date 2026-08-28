import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Building,
  Hash,
  LogOut,
  AtSign,
  Camera,
  Trash2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useProfileImage } from "@/hooks/useProfileImage";
import Button from "@/components/ui/Button";

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function AdminProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const userId = user?._id || user?.id || user?.role || "admin";
  const { profileImage, saveImage, removeImage } = useProfileImage(userId);

  const [imageError, setImageError] = useState(null);
  const [copied, setCopied] = useState(false);

  const collegeName =
    user?.college?.name ||
    (typeof user?.college === "string" ? user.college : null);
  const collegeCode = user?.college?.collegeCode || null;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCopyCollegeCode = async () => {
    if (!collegeCode) return;
    try {
      await navigator.clipboard.writeText(collegeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy college code:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Unsupported image format. Please choose JPG, PNG, or WebP.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size (max 2 MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError("Image is too large. Please choose an image smaller than 2 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      try {
        saveImage(reader.result);
      } catch {
        setImageError("Failed to save image. Storage quota may be full.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      setImageError("Failed to read image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setImageError(null);
    removeImage();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Profile
          </h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Manage your account and college workspace information.
        </p>
      </div>

      {/* 2. User Identity & Photo Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-border/80">
          {/* Avatar Photo / Initials Fallback */}
          <div className="relative group flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-2xl font-bold text-primary border-2 border-primary/20 shadow-2xs shrink-0 overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user?.fullName || "Administrator"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{getInitials(user?.fullName)}</span>
            )}
          </div>

          {/* Photo Actions & User Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {user?.fullName || "Administrator"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                <Shield className="h-3 w-3" aria-hidden="true" />
                {user?.role || "ADMIN"}
              </span>
            </div>

            {/* Photo Upload Controls */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile photo"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5 text-xs font-semibold"
              >
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{profileImage ? "Change Photo" : "Upload Photo"}</span>
              </Button>

              {profileImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="gap-1.5 text-xs font-semibold text-danger-700 hover:text-danger-800 hover:border-danger-200"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Remove Photo</span>
                </Button>
              )}

              <span className="text-[11px] text-muted-foreground">
                JPG, PNG or WebP. Max 2 MB.
              </span>
            </div>

            {imageError && (
              <div className="flex items-center gap-1.5 text-xs text-danger-700 pt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{imageError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Full Name</span>
              </div>
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.fullName || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Email Address</span>
              </div>
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.email || "Not provided"}
              </p>
            </div>

            {user?.username && (
              <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1 sm:col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AtSign className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Username</span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.username}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. College Workspace Section */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-bold text-foreground">
            College Workspace
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Institution Name</span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">
              {collegeName || "Nexora Workspace"}
            </p>
          </div>

          {collegeCode && (
            <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>College Code</span>
                </div>
                {copied && (
                  <span className="text-[11px] font-medium text-success-700 animate-in fade-in duration-150">
                    Copied!
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="font-mono text-sm font-semibold text-foreground truncate">
                  {collegeCode}
                </p>
                <button
                  type="button"
                  onClick={handleCopyCollegeCode}
                  aria-label="Copy college code"
                  title="Copy college code"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-foreground border border-border/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success-600" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Account Actions / Logout */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Account Session
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            End your current active session on this device.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleLogout}
            className="gap-2 text-xs font-semibold"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfilePage;
