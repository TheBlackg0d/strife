import type { IconType } from "react-icons";
import Avatar from "../../components/ui/Avatar";

interface GuildItemProps {
  name: string;
  imageUrl?: string;
  icon?: IconType;
  isActive?: boolean;
  /** "brand" is the home button, "action" the green "add a server" button. */
  variant?: "default" | "brand" | "action";
  onClick?: () => void;
}

const surfaces = {
  default:
    "bg-surface-container-high text-on-surface group-hover:bg-primary-container group-hover:text-on-primary-container",
  brand: "bg-primary-container text-on-primary-container",
  action:
    "bg-surface-container-high text-secondary group-hover:bg-secondary-container group-hover:text-on-secondary-container",
} as const;

function GuildItem({
  name,
  imageUrl,
  icon,
  isActive = false,
  variant = "default",
  onClick,
}: GuildItemProps) {
  return (
    <div className="group relative flex w-full justify-center">
      {/* Active/hover pill on the far-left edge of the rail */}
      <span
        aria-hidden
        className={`absolute left-0 top-1/2 w-1 origin-left -translate-y-1/2 rounded-r-full bg-on-surface transition-all duration-200 ${
          isActive ? "h-10 scale-y-100" : "h-5 scale-y-0 group-hover:scale-y-100"
        }`}
      />

      <button
        type="button"
        onClick={onClick}
        aria-label={name}
        aria-current={isActive ? "page" : undefined}
        className="cursor-pointer"
      >
        <Avatar
          name={name}
          imageUrl={imageUrl}
          icon={icon}
          size={48}
          shape={isActive || variant !== "default" ? "squircle" : "circle"}
          surfaceClassName={surfaces[variant]}
          className="transition-all duration-200 group-hover:rounded-[35%]"
        />
      </button>

      {/* Tooltip — DESIGN.md > Components > Tooltips */}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-sm bg-surface-container-lowest px-2 py-1 text-sm font-semibold text-on-surface opacity-0 transition-opacity group-hover:opacity-100"
      >
        {name}
      </span>
    </div>
  );
}

export default GuildItem;