import { useId, useState } from "react";
import { MdClose } from "react-icons/md";
import Modal from "../../components/ui/Modal";
import SettingsSidebar from "./components/SettingsSidebar";
import { getSection } from "./sections";
import type {
  PasswordFormValues,
  ProfileFormValues,
  SettingsSectionId,
  SettingsUser,
} from "../../types/settings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SettingsUser;
  /** Which pane opens first; the modal owns navigation from there. */
  initialSection?: SettingsSectionId;
  onLogout?: () => void;
  onSaveProfile?: (values: ProfileFormValues) => void;
  onUpdatePassword?: (values: PasswordFormValues) => void;
}

/**
 * Full-screen user settings, driven by the registry in `sections.tsx`:
 * 240px nav + fluid content pane, same three-plane depth as the app shell.
 */
function SettingsModal({
  isOpen,
  onClose,
  user,
  initialSection = "account",
  onLogout,
  onSaveProfile,
  onUpdatePassword,
}: SettingsModalProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>(initialSection);
  const headingId = useId();

  const { label, Component } = getSection(activeSection);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={headingId}
      panelClassName="relative flex h-full max-h-[921px] w-full max-w-7xl overflow-hidden rounded-xl bg-surface-container ring-1 ring-white/10"
    >
      <SettingsSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onLogout={onLogout}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto pb-20">
        <div className="sticky top-0 z-10 bg-surface-container/90 px-10 pb-4 pt-12 backdrop-blur-md">
          <h1
            id={headingId}
            className="text-[20px] font-bold tracking-[-0.02em] text-on-surface"
          >
            {label}
          </h1>
        </div>

        <div className="max-w-3xl px-10">
          <Component
            user={user}
            onSaveProfile={onSaveProfile}
            onUpdatePassword={onUpdatePassword}
          />
        </div>
      </main>

      <div className="absolute right-6 top-6 z-20 flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer les paramètres"
          className="group flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
        >
          <MdClose
            size={20}
            className="transition-transform group-hover:scale-110"
          />
        </button>
        <span className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant">
          ESC
        </span>
      </div>
    </Modal>
  );
}

export default SettingsModal;
