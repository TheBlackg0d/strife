import { MdLogout } from "react-icons/md";
import SettingsNavItem from "./SettingsNavItem";
import { settingsNavGroups } from "../sections";
import type { SettingsSectionId } from "../../../types/settings";

interface SettingsSidebarProps {
  activeSection: SettingsSectionId;
  onSelectSection: (section: SettingsSectionId) => void;
  onLogout?: () => void;
}

/** Level 1 surface of the modal: category headers + nav, log out pinned low. */
function SettingsSidebar({
  activeSection,
  onSelectSection,
  onLogout,
}: SettingsSidebarProps) {
  return (
    <nav
      aria-label="Paramètres"
      className="flex h-full w-60 shrink-0 flex-col overflow-y-auto bg-surface-container-low px-4 py-6"
    >
      {settingsNavGroups.map((group, index) => (
        <div key={group.title}>
          {index > 0 && <div className="mb-6 h-px w-full bg-outline-variant" />}

          <h2 className="mb-4 px-2 text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">
            {group.title}
          </h2>

          <div className="mb-6 flex flex-col gap-1">
            {group.items.map(({ id, label, icon }) => (
              <SettingsNavItem
                key={id}
                icon={icon}
                label={label}
                isActive={id === activeSection}
                onClick={() => onSelectSection(id)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-auto border-t border-outline-variant pt-4">
        <SettingsNavItem
          icon={MdLogout}
          label="Déconnexion"
          tone="danger"
          onClick={onLogout}
        />
      </div>
    </nav>
  );
}

export default SettingsSidebar;
