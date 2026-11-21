import { useState } from "react";
import { MdAdd, MdChevronRight } from "react-icons/md";

interface ChannelCategoryProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}

function ChannelCategory({
  title,
  children,
  onAdd,
  addLabel,
}: ChannelCategoryProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="mt-4 first:mt-2">
      <div className="group flex items-center justify-between pr-2 text-outline">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex min-w-0 cursor-pointer items-center gap-0.5 py-1 transition-colors hover:text-on-surface"
        >
          <MdChevronRight
            size={14}
            className={`shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
          <h2 className="truncate font-label text-xs font-bold tracking-wide">
            {title}
          </h2>
        </button>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label={addLabel ?? title}
            title={addLabel ?? title}
            className="cursor-pointer transition-colors hover:text-on-surface"
          >
            <MdAdd size={16} />
          </button>
        )}
      </div>

      {isOpen && <div className="flex flex-col gap-0.5">{children}</div>}
    </section>
  );
}

export default ChannelCategory;
