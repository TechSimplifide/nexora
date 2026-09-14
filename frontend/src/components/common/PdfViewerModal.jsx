import { useEffect } from "react";
import { X, FileText, Download, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Shared in-app PDF Viewer Modal for Nexora.
 * Renders embedded PDF documents within the application UI without redirecting to external storage.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback to close modal
 * @param {string} props.documentUrl - URL of the PDF document to view
 * @param {string} [props.title="Document Preview"] - Modal title
 * @param {string} [props.subtitle=null] - Optional subtitle (e.g. project title or author)
 * @param {string} [props.downloadFilename="document.pdf"] - Filename for secondary download
 */
function PdfViewerModal({
  isOpen,
  onClose,
  documentUrl,
  title = "Document Preview",
  subtitle = null,
  downloadFilename = "document.pdf",
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !documentUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150"
    >
      <div className="flex flex-col w-full max-w-5xl h-[90vh] overflow-hidden rounded-2xl border border-border bg-surface shadow-nexora-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-surface shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20 shrink-0">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="pdf-viewer-modal-title"
                className="text-base font-bold tracking-tight text-foreground truncate"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close document viewer"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-secondary hover:text-foreground transition-colors shrink-0 ml-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-surface-secondary/50 p-2 sm:p-4 overflow-hidden flex flex-col items-center justify-center">
          <object
            data={documentUrl}
            type="application/pdf"
            className="w-full h-full rounded-xl border border-border bg-white shadow-xs"
            aria-label={`Document reader for ${title}`}
          >
            {/* Fallback for browsers that don't support inline object embedding */}
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-surface rounded-xl space-y-4">
              <FileText className="h-12 w-12 text-muted-foreground/60" />
              <div className="space-y-1 max-w-md">
                <h3 className="text-sm font-bold text-foreground">
                  Inline Preview Unavailable
                </h3>
                <p className="text-xs text-muted-foreground">
                  Unable to preview this document inline in your browser. You can open or download the document directly.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Document</span>
                </a>
                <a
                  href={documentUrl}
                  download={downloadFilename}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </object>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/80 px-4 sm:px-6 py-3 bg-surface shrink-0 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Viewing within Nexora in-app reader</span>
          <div className="flex items-center justify-end w-full sm:w-auto gap-3">
            <a
              href={documentUrl}
              download={downloadFilename}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </a>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close Viewer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfViewerModal;
