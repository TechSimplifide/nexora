import { useState } from "react";
import {
  Sparkles,
  Users,
  Layers,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Cpu,
  Target,
  FileQuestion,
  Lightbulb,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/date";

const difficultyConfig = {
  BEGINNER: {
    label: "Beginner",
    className: "bg-success-50 text-success-700 border-success-200",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    className: "bg-primary-50 text-primary border-primary/20",
  },
  ADVANCED: {
    label: "Advanced",
    className: "bg-warning-50 text-warning-800 border-warning-200",
  },
};

const projectTypeLabels = {
  ACADEMIC: "Academic",
  REAL_WORLD: "Real World",
  INNOVATIVE: "Innovative",
  RESEARCH: "Research",
};

function ProjectRecommendationCard({ recommendation, onInitiateDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficulty =
    difficultyConfig[recommendation.difficulty] || {
      label: recommendation.difficulty || "Intermediate",
      className: "bg-primary-50 text-primary border-primary/20",
    };

  const projectTypeLabel =
    projectTypeLabels[recommendation.projectType] ||
    recommendation.projectType ||
    "Real World";

  const skills = Array.isArray(recommendation.skills)
    ? recommendation.skills
    : [];
  const keyFeatures = Array.isArray(recommendation.keyFeatures)
    ? recommendation.keyFeatures
    : [];
  const technologies = Array.isArray(recommendation.technologies)
    ? recommendation.technologies
    : [];

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md space-y-5">
      {/* Header: Sparkles, Title, Difficulty & Delete */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20 mt-0.5">
            <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${difficulty.className}`}
              >
                {difficulty.label}
              </span>
              <span className="inline-flex items-center rounded-sm bg-surface-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border/60">
                {projectTypeLabel}
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-foreground leading-snug">
              {recommendation.title || "Untitled Project Idea"}
            </h3>
          </div>
        </div>

        {/* Delete Action Button */}
        <button
          type="button"
          onClick={() => onInitiateDelete(recommendation)}
          aria-label={`Delete recommendation for ${recommendation.title || "project"}`}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Metadata Badges & Timestamps */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/70 text-xs">
        {recommendation.domain && (
          <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface-secondary/50 px-2.5 py-1 text-foreground-secondary font-medium">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span>Domain: {recommendation.domain}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface-secondary/50 px-2.5 py-1 text-foreground-secondary font-medium">
          <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <span>
            {recommendation.teamSize === 1
              ? "1 Member (Individual)"
              : `Team of ${recommendation.teamSize || 2}`}
          </span>
        </div>

        {recommendation.createdAt && (
          <div className="flex items-center gap-1 text-muted-foreground ml-auto text-[11px]">
            <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>Generated {formatDate(recommendation.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Why Recommended Section */}
      {recommendation.whyRecommended && (
        <div className="rounded-xl border border-primary/20 bg-primary-50/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            <span>Why Recommended For You</span>
          </div>
          <p className="text-xs leading-relaxed text-foreground-secondary">
            {recommendation.whyRecommended}
          </p>
        </div>
      )}

      {/* Selected/Input Skills */}
      {skills.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Target Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Project Details */}
      {isExpanded && (
        <div className="pt-3 border-t border-border/80 space-y-5 animate-in fade-in duration-150">
          {/* Introduction */}
          {recommendation.introduction && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Introduction
              </h4>
              <p className="text-xs leading-relaxed text-foreground-secondary whitespace-pre-wrap">
                {recommendation.introduction}
              </p>
            </div>
          )}

          {/* Problem Statement */}
          {recommendation.problemStatement && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileQuestion className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Problem Statement</span>
              </h4>
              <p className="text-xs leading-relaxed text-foreground-secondary whitespace-pre-wrap">
                {recommendation.problemStatement}
              </p>
            </div>
          )}

          {/* Proposed Solution */}
          {recommendation.proposedSolution && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Proposed Solution</span>
              </h4>
              <p className="text-xs leading-relaxed text-foreground-secondary whitespace-pre-wrap">
                {recommendation.proposedSolution}
              </p>
            </div>
          )}

          {/* Key Features */}
          {keyFeatures.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Key Features</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-foreground-secondary list-none">
                {keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Suggested Technology Stack</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-primary/20 bg-primary-50/50 px-2 py-0.5 text-xs font-semibold text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expected Outcome */}
          {recommendation.expectedOutcome && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Expected Outcome
              </h4>
              <p className="text-xs leading-relaxed text-foreground-secondary whitespace-pre-wrap">
                {recommendation.expectedOutcome}
              </p>
            </div>
          )}

          {/* Conclusion */}
          {recommendation.conclusion && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Conclusion
              </h4>
              <p className="text-xs leading-relaxed text-foreground-secondary whitespace-pre-wrap">
                {recommendation.conclusion}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Expand / Collapse Toggle Button */}
      <div className="pt-2 flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <span>{isExpanded ? "Show Less Details" : "Show Full Specification"}</span>
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </Button>
      </div>
    </article>
  );
}

export default ProjectRecommendationCard;
