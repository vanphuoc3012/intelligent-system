import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

const AboutUs = () => {
  return (
    <Box padding={3} minHeight="70vh" bgcolor="white" marginTop={10}>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" marginBottom={3}>
        <Avatar alt="Group 7" src="/group7.png" sx={{ width: 150, height: 150 }} />
      </Box>
      <Typography variant="h4" gutterBottom textAlign={'center'}>
        Intelligent System, Group 7, Author: Hồ Văn Phước - 2470108, Đinh Gia Quang - 2470014, Nguyễn Tấn Xanh - 2470114
      </Typography>
    </Box>
  );
};

export default AboutUs;
