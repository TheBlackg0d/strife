import type { PrivateChannel } from "../pages/channel/types/channel";
import { strifeApi } from "./strife-api";

const channelApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelList: builder.query<PrivateChannel[], void>({
      query: () => ({ url: "private-channel", method: "GET" }),
      providesTags: [{ type: "PrivateChannels", id: "LIST" }],
    }),
    getChannelByUser: builder.query<PrivateChannel, string>({
      query: (userId) => ({ url: `private-channel/${userId}`, method: "GET" }),
      providesTags: (_result, _error, userId) => [
        { type: "PrivateChannels", id: userId },
      ],
    }),
    createChannel: builder.mutation<
      PrivateChannel,
      { name: string; members: string[] }
    >({
      query: (body) => ({ url: "private-channel", method: "POST", body }),
      invalidatesTags: [{ type: "PrivateChannels", id: "LIST" }],
    }),
  }),
});

export const {
  useGetChannelListQuery,
  useGetChannelByUserQuery,
  useCreateChannelMutation,
} = channelApi;
