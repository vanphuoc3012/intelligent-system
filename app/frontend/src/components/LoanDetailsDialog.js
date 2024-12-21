import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';

const LoanDetailsDialog = ({ open, onClose, loanDetails }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Suggested Loan Details</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {loanDetails && loanDetails.length > 0 && Object.keys(loanDetails[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loanDetails && loanDetails.map((loan, index) => (
                <TableRow key={index}>
                  {Object.entries(loan).map(([key, value], idx) => (
                    <TableCell key={idx}>
                      {key === 'homeEquityLoan' ? (
                        <input type="checkbox" checked={Boolean(value)} disabled />
                      ) : (
                        value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ mt: 2 }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoanDetailsDialog;
