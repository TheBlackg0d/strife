import { useState } from "react";
import Button from "../../../components/ui/Button";
import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import type { PasswordFormValues } from "../../../types/settings";

const emptyForm: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

interface PasswordSectionProps {
  onUpdatePassword?: (values: PasswordFormValues) => void;
  onEnableTwoFactor?: () => void;
}

/** Self-contained: the password form never leaves this component. */
function PasswordSection({
  onUpdatePassword,
  onEnableTwoFactor,
}: PasswordSectionProps) {
  const [values, setValues] = useState<PasswordFormValues>(emptyForm);
  const [error, setError] = useState<string>();

  function update(field: keyof PasswordFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setError(undefined);
  }

  const isFilled =
    values.currentPassword !== "" &&
    values.newPassword !== "" &&
    values.confirmPassword !== "";

  function handleSubmit() {
    if (values.newPassword !== values.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    onUpdatePassword?.(values);
    setValues(emptyForm);
  }

  return (
    <SettingsSection title="Mot de passe et authentification">
      <div className="flex flex-col gap-4">
        <div className="flex max-w-lg flex-col gap-4">
          <SettingsField
            label="Mot de passe actuel"
            type="password"
            value={values.currentPassword}
            onChange={(value) => update("currentPassword", value)}
            placeholder="Saisir le mot de passe actuel"
            autoComplete="current-password"
          />
          <SettingsField
            label="Nouveau mot de passe"
            type="password"
            value={values.newPassword}
            onChange={(value) => update("newPassword", value)}
            placeholder="Saisir le nouveau mot de passe"
            autoComplete="new-password"
          />
          <SettingsField
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={values.confirmPassword}
            onChange={(value) => update("confirmPassword", value)}
            placeholder="Confirmer le nouveau mot de passe"
            autoComplete="new-password"
            error={error}
          />

          <div className="mt-2 flex items-center gap-4">
            <Button onClick={handleSubmit} disabled={!isFilled} className="px-6">
              Mettre à jour le mot de passe
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setValues(emptyForm);
                setError(undefined);
              }}
              disabled={!isFilled}
            >
              Annuler
            </Button>
          </div>
        </div>

        <p className="max-w-lg text-[14px] text-on-surface-variant">
          Sécurisez votre compte avec l'authentification à deux facteurs. Nous
          recommandons une application d'authentification.
        </p>
        <Button variant="neutral" onClick={onEnableTwoFactor} className="w-fit">
          Activer l'authentification à deux facteurs
        </Button>
      </div>
    </SettingsSection>
  );
}

export default PasswordSection;
