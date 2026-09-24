import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  UploadCloud,
  Users,
  User,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { createProjectProposal } from "@/services/projectProposal.service";

function StudentCreateProposalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [additionalMembers, setAdditionalMembers] = useState([]);
  const [abstractPdf, setAbstractPdf] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Handle Team Size adjustment (teamSize = total members including lead)
  const handleTeamSizeChange = (newSize) => {
    const size = Math.max(1, Math.min(10, Number(newSize) || 1));
    setTeamSize(size);

    const neededAdditional = Math.max(0, size - 1);
    setAdditionalMembers((prev) => {
      const next = [...prev];
      if (next.length < neededAdditional) {
        while (next.length < neededAdditional) {
          next.push({ name: "" });
        }
      } else {
        return next.slice(0, neededAdditional);
      }
      return next;
    });

    if (errors.team) {
      setErrors((prev) => ({ ...prev, team: null }));
    }
  };

  const handleMemberNameChange = (index, value) => {
    setAdditionalMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name: value };
      return next;
    });

    if (errors[`member_${index}`]) {
      setErrors((prev) => ({ ...prev, [`member_${index}`]: null }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setErrors((prev) => ({
        ...prev,
        abstractPdf: "Only PDF documents (.pdf) are allowed.",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        abstractPdf: "File size exceeds 10MB limit.",
      }));
      return;
    }

    setAbstractPdf(file);
    setErrors((prev) => ({ ...prev, abstractPdf: null }));
  };

  const validate = () => {
    const newErrors = {};

    // Title validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Project title is required.";
    } else if (trimmedTitle.length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    } else if (trimmedTitle.length > 150) {
      newErrors.title = "Title cannot exceed 150 characters.";
    }

    // Team Size validation
    if (teamSize < 1 || teamSize > 10) {
      newErrors.team = "Team size must be between 1 and 10 members.";
    }

    const creatorName = (user?.fullName || "").trim().toLowerCase();

    // Additional member names validation
    additionalMembers.forEach((m, idx) => {
      const name = m.name?.trim() || "";
      if (!name) {
        newErrors[`member_${idx}`] = `Team Member ${idx + 1} name is required.`;
      } else if (name.length < 2) {
        newErrors[`member_${idx}`] = "Name must be at least 2 characters.";
      } else if (name.length > 50) {
        newErrors[`member_${idx}`] = "Name cannot exceed 50 characters.";
      } else if (creatorName && name.toLowerCase() === creatorName) {
        newErrors[`member_${idx}`] = "You are already the Project Lead. Please enter a teammate's name.";
      } else if (
        additionalMembers.some(
          (other, oIdx) =>
            oIdx !== idx &&
            (other.name?.trim().toLowerCase() || "") === name.toLowerCase()
        )
      ) {
        newErrors[`member_${idx}`] = "Duplicate team member name entered.";
      }
    });

    // Abstract PDF validation
    if (!abstractPdf) {
      newErrors.abstractPdf = "Abstract document in PDF format is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    const leadName = (user?.fullName || "Student Lead").trim();
    const members = [
      { name: leadName },
      ...additionalMembers.map((m) => ({ name: m.name.trim() })),
    ];

    const payload = {
      title: title.trim(),
      team: {
        size: teamSize,
        members,
      },
      abstractPdf,
    };

    try {
      const response = await createProjectProposal(payload);
      setSuccessData(response?.data || { title: payload.title });
    } catch (err) {
      setServerError(
        err.message ||
          "Failed to submit project proposal. Please check your inputs and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setTeamSize(1);
    setAdditionalMembers([]);
    setAbstractPdf(null);
    setErrors({});
    setServerError(null);
    setSuccessData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- Success State View ---
  if (successData) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
        <div className="rounded-2xl border border-success-200 bg-surface p-8 text-center shadow-nexora-md space-y-5 animate-in fade-in duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-600 shadow-2xs">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Proposal Submitted Successfully!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              <strong className="font-semibold text-foreground">
                &quot;{successData.title || title}&quot;
              </strong>{" "}
              has been submitted for faculty review and institutional approval.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border/80">
            <Link to="/app/student/proposals">
              <Button
                variant="primary"
                size="md"
                className="gap-2 w-full sm:w-auto font-semibold"
              >
                <span>View My Proposals</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              onClick={handleResetForm}
              className="w-full sm:w-auto"
            >
              <span>Submit Another Proposal</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* 1. Page Header & Back Navigation */}
      <div className="space-y-4">
        <Link
          to="/app/student/proposals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Proposals</span>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              New Project Proposal
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Submit your project concept and abstract document for faculty review and institutional approval.
          </p>
        </div>
      </div>

      {/* 2. Proposal Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Server Error Alert */}
        {serverError && (
          <div className="flex items-start gap-2.5 rounded-xl bg-danger-50 p-4 text-xs text-danger-800 border border-danger-200">
            <AlertCircle
              className="h-4 w-4 text-danger-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{serverError}</span>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-nexora-sm">
          {/* Project Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="proposal-title"
              className="block text-xs font-semibold text-foreground"
            >
              Project Title <span className="text-danger-600">*</span>
            </label>
            <input
              id="proposal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              placeholder="e.g. AI-Powered Campus Shuttle Routing System"
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-danger-300 focus:border-danger-500 focus:ring-danger-500/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            {errors.title ? (
              <p className="text-[11px] font-medium text-danger-600">
                {errors.title}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Minimum 5 characters, maximum 150 characters.
              </p>
            )}
          </div>

          {/* Team Composition Section */}
          <div className="space-y-4 rounded-xl border border-border/70 bg-surface-secondary/30 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Team Composition
                </h2>
              </div>

              {/* Team Size Selector */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="team-size-select"
                  className="text-xs font-medium text-muted-foreground whitespace-nowrap"
                >
                  Total Team Size:
                </label>
                <select
                  id="team-size-select"
                  value={teamSize}
                  onChange={(e) => handleTeamSizeChange(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Member (Individual / Solo)" : "Members"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errors.team && (
              <p className="text-[11px] font-medium text-danger-600">
                {errors.team}
              </p>
            )}

            {/* 1. Project Lead / Submitter Card (Automatic & Uneditable) */}
            <div className="rounded-xl border border-border/80 bg-surface p-3.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Project Lead</span>
                </div>
                <span className="rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  Your Account
                </span>
              </div>
              <div className="space-y-0.5 pl-5 text-xs">
                <p className="font-semibold text-foreground">
                  {user?.fullName || "Student Lead"}
                </p>
                {user?.email && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{user.email}</span>
                  </div>
                )}
                <p className="text-[11px] font-medium text-primary flex items-center gap-1 pt-1">
                  <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>Automatically included as Team Lead</span>
                </p>
              </div>
            </div>

            {/* 2. Additional Team Members Section */}
            {teamSize > 1 ? (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Additional Team Members ({additionalMembers.length})
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Excluding project lead
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {additionalMembers.map((member, index) => (
                    <div key={index} className="space-y-1">
                      <label
                        htmlFor={`member-input-${index}`}
                        className="block text-[11px] font-medium text-muted-foreground"
                      >
                        Additional Team Member {index + 1} Name <span className="text-danger-600">*</span>
                      </label>
                      <input
                        id={`member-input-${index}`}
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberNameChange(index, e.target.value)
                        }
                        placeholder={`e.g. Teammate ${index + 1} Full Name`}
                        disabled={isSubmitting}
                        className={`w-full rounded-xl border bg-surface px-3 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 ${
                          errors[`member_${index}`]
                            ? "border-danger-300 focus:border-danger-500 focus:ring-danger-500/20"
                            : "border-border focus:border-primary focus:ring-primary/20"
                        }`}
                      />
                      {errors[`member_${index}`] && (
                        <p className="text-[10px] font-medium text-danger-600">
                          {errors[`member_${index}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface/60 p-3.5 text-center text-xs text-muted-foreground">
                Individual Project — No additional team members required.
              </div>
            )}
          </div>

          {/* Abstract PDF Document Upload */}
          <div className="space-y-2">
            <label
              htmlFor="proposal-abstract-pdf"
              className="block text-xs font-semibold text-foreground"
            >
              Project Abstract Document (PDF) <span className="text-danger-600">*</span>
            </label>

            <input
              ref={fileInputRef}
              id="proposal-abstract-pdf"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              disabled={isSubmitting}
              className="hidden"
            />

            <div
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!isSubmitting) fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload Project Abstract PDF"
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                errors.abstractPdf
                  ? "border-danger-300 bg-danger-50/20 hover:bg-danger-50/40"
                  : abstractPdf
                  ? "border-success-300 bg-success-50/20 hover:bg-success-50/30"
                  : "border-border hover:border-primary/40 hover:bg-surface-secondary/30"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl mb-3 border ${
                  abstractPdf
                    ? "bg-success-50 text-success-600 border-success-200"
                    : "bg-surface-secondary text-muted-foreground border-border/80"
                }`}
              >
                {abstractPdf ? (
                  <CheckCircle2 className="h-6 w-6 text-success-600" aria-hidden="true" />
                ) : (
                  <UploadCloud className="h-6 w-6 text-primary" aria-hidden="true" />
                )}
              </div>

              {abstractPdf ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-success-700">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Selected: {abstractPdf.name}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    ({(abstractPdf.size / 1024).toFixed(1)} KB) · Click to change file
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Click to browse and upload abstract PDF
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    PDF document format required (max 10MB)
                  </p>
                </div>
              )}
            </div>

            {errors.abstractPdf && (
              <p className="text-[11px] font-medium text-danger-600">
                {errors.abstractPdf}
              </p>
            )}
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate("/app/student/proposals")}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="gap-2 font-semibold min-w-[160px] w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Proposal</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StudentCreateProposalPage;
