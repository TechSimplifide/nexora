import ProposalProgressTimeline from "@/components/common/ProposalProgressTimeline";

// Product preview demonstration for Proposal Progress Timeline.
function ProposalTimelinePreview({ status = "APPROVED", className = "" }) {
  return (
    <ProposalProgressTimeline
      status={status}
      className={className}
    />
  );
}

export default ProposalTimelinePreview;
