import type { Activity, ActivityTone } from "../../../types/dashboard";

const tones: Record<ActivityTone, string> = {
  primary: "bg-primary-container/80 text-on-primary-container",
  secondary: "bg-secondary-container/20 text-secondary",
  neutral: "bg-surface-container-highest text-outline",
};

interface FriendActivityProps {
  activity: Activity;
}

function FriendActivity({ activity }: FriendActivityProps) {
  const { verb, target, icon: Icon, tone = "neutral" } = activity;

  return (
    <p className="flex items-center gap-1 text-[13px] text-outline">
      {Icon && (
        <span
          aria-hidden
          className={`flex h-2.5 w-2.5 items-center justify-center rounded-full ${tones[tone]}`}
        >
          <Icon size={8} />
        </span>
      )}
      {verb}
      {target && (
        <span className="font-medium text-on-surface-variant">{target}</span>
      )}
    </p>
  );
}

export default FriendActivity;