import { useState } from "react";
import {
  X,
  Sparkles,
  Plus,
  AlertCircle,
  Loader2,
  BrainCircuit,
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

function ProjectRecommendationModal({ isOpen, onClose, onSuccess }) {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [domain, setDomain] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [difficulty, setDifficulty] = useState("INTERMEDIATE");
  const [projectType, setProjectType] = useState("REAL_WORLD");

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [serverError, setServerError] = useState(null);

  if (!isOpen) return null;

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

      onSuccess(response?.data);
      onClose();
    } catch (err) {
      setServerError(
        err.message ||
          "Unable to generate recommendation. The AI service may be temporarily busy. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recommendation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-nexora-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="recommendation-modal-title"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                Get Project Recommendation
              </h2>
              <p className="text-xs text-muted-foreground">
                Tell Nexora about your skills and project preferences to generate an AI-tailored idea.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
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
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-surface-secondary/40 border border-border/70">
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

            {/* Input Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="skill-input"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill (e.g. React, Python) and press Add"
                  disabled={isGenerating || skills.length >= 15}
                  className={`w-full rounded-xl border bg-surface px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.skills
                      ? "border-danger-500 focus:border-danger-500"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSkill()}
                disabled={isGenerating || !skillInput.trim() || skills.length >= 15}
                className="gap-1 text-xs py-2"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add</span>
              </Button>
            </div>

            {errors.skills && (
              <p className="text-[11px] font-medium text-danger-600">
                {errors.skills}
              </p>
            )}

            {/* Suggestions */}
            <div className="pt-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1.5">
                Suggested:
              </span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {popularSkills
                  .filter((s) => !skills.includes(s))
                  .slice(0, 8)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      disabled={isGenerating || skills.length >= 15}
                      className="rounded-md border border-border/70 bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary-50/50 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Domain */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="domain-input"
                className="block text-xs font-semibold text-foreground"
              >
                Industry / Domain <span className="text-danger-600">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                (2 to 50 characters)
              </span>
            </div>
            <input
              id="domain-input"
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                if (errors.domain) setErrors((prev) => ({ ...prev, domain: null }));
              }}
              placeholder="e.g. Healthcare, Education, FinTech, Cybersecurity"
              disabled={isGenerating}
              className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.domain
                  ? "border-danger-500 focus:border-danger-500"
                  : "border-border focus:border-primary"
              }`}
            />
            {errors.domain && (
              <p className="text-[11px] font-medium text-danger-600">
                {errors.domain}
              </p>
            )}

            {/* Domain Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularDomains.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDomain(d);
                    if (errors.domain) setErrors((prev) => ({ ...prev, domain: null }));
                  }}
                  disabled={isGenerating}
                  className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    domain === d
                      ? "border-primary bg-primary-50 text-primary"
                      : "border-border/70 bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Team Size & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Team Size (1 or 2) */}
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

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isGenerating}
              className="gap-2 font-semibold min-w-[180px]"
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
    </div>
  );
}

export default ProjectRecommendationModal;
