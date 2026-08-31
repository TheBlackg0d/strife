import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** `label-caps` heading + block, the structural break of every settings pane. */
function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section>
      <h3 className="mb-4 text-[12px] font-bold uppercase tracking-wide text-on-surface-variant">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-lg text-[14px] text-on-surface-variant">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

export default SettingsSection;
