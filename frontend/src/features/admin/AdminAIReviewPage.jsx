import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Eye,
  Check,
  X,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Button from "@/components/ui/Button";
import PdfViewerModal from "@/components/common/PdfViewerModal";
import AdminProposalRejectModal from "@/features/admin/components/AdminProposalRejectModal";
import {
  getPendingProjectProposals,
  analyzeProposalWithAI,
  approveProjectProposal,
  rejectProjectProposal,
} from "@/services/projectProposal.service";
import { formatDate } from "@/utils/date";

export function AdminAIReviewPage() {
  const [proposals, setProposals] = useState([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);
  const [proposalsError, setProposalsError] = useState(null);

  // Active Proposal Selection
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // AI Review State (keyed by proposalId for active session)
  const [analysisStatus, setAnalysisStatus] = useState("idle"); // 'idle' | 'analyzing' | 'success' | 'error'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // PDF Viewer Modal State
  const [pdfModalUrl, setPdfModalUrl] = useState(null);
  const [pdfModalTitle, setPdfModalTitle] = useState("");

  // Approval Modal State
  const [proposalToApprove, setProposalToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState(null);

  // Rejection Modal State
  const [proposalToReject, setProposalToReject] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Feedback Notification Banner
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  // Initial Load Effect
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingProposals(true);
      setProposalsError(null);
      try {
        const res = await getPendingProjectProposals();
        if (isMounted) {
          const items = Array.isArray(res?.data) ? res.data : [];
          setProposals(items);
          if (items.length > 0) {
            setSelectedProposalId((prev) => prev || items[0]._id);
          }
        }
      } catch (err) {
        if (isMounted) {
          setProposalsError(
            err.message || "Failed to load pending proposals. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingProposals(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setIsLoadingProposals(true);
    setProposalsError(null);
    try {
      const res = await getPendingProjectProposals();
      const items = Array.isArray(res?.data) ? res.data : [];
      setProposals(items);
      if (items.length > 0 && !items.some((p) => p._id === selectedProposalId)) {
        setSelectedProposalId(items[0]._id);
      }
    } catch (err) {
      setProposalsError(
        err.message || "Failed to load pending proposals. Please try again."
      );
    } finally {
      setIsLoadingProposals(false);
    }
  };

  // Selected Proposal Object
  const selectedProposal = useMemo(() => {
    return proposals.find((p) => p._id === selectedProposalId) || null;
  }, [proposals, selectedProposalId]);

  // Filtered Proposals
  const filteredProposals = useMemo(() => {
    if (!searchQuery.trim()) return proposals;
    const query = searchQuery.toLowerCase().trim();
    return proposals.filter((p) => {
      const titleMatch = (p.title || "").toLowerCase().includes(query);
      const studentMatch = (p.createdBy?.fullName || "")
        .toLowerCase()
        .includes(query);
      return titleMatch || studentMatch;
    });
  }, [proposals, searchQuery]);

  // Handle Proposal Change
  const handleSelectProposal = (id) => {
    if (id === selectedProposalId) return;
    setSelectedProposalId(id);
    setAnalysisStatus("idle");
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  // Trigger AI Analysis
  const handleRunAIAnalysis = async () => {
    if (!selectedProposalId) return;
    setAnalysisStatus("analyzing");
    setAnalysisError(null);

    try {
      const response = await analyzeProposalWithAI(selectedProposalId);
      if (response?.data) {
        setAnalysisResult(response.data);
        setAnalysisStatus("success");
      } else {
        throw new Error("Invalid response received from AI service.");
      }
    } catch (err) {
      setAnalysisError(
        err.message || "AI Proposal Review failed. Please try again."
      );
      setAnalysisStatus("error");
    }
  };

  // Handle Approve Confirmation
  const handleConfirmApprove = async () => {
    if (!proposalToApprove?._id) return;
    setIsApproving(true);
    setApproveError(null);

    try {
      await approveProjectProposal(proposalToApprove._id);
      const approvedId = proposalToApprove._id;
      setProposals((prev) => prev.filter((p) => p._id !== approvedId));
      setFeedbackBanner({
        type: "success",
        message: `Proposal "${proposalToApprove.title || "Project"}" approved successfully.`,
      });
      setProposalToApprove(null);
      setAnalysisStatus("idle");
      setAnalysisResult(null);

      // Select next proposal if available
      const remaining = proposals.filter((p) => p._id !== approvedId);
      if (remaining.length > 0) {
        setSelectedProposalId(remaining[0]._id);
      } else {
        setSelectedProposalId(null);
      }
    } catch (err) {
      setApproveError(
        err.message || "Failed to approve proposal. Please try again."
      );
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Reject Confirmation
  const handleConfirmReject = async (proposal, remarks) => {
    if (!proposal?._id) return;
    setIsRejecting(true);

    try {
      await rejectProjectProposal({
        proposalId: proposal._id,
        adminRemarks: remarks,
      });
      const rejectedId = proposal._id;
      setProposals((prev) => prev.filter((p) => p._id !== rejectedId));
      setFeedbackBanner({
        type: "success",
        message: `Proposal "${proposal.title || "Project"}" rejected with feedback.`,
      });
      setProposalToReject(null);
      setAnalysisStatus("idle");
      setAnalysisResult(null);

      // Select next proposal if available
      const remaining = proposals.filter((p) => p._id !== rejectedId);
      if (remaining.length > 0) {
        setSelectedProposalId(remaining[0]._id);
      } else {
        setSelectedProposalId(null);
      }
    } catch (err) {
      setFeedbackBanner({
        type: "error",
        message: err.message || "Failed to reject proposal. Please try again.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  // Helper for Recommendation Configuration
  const getRecommendationConfig = (rec) => {
    const norm = String(rec || "").toUpperCase();
    if (norm === "APPROVE") {
      return {
        badgeText: "APPROVE",
        icon: CheckCircle2,
        badgeStyle: "bg-success-50 text-success-700 border-success-200",
        iconColor: "text-success-700",
        desc: "The proposal meets the evaluated requirements and is recommended for faculty approval.",
      };
    }
    if (norm === "NEEDS_IMPROVEMENT") {
      return {
        badgeText: "NEEDS IMPROVEMENT",
        icon: AlertTriangle,
        badgeStyle: "bg-warning-50 text-warning-700 border-warning-200",
        iconColor: "text-warning-700",
        desc: "The proposal has potential but requires revisions on specific criteria before faculty approval.",
      };
    }
    return {
      badgeText: "REJECT",
      icon: XCircle,
      badgeStyle: "bg-danger-50 text-danger-700 border-danger-200",
      iconColor: "text-danger-700",
      desc: "The proposal has significant scope, originality, or feasibility issues based on evaluated criteria.",
    };
  };

  // Helper for Criterion Result Badge
  const getCriterionBadge = (result) => {
    const norm = String(result || "").toUpperCase();
    if (norm === "PASS") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success-50 text-success-700 border border-success-200">
          <Check className="h-3 w-3" /> PASS
        </span>
      );
    }
    if (norm === "PARTIAL") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-warning-50 text-warning-700 border border-warning-200">
          <AlertTriangle className="h-3 w-3" /> PARTIAL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-danger-50 text-danger-700 border border-danger-200">
        <X className="h-3 w-3" /> FAIL
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              AI Proposal Review
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            AI-assisted evaluation of student project proposals against institutional criteria. Recommendations are advisory! final decisions remain with faculty.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoadingProposals}
          className="self-start sm:self-auto gap-2 text-xs"
        >
          <RotateCcw
            className={`h-3.5 w-3.5 ${isLoadingProposals ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-xs font-medium ${feedbackBanner.type === "success"
            ? "border-success-200 bg-success-50 text-success-700"
            : "border-danger-200 bg-danger-50 text-danger-700"
            }`}
        >
          <div className="flex items-center gap-2">
            {feedbackBanner.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success-700" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-danger-700" />
            )}
            <span>{feedbackBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="p-1 hover:opacity-75 transition-opacity"
            aria-label="Dismiss message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Content Grid */}
      {isLoadingProposals ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 rounded-2xl border border-border bg-surface p-4 space-y-3">
            <div className="h-9 w-full rounded-xl bg-surface-secondary animate-pulse" />
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 w-full rounded-xl bg-surface-secondary/70 animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 rounded-2xl border border-border bg-surface p-6 space-y-4">
            <div className="h-8 w-2/3 rounded-xl bg-surface-secondary animate-pulse" />
            <div className="h-40 w-full rounded-xl bg-surface-secondary/60 animate-pulse" />
            <div className="h-32 w-full rounded-xl bg-surface-secondary/60 animate-pulse" />
          </div>
        </div>
      ) : proposalsError ? (
        <div className="rounded-2xl border border-danger-200 bg-danger-50/50 p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger-100 text-danger-700">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Unable to Load Proposals
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {proposalsError}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : proposals.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center space-y-4 shadow-nexora-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary border border-primary/20">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-foreground">
              No Pending Proposals
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All submitted student project proposals have been reviewed. New proposals submitted by students will appear here for AI evaluation and faculty review.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Proposals Selection Feed */}
          <div className="lg:col-span-4 rounded-2xl border border-border bg-surface p-4 shadow-nexora-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pending Queue ({proposals.length})
              </h2>
              <span className="text-[11px] font-semibold text-primary">
                Select to Review
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-secondary/50 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-surface focus:outline-none"
              />
            </div>

            {/* Proposals List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-none">
              {filteredProposals.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No matching proposals found.
                </div>
              ) : (
                filteredProposals.map((p) => {
                  const isSelected = p._id === selectedProposalId;
                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => handleSelectProposal(p._id)}
                      className={`w-full text-left rounded-xl border p-3.5 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isSelected
                        ? "border-primary bg-primary-50/40 shadow-nexora-xs"
                        : "border-border bg-surface hover:border-border-strong hover:bg-surface-secondary/50"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`font-semibold line-clamp-2 leading-snug ${isSelected ? "text-primary" : "text-foreground"
                            }`}
                        >
                          {p.title || "Untitled Proposal"}
                        </h4>
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground"
                            }`}
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="truncate max-w-[140px]">
                          {p.createdBy?.fullName || "Student"}
                        </span>
                        <span>•</span>
                        <span>{p.team?.size || 1} members</span>
                        <span>•</span>
                        <span>{formatDate(p.createdAt)}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: AI Analysis Stage */}
          <div className="lg:col-span-8 space-y-6">
            {selectedProposal ? (
              <>
                {/* Proposal Overview & Action Banner */}
                <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary border border-primary/20 uppercase tracking-wider">
                          Pending Review
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Submitted {formatDate(selectedProposal.createdAt)}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        {selectedProposal.title}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {selectedProposal.abstractPdf?.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPdfModalUrl(selectedProposal.abstractPdf.url);
                            setPdfModalTitle(selectedProposal.title);
                          }}
                          className="gap-1.5 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View PDF</span>
                        </Button>
                      )}

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleRunAIAnalysis}
                        disabled={analysisStatus === "analyzing"}
                        className="gap-1.5 text-xs font-semibold shadow-xs"
                      >
                        {analysisStatus === "analyzing" ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Analyzing PDF...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>
                              {analysisStatus === "success"
                                ? "Re-Analyze with AI"
                                : "Analyze with AI"}
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Team Details Strip */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Lead:{" "}
                        <strong className="font-semibold text-foreground">
                          {selectedProposal.createdBy?.fullName || "Student"}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        Team ({selectedProposal.team?.size || 1}):{" "}
                        {selectedProposal.team?.members?.map((m) => m.name).join(", ") ||
                          "No roster specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Review Display States */}
                {analysisStatus === "idle" && (
                  <div className="rounded-2xl border border-dashed border-border bg-surface-secondary/30 p-10 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="text-sm font-bold text-foreground">
                        Ready for AI Proposal Review
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Click &quot;Analyze with AI&quot; to evaluate this proposal&apos;s abstract PDF against your college&apos;s standard and custom review criteria.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRunAIAnalysis}
                      className="gap-2 text-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Start AI Analysis</span>
                    </Button>
                  </div>
                )}

                {analysisStatus === "analyzing" && (
                  <div className="rounded-2xl border border-primary/30 bg-surface p-8 text-center space-y-4 shadow-nexora-xs animate-pulse">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary border border-primary/20">
                      <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    </div>
                    <div className="space-y-1.5 max-w-sm mx-auto">
                      <h3 className="text-base font-bold text-foreground">
                        Evaluating Proposal PDF...
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Gemini is reading the document, assessing scope feasibility, checking technical depth, and scoring institutional criteria.
                      </p>
                    </div>
                  </div>
                )}

                {analysisStatus === "error" && (
                  <div className="rounded-2xl border border-danger-200 bg-danger-50/50 p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-100 text-danger-700 shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-sm font-bold text-foreground">
                          AI Analysis Failed
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {analysisError || "The AI evaluation service could not process this proposal."}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleRunAIAnalysis}
                        className="gap-1.5 text-xs bg-danger-600 hover:bg-danger-700 text-white"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Retry Analysis</span>
                      </Button>
                    </div>
                  </div>
                )}

                {analysisStatus === "success" && analysisResult && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* 1. Evaluation Outcome Card (Clean Nexora Design System) */}
                    {(() => {
                      const recConfig = getRecommendationConfig(analysisResult.recommendation);
                      const RecIcon = recConfig.icon;
                      return (
                        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                                <span>AI Recommends</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <RecIcon className={`h-5 w-5 ${recConfig.iconColor} shrink-0`} aria-hidden="true" />
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                                  {recConfig.badgeText}
                                </h3>
                              </div>
                            </div>

                            <span
                              className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold border ${recConfig.badgeStyle}`}
                            >
                              {recConfig.badgeText}
                            </span>
                          </div>

                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {recConfig.desc}
                          </p>

                          <div className="flex items-center gap-1.5 pt-3 border-t border-border text-[11px] text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                            <span>
                              AI recommendation — final decision remains with the administrator.
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 2. Confidence Score & Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Confidence Score */}
                      <div className="rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">
                              AI Confidence
                            </span>
                            <span className="text-lg font-extrabold text-foreground">
                              {Math.round((analysisResult.confidenceScore || 0) * 100)}%
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div className="h-2 w-full rounded-full bg-surface-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    Math.round(
                                      (analysisResult.confidenceScore || 0) * 100
                                    ),
                                    5
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-snug">
                          Confidence represents completeness of information extracted from the document, not project success probability.
                        </p>
                      </div>

                      {/* Summary */}
                      <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Executive Summary
                        </h4>
                        <p className="text-xs text-foreground leading-relaxed">
                          {analysisResult.summary || "No executive summary provided."}
                        </p>
                      </div>
                    </div>

                    {/* 3. Reasons & Improvement Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Key Reasons */}
                      <div className="rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Key Evaluation Reasons
                        </h4>
                        {Array.isArray(analysisResult.reasons) &&
                          analysisResult.reasons.length > 0 ? (
                          <ul className="space-y-2 text-xs text-foreground">
                            {analysisResult.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                <span className="leading-relaxed">{reason}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No specific reasons listed.
                          </p>
                        )}
                      </div>

                      {/* Improvement Suggestions */}
                      <div className="rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Actionable Improvement Suggestions
                        </h4>
                        {Array.isArray(analysisResult.improvementSuggestions) &&
                          analysisResult.improvementSuggestions.length > 0 ? (
                          <ol className="space-y-2 text-xs text-foreground">
                            {analysisResult.improvementSuggestions.map((sug, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{sug}</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            No specific improvements required.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 4. Criteria Breakdown (Dynamic for standard + custom criteria) */}
                    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-xs space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          Institutional Criteria Breakdown
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Evaluation against institutional standards configured for your college.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {Array.isArray(analysisResult.criteriaBreakdown) &&
                          analysisResult.criteriaBreakdown.map((crit, idx) => (
                            <div
                              key={crit.key || idx}
                              className="rounded-xl border border-border bg-surface-secondary/30 p-3.5 space-y-1.5 transition-colors hover:border-border-strong"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-foreground">
                                  {crit.name || crit.key || `Criterion ${idx + 1}`}
                                </span>
                                {getCriterionBadge(crit.result)}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {crit.reason || "No detailed remarks provided."}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* 5. Faculty Decision Action Bar */}
                    <div className="rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-muted-foreground">
                        <span>Make a faculty decision for </span>
                        <strong className="font-semibold text-foreground">
                          &quot;{selectedProposal.title}&quot;
                        </strong>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setProposalToReject(selectedProposal)}
                          className="gap-1.5 text-xs bg-danger-600 hover:bg-danger-700 text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setProposalToApprove(selectedProposal)}
                          className="gap-1.5 text-xs bg-success-600 hover:bg-success-700 text-white"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-border bg-surface p-12 text-center text-xs text-muted-foreground">
                Please select a proposal from the left queue to view details and request AI analysis.
              </div>
            )}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {pdfModalUrl && (
        <PdfViewerModal
          isOpen={Boolean(pdfModalUrl)}
          onClose={() => {
            setPdfModalUrl(null);
            setPdfModalTitle("");
          }}
          documentUrl={pdfModalUrl}
          title={pdfModalTitle || "Project Proposal Abstract"}
        />
      )}

      {/* Approve Confirmation Modal */}
      {proposalToApprove && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-700 border border-success-200 shrink-0">
                <Check className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setProposalToApprove(null)}
                disabled={isApproving}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3
                id="approve-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                Approve Project Proposal
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to approve{" "}
                <strong className="font-semibold text-foreground">
                  &quot;{proposalToApprove.title || "this proposal"}&quot;
                </strong>
                ? The student team will be notified and can proceed with project development.
              </p>
            </div>

            {approveError && (
              <p className="text-xs font-medium text-danger-600">
                {approveError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProposalToApprove(null)}
                disabled={isApproving}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmApprove}
                disabled={isApproving}
                className="gap-1.5 text-xs bg-success-600 hover:bg-success-700 text-white min-w-[100px]"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <span>Confirm Approval</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Proposal Modal with Faculty Remarks */}
      {proposalToReject && (
        <AdminProposalRejectModal
          isOpen={Boolean(proposalToReject)}
          onClose={() => setProposalToReject(null)}
          onConfirmReject={handleConfirmReject}
          proposal={proposalToReject}
          isSubmitting={isRejecting}
        />
      )}
    </div>
  );
}

export default AdminAIReviewPage;
