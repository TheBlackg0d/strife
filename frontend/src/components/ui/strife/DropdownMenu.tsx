import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: IconType;
  onSelect?: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
  title?: string;
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  items: DropdownMenuItem[];
  label: string;
}

const GAP = 8;

const tones = {
  default:
    "cursor-pointer text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface",
  danger:
    "cursor-pointer text-error hover:bg-error-container hover:text-on-error-container",
  disabled: "cursor-not-allowed text-outline-variant",
} as const;

function DropdownMenu({
  isOpen,
  onClose,
  anchorRef,
  items,
  label,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!isOpen || !anchor || !menu) return;

    const anchorRect = anchor.getBoundingClientRect();
    const { width, height } = menu.getBoundingClientRect();

    const left = Math.min(
      Math.max(anchorRect.right - width, GAP),
      window.innerWidth - width - GAP,
    );
    const top =
      anchorRect.bottom + GAP + height > window.innerHeight
        ? anchorRect.top - height - GAP
        : anchorRect.bottom + GAP;

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.visibility = "visible";

    menu
      .querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus({ preventScroll: true });
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        anchorRef.current?.focus();
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      const options = Array.from(
        menuRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)",
        ) ?? [],
      );
      if (options.length === 0) return;

      event.preventDefault();
      const current = options.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = (current + step + options.length) % options.length;
      options[next].focus();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label={label}
      style={{ top: 0, left: 0, visibility: "hidden" }}
      className="fixed z-50 w-56 rounded-lg border border-surface-container bg-surface-container-high p-1.5 shadow-lg shadow-black/40"
    >
      {items.map(
        ({
          id,
          label: itemLabel,
          icon: Icon,
          onSelect,
          tone,
          disabled,
          title,
        }) => (
          <button
            key={id}
            type="button"
            role="menuitem"
            disabled={disabled}
            title={title}
            onClick={() => {
              onSelect?.();
              onClose();
            }}
            className={`flex w-full items-center justify-between gap-3 rounded-sm px-2 py-2 text-left text-[14px] transition-colors focus:outline-none ${
              disabled ? tones.disabled : tones[tone ?? "default"]
            }`}
          >
            <span className="truncate">{itemLabel}</span>
            {Icon && <Icon size={18} className="shrink-0" />}
          </button>
        ),
      )}
    </div>,
    document.body,
  );
}

export default DropdownMenu;
