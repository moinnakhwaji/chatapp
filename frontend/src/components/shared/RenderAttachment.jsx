import React from 'react';
import { FileOpen as FileOpenIcon } from "@mui/icons-material";
import { transformImage } from '../../libs/Features';

const RenderAttachment = ({ file, url }) => {
  const renderContent = () => {
    switch (file) {
      case 'video':
        return <video src={url} preload="none" width={"200px"} controls />;
      case 'image':
        return (
          <img
            src={transformImage(url, 200)}
            alt="Attachment"
            width={"200px"}
            height={"150px"}
            style={{ objectFit: 'contain' }}
            onError={(e) => { e.target.onerror = null; e.target.src = url; }} // Fallback if transformImage fails
          />
        );
      case 'audio':
        return <audio src={url} preload="none" controls />;
      default:
        return <FileOpenIcon />;
    }
  };

  return <>{renderContent()}</>;
};

export default RenderAttachment;
