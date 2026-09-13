import ProposalProgressTimeline from "@/components/common/ProposalProgressTimeline";

/**
 * ProposalTimelinePreview
 * Renders the authentic 3-stage Proposal Progress timeline on landing page product previews.
 * Uses the shared ProposalProgressTimeline component to maintain 1:1 fidelity with StudentProposalCard.jsx.
 */
function ProposalTimelinePreview({ status = "APPROVED", className = "" }) {
  return (
    <ProposalProgressTimeline
      status={status}
      className={className}
    />
  );
}

export default ProposalTimelinePreview;
