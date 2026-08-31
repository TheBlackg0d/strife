import type { IconType } from "react-icons";

interface SettingsNavItemProps {
  icon: IconType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  /** Destructive entries (log out) keep the error colour instead. */
  tone?: "default" | "danger";
}

function SettingsNavItem({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  tone = "default",
}: SettingsNavItemProps) {
  const tones = {
    default: isActive
      ? "bg-surface-container-highest text-on-surface"
      : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface",
    danger: "text-error hover:bg-error/10",
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-left text-[15px] font-medium transition-colors active:opacity-80 ${tones[tone]}`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}

export default SettingsNavItem;
