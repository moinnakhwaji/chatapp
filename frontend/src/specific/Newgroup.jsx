import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
} from '@mui/material';
import Useritem from '../components/shared/Useritem';
import { useInputValidation } from '6pp';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddmember } from '../redux/reducers/misc';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import toast from 'react-hot-toast';

const Newgroup = () => {
  const dispatch = useDispatch();

  const { isError, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const { isAddmember } = useSelector((state) => state.misc);
  const groupname = useInputValidation();
  const [selectMember, setSelectMember] = useState([]);
  const errors = [{ isError, error }];
  // console.log(data)

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectMember((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandeler = () => {
    if (!groupname.value) return toast.error("Group name is required");
    if (selectMember.length < 2) return toast.error("Please select at least three members");

    newGroup("Creating New Group...", {
      name: groupname.value,
      members: selectMember,
    });
    closeHandeler();

    // console.log('Group Created:', groupname.value, selectMember);
  };

  const closeHandeler = () => {
    dispatch(setIsAddmember(false));
  };

  return (
    <Dialog open={isAddmember} onClose={closeHandeler}>
      <Stack
        p={{ xs: '1rem', sm: '2rem' }}
        maxWidth="30rem"
        sx={{
          backgroundColor: '#1f1e24',
          color: '#f5f5f5',
          borderRadius: '2px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <DialogTitle sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>New Group</DialogTitle>
        <TextField
          label="Group"
          value={groupname.value || ''}
          onChange={groupname.changeHandler}
          fullWidth
          margin="normal"
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#2a2a34',
              color: '#f5f5f5',
              borderRadius: '4px',
            },
            '& .MuiFormLabel-root': {
              color: '#f5f5f5',
            },
            '& .MuiInputBase-root::before': {
              borderBottomColor: '#6556cd',
            },
            '& .MuiInputBase-root:hover::before': {
              borderBottomColor: '#6556cd',
            },
          }}
        />
        <Typography variant="body1" sx={{ marginTop: '1rem', color: '#f5f5f5', fontWeight: '500' }}>
          Members
        </Typography>
        <Stack spacing={1} mt={1}>
          {data?.freinds?.map((user) => (
            <Useritem
              user={user}
              key={user._id}
              handler={selectMemberHandler}
              IsAdd={selectMember.includes(user._id)}
              handelIsloading={false}
            />
          ))}
        </Stack>
        <DialogActions
          sx={{
            mt: 2,
            justifyContent: 'space-between',
            padding: '0 1rem',
          }}
        >
          <Button
            variant="contained"
            onClick={submitHandeler}
            disabled={isLoadingNewGroup}
            sx={{
              backgroundColor: '#6556cd',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#4a3fb2',
              },
              borderRadius: '20px',
            }}
          >
            Create
          </Button>
          <Button
            variant="contained"
            onClick={closeHandeler}
            sx={{
              backgroundColor: '#ff4444',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#cc0000',
              },
              borderRadius: '20px',
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

export default Newgroup;

