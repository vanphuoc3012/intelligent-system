import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme, useMediaQuery } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Link from 'next/link';

const HeroButtons = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretched", sm: "flex-start" }}
        justifyContent="right"
        marginTop={4}
      >
        <Box
          marginTop={{ xs: 2, sm: 0 }}
          marginLeft={{ sm: 1 }}
          width={{ xs: "100%", md: "auto" }}
        >
          <Link href="/predict" passHref>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<TrendingUpIcon  style={{ height: 26, width: 26 }}/>}
              fullWidth={isMd ? false : true}
              disableElevation={true}
              sx={{
                padding: "10px 20px",
                marginRight: "15px",
                fontSize: "18px",
                border: "2px solid " + theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  border: "2px solid " + theme.palette.primary.main,
                },
              }}
            >
              Prediction
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default HeroButtons;
