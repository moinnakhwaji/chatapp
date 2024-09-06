import React from "react";
import { Box, Typography } from "@mui/material";
import { lightblue } from "../../constant/Color";
import moment from "moment";
import { fileFormat } from "../../libs/Features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const isSameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <Box
      sx={{
        alignSelf: isSameSender ? "flex-end" : "flex-start",
        backgroundColor: "#2a2a2d", // Dark background
        color: "#e0e0e0", // Light text color
        borderRadius: "12px", // More rounded corners
        padding: "0.75rem 1rem", // Increased padding
        maxWidth: "75%", // More compact width
        margin: "0.5rem 0",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)", // Softer shadow for better depth
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isSameSender && (
        <Typography
          color={lightblue}
          fontWeight="600"
          variant="caption"
          sx={{ mb: 0.5 }} // Margin bottom for spacing
        >
          {sender.name}
        </Typography>
      )}
      {content && (
        <Typography
          sx={{
            mb: attachments.length > 0 ? 0.5 : 0, // Margin bottom adjustment
          }}
        >
          {content}
        </Typography>
      )}
      {attachments.length > 0 &&
        attachments.map((i, index) => {
          const url = i.url;
          const file = fileFormat(url);
          return (
            <Box key={index} sx={{ mt: 0.5 }}>
              <a
                href={url}
                target="_blank"
                download
                style={{ color: "#e0e0e0", textDecoration: 'none' }} // Improved color and no underline
              >
                <RenderAttachment file={file} url={url} />
              </a>
            </Box>
          );
        })}
      <Typography
        fontWeight="500"
        color="#b0b0b0" // Lighter text color for timestamp
        fontSize="12px"
        sx={{ mt: 0.5 }} // Margin top for spacing
      >
        {timeAgo}
      </Typography>
    </Box>
    
  );
};

export default MessageComponent;
