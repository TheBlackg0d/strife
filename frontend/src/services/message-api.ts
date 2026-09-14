import { subscibeToTopic } from "../hook/useStomp";
import { convertMessageWebSocket } from "../pages/channel/service/channel-service";
import {
  type MessageBroadcast,
  type Message,
  type MessageRequest,
} from "../pages/channel/types/channel";
import { strifeApi } from "./strife-api";

const messageApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesForChannel: builder.query<Message[], string>({
      query: (channelId) => ({ url: `message/${channelId}`, method: "GET" }),
      providesTags: (_result, _error, channelId) => [
        { type: "Messages", id: channelId },
      ],
      async onCacheEntryAdded(
        channelId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        let unsubscribe: (() => void) | undefined;

        try {
          await cacheDataLoaded;

          unsubscribe = subscibeToTopic<MessageBroadcast>(
            `/topic/channel.${channelId}`,
            ({ actionType, message }) => {
              const incoming = convertMessageWebSocket(message);

              updateCachedData((draft) => {
                const index = draft.findIndex((m) => m.id === incoming.id);

                if (index !== -1) {
                  draft[index] = incoming;
                  return;
                }

                if (actionType === "CREATED") {
                  draft.push(incoming);
                }
              });
            },
          );

          await cacheEntryRemoved;
        } catch (error) {
          console.error("Message subscription failed:", error);
        }

        unsubscribe?.();
      },
    }),
    createMessage: builder.mutation<
      Message,
      { message: MessageRequest; channelId: string }
    >({
      query: ({ message }) => ({
        url: "message/create",
        method: "POST",
        body: message,
      }),
      async onQueryStarted({ channelId }, { dispatch, queryFulfilled }) {
        try {
          const { data: created } = await queryFulfilled;
          dispatch(
            messageApi.util.updateQueryData(
              "getMessagesForChannel",
              channelId,
              (draft) => {
                if (!draft.some((m) => m.id === created.id)) {
                  draft.push(created);
                }
              },
            ),
          );
        } catch (e) {
          console.log(e);
        }
      },
    }),
    updateMessage: builder.mutation<
      Message,
      { payload: MessageRequest; messageId: string }
    >({
      query: ({ payload, messageId }) => ({
        url: `message/update/${messageId}`,
        method: "PUT",
        body: payload,
      }),
      async onQueryStarted({ payload }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            messageApi.util.updateQueryData(
              "getMessagesForChannel",
              payload.channelId,
              (draft) => {
                const index = draft.findIndex((m) => m.id === updated.id);
                if (index !== -1) {
                  draft[index] = updated;
                }
              },
            ),
          );
        } catch (e) {
          console.log(e);
        }
      },
    }),
  }),
});

export const {
  useGetMessagesForChannelQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
} = messageApi;
