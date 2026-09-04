import PasswordSection from "../components/PasswordSection";
import PlaceholderSection from "../components/PlaceholderSection";

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
