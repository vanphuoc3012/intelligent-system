import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Link from 'next/link';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Result = () => {
  return (
    <Box padding={3} minHeight="70vh" bgcolor="white" marginBottom={2} marginTop={10}>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h1" sx={{ textAlign: 'left' }}>
          Loan Application Summary
        </Typography>
        <Box display="flex" alignItems="center" sx={{ ml: 2, border: '1px solid', borderRadius: '16px', padding: '4px 8px', height: 'fit-content' }}>
          <Typography variant="h6" color="primary">
            Approved
          </Typography>
          <CheckCircleOutlineIcon color="primary" sx={{ ml: 1 }} />
        </Box>
      </Box>
      <Typography variant="body1" gutterBottom>
        Congratulations! Your customer has the potential to accept a loan. Please review the next steps.
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'lightgray' }}>
            <TableRow>
              <TableCell>Loan Amount</TableCell>
              <TableCell>Annual Interest Rate</TableCell>
              <TableCell>Loan Term</TableCell>
              <TableCell>Application Date</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Home Equity Loan</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>$250,000</TableCell>
              <TableCell>3.5%</TableCell>
              <TableCell>30 years</TableCell>
              <TableCell>2023-09-15</TableCell>
              <TableCell sx={{ textAlign: 'center' }}><input type="checkbox" disabled /></TableCell>
              <TableCell sx={{ textAlign: 'center' }}><Button variant="contained">View Details</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body2" gutterBottom>
        Note: This is a Home Equity Loan
      </Typography>
      <Box display="flex" justifyContent="flex-end" marginTop={3}>
        <Link href="/predict" passHref>
          <Button variant="contained" color="primary" startIcon={<TrendingUpIcon />}>
            Predict a New Customer
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Result;
