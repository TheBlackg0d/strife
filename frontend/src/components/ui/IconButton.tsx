import type { Ref } from "react";
import type { IconType } from "react-icons";

interface IconButtonProps {
  icon: IconType;
  label: string;
  onClick?: () => void;

  variant?: "ghost" | "raised";
  size?: number;
  ref?: Ref<HTMLButtonElement>;
  hasPopup?: boolean;
  isExpanded?: boolean;
}

const variants = {
  ghost:
    "p-1 rounded-sm text-outline hover:bg-surface-variant hover:text-on-surface",
  raised:
    "h-9 w-9 rounded-full bg-surface-container-highest text-outline hover:text-on-surface",
} as const;

function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
  size = 18,
  ref,
  hasPopup,
  isExpanded,
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-haspopup={hasPopup ? "menu" : undefined}
      aria-expanded={hasPopup ? isExpanded === true : undefined}
      className={`flex cursor-pointer items-center justify-center transition-colors ${variants[variant]}`}
    >
      <Icon size={size} />
    </button>
  );
}

export default IconButton;
