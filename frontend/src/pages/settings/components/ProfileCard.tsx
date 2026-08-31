import { MdAddAPhoto, MdEdit } from "react-icons/md";
import Avatar from "../../../components/ui/Avatar";
import SettingsField from "./SettingsField";
import type { ProfileFormValues, SettingsUser } from "../../../types/settings";

interface ProfileCardProps {
  user: SettingsUser;
  values: ProfileFormValues;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  onChangeBanner?: () => void;
  onChangeAvatar?: () => void;
}

/** Banner + avatar + the identity fields of "Mon compte". */
function ProfileCard({
  user,
  values,
  onChange,
  onChangeBanner,
  onChangeAvatar,
}: ProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface-container-lowest">
      <div
        className="relative h-24 w-full bg-primary-container bg-cover bg-center"
        style={
          user.bannerUrl ? { backgroundImage: `url(${user.bannerUrl})` } : undefined
        }
      >
        {!user.bannerUrl && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] opacity-20 [background-size:16px_16px]" />
        )}
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
              imageUrl={user.avatarUrl}
              status={user.status}
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
        {user.tag && (
          <p className="text-[14px] text-on-surface-variant">{user.tag}</p>
        )}
      </div>

      <div className="mx-6 mb-6 flex flex-col gap-4 rounded-sm bg-surface-container-high p-4">
        <SettingsField
          label="Nom d'utilisateur"
          value={values.username}
          onChange={(value) => onChange("username", value)}
          autoComplete="username"
        />
        <SettingsField
          label="E-mail"
          type="email"
          value={values.email}
          onChange={(value) => onChange("email", value)}
          autoComplete="email"
        />
        <SettingsField
          label="Numéro de téléphone"
          type="tel"
          value={values.phone}
          onChange={(value) => onChange("phone", value)}
          placeholder="Saisir un numéro de téléphone"
          autoComplete="tel"
        />
      </div>
    </div>
  );
}

export default ProfileCard;
