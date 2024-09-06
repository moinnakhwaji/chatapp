// DisplayImages.js
import React from 'react';

const DisplayImages = ({ attachments }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {attachments.map((attachment) => (
        <img
          key={attachment.public_id}
          src={attachment.url}
          alt="Uploaded"
          style={{ width: '200px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
        />
      ))}
    </div>
  );
};

export default DisplayImages;
