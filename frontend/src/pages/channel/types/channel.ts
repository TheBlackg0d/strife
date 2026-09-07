export interface Member {
  userId: string;
  username: string;
}

export interface Message {
  id: string;
  content: string;
  sender: Member;
  timestamp: string;
}

export interface PrivateChannel {
  id: string;
  channelName: string;
  member: Member[];
}

/** Above two members a private channel is a group: it gets a member list. */
export function isGroupChannel(channel: PrivateChannel): boolean {
  return channel.member.length > 2;
}

export function otherMember(
  channel: PrivateChannel,
  currentUserId?: string,
): Member | undefined {
  return (
    channel.member.find((member) => member.userId !== currentUserId) ??
    channel.member[0]
  );
}
