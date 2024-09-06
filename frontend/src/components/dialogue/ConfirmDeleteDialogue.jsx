import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { grey } from "@mui/material/colors";

const ConfirmDeleteDialogue = ({ open, handleClose, deleteHandler, Message }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: grey[900], // Dark background color
          color: grey[50],            // Light text color
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle style={{ 
        backgroundColor: grey[800], 
        color: grey[50], 
        padding: "16px 24px",
        borderBottom: `1px solid ${grey[700]}`,
      }}>
        Confirm Delete
      </DialogTitle>
      <DialogContent style={{ padding: "24px" }}>
        <DialogContentText style={{ color: grey[300] }}>
          {Message}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ padding: "8px 24px", backgroundColor: grey[800], borderTop: `1px solid ${grey[700]}` }}>
        <Button 
          onClick={handleClose} 
          style={{ 
            color: grey[400], 
            fontWeight: "bold" 
          }}
        >
          No
        </Button>
        <Button 
          onClick={deleteHandler} 
          style={{ 
            color: "#ff4c4c", // Red color for the delete action
            fontWeight: "bold",
            backgroundColor: "#1f1e24",
            borderRadius: "5px",
          }}
          variant="contained"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialogue;
