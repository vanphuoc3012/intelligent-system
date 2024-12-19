import React, { useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

const UploadHeader = ({
  setViewMedia,
  nameFile,
  setNameFile,
  mediaFileError,
  setMediaFileError,
}) => {
  const theme = useTheme();

  // onchange event
  const fileType = ["video/mp4", "audio/mp3", "audio/wav"];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNameFile(file.name);
      setViewMedia(file);
      if (!fileType.includes(file.type)) {
        setMediaFileError("Unsupported file type. Please select a valid file.");
      } else {
        setMediaFileError("");
      }
    }
  };

  return (
    <>
      <Box>
        <Typography color={theme.palette.text.primary} variant="h2">
          Upload Video & Audio Files
        </Typography>
        <Typography
          paddingTop={2}
          color={theme.palette.text.secondary}
          variant="h5"
        >
          Choose File You Want To Transcribe
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="contained" component="label" sx={{ width: "10%" }}>
          Choose File
          <Input
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: fileType.join(",") }}
            style={{ display: "none" }}
          />
        </Button>
        <Typography
          sx={{
            border: "2px solid black",
            padding: "5px",
            width: "90%",
            textAlign: "center",
          }}
          color={theme.palette.text.secondary}
          variant="h5"
        >
          {nameFile}
        </Typography>
      </Stack>
      <Box>
        {mediaFileError && <Alert severity="error">{mediaFileError}</Alert>}
      </Box>
    </>
  );
};

export default UploadHeader;
