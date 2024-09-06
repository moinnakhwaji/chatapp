import React from 'react';
import { Avatar, AvatarGroup, Stack } from "@mui/material";
import { transformImage } from "../../libs/Features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  // Ensure avatar is always an array
  const avatars = Array.isArray(avatar) ? avatar : [avatar];

  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup max={max} sx={{ position: "relative" }}>
        {avatars.map((av, index) => (
          <Avatar
            key={index}
            src={transformImage(av)}
            alt={`Avatar ${index}`}
            sx={{
              width: "3rem",
              height: "3rem",
            }}
          />
        ))}
      </AvatarGroup>
    </Stack>
  );
}

export default AvatarCard;
