import type { Channel } from "../pages/channel/types/channel";
import { strifeApi } from "./strife-api";

const channelApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivateChannelList: builder.query<Channel[], void>({
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
      async onQueryStarted(_result, { dispatch, queryFulfilled }) {
        try {
          const { data: createdChannel } = await queryFulfilled;
          dispatch(
            channelApi.util.updateQueryData(
              "getPrivateChannelList",
              undefined,
              (draft) => {
                const index = draft.findIndex(
                  (channel) => channel.id === createdChannel.id,
                );

                if (index === -1) {
                  draft.push(createdChannel);
                  return;
                }

                draft[index] = createdChannel;
              },
            ),
          );
        } catch (error) {
          console.log(error);
        }
      },
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
  useGetPrivateChannelListQuery,
  useGetChannelQuery,
  useCreateDmMutation,
  useCreateGroupDmMutation,
} = channelApi;
