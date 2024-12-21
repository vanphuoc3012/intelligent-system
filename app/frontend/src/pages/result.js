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
} from "@mui/material";
import Link from "next/link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Head from "next/head";
import { useRouter } from 'next/router';

const Result = () => {
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

  const router = useRouter();
  const { data } = router.query;
  const parsedData = data ? JSON.parse(data) : {};
  const isApproved = parsedData.predictResult;

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
            Loan Application Summary
          </Typography>
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
            <Typography variant="h6" color={isApproved ? 'primary' : 'error'}>
              {isApproved ? 'Approved' : 'Not Approved'}
            </Typography>
            <CheckCircleOutlineIcon color={isApproved ? 'primary' : 'error'} sx={{ ml: 1 }} />
          </Box>
        </Box>
        <Typography variant="body1" gutterBottom>
          {isApproved ? 'Congratulations! Your customer has the potential to accept a loan. Please review the next steps.' : 'Sorry, your customer does not have the potential to accept a loan.'}
        </Typography>
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "lightgray" }}>
              <TableRow>
                <TableCell>Loan Amount</TableCell>
                <TableCell>Annual Interest Rate</TableCell>
                <TableCell>Loan Term</TableCell>
                <TableCell>Application Date</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  Home Equity Loan
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isApproved && randomRows.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>{loan.loanAmount}</TableCell>
                  <TableCell>{loan.interestRate}</TableCell>
                  <TableCell>{loan.loanTerm}</TableCell>
                  <TableCell>{loan.applicationDate}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={loan.homeEquityLoan}
                      disabled
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button variant="contained">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" gutterBottom>
          Note: This is a Home Equity Loan
        </Typography>
        <Box display="flex" justifyContent="flex-end" marginTop={3}>
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

export default Result;
