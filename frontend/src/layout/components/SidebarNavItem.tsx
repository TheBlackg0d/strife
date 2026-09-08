import type { IconType } from "react-icons";

interface SidebarNavItemProps {
  icon: IconType;
  label: string;
  isActive?: boolean;
  badge?: number;
  onClick?: () => void;
}

function SidebarNavItem({
  icon: Icon,
  label,
  isActive = false,
  badge,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 transition-colors ${
        isActive
          ? "bg-surface-variant text-on-surface"
          : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={20} />
        <span className="text-left text-[15px] font-medium">{label}</span>
      </span>

      {badge ? (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-bold text-on-error">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export default SidebarNavItem;
