import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FolderKanban,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe,
  Lock,
  Layers,
  Building,
  GraduationCap,
  Info,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getProjectById, updateProject } from "@/services/project.service";
import Button from "@/components/ui/Button";
import PdfViewerModal from "@/components/common/PdfViewerModal";

const COMMON_DOMAINS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile App Development",
  "Cloud Computing & DevOps",
  "Cybersecurity",
  "Internet of Things (IoT)",
  "Blockchain & Web3",
  "Data Science & Analytics",
  "Embedded Systems",
  "Healthcare Technology",
  "FinTech",
  "AR / VR & Game Development",
];

const COMMON_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Electronics & Telecommunication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Computer Applications (MCA/BCA)",
];

function getAcademicYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = -3; i <= 2; i++) {
    const start = currentYear + i;
    const end = String(start + 1).slice(-2);
    years.push(`${start}-${end}`);
  }
  return years;
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function StudentEditProjectPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [initialFetchError, setInitialFetchError] = useState(null);
  const [isOwner, setIsOwner] = useState(true);

  // Form Field States
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [department, setDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  // Technologies (Tags)
  const [technologies, setTechnologies] = useState([]);
  const [techInput, setTechInput] = useState("");

  // Team Members
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  // Links & Access Levels
  const [githubUrl, setGithubUrl] = useState("");
  const [githubAccess, setGithubAccess] = useState("public");
  const [deployedUrl, setDeployedUrl] = useState("");
  const [deployedAccess, setDeployedAccess] = useState("public");

  // Existing Files from DB
  const [existingScreenshots, setExistingScreenshots] = useState([]);
  const [existingDocument, setExistingDocument] = useState(null);

  // New Replacement Files
  const [newDocumentFile, setNewDocumentFile] = useState(null);
  const [newScreenshotFiles, setNewScreenshotFiles] = useState([]);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  // Form Submission & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Fetch Existing Project Data on mount
  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      if (!id) return;
      setIsLoading(true);
      setInitialFetchError(null);

      try {
        const response = await getProjectById(id);
        const proj = response?.data;

        if (!proj) {
          throw new Error("Project not found");
        }

        if (!isMounted) return;

        // Verify ownership
        const currentUserId = user?._id || user?.id;
        const creatorId =
          proj.createdBy?._id ||
          proj.createdBy?.id ||
          (typeof proj.createdBy === "string" ? proj.createdBy : null);

        if (!currentUserId || !creatorId || currentUserId !== creatorId) {
          setIsOwner(false);
          setIsLoading(false);
          return;
        }

        setIsOwner(true);
        setTitle(proj.title || "");
        setSummary(proj.summary || "");
        setDescription(proj.description || "");
        setDomain(proj.domain || "");
        setDepartment(proj.department || user?.department || "");
        setAcademicYear(proj.academicYear || "");
        setTechnologies(Array.isArray(proj.technologies) ? proj.technologies : []);

        setTeamMembers(
          Array.isArray(proj.teamMembers) && proj.teamMembers.length > 0
            ? proj.teamMembers.map((m, idx) => ({
                name: m.name || "",
                role: m.role || "Team Member",
                isCreator: idx === 0,
              }))
            : [
                {
                  name: user?.fullName || "Student Creator",
                  role: "Project Lead",
                  isCreator: true,
                },
              ]
        );

        setGithubUrl(proj.github?.url || "");
        setGithubAccess(proj.github?.access || "public");
        setDeployedUrl(proj.deployedLink?.url || "");
        setDeployedAccess(proj.deployedLink?.access || "public");

        setExistingScreenshots(
          Array.isArray(proj.screenshots) ? proj.screenshots.filter((s) => s?.url) : []
        );
        setExistingDocument(proj.supportingDocument || null);
      } catch (err) {
        if (isMounted) {
          setInitialFetchError(err.message || "Failed to load project details.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  // Mark form as dirty when fields change
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // --- Handlers: Technologies ---
  const handleAddTechnology = (e) => {
    e?.preventDefault();
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      if (technologies.length >= 20) {
        setFormErrors((prev) => ({
          ...prev,
          technologies: "Maximum 20 technologies allowed",
        }));
        return;
      }
      setTechnologies([...technologies, trimmed]);
      setTechInput("");
      setFormErrors((prev) => ({ ...prev, technologies: null }));
      markDirty();
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    setTechnologies(technologies.filter((t) => t !== techToRemove));
    markDirty();
  };

  // --- Handlers: Team Members ---
  const handleAddTeamMember = () => {
    const trimmedName = newMemberName.trim();
    if (!trimmedName) {
      setFormErrors((prev) => ({
        ...prev,
        teamMember: "Member name is required",
      }));
      return;
    }
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setFormErrors((prev) => ({
        ...prev,
        teamMember: "Name must be between 2 and 100 characters",
      }));
      return;
    }

    setTeamMembers([
      ...teamMembers,
      {
        name: trimmedName,
        role: newMemberRole.trim() || "Team Member",
        isCreator: false,
      },
    ]);
    setNewMemberName("");
    setNewMemberRole("");
    setFormErrors((prev) => ({ ...prev, teamMember: null }));
    markDirty();
  };

  const handleRemoveTeamMember = (indexToRemove) => {
    setTeamMembers(teamMembers.filter((_, idx) => idx !== indexToRemove));
    markDirty();
  };

  // --- Handlers: Document Replacement (PDF) ---
  const handleDocumentChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFormErrors((prev) => ({
        ...prev,
        supportingDocument: "Only PDF files are allowed for supporting documents",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        supportingDocument: "Supporting document must be smaller than 5 MB",
      }));
      return;
    }

    setNewDocumentFile(file);
    setFormErrors((prev) => ({ ...prev, supportingDocument: null }));
    markDirty();
  };

  const handleCancelDocumentReplacement = () => {
    setNewDocumentFile(null);
  };

  // --- Handlers: Screenshots Replacement ---
  const handleScreenshotsChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const newValidFiles = [];
    let errorMessage = null;

    if (newScreenshotFiles.length + files.length > 5) {
      setFormErrors((prev) => ({
        ...prev,
        screenshots: "You can upload a maximum of 5 screenshots",
      }));
      return;
    }

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        errorMessage = "Only JPG, PNG, and WebP images are allowed";
        break;
      }
      if (file.size > 5 * 1024 * 1024) {
        errorMessage = "Each screenshot must be smaller than 5 MB";
        break;
      }
      newValidFiles.push(file);
    }

    if (errorMessage) {
      setFormErrors((prev) => ({ ...prev, screenshots: errorMessage }));
      return;
    }

    setNewScreenshotFiles([...newScreenshotFiles, ...newValidFiles]);
    setFormErrors((prev) => ({ ...prev, screenshots: null }));
    markDirty();
  };

  const handleRemoveNewScreenshot = (indexToRemove) => {
    setNewScreenshotFiles(newScreenshotFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearNewScreenshots = () => {
    setNewScreenshotFiles([]);
  };

  // --- Handle Cancel Navigation with Unsaved Guard ---
  const handleCancel = () => {
    if (
      isDirty &&
      !window.confirm("You have unsaved changes. Are you sure you want to leave without saving?")
    ) {
      return;
    }
    navigate(`/app/student/projects/${id}`);
  };

  // --- Form Validation ---
  const validateForm = () => {
    const errors = {};

    if (!title.trim() || title.trim().length < 3 || title.trim().length > 100) {
      errors.title = "Project title must be between 3 and 100 characters";
    }

    if (
      !summary.trim() ||
      summary.trim().length < 20 ||
      summary.trim().length > 500
    ) {
      errors.summary =
        "Summary must be between 20 and 500 characters";
    }

    if (
      !description.trim() ||
      description.trim().length < 50 ||
      description.trim().length > 5000
    ) {
      errors.description =
        "Description must be between 50 and 5000 characters";
    }

    if (
      !domain.trim() ||
      domain.trim().length < 2 ||
      domain.trim().length > 50
    ) {
      errors.domain = "Please specify a project domain (2-50 characters)";
    }

    if (
      !department.trim() ||
      department.trim().length < 2 ||
      department.trim().length > 100
    ) {
      errors.department = "Please specify a department (2-100 characters)";
    }

    if (!academicYear.trim() || !/^\d{4}-\d{2}$/.test(academicYear.trim())) {
      errors.academicYear = "Academic year must follow the YYYY-YY format (e.g. 2025-26)";
    }

    if (technologies.length === 0) {
      errors.technologies = "Please specify at least one technology";
    }

    if (teamMembers.length === 0) {
      errors.teamMembers = "At least one team member is required";
    }

    if (githubUrl.trim() && !isValidUrl(githubUrl.trim())) {
      errors.github = "Please enter a valid URL (e.g. https://github.com/user/project)";
    }

    if (deployedUrl.trim() && !isValidUrl(deployedUrl.trim())) {
      errors.deployedLink = "Please enter a valid URL (e.g. https://myproject.app)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Submit Update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("summary", summary.trim());
      formData.append("description", description.trim());
      formData.append("domain", domain.trim());
      formData.append("department", department.trim());
      formData.append("academicYear", academicYear.trim());
      formData.append("technologies", JSON.stringify(technologies));

      const sanitizedMembers = teamMembers.map((m) => ({
        name: m.name.trim(),
        role: m.role?.trim() || "Team Member",
      }));
      formData.append("teamMembers", JSON.stringify(sanitizedMembers));

      if (githubUrl.trim()) {
        formData.append(
          "github",
          JSON.stringify({
            url: githubUrl.trim(),
            access: githubAccess,
          })
        );
      } else {
        formData.append(
          "github",
          JSON.stringify({ url: "", access: "public" })
        );
      }

      if (deployedUrl.trim()) {
        formData.append(
          "deployedLink",
          JSON.stringify({
            url: deployedUrl.trim(),
            access: deployedAccess,
          })
        );
      } else {
        formData.append(
          "deployedLink",
          JSON.stringify({ url: "", access: "public" })
        );
      }

      // If user provided a new replacement document
      if (newDocumentFile) {
        formData.append("supportingDocument", newDocumentFile);
      }

      // If user provided a new replacement screenshot set
      if (newScreenshotFiles.length > 0) {
        newScreenshotFiles.forEach((file) => {
          formData.append("screenshots", file);
        });
      }

      await updateProject(id, formData);
      setSuccessMessage("Project updated successfully!");
      setIsDirty(false);

      // Redirect back to project detail after brief confirmation
      setTimeout(() => {
        navigate(`/app/student/projects/${id}`, { replace: true });
      }, 1000);
    } catch (err) {
      setApiError(
        err.message ||
          "Failed to update project. Please check the entered fields and try again."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm font-semibold text-muted-foreground">
          Loading project data for editing...
        </p>
      </div>
    );
  }

  // Not Owner or Error State
  if (!isOwner || initialFetchError) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-nexora-md space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 shadow-2xs">
            <AlertCircle className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">
              {!isOwner ? "Unauthorized Access" : "Unable to Load Project"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {!isOwner
                ? "You do not have permission to edit this project. Only the project author can make changes."
                : initialFetchError || "The project could not be retrieved from the archive."}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link to={`/app/student/projects/${id}`}>
              <Button variant="outline" size="sm">
                <span>View Project</span>
              </Button>
            </Link>
            <Link to="/app/student/projects">
              <Button variant="primary" size="sm">
                <span>Projects Catalog</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* 1. Header & Navigation */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Project Details</span>
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <FolderKanban className="h-4 w-4" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Edit Project
            </h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Update your project information, team roster, repository links, documentation, and screenshots.
          </p>
        </div>
      </div>

      {/* Global API Error Alert */}
      {apiError && (
        <div className="flex items-start gap-3 rounded-2xl border border-danger-200 bg-danger-50 p-4 text-xs text-danger-800 shadow-nexora-sm animate-in fade-in duration-150">
          <AlertCircle className="h-5 w-5 text-danger-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 flex-1">
            <p className="font-semibold">Update Failed</p>
            <p className="leading-relaxed">{apiError}</p>
          </div>
          <button
            type="button"
            onClick={() => setApiError(null)}
            className="text-danger-600 hover:text-danger-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-success-200 bg-success-50 p-4 text-xs text-success-800 shadow-nexora-sm animate-in fade-in duration-150">
          <CheckCircle2 className="h-5 w-5 text-success-600 shrink-0" aria-hidden="true" />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ============================================================ */}
        {/* SECTION 1: PROJECT INFORMATION */}
        {/* ============================================================ */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-6">
          <div className="border-b border-border/80 pb-4">
            <h2 className="text-base font-bold text-foreground">
              1. Project Information
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Core academic details and scope of your completed project.
            </p>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="edit-project-title" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Project Title</span>
                <span className="text-danger-600">*</span>
              </label>
              <input
                id="edit-project-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  markDirty();
                }}
                maxLength={100}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  formErrors.title
                    ? "border-danger-300 focus-visible:ring-danger-500 bg-danger-50/20"
                    : "border-border focus-visible:ring-primary bg-surface"
                }`}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                {formErrors.title ? (
                  <span className="text-danger-600 font-medium">{formErrors.title}</span>
                ) : (
                  <span>3-100 characters</span>
                )}
                <span>{title.length}/100</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label htmlFor="edit-project-summary" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Summary / Abstract</span>
                <span className="text-danger-600">*</span>
              </label>
              <textarea
                id="edit-project-summary"
                rows={3}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  markDirty();
                }}
                maxLength={500}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  formErrors.summary
                    ? "border-danger-300 focus-visible:ring-danger-500 bg-danger-50/20"
                    : "border-border focus-visible:ring-primary bg-surface"
                }`}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                {formErrors.summary ? (
                  <span className="text-danger-600 font-medium">{formErrors.summary}</span>
                ) : (
                  <span>20-500 characters overview</span>
                )}
                <span>{summary.length}/500</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="edit-project-description" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Detailed Description</span>
                <span className="text-danger-600">*</span>
              </label>
              <textarea
                id="edit-project-description"
                rows={6}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  markDirty();
                }}
                maxLength={5000}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  formErrors.description
                    ? "border-danger-300 focus-visible:ring-danger-500 bg-danger-50/20"
                    : "border-border focus-visible:ring-primary bg-surface"
                }`}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                {formErrors.description ? (
                  <span className="text-danger-600 font-medium">{formErrors.description}</span>
                ) : (
                  <span>50-5000 characters technical body</span>
                )}
                <span>{description.length}/5000</span>
              </div>
            </div>

            {/* Domain, Department, Academic Year */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Domain */}
              <div className="space-y-1.5">
                <label htmlFor="edit-project-domain" className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Domain</span>
                  <span className="text-danger-600">*</span>
                </label>
                <input
                  id="edit-project-domain"
                  type="text"
                  list="domain-options"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    markDirty();
                  }}
                  maxLength={50}
                  className={`w-full rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    formErrors.domain
                      ? "border-danger-300 focus-visible:ring-danger-500 bg-danger-50/20"
                      : "border-border focus-visible:ring-primary bg-surface"
                  }`}
                />
                <datalist id="domain-options">
                  {COMMON_DOMAINS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
                {formErrors.domain && (
                  <p className="text-[11px] text-danger-600 font-medium">{formErrors.domain}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label htmlFor="edit-project-department" className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Department</span>
                  <span className="text-danger-600">*</span>
                </label>
                <input
                  id="edit-project-department"
                  type="text"
                  list="department-options"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    markDirty();
                  }}
                  maxLength={100}
                  className={`w-full rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    formErrors.department
                      ? "border-danger-300 focus-visible:ring-danger-500 bg-danger-50/20"
                      : "border-border focus-visible:ring-primary bg-surface"
                  }`}
                />
                <datalist id="department-options">
                  {COMMON_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
                {formErrors.department && (
                  <p className="text-[11px] text-danger-600 font-medium">{formErrors.department}</p>
                )}
              </div>

              {/* Academic Year */}
              <div className="space-y-1.5">
                <label htmlFor="edit-project-academic-year" className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Academic Year</span>
                  <span className="text-danger-600">*</span>
                </label>
                <select
                  id="edit-project-academic-year"
                  value={academicYear}
                  onChange={(e) => {
                    setAcademicYear(e.target.value);
                    markDirty();
                  }}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {getAcademicYearOptions().map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                {formErrors.academicYear && (
                  <p className="text-[11px] text-danger-600 font-medium">{formErrors.academicYear}</p>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2 pt-1">
              <label htmlFor="edit-tech-input" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Technologies & Frameworks</span>
                <span className="text-danger-600">*</span>
              </label>

              <div className="flex gap-2">
                <input
                  id="edit-tech-input"
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                  placeholder="e.g. React, PostgreSQL, Docker..."
                  maxLength={50}
                  className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTechnology}
                  disabled={!techInput.trim()}
                  className="gap-1.5 text-xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Tag Chips */}
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary shadow-2xs"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        aria-label={`Remove ${tech}`}
                        className="hover:text-primary-hover focus-visible:outline-none text-primary/70"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {formErrors.technologies && (
                <p className="text-[11px] text-danger-600 font-medium">{formErrors.technologies}</p>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: TEAM MEMBERS */}
        {/* ============================================================ */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-6">
          <div className="border-b border-border/80 pb-4">
            <h2 className="text-base font-bold text-foreground">
              2. Project Team Members
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage student contributors and their roles.
            </p>
          </div>

          <div className="space-y-4">
            {/* Team Members List */}
            <div className="space-y-2">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-border/80 bg-surface-secondary/40 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary border border-primary/20">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {member.name}
                        {member.isCreator && (
                          <span className="ml-2 rounded bg-primary-50 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            You (Author)
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{member.role}</p>
                    </div>
                  </div>

                  {!member.isCreator && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(idx)}
                      aria-label={`Remove team member ${member.name}`}
                      className="p-1.5 text-muted-foreground hover:text-danger-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Team Member Inputs */}
            <div className="rounded-xl border border-dashed border-border p-4 bg-surface-secondary/20 space-y-3">
              <p className="text-xs font-semibold text-foreground">Add Additional Contributor</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Full Name"
                  maxLength={100}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Role (e.g. Backend Lead)"
                  maxLength={100}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {formErrors.teamMember && (
                  <p className="text-[11px] text-danger-600 font-medium">{formErrors.teamMember}</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTeamMember}
                  disabled={!newMemberName.trim()}
                  className="gap-1.5 text-xs ml-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Member</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: PROJECT LINKS & ACCESS CONTROL */}
        {/* ============================================================ */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-6">
          <div className="border-b border-border/80 pb-4">
            <h2 className="text-base font-bold text-foreground">
              3. Project Links & Permissions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your GitHub repository and live application URLs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* GitHub */}
            <div className="space-y-2">
              <label htmlFor="edit-github-url" className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>GitHub Repository</span>
                <span className="text-[11px] text-muted-foreground">Optional</span>
              </label>
              <input
                id="edit-github-url"
                type="url"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  markDirty();
                }}
                placeholder="https://github.com/username/project"
                className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  formErrors.github
                    ? "border-danger-300 focus-visible:ring-danger-500"
                    : "border-border focus-visible:ring-primary bg-surface"
                }`}
              />
              {formErrors.github && (
                <p className="text-[11px] text-danger-600 font-medium">{formErrors.github}</p>
              )}

              {/* GitHub Access Radio */}
              {githubUrl.trim() && (
                <div className="flex items-center gap-4 pt-1 text-xs">
                  <span className="text-muted-foreground">Access:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editGithubAccess"
                      value="public"
                      checked={githubAccess === "public"}
                      onChange={() => {
                        setGithubAccess("public");
                        markDirty();
                      }}
                      className="text-primary"
                    />
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editGithubAccess"
                      value="protected"
                      checked={githubAccess === "protected"}
                      onChange={() => {
                        setGithubAccess("protected");
                        markDirty();
                      }}
                      className="text-primary"
                    />
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span>Protected</span>
                  </label>
                </div>
              )}
            </div>

            {/* Deployed Link */}
            <div className="space-y-2">
              <label htmlFor="edit-deployed-url" className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Live Deployment / Demo URL</span>
                <span className="text-[11px] text-muted-foreground">Optional</span>
              </label>
              <input
                id="edit-deployed-url"
                type="url"
                value={deployedUrl}
                onChange={(e) => {
                  setDeployedUrl(e.target.value);
                  markDirty();
                }}
                placeholder="https://my-app.vercel.app"
                className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  formErrors.deployedLink
                    ? "border-danger-300 focus-visible:ring-danger-500"
                    : "border-border focus-visible:ring-primary bg-surface"
                }`}
              />
              {formErrors.deployedLink && (
                <p className="text-[11px] text-danger-600 font-medium">{formErrors.deployedLink}</p>
              )}

              {/* Deployed Access Radio */}
              {deployedUrl.trim() && (
                <div className="flex items-center gap-4 pt-1 text-xs">
                  <span className="text-muted-foreground">Access:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editDeployedAccess"
                      value="public"
                      checked={deployedAccess === "public"}
                      onChange={() => {
                        setDeployedAccess("public");
                        markDirty();
                      }}
                      className="text-primary"
                    />
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editDeployedAccess"
                      value="protected"
                      checked={deployedAccess === "protected"}
                      onChange={() => {
                        setDeployedAccess("protected");
                        markDirty();
                      }}
                      className="text-primary"
                    />
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span>Protected</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: SUPPORTING DOCUMENT & SCREENSHOTS */}
        {/* ============================================================ */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-6">
          <div className="border-b border-border/80 pb-4">
            <h2 className="text-base font-bold text-foreground">
              4. Supporting Document & Screenshots
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review current resources or upload replacements.
            </p>
          </div>

          <div className="space-y-6">
            {/* Supporting Document (PDF) */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Documentation Report (PDF)</span>
                </span>
                <span className="text-[11px] text-muted-foreground">Max 5 MB</span>
              </label>

              {/* Display Existing Document */}
              {existingDocument && !newDocumentFile && (
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary/40 p-3.5">
                  <div className="flex items-center gap-3 truncate">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {existingDocument.name || "Current Project Report"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Current uploaded document</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {existingDocument.url && (
                      <button
                        type="button"
                        onClick={() => setIsDocumentViewerOpen(true)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      >
                        <FileText className="h-3 w-3" />
                        <span>View</span>
                      </button>
                    )}
                    <label className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-secondary cursor-pointer transition-colors">
                      <Upload className="h-3 w-3" />
                      <span>Replace</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleDocumentChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Display New Replacement Document */}
              {newDocumentFile && (
                <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary-50/50 p-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-3 truncate">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-foreground truncate">
                        New: {newDocumentFile.name}
                      </p>
                      <p className="text-[11px] text-primary font-medium">
                        {formatBytes(newDocumentFile.size)} (Will replace existing on save)
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDocumentReplacement}
                    className="text-xs text-danger-700 hover:text-danger-800 shrink-0"
                  >
                    <span>Cancel Replacement</span>
                  </Button>
                </div>
              )}

              {!existingDocument && !newDocumentFile && (
                <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center cursor-pointer hover:bg-surface-secondary/40 hover:border-primary/50 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-semibold text-foreground">
                    Upload PDF Documentation
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    PDF format, up to 5 MB
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
                </label>
              )}

              {formErrors.supportingDocument && (
                <p className="text-[11px] text-danger-600 font-medium">{formErrors.supportingDocument}</p>
              )}
            </div>

            {/* Screenshots Showcase & Replacement */}
            <div className="space-y-3 pt-3 border-t border-border/70">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Project Screenshots</span>
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {newScreenshotFiles.length > 0
                      ? `${newScreenshotFiles.length}/5 new screenshot(s) selected for upload`
                      : `${existingScreenshots.length} screenshot(s) currently in archive`}
                  </p>
                </div>

                {newScreenshotFiles.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearNewScreenshots}
                    className="text-xs text-danger-700 hover:text-danger-800"
                  >
                    <span>Keep Existing Screenshots</span>
                  </Button>
                )}
              </div>

              {/* Informational Callout regarding backend replacement behavior */}
              <div className="flex items-start gap-2 rounded-xl bg-surface-secondary/50 border border-border/80 p-3 text-[11px] text-muted-foreground leading-relaxed">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Screenshot replacement:</strong> Uploading new screenshots will replace the entire screenshot collection upon saving. If no new images are chosen, your existing screenshots will remain untouched.
                </span>
              </div>

              {/* Display Existing Screenshots (if no new files chosen) */}
              {existingScreenshots.length > 0 && newScreenshotFiles.length === 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Current Screenshots:
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {existingScreenshots.map((item, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-secondary/50 shadow-2xs"
                      >
                        <img
                          src={item.url}
                          alt={`Current screenshot ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display New Replacement Screenshots */}
              {newScreenshotFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                    New Screenshots to Upload:
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {newScreenshotFiles.map((file, idx) => {
                      const previewUrl = URL.createObjectURL(file);
                      return (
                        <div
                          key={idx}
                          className="group relative aspect-video overflow-hidden rounded-xl border border-primary/30 bg-surface-secondary/50 shadow-2xs"
                        >
                          <img
                            src={previewUrl}
                            alt={`New screenshot preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewScreenshot(idx)}
                            aria-label={`Remove new screenshot ${idx + 1}`}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-foreground/70 text-background opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-600"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload Trigger */}
              {newScreenshotFiles.length < 5 && (
                <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-5 text-center cursor-pointer hover:bg-surface-secondary/40 hover:border-primary/50 transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
                  <span className="text-xs font-semibold text-foreground">
                    {existingScreenshots.length > 0 && newScreenshotFiles.length === 0
                      ? "Select new screenshots to replace existing"
                      : "Add more screenshot images"}
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    JPG, PNG, or WebP (Max 5 images total)
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleScreenshotsChange}
                    className="hidden"
                  />
                </label>
              )}

              {formErrors.screenshots && (
                <p className="text-[11px] text-danger-600 font-medium">{formErrors.screenshots}</p>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: ACTION CONTROLS */}
        {/* ============================================================ */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="gap-2 text-xs font-semibold min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </div>
      </form>

      {/* In-App Document PDF Viewer Modal */}
      {isDocumentViewerOpen && existingDocument?.url && (
        <PdfViewerModal
          isOpen={isDocumentViewerOpen}
          onClose={() => setIsDocumentViewerOpen(false)}
          documentUrl={existingDocument.url}
          title={existingDocument.name || "Supporting Document"}
          subtitle={title || "Project Documentation"}
          downloadFilename={
            existingDocument.name || `${title || "Project"}_Document.pdf`
          }
        />
      )}
    </div>
  );
}

export default StudentEditProjectPage;
