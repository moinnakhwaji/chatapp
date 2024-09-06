import React, { useCallback, useEffect, useRef, useState } from "react";
import Applayout from "../layout/Applayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grey } from "../constant/Color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/Style/Style";
import Filemenu from "../components/dialogue/Filemenu";
import MessageComponent from "../components/shared/Messagecomponent"; // Ensure correct import path
import { getSocket } from "../socket";
import {
  STOP_TYPING,
  NEW_MESSAGE,
  START_TYPING,
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
} from "../constant/event";
import { useDispatch } from "react-redux";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { setIsFileMenu } from "../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { useNavigate } from "react-router-dom";
import { useInfiniteScrollTop } from "6pp"; // Verify this import path and package
import { TypingLoader } from "../layout/Loader";

const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  const filteredMessages = allMessages.filter(Boolean);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={"#1f1e24"} // Black background
        ref={containerRef}
        height={"90%"}
        position={"relative"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          color: "#e0e0e0", // Light text color for better contrast
        }}
      >
       

        {filteredMessages.map((i, index) => (
          <MessageComponent key={i._id || index} message={i} user={user} />
        ))}
         {userTyping && <TypingLoader />}
     <div ref={bottomRef} />
      </Stack>

      <form
        style={{
          height: "10%",
          display: "flex",
          alignItems: "center",
          padding: "0 1rem",
          backgroundColor: "#1f1e24", // Black background
          borderTop: `1px solid ${grey[800]}`, // Slightly lighter border for contrast
        }}
        onSubmit={submitHandler}
      >
        <IconButton
          sx={{
            rotate: "30deg",
            transition:
              "transform 0.3s, background-color 0.3s, box-shadow 0.3s",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: grey[800], // Darker grey for hover
              transform: "rotate(0deg)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Subtle shadow on hover
            },
          }}
          onClick={handleFileOpen}
        >
          <AttachFileIcon sx={{ color: "#6556cd" }} />{" "}
          {/* Updated color for icon */}
        </IconButton>
        <InputBox
          placeholder="Type a message..."
          value={message}
          onChange={messageOnChange}
          style={{
            flexGrow: 1,
            marginLeft: "1rem",
            marginRight: "1rem",
            backgroundColor: "#2c2c2c", // Darker input background
            color: "#e0e0e0", // Light text color
            border: `1px solid #6556cd`, // Border color matching the theme
            borderRadius: "20px", // Rounded corners
            padding: "0.5rem 1rem",
            transition: "border-color 0.3s, box-shadow 0.3s",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow
            "&:focus": {
              borderColor: "#6556cd", // Border color on focus
              boxShadow: `0 0 8px rgba(101, 86, 205, 0.5)`, // Glowing effect on focus
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            backgroundColor: "#6556cd", // Updated background color
            color: "#fff",
            borderRadius: "50%", // Rounded button
            padding: "0.5rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Subtle shadow
            transition: "background-color 0.3s, box-shadow 0.3s",
            "&:hover": {
              backgroundColor: "#4a44b7", // Slightly darker shade for hover
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Enhanced shadow on hover
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </form>

      <Filemenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default Applayout(Chat);
