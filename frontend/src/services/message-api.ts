import type { Message } from "../pages/channel/types/channel";
import { strifeApi } from "./strife-api";

const messageApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesForChannel: builder.query<Message[], string>({
      query: (channelId) => ({ url: `message/${channelId}`, method: "GET" }),
      providesTags: (_result, _error, channelId) => [
        { type: "Messages", id: channelId },
      ],
    }),
  }),
});

export const { useGetMessagesForChannelQuery } = messageApi;
