import type { IconType } from "react-icons";
import type { PresenceStatus } from "~/api/profile/profile.types";
import StatusDot from "./StatusDot";

import { initials, stringToHslColor } from "~/lib/avatar";
import type { RingSurface } from "./StatusDot";

interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string;
  icon?: IconType;
  status?: PresenceStatus;
  ring?: RingSurface;
  shape?: "circle" | "squircle";
  surfaceClassName?: string;
  className?: string;
  backgroundColor?: string;
}

function Avatar({
  name,
  size = 32,
  imageUrl,
  icon: Icon,
  status,
  ring = "surface",
  shape = "circle",
  backgroundColor = "none",
  surfaceClassName = "bg-surface-container-high text-on-surface",
  className = "",
}: AvatarProps) {
  const radius = shape === "squircle" ? "rounded-[35%]" : "rounded-full";

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor,
      }}
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
          style={{
            fontSize: Math.round(size * 0.38),
          }}
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
