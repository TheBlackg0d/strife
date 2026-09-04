import { useState } from "react";
import Button from "../../../components/ui/Button";
import AboutMeSection from "../components/AboutMeSection";
import ProfileCard from "../components/ProfileCard";
import type { ProfileFormValues } from "../../../types/settings";
import type { Profile } from "../../../types/profile";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../../services/profile-api";

function toFormValues(user: Profile | undefined): ProfileFormValues {
  return {
    username: user?.username ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
  };
}

function MyAccountSection() {
  const [genericError, setGenericError] = useState<string | null>(null);

  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { error }] = useUpdateProfileMutation();

  if (!profile) {
    return null;
  }

  if (error) {
    setGenericError(
      "Une erreur est survenue lors de la mise à jour de votre profil.",
    );
  }

  const initialValues = toFormValues(profile);
  const [values, setValues] = useState<ProfileFormValues>(initialValues);

  const isDirty = (Object.keys(values) as (keyof ProfileFormValues)[]).some(
    (field) => values[field] !== initialValues[field],
  );

  function update(field: keyof ProfileFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  async function onSaveProfile(values: ProfileFormValues) {
    await updateProfile(values);
  }

  return (
    <div className="flex flex-col gap-8">
      <ProfileCard user={profile} values={values} onChange={update} />

      <AboutMeSection
        value={values.bio}
        onChange={(bio) => update("bio", bio)}
      />

      <div className="flex items-center gap-4">
        <Button
          onClick={() => onSaveProfile(values)}
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
