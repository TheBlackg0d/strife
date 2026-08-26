import { MdAdd } from "react-icons/md";

interface SectionHeaderProps {
  title: string;
  /** Shows the trailing "+" affordance when provided. */
  onAdd?: () => void;
  addLabel?: string;
}

/** `label-caps` category break — DESIGN.md > Typography > Hierarchy. */
function SectionHeader({ title, onAdd, addLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 text-outline">
      <h2 className="font-label text-xs font-bold tracking-wide">{title}</h2>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label={addLabel ?? title}
          className="cursor-pointer transition-colors hover:text-on-surface"
        >
          <MdAdd size={16} />
        </button>
      )}
    </div>
  );
}

export default SectionHeader;