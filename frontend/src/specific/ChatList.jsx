import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../components/shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack 
      width={w} 
      direction={"column"} 
      overflow={"auto"} 
      height={"100%"}
      sx={{
        backgroundColor: "#1f1e24", // Dark background
        padding: "1rem", // Adds padding around the chat list
        borderRadius: "8px", // Subtle rounded corners
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.8)", // Inset shadow for depth
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#333', // Darker scrollbar for consistency
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555', // Slightly lighter on hover
        },
        color: '#ccc', // Light text color for readability
      }}
    >
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
