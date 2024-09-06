import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/Useritem";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddmember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();

  const { isAddmember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  // console.log(data);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddmember(false));
  };
  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog
      open={isAddmember}
      onClose={closeHandler}
      PaperProps={{
        style: {
          backgroundColor: "#1f1e24", // Dark background color
          color: "grey[50]", // Light text color
          borderRadius: "10px", // Rounded corners for a modern look
        },
      }}
    >
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle
          textAlign={"center"}
          sx={{ color: "#6556cd" }} // Purple color for the title
        >
          Add Member
        </DialogTitle>

        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={40}
              animation="wave"
              sx={{ backgroundColor: "grey[800]" }} // Darker skeleton color
            />
          ) : data?.freinds?.length > 0 ? (
            data?.freinds?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                IsAdd={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button
            color="error"
            onClick={closeHandler}
            sx={{
              backgroundColor: "#3b3b3b", // Dark button background
              color: "#ffffff", // Light text color
              "&:hover": {
                backgroundColor: "#555555", // Slightly lighter hover effect
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMembers}
            sx={{
              backgroundColor: "#6556cd", // Purple button background
              color: "#ffffff", // Light text color
              "&:hover": {
                backgroundColor: "#5347a1", // Slightly darker purple on hover
              },
            }}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
