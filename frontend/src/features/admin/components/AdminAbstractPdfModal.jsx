import PdfViewerModal from "@/components/common/PdfViewerModal";

function AdminAbstractPdfModal({ isOpen, onClose, proposal }) {
  if (!isOpen || !proposal) return null;

  const pdfUrl = proposal.abstractPdf?.url;
  const leadName = proposal.createdBy?.fullName || "Student Lead";
  const leadEmail = proposal.createdBy?.email ? ` (${proposal.createdBy.email})` : "";

  return (
    <PdfViewerModal
      isOpen={isOpen}
      onClose={onClose}
      documentUrl={pdfUrl}
      title={`Abstract: ${proposal.title || "Project Proposal"}`}
      subtitle={`Submitted by ${leadName}${leadEmail}`}
      downloadFilename={`Abstract_${proposal.title || "Proposal"}.pdf`}
    />
  );
}

export default AdminAbstractPdfModal;
