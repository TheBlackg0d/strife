import { useState } from "react";
import { MdCheck, MdClose } from "react-icons/md";
import Avatar from "../../../components/ui/Avatar";
import IconButton from "../../../components/ui/IconButton";
import Modal from "../../../components/ui/Modal";
import { useGetFriendsQuery } from "../../../services/friend-api";
import type { Member } from "../types/channel";

interface AddMembersModalProps {
  isOpen: boolean;
  channelName: string;
  /** Members already in the channel, filtered out of the pick list. */
  currentMembers: Member[];
  onClose: () => void;
  onAddMembers: (members: Member[]) => void;
}

/** Friend picker for "Inviter dans le groupe privé". */
function AddMembersModal({
  isOpen,
  channelName,
  currentMembers,
  onClose,
  onAddMembers,
}: AddMembersModalProps) {
  const { data: friends } = useGetFriendsQuery();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const memberIds = new Set(currentMembers.map((member) => member.userId));
  const query = search.trim().toLowerCase();

  const candidates = (friends?.ALL ?? []).filter(
    (friend) =>
      !memberIds.has(friend.id) &&
      (query === "" || friend.username.toLowerCase().includes(query)),
  );

  const toggle = (friendId: string) => {
    setSelectedIds((ids) =>
      ids.includes(friendId)
        ? ids.filter((id) => id !== friendId)
        : [...ids, friendId],
    );
  };

  const close = () => {
    setSearch("");
    setSelectedIds([]);
    onClose();
  };

  const handleSubmit = () => {
    const invited = candidates
      .filter((friend) => selectedIds.includes(friend.id))
      .map<Member>((friend) => ({
        userId: friend.id,
        username: friend.username,
      }));

    if (invited.length > 0) {
      onAddMembers(invited);
    }
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      labelledBy="add-members-title"
      panelClassName="w-[440px] max-w-full rounded-lg bg-surface-container p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="add-members-title"
            className="text-[16px] font-bold text-on-surface"
          >
            Ajouter des amis
          </h2>
          <p className="truncate text-[13px] text-on-surface-variant">
            à {channelName}
          </p>
        </div>
        <IconButton icon={MdClose} label="Fermer" onClick={close} size={20} />
      </div>

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Cherche un ami"
        aria-label="Cherche un ami"
        autoComplete="off"
        className="mb-3 w-full rounded-sm border border-surface-container-lowest bg-surface-container-lowest px-3 py-2 text-[14px] text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none"
      />

      <ul className="flex max-h-70 flex-col gap-0.5 overflow-y-auto">
        {candidates.map((friend) => {
          const isSelected = selectedIds.includes(friend.id);

          return (
            <li key={friend.id}>
              <button
                type="button"
                onClick={() => toggle(friend.id)}
                aria-pressed={isSelected}
                className="flex w-full cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-surface-variant/50"
              >
                <Avatar
                  name={friend.username}
                  imageUrl={friend.imageUrl}
                  icon={friend.icon}
                  status={friend.statusPreference}
                  size={32}
                  ring="surface-container-low"
                />
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-on-surface">
                  {friend.username}
                </span>
                <span
                  aria-hidden
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
                    isSelected
                      ? "border-primary-container bg-primary-container text-on-primary-container"
                      : "border-outline"
                  }`}
                >
                  {isSelected && <MdCheck size={14} />}
                </span>
              </button>
            </li>
          );
        })}

        {candidates.length === 0 && (
          <li className="px-2 py-4 text-[13px] text-outline">
            Aucun ami à ajouter.
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={selectedIds.length === 0}
        className="mt-4 w-full cursor-pointer rounded-sm bg-primary-container px-4 py-2 text-[14px] font-medium text-on-primary-container transition-colors hover:bg-primary-container/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Ajouter au groupe privé
      </button>
    </Modal>
  );
}

export default AddMembersModal;
