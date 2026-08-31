import { useState } from "react";
import Button from "../../../components/ui/Button";
import AboutMeSection from "../components/AboutMeSection";
import PasswordSection from "../components/PasswordSection";
import ProfileCard from "../components/ProfileCard";
import type {
  ProfileFormValues,
  SettingsSectionProps,
  SettingsUser,
} from "../../../types/settings";

function toFormValues(user: SettingsUser): ProfileFormValues {
  return {
    username: user.username,
    email: user.email,
    phone: user.phone ?? "",
    bio: user.bio ?? "",
  };
}

function MyAccountSection({
  user,
  onSaveProfile,
  onUpdatePassword,
}: SettingsSectionProps) {
  const initialValues = toFormValues(user);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);

  const isDirty = (Object.keys(values) as (keyof ProfileFormValues)[]).some(
    (field) => values[field] !== initialValues[field],
  );

  function update(field: keyof ProfileFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  return (
    <div className="flex flex-col gap-8">
      <ProfileCard user={user} values={values} onChange={update} />

      <PasswordSection onUpdatePassword={onUpdatePassword} />

      <AboutMeSection
        value={values.bio}
        onChange={(bio) => update("bio", bio)}
      />

      <div className="flex items-center gap-4">
        <Button
          onClick={() => onSaveProfile?.(values)}
          disabled={!isDirty}
          className="px-6"
        >
          Enregistrer les modifications
        </Button>
        <Button
          variant="ghost"
          onClick={() => setValues(initialValues)}
          disabled={!isDirty}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}

export default MyAccountSection;
