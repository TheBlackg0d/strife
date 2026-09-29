import type { MediaRequest } from "~/api/file/file.types";
import { useCreateMessage } from "~/api/message/message.hooks";

export function useSendMessage(channelId: string) {
  const createMessage = useCreateMessage();

  const sendMessage = (content: string, media: MediaRequest[]) => {
    createMessage.mutate({
      channelId,
      content,
      media: media.length > 0 ? media : null,
    });
  };

  return { sendMessage };
}
