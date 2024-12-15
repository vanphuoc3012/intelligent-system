import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import axios from "axios";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const LoginBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#4A2F80",
  padding: theme.spacing(4),
  borderRadius: "16px",
  width: "100%",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "white",
}));

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "&.MuiFormLabel-filled": {
    color: "white",
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  marginBottom: "16px",
  width: "100%",
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        new URLSearchParams({
          username: email, // Map email to username
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // Handle successful login, e.g., redirect or store token
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      setErrorMessage(""); // Clear any previous error messages
      router.push("/"); // Redirect to home page
    } catch (error) {
      // Handle login failure
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("Email or password is incorrect.");
    }
  };

  return (
    <StyledContainer>
      <LoginBox>
        {/* Logo/Icon */}
        <Link href="/" passHref>
          <IconButton sx={{ mb: 3 }}>
            <Image src="/images/logo.png" alt="Logo" width={48} height={48} />
          </IconButton>
        </Link>

        {/* Welcome Text */}
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Back
        </Typography>

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <StyledTextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Enter your email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
          />
          <StyledTextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Forgot Password Link */}
          <Link
            href="#"
            variant="body2"
            sx={{
              color: "white",
              display: "block",
              textAlign: "center",
              mb: 2,
            }}
          >
            Forgot password?
          </Link>

          {/* Login and Sign up buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Log in
              </Button>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Link href="/signup" passHref>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "#6C5DD3",
                    "&:hover": {
                      backgroundColor: "#5648A8",
                    },
                  }}
                >
                  Sign up
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </LoginBox>
    </StyledContainer>
  );
}
