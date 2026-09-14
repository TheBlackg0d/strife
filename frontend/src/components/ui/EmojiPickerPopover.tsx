import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";

interface EmojiPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  onSelect: (emoji: string) => void;
}

const GAP = 8;
const WIDTH = 350;
const HEIGHT = 450;

function EmojiPickerPopover({
  isOpen,
  onClose,
  anchorRef,
  onSelect,
}: EmojiPickerPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const popover = popoverRef.current;
    if (!isOpen || !anchor || !popover) return;

    const anchorRect = anchor.getBoundingClientRect();

    const left = Math.min(
      Math.max(anchorRect.right - WIDTH, GAP),
      window.innerWidth - WIDTH - GAP,
    );
    const top =
      anchorRect.bottom + GAP + HEIGHT > window.innerHeight
        ? Math.max(anchorRect.top - HEIGHT - GAP, GAP)
        : anchorRect.bottom + GAP;

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.visibility = "visible";
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      onClose();
      anchorRef.current?.focus();
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
      ref={popoverRef}
      style={{ top: 0, left: 0, visibility: "hidden" }}
      className="fixed z-50 overflow-hidden rounded-lg shadow-lg shadow-black/40"
    >
      <EmojiPicker
        width={WIDTH}
        height={HEIGHT}
        theme={Theme.DARK}
        emojiStyle={EmojiStyle.NATIVE}
        lazyLoadEmojis
        previewConfig={{ showPreview: true, defaultEmoji: "1f603" }}
        onEmojiClick={(emoji) => {
          onSelect(emoji.emoji);
          onClose();
        }}
      />
    </div>,
    document.body,
  );
}

export default EmojiPickerPopover;
