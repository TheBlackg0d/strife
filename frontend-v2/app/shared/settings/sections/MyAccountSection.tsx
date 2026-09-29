import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Profile, ProfileFormValues } from "~/api/profile/profile.types";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "~/api/profile/profile.hooks";
import ProfileCard from "../components/ProfileCard";
import AboutMeSection from "../components/AboutMeSection";
import { Button } from "~/components/ui/button";
import { profileValidationSchema } from "./myAccount.schema";

function toFormValues(user: Profile): ProfileFormValues {
  return {
    username: user.username ?? "",
    email: user.email ?? "",
    bio: user.bio ?? "",
  };
}

function MyAccountSection() {
  const { data: profile } = useProfileQuery();

  if (!profile) {
    return null;
  }

  return <MyAccountForm profile={profile} />;
}

function MyAccountForm({ profile }: { profile: Profile }) {
  const updateProfile = useUpdateProfileMutation();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: toFormValues(profile),
  });

  const { isDirty } = form.formState;

  const handleSubmit = form.handleSubmit((values) => {
    updateProfile.mutate(values, {
      onSuccess: (updated) => form.reset(toFormValues(updated)),
    });
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <ProfileCard user={profile} control={form.control} />

      <AboutMeSection control={form.control} name="bio" />

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={!isDirty || updateProfile.isPending}
          className="px-6"
        >
          Enregistrer les modifications
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => form.reset()}
          disabled={!isDirty}
        >
          Annuler
        </Button>
        {updateProfile.isError && (
          <p className="text-sm text-red-500">
            Impossible d'enregistrer les modifications.
          </p>
        )}
      </div>
    </form>
  );
}

export default MyAccountSection;
