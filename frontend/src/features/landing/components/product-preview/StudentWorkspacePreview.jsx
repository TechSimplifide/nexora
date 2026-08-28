import {
  FolderGit2,
  Send,
  Inbox,
  CheckCircle2,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  Layers,
  Lightbulb,
  Star,
  User,
} from "lucide-react";
import ProposalTimelinePreview from "./ProposalTimelinePreview";

/**
 * StudentWorkspacePreview
 * Unified, single-view preview of the authentic Student Workspace Dashboard.
 * Integrates KPIs, Active Proposal lifecycle, Featured Project, and AI recommendation rationale.
 */
function StudentWorkspacePreview() {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Authentic Student KPI Cards (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-nexora-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Project Contributions
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">2</div>
          <p className="text-[10px] text-muted-foreground">Active projects</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-nexora-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Requests Sent
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary text-foreground-secondary border border-border/60">
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">3</div>
          <p className="text-[10px] text-muted-foreground">Peer documents requested</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-nexora-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Requests Received
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary text-foreground-secondary border border-border/60">
              <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">5</div>
          <p className="text-[10px] text-muted-foreground">On your project assets</p>
        </div>
      </div>

      {/* 2. Active Proposal Card with 4-Stage Lifecycle & Faculty Admin Remarks */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Active Proposal #PR-2026-084
            </span>
            <h3 className="text-base font-bold text-foreground">
              Decentralized Healthcare Record Verification System
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Team of 4</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Submitted Feb 20, 2026</span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-success-200 bg-success-50 px-3 py-1 text-xs font-semibold text-success-700 self-start sm:self-auto">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approved by Faculty</span>
          </span>
        </div>

        {/* Faculty Admin Remarks Callout Box */}
        <div className="rounded-lg border border-border/80 bg-surface-secondary/50 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-muted-foreground mb-1">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>Faculty Admin Remarks:</span>
          </div>
          <p className="leading-relaxed text-foreground-secondary">
            Strong project direction. Proceed with smart contract testnet deployment and prepare supporting documentation.
          </p>
        </div>

        {/* 4-Stage Proposal Lifecycle Timeline */}
        <ProposalTimelinePreview status="APPROVED" activeStageIndex={3} />
      </div>

      {/* 3. 2-Column Supporting Grid: College Featured Project + AI Recommendation Supporting Card */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Featured Project Showcase Card (Inspired by FeaturedProjectCard.jsx) */}
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-bold text-warning-800 border border-warning-200">
                  <Star className="h-2.5 w-2.5 fill-warning-600 text-warning-600" aria-hidden="true" />
                  Featured Showcase
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  AI & ML
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">2025–26</span>
            </div>

            <h4 className="text-sm font-bold text-foreground">
              Campus Vision Assistant
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Autonomous multimodal edge navigation model evaluating campus accessibility routes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3 w-3" />
              <span>Created by <strong>Aarav Patel</strong></span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                React
              </span>
              <span className="rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                FastAPI
              </span>
              <span className="rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                PyTorch
              </span>
            </div>
          </div>
        </div>

        {/* Compact AI Recommendation Supporting Card (Inspired by ProjectRecommendationCard.jsx) */}
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  AI Recommended Idea
                </span>
              </div>
              <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                Intermediate · Real World
              </span>
            </div>

            <h4 className="text-sm font-bold text-foreground">
              Intelligent Campus Resource Assistant
            </h4>

            {/* Rationale Callout Box */}
            <div className="rounded-lg border border-primary/20 bg-primary-50/40 p-2.5 text-xs space-y-0.5">
              <div className="flex items-center gap-1 font-bold text-primary text-[11px]">
                <Lightbulb className="h-3 w-3" />
                <span>Why Recommended For You:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-foreground-secondary line-clamp-2">
                Matches your interest in AI and full-stack development while providing strong opportunities for academic research.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Layers className="h-3 w-3" />
              <span>Full-Stack AI</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="rounded-md border border-primary/20 bg-primary-50/50 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                React
              </span>
              <span className="rounded-md border border-primary/20 bg-primary-50/50 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                FastAPI
              </span>
              <span className="rounded-md border border-primary/20 bg-primary-50/50 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                PostgreSQL
              </span>
              <span className="rounded-md border border-primary/20 bg-primary-50/50 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                PyTorch
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentWorkspacePreview;
