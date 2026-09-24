import { forwardRef } from "react";

// Reusable Input UI primitive for Nexora.
const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    icon: Icon,
    rightElement,
    error,
    helperText,
    className = "",
    wrapperClassName = "",
    autoComplete,
    autoCapitalize,
    ...props
  },
  ref
) {
  const inputId = id || name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;
  const describedBy = errorId || helperId || undefined;

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-xs font-semibold text-foreground"
        >
          {label}
          {required && <span className="ml-0.5 text-danger-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3 flex items-center justify-center text-muted-foreground/70">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-md border bg-surface py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon ? "pl-9.5" : "pl-3"
          } ${rightElement ? "pr-10" : "pr-3"} ${
            error
              ? "border-danger-500 focus-visible:ring-danger-500"
              : "border-border hover:border-border-strong focus-visible:ring-primary"
          } ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-2.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1 text-xs font-medium text-danger-600"
        >
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1 text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
