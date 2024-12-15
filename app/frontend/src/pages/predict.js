import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const Predict = () => {
  const [formData, setFormData] = useState({
    age: '',
    experience: '',
    income: '',
    dependents: '',
    education: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle prediction logic here
    console.log('Form data submitted:', formData);
  };

  return (
    <Box padding={3} minHeight="90vh" bgcolor="white">
      <Typography variant="h1" gutterBottom sx={{ textAlign: 'center' , mt: 8 }}>
        Loan Approval Prediction System Web-Based
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
        <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        <Typography variant="h4" align="center" sx={{ mt: 2 }}>
          Fill the form for prediction
        </Typography>
      </Box>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Age</Typography>
        <TextField
          label="Input age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Experience</Typography>
        <TextField
          label="Input experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Income</Typography>
        <TextField
          label="Input income"
          name="income"
          value={formData.income}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Dependents</Typography>
        <TextField
          label="Input dependents"
          name="dependents"
          value={formData.dependents}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Education</Typography>
        <TextField
          label="Input education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Link href="/" passHref>
            <Button variant="outlined" color="primary" type="button" sx={{ mr: 1, width: '120px' }}>
              Back
            </Button>
          </Link>
          <Link href="/result" passHref>
            <Button variant="contained" color="primary" type="submit" sx={{ width: '120px' }}>
              Predict
            </Button>
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Predict;
