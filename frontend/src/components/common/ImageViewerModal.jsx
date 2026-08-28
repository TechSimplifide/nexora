import { useEffect, useRef, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

/**
 * Shared in-app Image Viewer Modal / Lightbox for Nexora.
 * Displays uncropped full-resolution project screenshots with keyboard navigation,
 * accessible dialog semantics, and focus management.
 */
function ImageViewerContent({
  onClose,
  images = [],
  initialIndex = 0,
  title = "Project Screenshot",
}) {
  const normalizedImages = (images || []).map((img) =>
    typeof img === "string" ? { url: img } : img
  ).filter((img) => img?.url);

  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(0, Math.min(initialIndex, normalizedImages.length - 1))
  );
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  // Focus close button on mount, restore focus to opener on unmount
  useEffect(() => {
    triggerRef.current = document.activeElement;
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      if (triggerRef.current && typeof triggerRef.current.focus === "function") {
        triggerRef.current.focus();
      }
    };
  }, []);

  const handleNext = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (normalizedImages.length === 0) return null;

  const currentImage = normalizedImages[currentIndex];
  const hasMultiple = normalizedImages.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-viewer-modal-title"
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950/90 backdrop-blur-md text-zinc-100 animate-in fade-in duration-150 select-none"
    >
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-zinc-800/80 bg-zinc-950/70 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2
              id="image-viewer-modal-title"
              className="text-xs sm:text-sm font-semibold text-zinc-100 truncate"
            >
              {title}
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono">
              Screenshot {currentIndex + 1} of {normalizedImages.length}
            </p>
          </div>
        </div>

        {/* Action: Close */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer (Escape)"
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-0">
        {/* Previous Button Overlay */}
        {hasMultiple && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous screenshot (Left Arrow)"
            className="absolute left-2 sm:left-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-200 border border-zinc-700/80 shadow-lg hover:bg-zinc-800 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Uncropped Main Image with Contain */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <img
            src={currentImage?.url}
            alt={`${title} - view ${currentIndex + 1}`}
            className="max-h-[72vh] sm:max-h-[76vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-opacity duration-150"
          />
        </div>

        {/* Next Button Overlay */}
        {hasMultiple && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next screenshot (Right Arrow)"
            className="absolute right-2 sm:right-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-200 border border-zinc-700/80 shadow-lg hover:bg-zinc-800 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple) */}
      {hasMultiple && (
        <div className="px-4 py-3 border-t border-zinc-800/80 bg-zinc-950/70 shrink-0 flex justify-center">
          <div
            className="flex gap-2 overflow-x-auto max-w-full pb-1 px-1"
            aria-label="Modal thumbnail strip"
          >
            {normalizedImages.map((shot, idx) => (
              <button
                key={shot.publicId || shot.url || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to screenshot ${idx + 1}`}
                aria-current={currentIndex === idx ? "true" : undefined}
                className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  currentIndex === idx
                    ? "border-primary ring-2 ring-primary/40 opacity-100"
                    : "border-zinc-700/80 opacity-50 hover:opacity-85 bg-zinc-900"
                }`}
              >
                <img
                  src={shot.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ImageViewerModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  title = "Project Screenshot",
}) {
  if (!isOpen) return null;

  return (
    <ImageViewerContent
      key={`${initialIndex}-${images.length}`}
      onClose={onClose}
      images={images}
      initialIndex={initialIndex}
      title={title}
    />
  );
}

export default ImageViewerModal;
