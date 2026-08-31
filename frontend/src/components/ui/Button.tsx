import type { ReactNode } from "react";

/** DESIGN.md > Components > Buttons. */
type ButtonVariant = "primary" | "neutral" | "ghost" | "danger";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-container text-on-primary-container hover:bg-primary-container/90",
  neutral:
    "border border-outline-variant bg-surface-container-high text-on-surface hover:bg-surface-variant",
  ghost: "text-on-surface hover:underline",
  danger: "text-error hover:bg-error/10",
};

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-sm px-4 py-2 text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
