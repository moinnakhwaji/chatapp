import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Server } from "../../constant/config";

const baseQuery = fetchBaseQuery({
  baseUrl: `${Server}/api/v4/`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("authToken"); // Adjust as needed
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => "chat/my",
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => `user/search?name=${name}`,
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendRequest",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => "user/notification",
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptreq",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    sendAttachments:builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        body: data,
      }),

    }),
    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/getmyfreinds`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chat/new",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),
    myGroups: builder.query({
      query: () => ({
        url: "chat/my/group",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),
    removeGroupMember: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `chat/removemember`,
        method: "PUT",
        credentials: "include",
        body: { chatId, userId },
      }),
      invalidatesTags: ["Chat"],
    }),
    addGroupMembers: builder.mutation({
      query: ({ members, chatId }) => ({
        url: `chat/addmember`,
        method: "PUT",
        credentials: "include",
        body: { members, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),



  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLeaveGroupMutation,
  useAddGroupMembersMutation,
  useLazySearchUserQuery,
  useRenameGroupMutation,
  useDeleteChatMutation,
    useGetMessagesQuery,
  useMyGroupsQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useSendAttachmentsMutation,
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRemoveGroupMemberMutation,
  
} = api;
