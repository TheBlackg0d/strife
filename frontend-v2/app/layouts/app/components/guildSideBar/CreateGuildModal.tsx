import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdAdd, MdPhotoCamera } from "react-icons/md";
import Avatar from "~/components/strife/Avatar";
import CloseModalButton from "~/components/strife/CloseModalButton";
import Header from "~/components/strife/Header";
import Modal from "~/components/strife/Modal";
import Button from "~/components/strife/StrifeButton";
import { useFriends } from "~/api/friend/friend.hooks";
import type { Friend } from "~/api/friend/friend.types";
import { useCreateGuildMutation } from "~/api/guild/guild.hooks";
import type { GuildMember } from "~/api/guild/guild.types";
import {
  GuildSchema,
  type GuildSchemaType,
} from "~/routes/app/guild.$guildId/schema/GuildSchemaValidation";

interface CreateGuildModalProps {
  isOpen: boolean;
  owner: GuildMember;
  onClose: () => void;
}

type Step = "details" | "members";

export default function CreateGuildModal({
  isOpen,
  owner,
  onClose,
}: CreateGuildModalProps) {
  const { data } = useFriends();
  const friends = data?.friendStatusList.ALL ?? [];

  const createGuild = useCreateGuildMutation();
  const [step, setStep] = useState<Step>("details");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const form = useForm<GuildSchemaType>({
    resolver: zodResolver(GuildSchema),
    defaultValues: { name: "", owner, members: [] },
  });

  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setDirection("forward");
      form.reset({ name: "", owner, members: [] });
    }
  }, [isOpen, owner, form]);

  const goToStep = (nextStep: Step) => {
    setDirection(nextStep === "members" ? "forward" : "backward");
    setStep(nextStep);
  };

  const stepAnimation = `animate-in fade-in duration-300 ease-out ${
    direction === "forward" ? "slide-in-from-right-8" : "slide-in-from-left-8"
  }`;

  const handleDetailsSubmit = form.handleSubmit(() => goToStep("members"));

  const handleCreate = form.handleSubmit(({ name, owner, members = [] }) => {
    createGuild.mutate({ name, owner, members }, { onSuccess: onClose });
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="create-guild-title"
      panelClassName="relative w-full max-w-[440px] overflow-hidden rounded-xl bg-surface-container ring-1 ring-white/10"
    >
      {step === "details" ? (
        <GuildNameAndAvatarFormView
          control={form.control}
          onClose={onClose}
          stepAnimation={stepAnimation}
          handleDetailsSubmit={handleDetailsSubmit}
        />
      ) : (
        <GuildMembersFormView
          control={form.control}
          friends={friends}
          stepAnimation={stepAnimation}
          isPending={createGuild.isPending}
          onBack={() => goToStep("details")}
          handleCreate={handleCreate}
        />
      )}
      <CloseModalButton onClose={onClose} />
    </Modal>
  );
}

