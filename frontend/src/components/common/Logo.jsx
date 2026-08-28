import nexoraLogo from "@/assets/logos/nexora-logo.png";

/**
 * Nexora Brand Logo component.
 *
 * @param {Object} props
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} [props.size="md"] - Size preset for logo icon
 * @param {boolean} [props.showText=true] - Whether to render the brand name text
 * @param {string} [props.textClassName=""] - Additional classes for brand name text
 * @param {string} [props.className=""] - Container classes
 * @param {string} [props.imageClassName=""] - Additional classes for the logo image
 */
function Logo({
  size = "md",
  showText = true,
  textClassName = "",
  className = "",
  imageClassName = "",
}) {
  const sizeMap = {
    xs: "h-6 w-6",
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  const textSizeMap = {
    xs: "text-sm",
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const iconClass = sizeMap[size] || sizeMap.md;
  const textClass = textSizeMap[size] || textSizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={nexoraLogo}
        alt="Nexora Logo"
        className={`${iconClass} object-contain shrink-0 rounded-lg shadow-xs ${imageClassName}`}
      />
      {showText && (
        <span
          className={`font-bold tracking-tight text-foreground leading-none ${textClass} ${textClassName}`}
        >
          Nexora
        </span>
      )}
    </div>
  );
}

export default Logo;
