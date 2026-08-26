import type { IconType } from "react-icons";

interface IconButtonProps {
  icon: IconType;
  label: string;
  onClick?: () => void;
  /**
   * "ghost" is the flat control used in the user panel,
   * "raised" is the circular action shown on friend-row hover.
   */
  variant?: "ghost" | "raised";
  size?: number;
}

const variants = {
  ghost: "p-1 rounded-sm text-outline hover:bg-surface-variant hover:text-on-surface",
  raised:
    "h-9 w-9 rounded-full bg-surface-container-highest text-outline hover:text-on-surface",
} as const;

function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
  size = 18,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex cursor-pointer items-center justify-center transition-colors ${variants[variant]}`}
    >
      <Icon size={size} />
    </button>
  );
}

export default IconButton;
