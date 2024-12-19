import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import TranscribeOutlinedIcon from "@mui/icons-material/TranscribeOutlined";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { blue, purple, white } from "@mui/material/colors";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";

const Header = ({ isLoading }) => {
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItemWidth, setMenuItemWidth] = useState(0);

  const handleListItemClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuItemWidth(event.currentTarget.offsetWidth);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setEmail("");
    handleClose();
    // Redirect to login or home page
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token) {
      setIsLoggedIn(true);
      axios
        .get("http://127.0.0.1:8000/user_info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setEmail(response.data.email);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401 && refreshToken) {
            // Try refreshing the token
            axios
              .post("http://127.0.0.1:8000/refresh", {
                refresh_token: refreshToken,
              })
              .then((refreshResponse) => {
                localStorage.setItem(
                  "accessToken",
                  refreshResponse.data.access_token
                );
                // Retry fetching user info with new token
                return axios.get("http://127.0.0.1:8000/user_info", {
                  headers: {
                    Authorization: `Bearer ${refreshResponse.data.access_token}`,
                  },
                });
              })
              .then((response) => {
                setEmail(response.data.email);
              })
              .catch((refreshError) => {
                setIsLoggedIn(false);
                console.error(
                  "Error refreshing token or fetching user info:",
                  refreshError
                );
              });
          } else {
            setIsLoggedIn(false);
            console.error("Error fetching user info:", error);
          }
        });
    }
  }, []);

  return (
    <>
      <AppBar
        elevation={5}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 70 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/" passHref>
              <Button
                color="primary"
                size="small"
                variant="text"
                sx={{
                  color: theme.palette.common.white,
                  fontSize: theme.typography.subtitle1,
                  fontWeight: "medium",
                  mr: 2,
                  "& svg": {
                    mr: 0.5,
                  },
                }}
                startIcon={
                  <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
                }
              >
              </Button>
            </Link>

            <Link href="/" passHref>
              <Button
                color="primary"
                size="small"
                variant="text"
                sx={{
                  color: theme.palette.common.white,
                  fontSize: theme.typography.subtitle1,
                  fontWeight: "medium",
                  mr: 2,
                  "& svg": {
                    mr: 0.5,
                  },
                }}
                startIcon={
                  <HomeOutlinedIcon style={{ height: 26, width: 26 }} />
                }
              >
                Home
              </Button>
            </Link>
            <Link href="/predict" passHref>
              <Button
                color="primary"
                size="small"
                variant="text"
                sx={{
                  color: theme.palette.common.white,
                  fontSize: theme.typography.subtitle1,
                  fontWeight: "medium",
                  mr: 2,
                  "& svg": {
                    mr: 0.5,
                  },
                }}
                startIcon={
                  <TrendingUpIcon style={{ height: 26, width: 26 }} />
                }
              >
                Prediction
              </Button>
            </Link>
            <Link href="/transcribe" passHref>
              <Button
                color="primary"
                size="small"
                variant="text"
                sx={{
                  color: theme.palette.common.white,
                  fontSize: theme.typography.subtitle1,
                  fontWeight: "medium",
                  mr: 2,
                  "& svg": {
                    mr: 0.5,
                  },
                }}
                startIcon={
                  <TranscribeOutlinedIcon style={{ height: 26, width: 26 }} />
                }
              >
                Transcribe
              </Button>
            </Link>
            <Link href="/about" passHref>
              <Button
                color="primary"
                size="small"
                variant="text"
                sx={{
                  color: theme.palette.common.white,
                  fontSize: theme.typography.subtitle1,
                  fontWeight: "medium",
                  mr: 2,
                  "& svg": {
                    mr: 0.5,
                  },
                }}
                startIcon={
                  <InfoOutlinedIcon style={{ height: 26, width: 26 }} />
                }
              >
                About Us
              </Button>
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {isLoggedIn ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ListItem disablePadding key={email}>
                <ListItemButton onClick={handleListItemClick}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: purple[50], color: purple[800] }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={email} />
                </ListItemButton>
              </ListItem>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    style: {
                      width: menuItemWidth,
                    },
                  },
                }}
              >
                <MenuItem onClick={handleLogout} sx={{ color: purple[800],  }}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <>
              <Link href="/signup" passHref>
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{
                    color: theme.palette.common.white,
                    fontSize: theme.typography.subtitle1,
                    fontWeight: "medium",
                    mr: 2,
                  }}
                >
                  Sign up
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{
                    color: theme.palette.common.white,
                    fontSize: theme.typography.subtitle1,
                    fontWeight: "medium",
                    mr: 2,
                  }}
                >
                  Log in
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
        {isLoading && <LinearProgress color="warning" />}
        <Divider />
      </AppBar>
    </>
  );
};

export default Header;
