import { MdConstruction } from "react-icons/md";

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

/** Shown by sections whose settings are not implemented yet. */
function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-outline-variant bg-surface-container-lowest p-6">
      <span className="flex items-center gap-2 text-[15px] font-semibold text-on-surface">
        <MdConstruction size={20} className="text-tertiary" />
        {title}
      </span>
      <p className="max-w-lg text-[14px] text-on-surface-variant">
        {description}
      </p>
    </div>
  );
}

export default PlaceholderSection;