type GuildNameAndAvatarFormViewProps = {
  control: Control<GuildSchemaType>;
  onClose: () => void;
  stepAnimation: string;
  handleDetailsSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

function GuildNameAndAvatarFormView({
  control,
  onClose,
  stepAnimation,
  handleDetailsSubmit,
}: GuildNameAndAvatarFormViewProps) {
  const name = useWatch({ control, name: "name" });

  return (
    <form
      key="details"
      noValidate
      onSubmit={handleDetailsSubmit}
      className={`flex flex-col ${stepAnimation}`}
    >
      <GuildUploadInput control={control} />
      <GuildNameInput control={control} />

      <div className="flex items-center justify-between px-6 pt-4 pb-6">
        <Button variant="ghost" onClick={onClose}>
          Retour
        </Button>
        <Button type="submit" disabled={!name.trim()} className="px-8 py-2.5">
          Suivant
        </Button>
      </div>
    </form>
  );
}

type GuildMembersFormViewProps = {
  control: Control<GuildSchemaType>;
  friends: Friend[];
  stepAnimation: string;
  isPending: boolean;
  onBack: () => void;
  handleCreate: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

function GuildMembersFormView({
  control,
  friends,
  stepAnimation,
  isPending,
  onBack,
  handleCreate,
}: GuildMembersFormViewProps) {
  const [search, setSearch] = useState("");
  const name = useWatch({ control, name: "name" });
  const members = useWatch({ control, name: "members" }) ?? [];

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return friends;
    return friends.filter((friend) =>
      friend.username.toLowerCase().includes(query),
    );
  }, [friends, search]);

  return (
    <form
      key="members"
      noValidate
      onSubmit={handleCreate}
      className={`flex flex-col ${stepAnimation}`}
    >
      <div className="flex flex-col gap-4 px-6 pt-8 pb-4">
        <div id="create-guild-title">
          <Header
            title="Invite tes amis"
            subtitle={`Sélectionne les amis à ajouter à ${name.trim()}.`}
            titleClassName="text-2xl"
            subtitleClassName="text-sm"
          />
        </div>

        <input
          type="text"
          placeholder="Rechercher des amis"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 rounded-sm bg-surface-container-lowest px-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <Controller
          name="members"
          control={control}
          render={({ field }) => {
            const selected = field.value ?? [];
            const isSelected = (friend: Friend) =>
              selected.some((member) => member.id === friend.id);
            const toggleFriend = (friend: Friend) =>
              field.onChange(
                isSelected(friend)
                  ? selected.filter((member) => member.id !== friend.id)
                  : [...selected, { id: friend.id, username: friend.username }],
              );

            return (
              <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
                {filteredFriends.length === 0 ? (
                  <p className="py-6 text-center text-sm text-on-surface-variant">
                    Aucun ami trouvé
                  </p>
                ) : (
                  filteredFriends.map((friend) => (
                    <label
                      key={friend.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-surface-variant"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          name={friend.username}
                          imageUrl={friend.imageUrl}
                          icon={friend.icon}
                          status={friend.statusPreference}
                          size={36}
                          ring="surface"
                        />
                        <span className="truncate text-on-surface">
                          {friend.username}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected(friend)}
                        onChange={() => toggleFriend(friend)}
                        onBlur={field.onBlur}
                        className="size-5 cursor-pointer accent-primary"
                      />
                    </label>
                  ))
                )}
              </div>
            );
          }}
        />
      </div>

      <div className="flex items-center justify-between px-6 pt-4 pb-6">
        <Button variant="ghost" onClick={onBack}>
          Retour
        </Button>
        <Button type="submit" disabled={isPending} className="px-8 py-2.5">
          {members.length > 0 ? `Créer (${members.length})` : "Créer"}
        </Button>
      </div>
    </form>
  );
}

type GuildNameInputProps = {
  control: Control<GuildSchemaType>;
};

function GuildNameInput({ control }: GuildNameInputProps) {
  return (
    <div className="flex flex-col items-center gap-6 px-6 pt-8 pb-4">
      <div id="create-guild-title">
        <Header
          title="Personnalise ton serveur"
          subtitle="Donne une personnalité à ton nouveau serveur en choisissant un nom et une icône. Tu pourras toujours les modifier plus tard."
          titleClassName="text-2xl"
          subtitleClassName="text-sm"
        />
      </div>

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="guild-name"
              className="text-sm font-semibold text-on-surface"
            >
              Nom du serveur <span className="text-error">*</span>
            </label>
            <input
              {...field}
              id="guild-name"
              type="text"
              maxLength={100}
              aria-invalid={fieldState.invalid}
              className={`h-10 rounded-sm bg-surface-container-lowest px-3 text-on-surface focus:outline-none focus:ring-2 ${
                fieldState.invalid ? "ring-2 ring-error" : "focus:ring-primary"
              }`}
            />
            {fieldState.error && (
              <p className="text-xs text-error">{fieldState.error.message}</p>
            )}
            <p className="text-xs text-on-surface-variant">
              En créant un serveur, tu acceptes la{" "}
              <a
                href="#"
                className="font-semibold text-blue-400 hover:underline"
              >
                Charte d'Utilisation de la Communauté Strife
              </a>
              .
            </p>
          </div>
        )}
      />
    </div>
  );
}

type GuildUploadInputProps = {
  control: Control<GuildSchemaType>;
};

function GuildUploadInput({ control }: GuildUploadInputProps) {
  return (
    <Controller
      name="icon"
      control={control}
      render={({ field }) => (
        <GuildIconPicker
          file={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

type GuildIconPickerProps = {
  file: File | undefined;
  onChange: (file: File | undefined) => void;
  onBlur: () => void;
};

function GuildIconPicker({ file, onChange, onBlur }: GuildIconPickerProps) {
  const iconPreview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (iconPreview) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  return (
    <label className="relative flex size-20 cursor-pointer items-center justify-center">
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.files?.[0] ?? file)}
      />
      {iconPreview ? (
        <img
          src={iconPreview}
          alt="Icône du serveur"
          className="size-20 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-20 flex-col items-center justify-center rounded-full border-2 border-dashed border-on-surface-variant text-on-surface-variant transition-colors hover:border-on-surface hover:text-on-surface">
          <MdPhotoCamera size={24} />
          <span className="text-[10px] font-bold uppercase">Uploader</span>
        </span>
      )}
      <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
        <MdAdd size={18} />
      </span>
    </label>
  );
}
