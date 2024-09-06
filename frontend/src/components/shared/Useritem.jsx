import React, { memo } from 'react';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const UserItem = ({ user, handler, handelIsloading, styling = {}, IsAdd = false }) => {
  const { name, _id, avatar } = user;

  return (
    <ListItem
      sx={{
        bgcolor: '#1f1e24', // Black background for the list item
        borderBottom: '1px solid #333333', // Slightly lighter border for separation
        '&:last-child': {
          borderBottom: 'none', // Remove border from the last item
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing="1rem" width="100%" {...styling}>
        <Avatar
          src={typeof avatar === 'string' ? avatar : ''}
          sx={{ bgcolor: '#1f1e24' }} // Black background for avatar
        />
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: '#ffffff', // White text color
            flexGrow: 1,
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            width: '100%',
          }}
        >
          {name}
        </Typography>
        <IconButton
          size="small"
          sx={{
            bgcolor: IsAdd ? '#d32f2f' : '#6556cd', // Darker colors for add/remove
            color: '#ffffff',
            '&:hover': {
              bgcolor: IsAdd ? '#b71c1c' : '#4a2c8c', // Darker hover effect
            },
          }}
          onClick={() => handler(_id)}
          disabled={handelIsloading}
        >
          {IsAdd ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
