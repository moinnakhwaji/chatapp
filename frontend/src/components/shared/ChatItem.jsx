import React, { memo } from 'react';
import { Link } from "react-router-dom";
import { Stack, Typography, Box } from '@mui/material';
import { styled } from "@mui/material";
import AvatarCard from './AvtarCard';

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert, //
  handleDeleteChat
}) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    handleDeleteChat(e, _id, groupChat);
  };

  return (
    <StyledLink to={`/chat/${_id}`} onContextMenu={handleContextMenu}>
      <Container sameSender={sameSender}>
        <AvatarCard avatar={avatar} />
        <Stack spacing={1} flex={1}>
          <Typography variant="body1" sx={{ color: '#6556cd', fontWeight: 'bold' }}>
            {name}
          </Typography>
          {newMessageAlert && (
           
            <Typography>{Math.floor(newMessageAlert.count / 2)} New Message</Typography>

          )}
        </Stack>
        {isOnline && <StatusIndicator />}
      </Container>
    </StyledLink>
  );
};

export default memo(ChatItem);

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  margin: 0.5rem 0; /* Margin between chat items */
`;

const Container = styled('div')(({ sameSender }) => ({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  backgroundColor: sameSender ? '#1f1e24' : '#2b2b2b',
  color: sameSender ? '#ffffff' : '#cccccc',
  position: 'relative',
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  '&:hover': {
    backgroundColor: '#383838',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
    transform: 'scale(1.02)',
  }
}));

const StatusIndicator = styled(Box)({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: '#28a745',
  position: 'absolute',
  top: '50%',
  right: '1rem',
  transform: 'translateY(-50%)',
});
