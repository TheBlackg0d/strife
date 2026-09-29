import SectionHeader from "./SectionHeader";
import DmListItem from "./DmListItem";
import type { Conversation } from "~/api/guild/guild.types";

type DmListProps = {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation?: (conversationId: string) => void;
};
export default function DmList({
  conversations,
  activeConversationId,
  onSelectConversation,
}: DmListProps) {
  return (
    <>
      {conversations.map((conversation) => (
        <DmListItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
        />
      ))}
    </>
  );
}
