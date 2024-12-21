import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

const AboutUs = () => {
  return (
    <Box padding={3} minHeight="70vh" bgcolor="white" marginTop={10}>
      <Typography variant="h1" gutterBottom align="center">
        About Us
      </Typography>
      <Typography variant="h3" gutterBottom align="center">
        Group 7 - Intelligent System Course
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" marginBottom={3} padding={2}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={5}>
          <Avatar alt="Hồ Văn Phước" src="/phuoc.png" sx={{ width: 120, height: 120, marginBottom: 5 }} />
          <Typography variant="h6">Hồ Văn Phước - 2470108</Typography>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={5}>
          <Avatar alt="Đinh Gia Quang" src="/quang.png" sx={{ width: 120, height: 120, marginBottom: 5 }} />
          <Typography variant="h6">Đinh Gia Quang - 2470014</Typography>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={5}>
          <Avatar alt="Nguyễn Tấn Xanh" src="/xanh.png" sx={{ width: 120, height: 120, marginBottom: 5 }} />
          <Typography variant="h6">Nguyễn Tấn Xanh - 2470114</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;
