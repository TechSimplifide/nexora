// Lightweight, reusable Skeleton loading primitive for Nexora.
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
