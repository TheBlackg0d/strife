import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import ControlledFormInput from "~/components/strife/ControlledFormInput";
import SettingsSection from "./SettingsSection";
import {
  passwordValidationSchema,
  type PasswordFormValues,
} from "./password.schema";
import {
  settingsInputClassName,
  settingsLabelClassName,
} from "./settingsField.styles";

const emptyForm: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

interface PasswordSectionProps {
  onSubmit?: (values: PasswordFormValues) => void;
}

function PasswordSection({ onSubmit }: PasswordSectionProps) {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordValidationSchema),
    defaultValues: emptyForm,
  });

  const { isDirty } = form.formState;

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit?.(values);
    form.reset(emptyForm);
  });

  return (
    <SettingsSection title="Mot de passe et authentification">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex max-w-lg flex-col gap-4"
      >
        <ControlledFormInput
          name="currentPassword"
          control={form.control}
          label="Mot de passe actuel"
          type="password"
          placeholder="Saisir le mot de passe actuel"
          autoComplete="current-password"
          labelClassName={settingsLabelClassName}
          inputClassName={settingsInputClassName}
        />
        <ControlledFormInput
          name="newPassword"
          control={form.control}
          label="Nouveau mot de passe"
          type="password"
          placeholder="Saisir le nouveau mot de passe"
          autoComplete="new-password"
          labelClassName={settingsLabelClassName}
          inputClassName={settingsInputClassName}
        />
        <ControlledFormInput
          name="confirmPassword"
          control={form.control}
          label="Confirmer le nouveau mot de passe"
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
          autoComplete="new-password"
          labelClassName={settingsLabelClassName}
          inputClassName={settingsInputClassName}
        />

        <div className="mt-2 flex items-center gap-4">
          <Button type="submit" disabled={!isDirty} className="px-6">
            Mettre à jour le mot de passe
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => form.reset(emptyForm)}
            disabled={!isDirty}
          >
            Annuler
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}

export default PasswordSection;
