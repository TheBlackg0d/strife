import type { PresenceStatus } from "../../types/dashboard";

/**
 * Surface the avatar sits on. The status dot punches a ring of that colour
 * out of the avatar, so it has to be declared explicitly — class names are
 * kept literal for Tailwind's source scanner.
 */
export type RingSurface =
  | "surface"
  | "surface-variant"
  | "surface-container-low"
  | "surface-container-lowest";

const ringStyles: Record<RingSurface, { border: string; fill: string }> = {
  surface: { border: "border-surface", fill: "bg-surface" },
  "surface-variant": {
    border: "border-surface-variant",
    fill: "bg-surface-variant",
  },
  "surface-container-low": {
    border: "border-surface-container-low",
    fill: "bg-surface-container-low",
  },
  "surface-container-lowest": {
    border: "border-surface-container-lowest",
    fill: "bg-surface-container-lowest",
  },
};

const statusColor: Record<PresenceStatus, string> = {
  online: "bg-status-online",
  idle: "bg-status-idle",
  dnd: "bg-status-dnd",
  offline: "bg-surface-container-high",
};

const statusLabel: Record<PresenceStatus, string> = {
  online: "En ligne",
  idle: "Inactif",
  dnd: "Ne pas déranger",
  offline: "Hors ligne",
};

interface StatusDotProps {
  status: PresenceStatus;
  /** Diameter in px, ring included. */
  size?: number;
  ring?: RingSurface;
}

function StatusDot({ status, size = 12, ring = "surface" }: StatusDotProps) {
  const { border, fill } = ringStyles[ring];

  return (
    <span
      role="img"
      aria-label={statusLabel[status]}
      style={{ width: size, height: size, borderWidth: size >= 14 ? 3 : 2 }}
      className={`absolute bottom-0 right-0 flex items-center justify-center rounded-full border-solid ${statusColor[status]} ${border}`}
    >
      {status === "offline" && (
        <span className="h-1.5 w-1.5 rounded-full bg-outline" />
      )}
      {status === "dnd" && (
        <span className={`h-0.5 w-1.5 rounded-full ${fill}`} />
      )}
    </span>
  );
}

export default StatusDot;
