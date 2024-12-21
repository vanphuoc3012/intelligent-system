import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";
import Link from "next/link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Head from "next/head";
import LoanDetailsDialog from '../components/LoanDetailsDialog';

const BulkResults = () => {
  const [loanData, setLoanData] = useState(
    Array.from({ length: 20 }, (_, index) => {
      const randomRateIncrement = (Math.random() * (0.5 - 0.1) + 0.1).toFixed(
        2
      );
      const day = 15 + index <= 31 ? 15 + index : 15 + index - 31;
      const formattedDay = day.toString().padStart(2, "0");
      return {
        loanAmount: `$${(250000 + index * 5000).toLocaleString()}`,
        interestRate: `${(3.5 + parseFloat(randomRateIncrement)).toFixed(2)}%`,
        loanTerm: `${((index % 5) + 0.5).toFixed(1)} years`,
        applicationDate: `2024-12-${formattedDay}`,
        homeEquityLoan: Math.random() < 0.5, // Randomly set homeEquityLoan to true or false
      };
    })
  );

  const [randomRows, setRandomRows] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const randomRowCount = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
      const randomRows = Array.from(
        { length: randomRowCount },
        () => loanData[Math.floor(Math.random() * loanData.length)]
      );
      setRandomRows(randomRows);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("bulkResults");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  loanData.sort((a, b) => {
    const loanAmountA = parseInt(a.loanAmount.replace(/\$|,/g, ""));
    const loanAmountB = parseInt(b.loanAmount.replace(/\$|,/g, ""));
    const interestRateA = parseFloat(a.interestRate);
    const interestRateB = parseFloat(b.interestRate);
    if (loanAmountA === loanAmountB) {
      return interestRateA - interestRateB;
    }
    return loanAmountA - loanAmountB;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialogOpen = () => {
    const randomRowCount = Math.floor(Math.random() * (10 - 2 + 1)) + 2;
    const randomRows = Array.from(
      { length: randomRowCount },
      () => loanData[Math.floor(Math.random() * loanData.length)]
    );
    setRandomRows(randomRows);
    setSelectedLoan(randomRows);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedLoan(null);
  };

  const downloadCSV = () => {
    const storedData = localStorage.getItem('bulkResults');
    if (!storedData) return;

    const data = JSON.parse(storedData);
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => row[header]).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "bulk_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Result | Loan Approval Prediction</title>
      </Head>
      <Box
        padding={3}
        minHeight="70vh"
        bgcolor="white"
        marginBottom={2}
        marginTop={10}
      >
        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h1" sx={{ textAlign: "left" }}>
            Prediction Result Summary
          </Typography>
        </Box>
        <Typography variant="body1" gutterBottom>
          List of predicted results
        </Typography>
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "lightgray" }}>
              <TableRow>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                <TableCell>Suitable Loans</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {Object.entries(row).map(([key, value], i) => (
                      <TableCell key={i}>
                        {key === "predictResult\r" &&
                        value.trim() !== "Not enough information" ? (
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                              ml: 2,
                              border: "1px solid",
                              borderRadius: "16px",
                              padding: "4px 8px",
                              height: "fit-content",
                            }}
                          >
                            <Typography
                              variant="h6"
                              color={value.trim() === "1" ? "primary" : "error"}
                            >
                              {value.trim() === "1"
                                ? "Approved"
                                : "Not Approved"}
                            </Typography>
                            <CheckCircleOutlineIcon
                              color={value.trim() === "1" ? "primary" : "error"}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        ) : (
                          value
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {row["predictResult\r"] && row["predictResult\r"].trim() === "1" ? (
                        <Button variant="contained" onClick={handleDialogOpen}>View Details</Button>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <LoanDetailsDialog open={dialogOpen} onClose={handleDialogClose} loanDetails={selectedLoan} />
        </TableContainer>
        <Typography variant="body2" gutterBottom>
          Note: This is a Home Equity Loan
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={downloadCSV}
            sx={{ mr: 2 }}
          >
            Download CSV
          </Button>
          <Link href="/predict" passHref>
            <Button
              variant="contained"
              color="primary"
              startIcon={<TrendingUpIcon />}
            >
              Predict a New Customer
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default BulkResults;
