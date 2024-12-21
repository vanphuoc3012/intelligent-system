import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox } from '@mui/material';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Predict = () => {
  const [formData, setFormData] = useState({
    age: '',
    experience: '',
    income: '',
    dependents: '',
    education: '',
    zipcode: '',
    family: '',
    ccAvg: '',
    mortgage: '',
    securitiesAccount: false,
    cdAccount: false,
    online: false,
    creditCard: false
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const predictionResult = await response.json();
      console.log('Prediction result:', predictionResult);
      router.push({
        pathname: '/result',
        query: { data: JSON.stringify(predictionResult) },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
    <Head>
        <title>Loan Approval Prediction | Predict</title>
      </Head> 
    <Box padding={3} minHeight="90vh" bgcolor="white">
      <Typography variant="h1" gutterBottom sx={{ textAlign: 'center', mt: 8 }}>
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
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Zipcode</Typography>
        <TextField
          label="Input zipcode"
          name="zipcode"
          value={formData.zipcode}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Family</Typography>
        <TextField
          label="Input family"
          name="family"
          value={formData.family}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>CC Average</Typography>
        <TextField
          label="Input average monthly spending with credit card (in thousands)"
          name="ccAvg"
          value={formData.ccAvg}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Education</Typography>
        <TextField
          label="Input education level (1: bachelor's, 2: master's, 3: professional)"
          name="education"
          value={formData.education}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false}>Mortgage</Typography>
        <TextField
          label="Input mortgage value (in thousands)"
          name="mortgage"
          value={formData.mortgage}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false} sx={{ mr: 1 }}>
              Securities Account
            </Typography>
            <Checkbox
              name="securitiesAccount"
              checked={formData.securitiesAccount}
              onChange={handleChange}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false} sx={{ mr: 1 }}>
              CD Account
            </Typography>
            <Checkbox
              name="cdAccount"
              checked={formData.cdAccount}
              onChange={handleChange}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false} sx={{ mr: 1 }}>
              Online Banking
            </Typography>
            <Checkbox
              name="online"
              checked={formData.online}
              onChange={handleChange}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom={false} sx={{ mr: 1 }}>
              Credit Card
            </Typography>
            <Checkbox
              name="creditCard"
              checked={formData.creditCard}
              onChange={handleChange}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button variant="outlined" color="primary" type="button" sx={{ mr: 1, width: '120px' }}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
            sx={{ width: '120px' }}
          >
            Predict
          </Button>
        </Box>
      </form>
    </Box>
    </>
  );
};

export default Predict;
