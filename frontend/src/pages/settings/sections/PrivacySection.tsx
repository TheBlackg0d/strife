import PasswordSection from "@/pages/settings/components/PasswordSection";
import PlaceholderSection from "@/pages/settings/components/PlaceholderSection";

function PrivacySection() {
  return (
    <div className="flex flex-col gap-8">
      <PasswordSection />

      <PlaceholderSection
        title="Confidentialité"
        description="Qui peut vous ajouter en ami, filtrage des messages privés et gestion des données. À venir."
      />
    </div>
  );
}

export default PrivacySection;
