interface BadgeProps {
  count: number;
}

export default function Badge({ count }: BadgeProps) {
  return (
    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-bold text-on-error">
      {count}
    </span>
  );
}
