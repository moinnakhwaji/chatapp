import React from "react";
import {
  Dialog,
  DialogTitle,
  ListItem,
  Avatar,
  Button,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../redux/reducers/misc";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../redux/api/api";
import { useErrors } from "../hooks/hook";
import toast from "react-hot-toast";
import { blue, red } from "@mui/material/colors";

const Notification = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const dispatch = useDispatch();

  const friendRequestHandler = async ({ _id, accept }) => {
    try {
      const res = await acceptRequest({ requestId: _id, accept });
      if (res.data?.success) {
        toast.success(res?.data?.message);
        dispatch(setIsNotification(false));
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  useErrors([{ isError, error }]);

  const closeHandler = () => {
    dispatch(setIsNotification(false));
  };

  return (
    <Dialog
      open={isNotification}
      onClose={closeHandler}
      PaperProps={{
        sx: {
          backgroundColor: "#1f1e24",
          color: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <Stack p={{ xs: "1rem", sm: "2rem" }} spacing={2}>
        <DialogTitle sx={{ color: "#fff" }}>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={50}
            sx={{ bgcolor: "#333" }}
          />
        ) : (
          <>
            {data?.Request?.length > 0 ? (
              data.Request.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"} color={"#aaa"}>
                No notifications
              </Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = React.memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem
      sx={{
        backgroundColor: "#2d2d34",
        borderRadius: "0.75rem",
        padding: "1rem",
        marginBottom: "0.5rem",
        "&:hover": {
          backgroundColor: "#38383f",
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar
          src={avatar}
          alt={name}
          sx={{ width: 50, height: 50, border: `3px solid #6556cd` }}
        />
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#fff",
              fontWeight: "500",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {`${name} sent you a friend request.`}
          </Typography>
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent={"flex-end"}
          >
            <Button
              onClick={() => handler({ _id, accept: true })}
              sx={{
                color: "#fff",
                backgroundColor: blue[600],
                "&:hover": {
                  backgroundColor: blue[700],
                },
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontWeight: "600",
              }}
            >
              Accept
            </Button>
            <Button
              color="error"
              onClick={() => handler({ _id, accept: false })}
              sx={{
                color: "#fff",
                backgroundColor: red[600],
                "&:hover": {
                  backgroundColor: red[700],
                },
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontWeight: "600",
              }}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
