import type { Message, MessageRequest } from "../pages/channel/types/channel";
import { strifeApi } from "./strife-api";

const messageApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesForChannel: builder.query<Message[], string>({
      query: (channelId) => ({ url: `message/${channelId}`, method: "GET" }),
      providesTags: (_result, _error, channelId) => [
        { type: "Messages", id: channelId },
      ],
    }),
    createMessage: builder.mutation<Message, MessageRequest>({
      query: (body) => ({ url: "message/create", method: "POST", body }),
    }),
  }),
});

export const { useGetMessagesForChannelQuery, useCreateMessageMutation } =
  messageApi;
