import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme, useMediaQuery } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";

import HeroButtons from "../components/HeroButtons";

const Hero = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box
      maxWidth={{ sm: 720, md: 1236 }}
      width={1}
      margin="0 auto"
      paddingTop={10}
      backgroundColor={theme.palette.background.default}
    >
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop="20px">
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" width={1}>
          <Box flex={1} order={{ xs: 2, md: 1 }} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box data-aos={isMd ? "fade-right" : "fade-up"} marginRight={4}>
              <Box display="flex" flexDirection="row" alignItems="center" width={1}>
                <Typography
                  align="left"
                  color={theme.palette.text.primary}
                  variant="h1"
                  sx={{ fontSize: '56px' }}
                  noWrap
                >
                  Loan Approval Prediction
                </Typography>
              </Box>
              <Box marginBottom={3}>
                <Typography
                  align="left"
                  color={theme.palette.text.secondary}
                  variant="h5"
                  paddingTop={3}
                  paddingBottom={3}
                  marginBottom="15px"
                >
                  Discover your loan eligibility instantly with our advanced loan approval prediction tool. Input your details and get a quick assessment on your loan application status.
                </Typography>
              </Box>
              <HeroButtons />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flex={1} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                height: { xs: "auto", md: 1 },
                "& img": {
                  objectFit: "cover",
                },
                "& .lazy-load-image-loaded": {
                  height: 1,
                  width: 1,
                },
              }}
            >
              <Box
                component={LazyLoadImage}
                src={"/images/home_banner.png"}
                alt="Hero"
                effect="blur"
                height={{ xs: "auto", md: 1 }}
                maxHeight={{ xs: 300, md: 1 }}
                width={1}
                maxWidth={1}
                borderRadius={2}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
