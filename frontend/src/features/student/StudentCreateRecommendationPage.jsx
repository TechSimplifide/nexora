import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
  Loader2,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { createProjectRecommendation } from "@/services/recommendation.service";

const popularSkills = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "MongoDB",
  "Tailwind CSS",
  "PostgreSQL",
  "FastAPI",
  "Machine Learning",
  "Next.js",
  "Flutter",
  "Docker",
];

const popularDomains = [
  "Education",
  "Healthcare",
  "Finance",
  "Cybersecurity",
  "E-commerce",
  "Sustainability",
  "Smart Campus",
];

function StudentCreateRecommendationPage() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [domain, setDomain] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [difficulty, setDifficulty] = useState("INTERMEDIATE");
  const [projectType, setProjectType] = useState("REAL_WORLD");

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;

    if (trimmed.length > 50) {
      setErrors((prev) => ({
        ...prev,
        skills: "Each skill must be under 50 characters.",
      }));
      return;
    }

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        skills: `"${trimmed}" is already added.`,
      }));
      return;
    }

    if (skills.length >= 15) {
      setErrors((prev) => ({
        ...prev,
        skills: "Maximum 15 skills allowed.",
      }));
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
    setErrors((prev) => ({ ...prev, skills: null }));
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validate = () => {
    const newErrors = {};

    if (skills.length === 0) {
      newErrors.skills = "Please add at least 1 skill.";
    } else if (skills.length > 15) {
      newErrors.skills = "Maximum 15 skills allowed.";
    }

    const trimmedDomain = domain.trim();
    if (!trimmedDomain) {
      newErrors.domain = "Domain is required.";
    } else if (trimmedDomain.length < 2) {
      newErrors.domain = "Domain must be at least 2 characters.";
    } else if (trimmedDomain.length > 50) {
      newErrors.domain = "Domain cannot exceed 50 characters.";
    }

    if (![1, 2].includes(Number(teamSize))) {
      newErrors.teamSize = "Team size must be 1 or 2 members.";
    }

    if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(difficulty)) {
      newErrors.difficulty = "Please select a valid difficulty level.";
    }

    if (
      !["ACADEMIC", "REAL_WORLD", "INNOVATIVE", "RESEARCH"].includes(projectType)
    ) {
      newErrors.projectType = "Please select a valid project type.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsGenerating(true);

    try {
      const response = await createProjectRecommendation({
        skills,
        domain: domain.trim(),
        teamSize: Number(teamSize),
        difficulty,
        projectType,
      });

      setGeneratedResult(response?.data || { title: "Generated Project Idea" });
    } catch (err) {
      setServerError(
        err.message ||
          "Unable to generate recommendation. The AI service may be temporarily busy. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetForm = () => {
    setSkills([]);
    setSkillInput("");
    setDomain("");
    setTeamSize(1);
    setDifficulty("INTERMEDIATE");
    setProjectType("REAL_WORLD");
    setErrors({});
    setServerError(null);
    setGeneratedResult(null);
  };

  // --- Success State View ---
  if (generatedResult) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-200">
        <div className="rounded-2xl border border-success-200 bg-surface p-6 sm:p-8 text-center shadow-nexora-md space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-600 shadow-2xs">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5 fill-primary" aria-hidden="true" />
              AI Recommendation Generated
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {generatedResult.title || "Project Idea Ready!"}
            </h2>
            {generatedResult.problemStatement && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto line-clamp-3">
                {generatedResult.problemStatement}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border/80">
            <Link to="/app/student/recommendations">
              <Button
                variant="primary"
                size="md"
                className="gap-2 w-full sm:w-auto font-semibold"
              >
                <span>View All Recommendations</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              onClick={handleResetForm}
              className="w-full sm:w-auto"
            >
              <span>Generate Another Idea</span>
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
          to="/app/student/recommendations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Recommendations</span>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Get Recommendation
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              <Sparkles className="h-3 w-3 fill-primary" aria-hidden="true" />
              AI-Powered
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Tell Nexora about your skills and project preferences to generate an AI-tailored idea with complete architecture, milestones, and problem statement.
          </p>
        </div>
      </div>

      {/* 2. Form */}
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
          {/* Skills Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="skill-input"
                className="block text-xs font-semibold text-foreground"
              >
                Your Skills & Tech Stack <span className="text-danger-600">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {skills.length}/15 skills added
              </span>
            </div>

            {/* Selected Skills Chips */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-surface-secondary/40 border border-border/70">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-foreground border border-border/80 shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      disabled={isGenerating}
                      aria-label={`Remove ${skill}`}
                      className="text-muted-foreground hover:text-danger-600 rounded-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Skill Add Input */}
            <div className="flex gap-2">
              <input
                id="skill-input"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter (e.g. PyTorch, Next.js)"
                disabled={isGenerating || skills.length >= 15}
                className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSkill()}
                disabled={isGenerating || !skillInput.trim() || skills.length >= 15}
                className="shrink-0 gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add</span>
              </Button>
            </div>

            {/* Quick Skill Suggestions */}
            <div className="space-y-1 pt-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Popular suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {popularSkills
                  .filter((ps) => !skills.includes(ps))
                  .slice(0, 8)
                  .map((ps) => (
                    <button
                      key={ps}
                      type="button"
                      onClick={() => handleAddSkill(ps)}
                      disabled={isGenerating || skills.length >= 15}
                      className="rounded-md border border-dashed border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary-50/50 hover:text-primary disabled:opacity-50"
                    >
                      + {ps}
                    </button>
                  ))}
              </div>
            </div>

            {errors.skills && (
              <p className="text-[11px] font-medium text-danger-600">
                {errors.skills}
              </p>
            )}
          </div>

          {/* Target Application Domain */}
          <div className="space-y-2">
            <label
              htmlFor="domain-input"
              className="block text-xs font-semibold text-foreground"
            >
              Target Application Domain <span className="text-danger-600">*</span>
            </label>
            <input
              id="domain-input"
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                if (errors.domain) setErrors((prev) => ({ ...prev, domain: null }));
              }}
              placeholder="e.g. Healthcare, Smart Campus, FinTech"
              disabled={isGenerating}
              className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 ${
                errors.domain
                  ? "border-danger-300 focus:border-danger-500 focus:ring-danger-500/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
            />

            {/* Domain Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {popularDomains.map((pd) => (
                <button
                  key={pd}
                  type="button"
                  onClick={() => {
                    setDomain(pd);
                    if (errors.domain) setErrors((prev) => ({ ...prev, domain: null }));
                  }}
                  disabled={isGenerating}
                  className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    domain.toLowerCase() === pd.toLowerCase()
                      ? "border-primary bg-primary-50 text-primary font-semibold"
                      : "border-border/80 bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {pd}
                </button>
              ))}
            </div>

            {errors.domain && (
              <p className="text-[11px] font-medium text-danger-600">
                {errors.domain}
              </p>
            )}
          </div>

          {/* Grid: Team Size & Difficulty Level */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Team Size */}
            <div className="space-y-1.5">
              <label
                htmlFor="team-size-select"
                className="block text-xs font-semibold text-foreground"
              >
                Team Size <span className="text-danger-600">*</span>
              </label>
              <select
                id="team-size-select"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                disabled={isGenerating}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value={1}>1 Member (Individual Project)</option>
                <option value={2}>2 Members (Pair Project)</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label
                htmlFor="difficulty-select"
                className="block text-xs font-semibold text-foreground"
              >
                Difficulty Level <span className="text-danger-600">*</span>
              </label>
              <select
                id="difficulty-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={isGenerating}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="BEGINNER">Beginner (Foundational)</option>
                <option value="INTERMEDIATE">Intermediate (Production-ready)</option>
                <option value="ADVANCED">Advanced (High Complexity)</option>
              </select>
            </div>
          </div>

          {/* Project Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="project-type-select"
              className="block text-xs font-semibold text-foreground"
            >
              Project Category / Type <span className="text-danger-600">*</span>
            </label>
            <select
              id="project-type-select"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              disabled={isGenerating}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="REAL_WORLD">Real World (Industry Practical)</option>
              <option value="ACADEMIC">Academic (Curriculum Aligned)</option>
              <option value="INNOVATIVE">Innovative (Novel Architecture/Concept)</option>
              <option value="RESEARCH">Research (Investigative/Experimental)</option>
            </select>
          </div>

          {/* Generation In-Progress Indicator */}
          {isGenerating && (
            <div className="rounded-xl border border-primary/20 bg-primary-50/50 p-4 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <BrainCircuit className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                <span>Generating your project recommendation...</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Nexora AI is evaluating your skills, domain, and complexity requirements to generate a complete problem statement, technology stack, and implementation roadmap.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate("/app/student/recommendations")}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isGenerating}
            className="gap-2 font-semibold min-w-[180px] w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Analyzing & Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Generate Idea</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StudentCreateRecommendationPage;
