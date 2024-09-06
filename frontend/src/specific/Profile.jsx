
import React from "react";
import { Avatar, Stack, Typography, Paper } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  // console.log(user)

  return (
    <Stack
      spacing={"1.5rem"}
      direction={"column"}
      alignItems={"center"}
      sx={{
        background: "linear-gradient(135deg, #1f1e24, #2d2d34)", // Gradient background
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <Avatar
        src={user?.avatar?.url}
        sx={{
          width: 80,
          height: 80,
          objectFit: "cover",
          marginBottom: "1rem",
          border: "3px solid #6556cd",
        }}
      />
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        Icon={<UserNameIcon />}
      />
      <ProfileCard heading={"Name"} text={user.name} Icon={<FaceIcon />} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Paper
    elevation={2}
    sx={{
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      backgroundColor: "#2d2d34",
      width: "100%",
    }}
  >
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"0.75rem"}
      color={"white"}
    >
      {Icon && <span style={{ fontSize: "1.25rem" }}>{Icon}</span>}
      <Stack>
        <Typography variant="body1" sx={{ fontWeight: "500" }}>
          {text}
        </Typography>
        <Typography color={"gray"} variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Profile;

