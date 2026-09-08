export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
}

export interface PrivateChannel {
  id: string;
  channelName: string;
  users: User[];
}

/** Above two members a private channel is a group: it gets a member list. */
export function isGroupChannel(channel: PrivateChannel): boolean {
  return channel.users.length > 2;
}

export function otherUser(
  channel: PrivateChannel,
  currentUserId?: string,
): User | undefined {
  return (
    channel.users.find((user) => user.id !== currentUserId) ?? channel.users[0]
  );
}
