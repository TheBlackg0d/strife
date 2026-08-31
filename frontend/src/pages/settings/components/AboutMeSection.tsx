import { useId } from "react";
import SettingsSection from "./SettingsSection";

interface AboutMeSectionProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

function AboutMeSection({
  value,
  onChange,
  maxLength = 190,
}: AboutMeSectionProps) {
  const id = useId();

  return (
    <SettingsSection title="À propos de moi">
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Parlez un peu de vous..."
        className="min-h-[120px] w-full resize-y rounded-sm border border-outline-variant bg-surface-container-lowest p-3 text-[15px] text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <p className="mt-1 text-right text-[12px] text-on-surface-variant">
        {value.length}/{maxLength}
      </p>
    </SettingsSection>
  );
}

export default AboutMeSection;
