import { useState } from "react";
import Button from "../../../components/ui/Button";
import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import type { PasswordFormValues } from "../../../types/settings";
import { useChangePasswordMutation } from "../../../services/account-api";
import useFieldError from "../../../hook/use-field-error";
import { hasFieldErrors } from "../../../api/errors";

const emptyForm: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/** Self-contained: the password form never leaves this component. */
function PasswordSection() {
  const [values, setValues] = useState<PasswordFormValues>(emptyForm);
  const [passwordChangeMutation, { error, isError }] =
    useChangePasswordMutation();
  const { fieldErrors, apiError } = useFieldError(isError, error);

  const onUpdatePassword = (values: PasswordFormValues) => {
    passwordChangeMutation(values);
  };

  function update(field: keyof PasswordFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  const isFilled =
    values.currentPassword !== "" &&
    values.newPassword !== "" &&
    values.confirmPassword !== "";

  function handleSubmit() {
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
            error={fieldErrors?.confirmPassword}
          />

          {apiError && !hasFieldErrors(apiError) && (
            <p role="alert" className="text-red-400 text-sm">
              {apiError.message}
            </p>
          )}

          <div className="mt-2 flex items-center gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFilled}
              className="px-6"
            >
              Mettre à jour le mot de passe
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setValues(emptyForm);
              }}
              disabled={!isFilled}
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}

export default PasswordSection;
