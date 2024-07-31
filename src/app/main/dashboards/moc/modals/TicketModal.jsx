import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const TicketModal = ({ open, handleClose }) => {
  const styleImp = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={styleImp}>
          <Typography
            id="transition-modal-title"
            variant="h6"
            component="h2"
            style={{ fontSize: "2rem" }}
          >
            Create new ticket
          </Typography>
          <Box component="form">
            <Box>
              <TextField fullWidth label="Subject" name="subject" />
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
              />
            </Box>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <FormControl sx={{ width: "48%" }}>
                <InputLabel>Ticket Category</InputLabel>
                <Select name="category">
                  <MenuItem>options</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <FormControl sx={{ width: "48%" }}>
                <InputLabel>Ticket Priority</InputLabel>
                <Select name="priority">
                  <MenuItem>options</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <InputLabel>Ticket Status</InputLabel>
                <Select name="status">
                  <MenuItem>options</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <input
                type="file"
                name="fileUpload"
                // onChange={handleFileUpload}
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                // onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TicketModal;
