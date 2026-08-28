import { Loader2 } from "lucide-react";

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-700",

  secondary:
    "bg-surface-secondary text-foreground hover:bg-border active:bg-border-strong",

  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-secondary active:bg-surface-secondary/80",

  ghost:
    "bg-transparent text-foreground-secondary hover:bg-surface-secondary hover:text-foreground",

  danger: "bg-danger text-white hover:bg-danger-700 active:bg-danger-700",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}

      {children}
    </button>
  );
}

export default Button;
