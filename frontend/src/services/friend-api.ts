import {
  type Relationship,
  type Friend,
  type FriendFilter,
} from "../pages/dashboard/types/dashboard";
import { strifeApi } from "./strife-api";

const friendApi = strifeApi.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<Record<FriendFilter, Friend[]>, void>({
      query: () => ({ url: "relationships/friends", method: "GET" }),
      providesTags: [{ type: "Friends", id: "LIST" }],
    }),
    acceptFriendRequest: builder.mutation<Relationship, String>({
      query: (friendId) => ({
        url: `relationships/friends/${friendId}/accept`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Friends", id: "LIST" }],
    }),
    sendFriendRequest: builder.mutation<Relationship, String>({
      query: (username) => ({
        url: "relationships/friends",
        method: "POST",
        body: { username },
      }),
      invalidatesTags: [{ type: "Friends", id: "LIST" }],
    }),
    removeFriend: builder.mutation<Relationship, String>({
      query: (friendId) => ({
        url: `relationships/friends/${friendId}/remove`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Friends", id: "LIST" }],
    }),
    blockFriend: builder.mutation<Relationship, String>({
      query: (friendId) => ({
        url: `relationships/friends/${friendId}/block`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Friends", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useAcceptFriendRequestMutation,
  useSendFriendRequestMutation,
  useRemoveFriendMutation,
  useBlockFriendMutation,
} = friendApi;
