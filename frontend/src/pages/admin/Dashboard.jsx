import { useFetchData } from "6pp";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import moment from "moment";
import React from "react";
import AdminLayout from "../../layout/AdminLayout";

import { DoughnutChart, LineChart } from "../../specific/Charts";
import { CurveButton, SearchField } from "../../components/Style/Style";

import { matBlack } from "../../constant/Color";
import { Server } from "../../constant/config";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${Server}/api/v4/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // console.log(stats)

  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}
    >
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        alignItems={"center"}
        spacing={"1rem"}
      >
        <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
        <SearchField placeholder="Search..." />
        <CurveButton sx={{ bgcolor: matBlack }}>Search</CurveButton>
        <Box flexGrow={1} />
        {!isSmallScreen && (
          <Typography
            color={"rgba(0,0,0,0.7)"}
            textAlign={"center"}
          >
            {moment().format("dddd, D MMMM YYYY")}
          </Typography>
        )}
        <NotificationsIcon />
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Grid container spacing={3} marginY={"2rem"}>
      <Grid item xs={12} sm={4}>
        <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon />} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Widget title={"Chats"} value={stats?.totalChatsCount} Icon={<GroupIcon />} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Widget title={"Messages"} value={stats?.messagesChart} Icon={<MessageIcon />} />
      </Grid>
    </Grid>
  );

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Container component={"main"}>
          {Appbar}

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={6}>
              <Paper
                elevation={3}
                sx={{
                  padding: "2rem 3.5rem",
                  borderRadius: "1rem",
                }}
              >
                <Typography margin={"2rem 0"} variant="h4">
                  Last Messages
                </Typography>
                <LineChart value={stats?.messagesChart || []} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <DoughnutChart
                  labels={["Single Chats", "Group Chats"]}
                  value={[
                    stats?.totalChatsCount - stats?.groupsCount || 0,
                    stats?.groupsCount || 0,
                  ]}
                />
                <Stack
                  position={"absolute"}
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={"0.5rem"}
                  width={"100%"}
                  height={"100%"}
                >
                  <GroupIcon /> <Typography>Vs</Typography>
                  <PersonIcon />
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: "100%",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid ${matBlack}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
