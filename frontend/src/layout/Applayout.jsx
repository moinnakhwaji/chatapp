import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Title from "../components/shared/Title";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
// import { samepleChats } from "../constant/Sample";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobile, setSelectDeletChat } from "../redux/reducers/misc";
import { getSocket } from "../socket";
import { setNewMessagesAlert } from "../redux/reducers/chat";
import { NEW_MESSAGE_ALERT, NEW_REQUEST,REFRETCH_CHAT } from "../constant/event";
import { useNavigate } from "react-router-dom";
import { ONLINE_USERS } from "../../../backend/constant/event";
import { getOrSaveFromStorage } from "../libs/Features";
import DeleteChatMenu from "../components/dialogue/DeleteChatMenu";

const Applayout = (WrapComponent) => {
  return (props) => {
    const navigate = useNavigate()
    const params = useParams();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    
    const [onlineUsers, setOnlineUsers] = useState([]);
  // console.log("chatis",chatId)
    const dispatch = useDispatch()
    const socket =  getSocket()
    // console.log("this is socket is",socket.id)
    // console.log(socket)

const { isMobile } = useSelector((state) => state.misc);
const {user} = useSelector((state)=>state.auth);
const { newMessagesAlert } = useSelector((state) => state.chat);
// console.log(newMessagesAlert)


 const { isLoading, data, isError, error,refetch } = useMyChatsQuery("");
   
    useErrors([{ isError, error }]);
  

  
    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value:newMessagesAlert  });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectDeletChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        console.log("New message received for chatId:", data.chatId); // Debugging log
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFRETCH_CHAT]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
           <ChatList
              w="70vw"
              chats={data?.Chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              user={user}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}

        <Grid container style={{ height: "calc(100vh - 4rem)" }}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ height: "100%"}}

          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chatId={chatId}
                chats={data?.Chats}
                handleDeleteChat={handleDeleteChat}
                user={user}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            style={{ height: "100%" }}
            bgcolor="white"
          >
            <WrapComponent {...props} chatId={chatId} user={user}  />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgb(0,0,0,0.85)",
            }}
            style={{ height: "100%" }}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default Applayout;
