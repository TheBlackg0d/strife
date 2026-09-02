import PasswordSection from "../components/PasswordSection";
import PlaceholderSection from "../components/PlaceholderSection";
import type { SettingsSectionProps } from "../../../types/settings";

function PrivacySection({ onUpdatePassword }: SettingsSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <PasswordSection onUpdatePassword={onUpdatePassword} />

      <PlaceholderSection
        title="Confidentialité"
        description="Qui peut vous ajouter en ami, filtrage des messages privés et gestion des données. À venir."
      />
    </div>
  );
}

export default PrivacySection;
