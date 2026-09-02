import type { IconType } from "react-icons";
import StatusDot, { type RingSurface } from "./StatusDot";
import type { PresenceStatus } from "../../types/profile";

interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string;
  /** Rendered instead of initials when there is no image (bots, group DMs). */
  icon?: IconType;
  status?: PresenceStatus;
  /** Surface behind the avatar, so the status ring blends in. */
  ring?: RingSurface;
  /** "squircle" is the guild-icon shape; users are always circular. */
  shape?: "circle" | "squircle";
  /**
   * Background/foreground classes for the fallback tile. Kept separate from
   * `className` so overriding the colour never collides with the default.
   */
  surfaceClassName?: string;
  className?: string;
}

function initials(name: string): string {
  const parts = name
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  // "CyberNinja" -> "CN"
  const camel = name.match(/[A-Z][a-z]*/g);
  if (camel && camel.length > 1) {
    return (camel[0][0] + camel[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function Avatar({
  name,
  size = 32,
  imageUrl,
  icon: Icon,
  status,
  ring = "surface",
  shape = "circle",
  surfaceClassName = "bg-surface-container-high text-on-surface",
  className = "",
}: AvatarProps) {
  const radius = shape === "squircle" ? "rounded-[35%]" : "rounded-full";

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex shrink-0 items-center justify-center ${surfaceClassName} ${radius} ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={`h-full w-full object-cover ${radius}`}
        />
      ) : Icon ? (
        <Icon size={Math.round(size * 0.55)} />
      ) : (
        <span
          aria-hidden
          style={{ fontSize: Math.round(size * 0.38) }}
          className="font-semibold"
        >
          {initials(name)}
        </span>
      )}

      {status && (
        <StatusDot status={status} size={size >= 40 ? 14 : 12} ring={ring} />
      )}
    </div>
  );
}

export default Avatar;
