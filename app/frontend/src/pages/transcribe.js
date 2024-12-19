import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import TranscribeIcon from "@mui/icons-material/Transcribe";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

import UploadHeader from "../components/UploadHeader";
import Spacer from "../components/Spacer";

const Transcribe = ({ isLoading, setIsLoading }) => {
  const theme = useTheme();
  const router = useRouter();

  // for submit event
  const [viewMedia, setViewMedia] = useState(null);
  // for onchange event
  const [nameFile, setNameFile] = useState("No file is selected yet.");
  const [mediaFileError, setMediaFileError] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isMakingSubtitle, setIsMakingSubtitle] = useState(false);

  const handleClear = () => {
    setViewMedia(null);
    setNameFile("No file is selected yet.");
    setMediaFileError("");
    const uploadElement = document.getElementById("UploadMedia");
    if (uploadElement) {
      uploadElement.value = null; // Clear the file input
    }

    localStorage.removeItem("transcript"); // Clear transcript from local storage if needed
    localStorage.removeItem("mediaName"); // Clear media name from local storage if needed
  };

  // Function to handle media playback
  const handleMediaPlayback = () => {
    if (viewMedia) {
      return (
        <Box>
          {viewMedia.type.startsWith("video") ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <video controls width="100%">
                <source
                  src={URL.createObjectURL(viewMedia)}
                  type={viewMedia.type}
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <audio controls style={{ width: "100%" }}>
                <source
                  src={URL.createObjectURL(viewMedia)}
                  type={viewMedia.type}
                />
                Your browser does not support the audio element.
              </audio>
            </Box>
          )}
        </Box>
      );
    }
    return (
      <Box display="flex" height="500px" justifyContent="center">
        <Typography
          style={{ margin: "auto" }}
          color={theme.palette.text.primary}
          variant="h5"
        >
          No file is selected yet.
        </Typography>
      </Box>
    );
  };

  const handleTranscribe = async (act) => {
    if (!viewMedia) return;
    if (act === "subtitle") {
      setIsMakingSubtitle(true);
    } else {
      setIsTranscribing(true);
    }

    const formData = new FormData();
    formData.append("file", viewMedia);
    const responseFormat = act === "subtitle" ? "verbose_json" : "text";
    formData.append("response_format", responseFormat);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Transcription result:", response.data);
      localStorage.setItem(
        "transcript",
        response.data ? response.data.transcription : ""
      );
      localStorage.setItem("mediaName", viewMedia.name);
      router.push("/result");
    } catch (error) {
      console.error("Error during transcription:", error);
      localStorage.removeItem("transcript");
      localStorage.removeItem("mediaName");
    } finally {
      setIsTranscribing(false);
      setIsMakingSubtitle(false);
    }
  };

  return (
    <>
      <Head>
        <title>Transcribe | Magic Speechnotes</title>
      </Head>
      <Box
        backgroundColor={theme.palette.background.default}
        minHeight="100%"
        paddingTop={15}
        paddingBottom={15}
      >
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack spacing={1} alignItems="left">
              <UploadHeader
                setViewMedia={setViewMedia}
                nameFile={nameFile}
                setNameFile={setNameFile}
                mediaFileError={mediaFileError}
                setMediaFileError={setMediaFileError}
              />
            </Stack>
            <Card>
              <CardContent>{handleMediaPlayback()}</CardContent>
            </Card>
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                disabled={isTranscribing || isMakingSubtitle}
                onClick={handleClear}
              >
                <Typography style={{ padding: "5px" }}>Clear</Typography>
              </Button>
              <Button
                variant="contained"
                disabled={!viewMedia || isTranscribing || isMakingSubtitle}
                endIcon={
                  isTranscribing ? (
                    <CircularProgress size={24} />
                  ) : (
                    <TranscribeIcon />
                  )
                }
                onClick={() => handleTranscribe("transcribe")}
              >
                <Typography style={{ padding: "5px" }}>Transcribe</Typography>
              </Button>
              <Button
                variant="contained"
                disabled={!viewMedia || isMakingSubtitle || isTranscribing}
                endIcon={
                  isMakingSubtitle ? (
                    <CircularProgress size={24} />
                  ) : (
                    <SubtitlesIcon />
                  )
                }
                onClick={() => handleTranscribe("subtitle")}
              >
                <Typography style={{ padding: "5px" }}>
                  Make Subtitle
                </Typography>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Spacer sx={{ pt: 6 }} />
    </>
  );
};

export default Transcribe;
