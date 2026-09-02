import { useState } from "react";
import Button from "../../../components/ui/Button";
import AboutMeSection from "../components/AboutMeSection";
import ProfileCard from "../components/ProfileCard";
import type {
  ProfileFormValues,
  SettingsSectionProps,
  SettingsUser,
} from "../../../types/settings";
import { updateProfile } from "../../../api/profile";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../main";
import { createProfileQueryOptions } from "../../../query-options/profile-query-options";

function toFormValues(user: SettingsUser): ProfileFormValues {
  return {
    username: user.username,
    email: user.email,
    bio: user.bio ?? "",
  };
}

function MyAccountSection({ user, onSaveProfile }: SettingsSectionProps) {
  const [genericError, setGenericError] = useState<string | null>(null);

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
        {genericError && <p className="text-sm text-red-500">{genericError}</p>}
      </div>
    </div>
  );
}

export default MyAccountSection;
