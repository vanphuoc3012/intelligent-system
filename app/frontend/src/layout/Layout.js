import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import NoSsr from "@mui/material/NoSsr";
import Zoom from "@mui/material/Zoom";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTheme } from "@mui/material";

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const [openSidebar, setOpenSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const open = isMd ? false : openSidebar;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollTo = (id) => {
    setTimeout(() => {
      const element = document.querySelector(`#${id}`);
      if (!element) {
        return;
      }
      window.scrollTo({ left: 0, top: element.offsetTop, behavior: "smooth" });
    });
  };

  return (
    <Box
      id="page-top"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
      }}
    >
      <Header isLoading={isLoading} />
      <Box
        maxWidth={{ sm: 960, md: 1440 }}
        width={1}
        margin="0 auto"
        paddingX={2}
        paddingY={2}
      >
        {children({isLoading, setIsLoading})}
      </Box>
      <Footer />
      <NoSsr>
        <Zoom in={trigger}>
          <Box
            onClick={() => scrollTo("page-top")}
            role="presentation"
            sx={{ position: "fixed", bottom: 24, right: 32 }}
          >
            <Fab
              color="primary"
              size="small"
              aria-label="scroll back to top"
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                  color: theme.palette.primary.main,
                  border: "2px solid" + theme.palette.primary.main,
                },
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Box>
        </Zoom>
      </NoSsr>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;