import { useState, useLayoutEffect, useRef } from "react";

// Collision-aware floating tooltip for SVG analytics charts.
function ChartFloatingTooltip({
  containerRef,
  anchor,
  title,
  count,
  visible,
}) {
  const tooltipRef = useRef(null);
  const [coords, setCoords] = useState({ left: 0, top: 0, isCalculated: false });

  useLayoutEffect(() => {
    if (!visible || !anchor || !containerRef.current || !tooltipRef.current) {
      setCoords((prev) => (prev.isCalculated ? { ...prev, isCalculated: false } : prev));
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    if (containerRect.width === 0 || containerRect.height === 0) return;

    // Convert SVG coordinates to actual container pixel coordinates
    const scaleX = containerRect.width / anchor.svgWidth;
    const scaleY = containerRect.height / anchor.svgHeight;

    const anchorX = anchor.svgX * scaleX;
    const anchorY = anchor.svgY * scaleY;

    const padding = 8;
    const gap = 10;

    // 1. Horizontal position: centered on anchor, strictly clamped inside container
    let left = anchorX - tooltipRect.width / 2;
    if (left < padding) {
      left = padding;
    } else if (left + tooltipRect.width > containerRect.width - padding) {
      left = containerRect.width - tooltipRect.width - padding;
    }

    // 2. Vertical position: above anchor by default, flip below if colliding with top
    let top = anchorY - tooltipRect.height - gap;
    if (top < padding) {
      // Flip below the anchor point
      top = anchorY + gap;
      // Extra guard against overflowing the bottom
      if (top + tooltipRect.height > containerRect.height - padding) {
        top = Math.max(padding, containerRect.height - tooltipRect.height - padding);
      }
    }

    setCoords({
      left: Math.round(left),
      top: Math.round(top),
      isCalculated: true,
    });
  }, [visible, anchor, containerRef]);

  if (!visible || !anchor) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        opacity: coords.isCalculated ? 1 : 0,
      }}
      className="pointer-events-none absolute z-30 whitespace-nowrap rounded-lg border border-border bg-foreground px-2.5 py-1.5 text-xs text-background shadow-nexora-md transition-opacity duration-150 ease-out"
      role="tooltip"
    >
      <p className="font-bold text-[11px] leading-tight text-background">
        {title}
      </p>
      <p className="text-[10px] opacity-90 leading-tight text-background/90 font-mono">
        {count} {count === 1 ? "project" : "projects"}
      </p>
    </div>
  );
}

export default ChartFloatingTooltip;
