import React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack"; // Replaced Grid with Stack
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        backgroundColor={theme.palette.background.default}
        // sticky footer - see four values below
        position="fixed"
        bottom="0"
        left="0"
        width="100%"
      >
        <Divider />
        <Box
          backgroundColor={theme.palette.background.default}
          position="relative"
        >
          <Stack spacing={0} paddingBottom={1} paddingTop={1}>
            <Stack item="true" xs={12} md={4}></Stack>
            <Stack item="true" xs={12} md={4} justifyContent="center" alignItems="center">
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Intelligent System, Group 7, Author: Hồ Văn Phước - 2470108, Đinh Gia Quang - 2470014, Nguyễn Tấn Xanh - 2470114
              </Typography>
            </Stack>
            <Stack item="true" xs={12} md={4} justifyContent="center"></Stack>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default Footer;