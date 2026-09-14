import { useCreateMessageMutation } from "../../../services/message-api";
import { useGetProfileQuery } from "../../../services/profile-api";

export function useSendMessage(channelId: string) {
  const { data: profile } = useGetProfileQuery();
  const [createMessage] = useCreateMessageMutation();

  const sendMessage = (content: string, media: string[]) => {
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
