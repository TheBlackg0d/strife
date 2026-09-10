import type { Channel } from "../pages/channel/types/channel";
import { strifeApi } from "./strife-api";

const channelApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannelList: builder.query<Channel[], void>({
      query: () => ({ url: "channel", method: "GET" }),
      providesTags: (result) => [
        { type: "Channels" as const, id: "LIST" },
        ...(result ?? []).map((channel) => ({
          type: "Channels" as const,
          id: channel.id,
        })),
      ],
    }),
    getChannel: builder.query<Channel, string>({
      query: (channelId) => ({ url: `channel/${channelId}`, method: "GET" }),
      providesTags: (_result, _error, channelId) => [
        { type: "Channels", id: channelId },
      ],
    }),
    createDm: builder.mutation<Channel, { memberId: string }>({
      query: (body) => ({ url: "channel/dm", method: "POST", body }),
      invalidatesTags: [{ type: "Channels", id: "LIST" }],
    }),
    createGroupDm: builder.mutation<
      Channel,
      { name: string; members: string[] }
    >({
      query: (body) => ({ url: "channel/group", method: "POST", body }),
      invalidatesTags: [{ type: "Channels", id: "LIST" }],
    }),
  }),
});

export const {
  useGetChannelListQuery,
  useGetChannelQuery,
  useCreateDmMutation,
  useCreateGroupDmMutation,
} = channelApi;
