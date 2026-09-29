import { MdAddAPhoto, MdEdit } from "react-icons/md";
import type { Control } from "react-hook-form";
import Avatar from "~/components/strife/Avatar";
import ControlledFormInput from "~/components/strife/ControlledFormInput";
import type { Profile, ProfileFormValues } from "~/api/profile/profile.types";
import {
  settingsInputClassName,
  settingsLabelClassName,
} from "./settingsField.styles";

interface ProfileCardProps {
  user: Profile;
  control: Control<ProfileFormValues>;
  onChangeBanner?: () => void;
  onChangeAvatar?: () => void;
}

function ProfileCard({
  user,
  control,
  onChangeBanner,
  onChangeAvatar,
}: ProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest">
      <div className="relative h-24 w-full bg-primary-container bg-cover bg-center">
        <button
          type="button"
          onClick={onChangeBanner}
          className="absolute right-2 top-2 flex cursor-pointer items-center gap-2 rounded-sm bg-black/40 px-2 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <MdEdit size={16} />
          Changer la bannière
        </button>
      </div>

      <div className="relative px-6 pb-6 pt-14">
        <div className="absolute -top-12 left-6 rounded-full bg-surface-container-lowest p-2">
          <div className="group relative">
            <Avatar
              name={user.username}
              imageUrl={user.imageUrl}
              status={user.statusPreference}
              size={80}
              ring="surface-container-lowest"
              surfaceClassName="bg-primary-container text-on-primary-container"
            />
            <button
              type="button"
              onClick={onChangeAvatar}
              aria-label="Changer l'avatar"
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MdAddAPhoto size={24} />
            </button>
          </div>
        </div>

        <h2 className="text-[16px] font-bold text-on-surface">
          {user.username}
        </h2>
      </div>

      <div className="mx-6 mb-6 flex flex-col gap-4 rounded-sm bg-surface-container-high p-4">
        <ControlledFormInput
          name="username"
          control={control}
          label="Nom d'utilisateur"
          autoComplete="username"
          labelClassName={settingsLabelClassName}
          inputClassName={settingsInputClassName}
        />
        <ControlledFormInput
          name="email"
          control={control}
          label="E-mail"
          type="email"
          autoComplete="email"
          labelClassName={settingsLabelClassName}
          inputClassName={settingsInputClassName}
        />
      </div>
    </div>
  );
}

export default ProfileCard;
