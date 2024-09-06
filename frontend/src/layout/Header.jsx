import React, { useState, Suspense } from "react";
import {
  AppBar,
  Backdrop,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { Server } from "../constant/config";
import { IoCall } from "react-icons/io5";

import AddIcon from "@mui/icons-material/Add";

import { orange } from "../constant/Color"; // Ensure this path is correct
import ChatWaveLogo from "../constant/Logo";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserNotExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";
import {
  setIsAddmember,
  setIsMobile,
  setIsNotification,
  setIsSearch,
} from "../redux/reducers/misc";

const SearchComponent = React.lazy(() => import("../specific/Search"));
const NotificationComponent = React.lazy(() =>
  import("../specific/Notification")
);
const NewGroups = React.lazy(() => import("../specific/Newgroup"));

const Header = () => {
  const { isSearch, isAddmember, isNotification } = useSelector(
    (state) => state.misc
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMobile = () => {
    dispatch(setIsMobile(true));
    // console.log("open");
  };
  

  const openSearchDialogue = () => {
    dispatch(setIsSearch(true));
  };

  const addPerson = () => {
    dispatch(setIsAddmember(true));
  };

  const navigateToGroup = () => {
    navigate("/group");
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${Server}/api/v4/user/logout`, {
        withCredentials: true,
      });
      dispatch(UserNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const notificationHandler = () => {
    dispatch(setIsNotification(true));
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" sx={{ bgcolor: orange, boxShadow: 'none' }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
                flexGrow: 1,
                alignItems: "center",
                color: "#fff",
                fontWeight: 600,
                fontSize: '1.5rem',
                display: 'flex',
                gap: 1,
              }}
            >
              <div className="flex items-center space-x-4 hover:opacity-90 transition duration-300 ease-in-out">
    <ChatWaveLogo className="text-[#6556cd] hover:text-[#5249b7]" />
    {/* <h6 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6556cd] to-[#1f1e24]">
        chattu
    </h6> */}
</div>

            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton onClick={handleMobile} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconBtn
                title={"Search"}
                onClick={openSearchDialogue}
                icon={<SearchIcon />}
              />
              <IconBtn
                title={"New Group"}
                onClick={addPerson}
                icon={<AddIcon />}
              />
              <IconBtn
                title={"Manage Group"}
                onClick={navigateToGroup}
                icon={<GroupAddIcon />}
              />
              
              <IconBtn
                title={"Notification"}
                onClick={notificationHandler}
                icon={<NotificationsIcon />}
              />
              <IconBtn
              title={"Call"}
              icon={<IoCall />}


              
              />
              <IconBtn
                title={"Logout"}
                onClick={logoutHandler}
                icon={<LogoutIcon />}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Suspense fallback={<Backdrop open />}>
        {isSearch && <SearchComponent />}
      </Suspense>
      <Suspense fallback={<Backdrop open />}>
        {isAddmember && <NewGroups />}
      </Suspense>
      <Suspense fallback={<Backdrop open />}>
        {isNotification && <NotificationComponent />}
      </Suspense>
    </>
  );
};

const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        sx={{
          color: "#1f1e24",
          fontSize: "1.2rem",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.2)",
            transition: "background-color 0.3s",
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
