/**
 * Lightweight, reusable Skeleton loading primitive for Nexora.
 * Provides subtle visual shimmer placeholders matching the design tokens.
 *
 * @param {Object} props
 * @param {"text" | "rectangular" | "circular"} [props.variant="rectangular"] - Shape of the skeleton placeholder
 * @param {string} [props.className] - Additional Tailwind classes for sizing, rounded corners, or margins
 */
function Skeleton({ variant = "rectangular", className = "", ...props }) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-xl",
    circular: "rounded-full",
  };

  const baseVariant = variantClasses[variant] || variantClasses.rectangular;

  return (
    <div
      className={`animate-pulse bg-surface-secondary/80 ${baseVariant} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Skeleton;
