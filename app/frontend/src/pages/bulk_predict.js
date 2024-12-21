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
import Papa from "papaparse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import UploadHeader from "../components/UploadHeader";
import Spacer from "../components/Spacer";

const Predict = ({ isLoading, setIsLoading }) => {
  const theme = useTheme();
  const router = useRouter();
  // for onchange event
  const [nameFile, setNameFile] = useState("No file is selected yet.");
  const [mediaFileError, setMediaFileError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleClear = () => {
    setNameFile("No file is selected yet.");
    setMediaFileError("");
    setCsvData(null);
    const uploadElement = document.getElementById("upload-input");
    if (uploadElement) {
      uploadElement.value = null; // Clear the file input
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCsvDisplay = () => {
    if (csvData && csvData.length > 0) {
      return (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(csvData[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={csvData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      );
    }
    return (
      <Box display="flex" height="500px" justifyContent="center">
        <Typography
          style={{ margin: "auto" }}
          color={theme.palette.text.primary}
          variant="h5"
        >
          No CSV file is selected yet.
        </Typography>
      </Box>
    );
  };

  const handlePredict = async () => {
    if (!csvData) return;
    setIsPredicting(true);

    try {
      const formData = new FormData();
      const csvContent = [
        Object.keys(csvData[0]).join(","), // Add headers
        ...csvData.map(row => Object.values(row).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv' });
      formData.append("file", blob, "customers.csv");

      const response = await axios.post("http://127.0.0.1:8000/predict-csv", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'predicted_customers.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error during prediction:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Predict | Loan Approval</title>
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
                setCsvData={setCsvData}
                nameFile={nameFile}
                setNameFile={setNameFile}
                mediaFileError={mediaFileError}
                setMediaFileError={setMediaFileError}
                accept=".csv"
              />
            </Stack>

            <Card>
              <CardContent>{handleCsvDisplay()}</CardContent>
            </Card>

            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                disabled={isPredicting}
                onClick={handleClear}
              >
                <Typography style={{ padding: "5px" }}>Clear</Typography>
              </Button>
              <Button
                variant="contained"
                disabled={!csvData || isPredicting}
                endIcon={
                  isPredicting ? (
                    <CircularProgress size={24} />
                  ) : (
                    <TrendingUpIcon />
                  )
                }
                onClick={handlePredict}
              >
                <Typography style={{ padding: "5px" }}>Predict</Typography>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Spacer sx={{ pt: 6 }} />
    </>
  );
};

export default Predict;
