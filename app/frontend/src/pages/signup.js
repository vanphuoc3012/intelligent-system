import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  LinearProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const SignupBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#4A2F80",
  padding: theme.spacing(4),
  borderRadius: "16px",
  width: "100%",
  maxWidth: "620px",
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "white",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
    "&.Mui-focused": {
      color: "white",
    },
    "&.MuiFormLabel-filled": {
      color: "white",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const CustomTextField = ({ startAdornment, endAdornment, ...props }) => (
  <StyledTextField
    {...props}
    slotProps={{
      input: {
        startAdornment: startAdornment,
        endAdornment: endAdornment,
      },
    }}
  />
);

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        handleSuccess();
      } catch (error) {
        setErrorMessage("Email is already exist!");
        setSuccessMessage(""); // Clear any previous success messages
      }
    }
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setFormData({ ...formData, password: newPassword });

    // Calculate password strength
    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (newPassword.match(/[A-Z]/)) strength += 25;
    if (newPassword.match(/[a-z]/)) strength += 25;
    if (newPassword.match(/[0-9]/) || newPassword.match(/[^A-Za-z0-9]/))
      strength += 25;

    setPasswordStrength(strength);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleSuccess = () => {
    setShowSuccessPopup(true);
  };

  return (
    <StyledContainer component="main">
      <Dialog
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        maxWidth="xs"
        fullWidth
      >
        {/* <DialogTitle>Success</DialogTitle> */}
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <CheckCircleIcon style={{ color: "green", fontSize: 60 }} />
          <Typography variant="h4" style={{ fontWeight: "bold", marginTop: 16, marginBottom: 16 }}>
            Account created successfully!
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 0, width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Link href="/" passHref>
                <Button fullWidth variant="contained" color="primary">
                  Home
                </Button>
              </Link>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Link href="/login" passHref>
                <Button fullWidth variant="outlined" color="primary">
                  Login
                </Button>
              </Link>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <SignupBox>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
          Create a New Account
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ width: "100%" }}
        >
          <CustomTextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            error={!!errors.firstName}
            helperText={errors.firstName}
            startAdornment={
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            }
          />

          <CustomTextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            error={!!errors.lastName}
            helperText={errors.lastName}
            startAdornment={
              <InputAdornment position="start">
                <PersonOutlineIcon />
              </InputAdornment>
            }
          />
          <CustomTextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={!!errors.email}
            helperText={errors.email}
            startAdornment={
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            }
          />

          <CustomTextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            error={!!errors.password || !!passwordError}
            helperText={errors.password || passwordError}
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={passwordStrength}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "white",
                },
              }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 1, display: "block" }}
          >
            Password must be at least 8 characters long and include a mix of
            uppercase, lowercase, numbers, and symbols.
          </Typography>

          <CustomTextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "white",
              color: "#4A2F80",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.9)",
              },
              height: "48px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Create Account
          </Button>
        </Box>
      </SignupBox>
    </StyledContainer>
  );
}
