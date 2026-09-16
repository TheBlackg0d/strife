import { useMemo, useRef, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { useGetFriendsQuery } from "../../../services/friend-api";
import Avatar from "../../../components/ui/Avatar";
import CloseModalButton from "../../../components/ui/CloseModalButton";
import Header from "../../../components/ui/Header";
import Button from "../../../components/ui/Button";
import {
  useCreateDmMutation,
  useCreateGroupDmMutation,
} from "../../../services/channel-api";
import type { Friend } from "../types/dashboard";

interface CreateGroupChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function CreateGroupChannelModal({
  isOpen,
  onClose,
}: CreateGroupChannelModalProps) {
  const { data: friends, isError, isLoading, isSuccess } = useGetFriendsQuery();

  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  const handleSelectFriend = (friend: Friend) => {
    if (selectedFriends.includes(friend)) {
      console.log("removing friend", friend);
      setSelectedFriends(selectedFriends.filter((f) => f.id !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  if (isError || isLoading) {
    return <></>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative flex h-90/100  w-25/100   flex-col justify-start  items-start px-8 py-8 rounded-xl bg-surface-container ring-1 ring-white/10"
    >
      <div className="flex flex-col  w-full  h-full justify-between">
        <div className="flex flex-col gap-4 w-full">
          <Header
            title="Nouveau message"
            subtitle="Les groupes privés peuvent contenir jusqu'à 10 membres"
            titleClassName="text-2xl"
            subtitleClassName="text-sm"
            headerClassName="items-start mb-2"
          />
          <div>
            <input
              type="text"
              placeholder="Rechercher des amis"
              className="w-full rounded-2xl px-4 py-2 bg-zinc-700 text-white"
            />
            <span className="text-gray-400 text-sm p-2">
              Selectionner des amis
            </span>
          </div>
          <div className="overflow-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {isSuccess &&
              friends["ALL"].map((friend) => (
                <div
                  key={friend.id}
                  className="flex min-w-0 items-center justify-between gap-3 hover:bg-zinc-500 w-full rounded-2xl px-2 py-1 -ml-3"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar
                      name={friend.username}
                      imageUrl={friend.imageUrl}
                      icon={friend.icon}
                      status={friend.statusPreference}
                      size={48}
                      ring="surface"
                    />
                    <div className="flex flex-col">
                      <span className="text-xl">{friend.username}</span>
                      <span className="text-gray-400 text-sm">
                        {friend.username}
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    onClick={() => handleSelectFriend(friend)}
                    className="w-6 h-6  appearance-none bg-zinc-900 checked:accent-zinc-600 checked:appearance-auto border rounded"
                  />
                </div>
              ))}
          </div>
        </div>
        <CreateChannelFooter onClose={onClose} friends={selectedFriends} />
        <CloseModalButton onClose={onClose} />
      </div>
    </Modal>
  );
}

interface CreateChannelFooterProps {
  onClose: () => void;
  friends: Friend[];
}

function CreateChannelFooter({ onClose, friends }: CreateChannelFooterProps) {
  const [createDm] = useCreateDmMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [createGroupDm] = useCreateGroupDmMutation();

  const friendIds = useMemo(() => friends.map((f) => f.id), [friends]);
  console.log(friendIds);
  const nameGroupChannel = useMemo(
    () =>
      friends
        .slice(0, 3)
        .map((f) => f.username)
        .join(", "),
    [friends],
  );

  const handleCreateGroupDm = async () => {
    await createGroupDm({
      members: friendIds,
      name: inputRef.current?.value ?? nameGroupChannel,
    });
    onClose();
  };
  const handleCreateDm = async () => {
    await createDm({ memberId: friendIds[0] });
    onClose();
  };

  if (friendIds.length > 1) {
    return (
      <div className="flex flex-col gap-6">
        <hr className="border-zinc-700" />
        <label htmlFor="group-name">Nom du groupe (facultatif) </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="ex: Les potos"
          id="group-name"
          className="text-gray-200 bg-neutral-900 placeholder:text-gray-500 focus:ring-2 focus:outline-none rounded-sm h-9 p-2 "
        />
        <div className="flex gap-1 ">
          <Button variant="neutral" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button className="flex-1" onClick={handleCreateGroupDm}>
            Creer un groupe
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <hr className="border-zinc-700" />
      <div className="flex gap-1 ">
        <Button variant="neutral" className="flex-1" onClick={onClose}>
          Annuler
        </Button>
        <Button className="flex-1" onClick={handleCreateDm}>
          Creer un MP
        </Button>
      </div>
    </div>
  );
}
