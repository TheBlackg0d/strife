import { useCreateMessageMutation } from "@/services/message-api";
import { useGetProfileQuery } from "@/services/profile-api";
import type { MediaRequest } from "@/pages/channel/types/channel";

export function useSendMessage(channelId: string) {
  const { data: profile } = useGetProfileQuery();
  const [createMessage] = useCreateMessageMutation();

  const sendMessage = (content: string, media: MediaRequest[]) => {
    if (!profile) {
      return;
    }

    createMessage({
      channelId,
      message: {
        channelId,
        content,
        media: media.length > 0 ? media : null,
      },
    });
  };

  return { sendMessage };
}
