import { useState } from "react";
import { Link } from "react-router-dom";
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
  ExternalLink,
  Globe,
  Lock,
  Layers,
  Building,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { createProject } from "@/services/project.service";
import Button from "@/components/ui/Button";

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
  for (let i = -2; i <= 1; i++) {
    const start = currentYear + i;
    const end = String(start + 1).slice(-2);
    years.push(`${start}-${end}`);
  }
  return years;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
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

function StudentCreateProjectPage() {
  const { user } = useAuth();

  // Basic Information
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [department, setDepartment] = useState(user?.department || "");
  const [academicYear, setAcademicYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    const nextYear = String(currentYear + 1).slice(-2);
    return `${currentYear}-${nextYear}`;
  });

  // Technologies (Tags)
  const [technologies, setTechnologies] = useState([]);
  const [techInput, setTechInput] = useState("");

  // Team Members
  const [teamMembers, setTeamMembers] = useState([
    {
      name: user?.fullName || "Student Creator",
      role: "Project Lead",
      isCreator: true,
    },
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  // Links & Access Levels
  const [githubUrl, setGithubUrl] = useState("");
  const [githubAccess, setGithubAccess] = useState("public");
  const [deployedUrl, setDeployedUrl] = useState("");
  const [deployedAccess, setDeployedAccess] = useState("public");

  // Files
  const [supportingDocument, setSupportingDocument] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successData, setSuccessData] = useState(null);

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
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    setTechnologies(technologies.filter((t) => t !== techToRemove));
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
  };

  const handleRemoveTeamMember = (indexToRemove) => {
    setTeamMembers(teamMembers.filter((_, idx) => idx !== indexToRemove));
  };

  // --- Handlers: Supporting Document (PDF) ---
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

    setSupportingDocument(file);
    setFormErrors((prev) => ({ ...prev, supportingDocument: null }));
  };

  const handleRemoveDocument = () => {
    setSupportingDocument(null);
  };

  // --- Handlers: Screenshots (Images) ---
  const handleScreenshotsChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const newValidFiles = [];
    let errorMessage = null;

    if (screenshots.length + files.length > 5) {
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

    setScreenshots([...screenshots, ...newValidFiles]);
    setFormErrors((prev) => ({ ...prev, screenshots: null }));
  };

  const handleRemoveScreenshot = (indexToRemove) => {
    setScreenshots(screenshots.filter((_, idx) => idx !== indexToRemove));
  };

  // --- Validation & Submit ---
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
        "Summary must be between 20 and 500 characters (describes the project overview)";
    }

    if (
      !description.trim() ||
      description.trim().length < 50 ||
      description.trim().length > 5000
    ) {
      errors.description =
        "Description must be between 50 and 5000 characters (detailed implementation, features & architecture)";
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
      errors.technologies = "Please add at least one technology tag";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

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

      // Sanitize team members object for backend schema
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
      }

      if (deployedUrl.trim()) {
        formData.append(
          "deployedLink",
          JSON.stringify({
            url: deployedUrl.trim(),
            access: deployedAccess,
          })
        );
      }

      if (supportingDocument) {
        formData.append("supportingDocument", supportingDocument);
      }

      screenshots.forEach((file) => {
        formData.append("screenshots", file);
      });

      const response = await createProject(formData);
      const created = response?.data;

      setSuccessData(created);
    } catch (err) {
      setApiError(
        err.message ||
          "Failed to submit project. Please verify all fields and try again."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success State View ---
  if (successData) {
    const projectId = successData._id || successData.id;
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
        <div className="rounded-2xl border border-success-200 bg-surface p-8 text-center shadow-nexora-md space-y-5 animate-in fade-in duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-600 shadow-2xs">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Project Uploaded Successfully!
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              <strong className="font-semibold text-foreground">
                &quot;{successData.title || title}&quot;
              </strong>{" "}
              has been added to your college&apos;s institutional project archive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border/80">
            <Link to={`/app/student/projects/${projectId}`}>
              <Button variant="primary" size="md" className="gap-2 w-full sm:w-auto font-semibold">
                <span>View Project in Archive</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>

            <Link to="/app/student/projects">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                <span>Back to Catalog</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* 1. Page Header & Back Navigation */}
      <div className="space-y-4">
        <Link
          to="/app/student/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Projects Catalog</span>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <FolderKanban className="h-4 w-4" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Upload Project
            </h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Submit your completed capstone, research, or engineering project to the Nexora college archive.
          </p>
        </div>
      </div>

      {/* Global API Error Alert */}
      {apiError && (
        <div className="flex items-start gap-3 rounded-2xl border border-danger-200 bg-danger-50 p-4 text-xs text-danger-800 shadow-nexora-sm animate-in fade-in duration-150">
          <AlertCircle className="h-5 w-5 text-danger-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 flex-1">
            <p className="font-semibold">Submission Failed</p>
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
              Core details describing your project, domain, and scope.
            </p>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="project-title" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Project Title</span>
                <span className="text-danger-600">*</span>
              </label>
              <input
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI-Powered Autonomous Drone Navigation"
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
                  <span>Brief, descriptive title (3-100 chars)</span>
                )}
                <span>{title.length}/100</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label htmlFor="project-summary" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Summary / Abstract</span>
                <span className="text-danger-600">*</span>
              </label>
              <textarea
                id="project-summary"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A concise summary highlighting the problem solved, methodologies used, and key findings (20-500 chars)..."
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
                  <span>Overview displayed on cards in the archive</span>
                )}
                <span>{summary.length}/500</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="project-description" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Detailed Description</span>
                <span className="text-danger-600">*</span>
              </label>
              <textarea
                id="project-description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Elaborate on the background, technical architecture, system design, algorithms implemented, testing methodology, and conclusions (50-5000 chars)..."
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
                  <span>Full project documentation body</span>
                )}
                <span>{description.length}/5000</span>
              </div>
            </div>

            {/* Domain, Department, Academic Year Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Domain */}
              <div className="space-y-1.5">
                <label htmlFor="project-domain" className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Domain</span>
                  <span className="text-danger-600">*</span>
                </label>
                <input
                  id="project-domain"
                  type="text"
                  list="domain-options"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
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
                <label htmlFor="project-department" className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Department</span>
                  <span className="text-danger-600">*</span>
                </label>
                <input
                  id="project-department"
                  type="text"
                  list="department-options"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
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
                <label htmlFor="project-academic-year" className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Academic Year</span>
                  <span className="text-danger-600">*</span>
                </label>
                <select
                  id="project-academic-year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
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

            {/* Technologies Chip Input */}
            <div className="space-y-2 pt-1">
              <label htmlFor="tech-input" className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>Technologies & Frameworks</span>
                <span className="text-danger-600">*</span>
              </label>

              <div className="flex gap-2">
                <input
                  id="tech-input"
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                  placeholder="e.g. React, PyTorch, Node.js, Docker..."
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
                  <span>Add Tech</span>
                </Button>
              </div>

              {/* Tag Chips */}
              {technologies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary shadow-2xs animate-in fade-in duration-100"
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
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Press Enter or click &apos;Add Tech&apos; to append technologies.
                </p>
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
              List all students who contributed to the project.
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
              <p className="text-xs font-semibold text-foreground">Add Team Member</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Full Name (e.g. Priya Sharma)"
                  maxLength={100}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Role (e.g. Backend Lead / Researcher)"
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
              Optionally provide your source repository and live deployed URL with public or protected access.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* GitHub Repository */}
            <div className="space-y-2">
              <label htmlFor="github-url" className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>GitHub Repository</span>
                <span className="text-[11px] text-muted-foreground">Optional</span>
              </label>
              <input
                id="github-url"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
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
                      name="githubAccess"
                      value="public"
                      checked={githubAccess === "public"}
                      onChange={() => setGithubAccess("public")}
                      className="text-primary"
                    />
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="githubAccess"
                      value="protected"
                      checked={githubAccess === "protected"}
                      onChange={() => setGithubAccess("protected")}
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
              <label htmlFor="deployed-url" className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Live Deployment / Demo URL</span>
                <span className="text-[11px] text-muted-foreground">Optional</span>
              </label>
              <input
                id="deployed-url"
                type="url"
                value={deployedUrl}
                onChange={(e) => setDeployedUrl(e.target.value)}
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

              {/* Deployed Link Access Radio */}
              {deployedUrl.trim() && (
                <div className="flex items-center gap-4 pt-1 text-xs">
                  <span className="text-muted-foreground">Access:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="deployedAccess"
                      value="public"
                      checked={deployedAccess === "public"}
                      onChange={() => setDeployedAccess("public")}
                      className="text-primary"
                    />
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="deployedAccess"
                      value="protected"
                      checked={deployedAccess === "protected"}
                      onChange={() => setDeployedAccess("protected")}
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
        {/* SECTION 4: PROJECT RESOURCES (PDF & SCREENSHOTS) */}
        {/* ============================================================ */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-6">
          <div className="border-b border-border/80 pb-4">
            <h2 className="text-base font-bold text-foreground">
              4. Supporting Document & Screenshots
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload project documentation PDF (e.g. project report) and preview screenshots.
            </p>
          </div>

          <div className="space-y-6">
            {/* Supporting Document (PDF) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Documentation / Report (PDF)</span>
                </span>
                <span className="text-[11px] text-muted-foreground">Max 5 MB</span>
              </label>

              {supportingDocument ? (
                <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary-50/40 p-3.5">
                  <div className="flex items-center gap-3 truncate">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {supportingDocument.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatBytes(supportingDocument.size)}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveDocument}
                    className="text-xs text-danger-700 hover:text-danger-800 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span>Remove</span>
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center cursor-pointer hover:bg-surface-secondary/40 hover:border-primary/50 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-semibold text-foreground">
                    Click to select PDF report
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    PDF files only, up to 5 MB
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

            {/* Screenshots Grid */}
            <div className="space-y-2 pt-2 border-t border-border/70">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Screenshots & Architecture Diagrams</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {screenshots.length}/5 selected (Max 5 MB each)
                </span>
              </label>

              {/* Thumbnails */}
              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 pt-1">
                  {screenshots.map((file, idx) => {
                    const previewUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={idx}
                        className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-secondary/50 shadow-2xs"
                      >
                        <img
                          src={previewUrl}
                          alt={`Screenshot preview ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          aria-label={`Remove screenshot ${idx + 1}`}
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-foreground/70 text-background opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-600"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {screenshots.length < 5 && (
                <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-5 text-center cursor-pointer hover:bg-surface-secondary/40 hover:border-primary/50 transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
                  <span className="text-xs font-semibold text-foreground">
                    Upload screenshots
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
        {/* SECTION 5: SUBMIT CONTROLS */}
        {/* ============================================================ */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link to="/app/student/projects">
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="gap-2 text-xs font-semibold min-w-[160px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Uploading Project...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" aria-hidden="true" />
                <span>Submit Project</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StudentCreateProjectPage;
