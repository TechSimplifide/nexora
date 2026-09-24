import { useState, useRef } from "react";
import {
  X,
  FileText,
  UploadCloud,
  Users,
  User,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  createProjectProposal,
  updateRejectedProjectProposal,
} from "@/services/projectProposal.service";

function ProposalFormContent({ onClose, onSuccess, proposalToEdit }) {
  const { user } = useAuth();
  const isEditMode = Boolean(proposalToEdit);
  const fileInputRef = useRef(null);

  const creatorName = (
    user?.fullName ||
    proposalToEdit?.createdBy?.fullName ||
    ""
  )
    .trim()
    .toLowerCase();

  // Initialize state directly from props without setState in effect
  const [title, setTitle] = useState(() => proposalToEdit?.title || "");
  const [teamSize, setTeamSize] = useState(() => {
    return proposalToEdit?.team?.size || 1;
  });

  const [additionalMembers, setAdditionalMembers] = useState(() => {
    const size = proposalToEdit?.team?.size || 1;
    const needed = Math.max(0, size - 1);
    const existingMembers = Array.isArray(proposalToEdit?.team?.members)
      ? proposalToEdit.team.members
      : [];

    // Filter out creator name if it was stored in legacy proposal members
    const filtered = existingMembers
      .map((m) => ({ name: m.name || "" }))
      .filter((m) => m.name.trim().toLowerCase() !== creatorName);

    const padded = [...filtered];
    while (padded.length < needed) {
      padded.push({ name: "" });
    }
    return padded.slice(0, needed);
  });

  const [abstractPdf, setAbstractPdf] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

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

    // Member names validation
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
    if (!isEditMode && !abstractPdf) {
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

    const currentLead = (
      user?.fullName ||
      proposalToEdit?.createdBy?.fullName ||
      "Student Lead"
    ).trim();

    const members = [
      { name: currentLead },
      ...additionalMembers.map((m) => ({ name: m.name.trim() })),
    ];

    const payload = {
      title: title.trim(),
      team: {
        size: teamSize,
        members,
      },
      abstractPdf: abstractPdf || undefined,
    };

    try {
      let response;
      if (isEditMode) {
        response = await updateRejectedProjectProposal({
          proposalId: proposalToEdit._id,
          ...payload,
        });
      } else {
        response = await createProjectProposal(payload);
      }

      onSuccess(response?.data, isEditMode);
      onClose();
    } catch (err) {
      setServerError(
        err.message ||
          "Failed to submit project proposal. Please check your inputs."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const leadName = user?.fullName || proposalToEdit?.createdBy?.fullName || "Student Lead";
  const leadEmail = user?.email || proposalToEdit?.createdBy?.email;

  return (
    <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-nexora-lg">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
            <FileText className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="proposal-modal-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              {isEditMode ? "Edit & Resubmit Proposal" : "New Project Proposal"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isEditMode
                ? "Update rejected details and resubmit for faculty approval."
                : "Submit your project concept and abstract document for admin review."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close modal"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-secondary hover:text-foreground transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Form Body */}
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
      >
        {/* Server Error Alert */}
        {serverError && (
          <div className="flex items-start gap-2.5 rounded-xl bg-danger-50 p-3.5 text-xs text-danger-800 border border-danger-200">
            <AlertCircle
              className="h-4 w-4 text-danger-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{serverError}</span>
          </div>
        )}

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
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.title
                ? "border-danger-500 focus:border-danger-500"
                : "border-border focus:border-primary"
            }`}
          />
          {errors.title && (
            <p className="text-[11px] font-medium text-danger-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Team Composition Section */}
        <div className="space-y-4 rounded-xl border border-border/80 bg-surface-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Team Composition</span>
            </div>

            {/* Team Size Selector */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="team-size"
                className="text-xs font-medium text-muted-foreground whitespace-nowrap"
              >
                Total Team Size:
              </label>
              <select
                id="team-size"
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

          {/* Project Lead Card (Automatic) */}
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
              <p className="font-semibold text-foreground">{leadName}</p>
              {leadEmail && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>{leadEmail}</span>
                </div>
              )}
              <p className="text-[11px] font-medium text-primary flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Automatically included as Team Lead</span>
              </p>
            </div>
          </div>

          {/* Additional Team Members */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {additionalMembers.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <label
                      htmlFor={`modal-member-input-${idx}`}
                      className="block text-[11px] font-medium text-muted-foreground"
                    >
                      Additional Team Member {idx + 1} Name <span className="text-danger-600">*</span>
                    </label>
                    <input
                      id={`modal-member-input-${idx}`}
                      type="text"
                      value={m.name}
                      onChange={(e) => handleMemberNameChange(idx, e.target.value)}
                      placeholder={`e.g. Teammate ${idx + 1} Full Name`}
                      disabled={isSubmitting}
                      className={`w-full rounded-lg border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors[`member_${idx}`]
                          ? "border-danger-500 focus:border-danger-500"
                          : "border-border focus:border-primary"
                      }`}
                    />
                    {errors[`member_${idx}`] && (
                      <p className="text-[10px] font-medium text-danger-600">
                        {errors[`member_${idx}`]}
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

        {/* Abstract PDF Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-foreground">
            Abstract Document (PDF){" "}
            {!isEditMode && <span className="text-danger-600">*</span>}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="abstract-pdf-input"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload abstract PDF document"
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              errors.abstractPdf
                ? "border-danger-400 bg-danger-50/30 hover:bg-danger-50/50"
                : "border-border hover:border-primary hover:bg-surface-secondary/40"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary mb-2 border border-primary/20">
              <UploadCloud className="h-5 w-5" aria-hidden="true" />
            </div>

            {abstractPdf ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-success-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>Selected: {abstractPdf.name}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  ({(abstractPdf.size / 1024).toFixed(1)} KB) · Click to change file
                </p>
              </div>
            ) : isEditMode && proposalToEdit?.abstractPdf?.url ? (
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">
                  Existing abstract PDF attached
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Click here if you wish to upload a revised PDF.
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

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="gap-2 font-semibold min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>{isEditMode ? "Resubmit Proposal" : "Submit Proposal"}</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProjectProposalModal({ isOpen, onClose, onSuccess, proposalToEdit }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <ProposalFormContent
        key={proposalToEdit?._id || "new-proposal"}
        onClose={onClose}
        onSuccess={onSuccess}
        proposalToEdit={proposalToEdit}
      />
    </div>
  );
}

export default ProjectProposalModal;
