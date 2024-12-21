import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Stack, Button, Input } from "@mui/material";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material";
import Papa from "papaparse";

const UploadHeader = ({
  setCsvData,
  nameFile,
  setNameFile,
  mediaFileError,
  setMediaFileError,
  accept = ".csv",
}) => {
  const theme = useTheme();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setNameFile(file.name);
      setMediaFileError("");
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: true,
      });
    } else {
      setMediaFileError("Please upload a valid CSV file.");
    }
  };

  return (
    <>
      <Box>
        <Typography color={theme.palette.text.primary} variant="h2">
          Upload Customer Information
        </Typography>
        <Typography
          paddingTop={2}
          color={theme.palette.text.secondary}
          variant="h5"
        >
          Choose File You Want To Predict
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="contained" component="label" sx={{ width: "10%" }} htmlFor="upload-input">
          Browse
          <Input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-input"
          />
        </Button>
        <Typography
          sx={{
            border: "2px solid black",
            padding: "5px",
            width: "90%",
            textAlign: "center",
          }}
          variant="body1"
          color={mediaFileError ? "error" : "textPrimary"}
        >
          {mediaFileError || nameFile}
        </Typography>
      </Stack>
      <Box>
        {mediaFileError && <Alert severity="error">{mediaFileError}</Alert>}
      </Box>
    </>
  );
};

UploadHeader.propTypes = {
  setCsvData: PropTypes.func.isRequired,
  nameFile: PropTypes.string.isRequired,
  setNameFile: PropTypes.func.isRequired,
  mediaFileError: PropTypes.string.isRequired,
  setMediaFileError: PropTypes.func.isRequired,
  accept: PropTypes.string,
};

export default UploadHeader;
