import { MdClose } from "react-icons/md";

interface CloseModalButtonProps {
  onClose: () => void;
}

function CloseModalButton({ onClose }: CloseModalButtonProps) {
  return (
    <div className="absolute right-2 top-2 z-20 flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer les paramètres"
        className="group flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
      >
        <MdClose
          size={20}
          className="transition-transform group-hover:scale-110"
        />
      </button>
    </div>
  );
}

export default CloseModalButton;
