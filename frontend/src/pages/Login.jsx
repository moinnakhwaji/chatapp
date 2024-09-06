import { VisuallyHiddenInput } from "../components/Style/Style";
import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import chatgif from "../constant/chatgif.gif";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Server } from "../constant/config";
import { UserExist } from "../redux/reducers/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");

  const username = useInputValidation("");
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    // Password length validation
    if (password.value.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return; // Exit the function to prevent further execution
    }
  
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
  
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  
    try {
      const { data } = await axios.post(
        `${Server}/api/v4/user/new`,
        formData,
        config
      );
  
      dispatch(UserExist(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  

 
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (isLoading) return;
  
    const toastId = toast.loading("Logging In...");
  
    const config = {
      withCredentials: true, // This ensures cookies are sent and received
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(config)
  
    try {
      const { data } = await axios.post(
        `${Server}/api/v4/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
  
      dispatch(UserExist(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  return (
    <Container
      component={"main"}
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1f1e24 0%, #2d2a2e 100%)",
        padding: 0,
        margin: 0,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "90%", sm: "80%", md: "70%" },
          maxWidth: "1000px",
          backgroundColor: "#1f1e24",
          color: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          <img
            src={chatgif}
            alt="Chat GIF"
            style={{
              width: "100%",
              maxWidth: "350px",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <Typography variant="h4" color="#ffffff" fontWeight="bold" mb={2}>
            {isLogin ? "Login" : ""}
          </Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            onSubmit={isLogin ? handleLogin : handleSignUp}
          >
            {!isLogin && (
              <Stack
                position={"relative"}
                width={"6rem"} // Decreased width
                height={"6rem"} // Decreased height
                margin={"auto"}
                mb={2}
                alignItems="center"
                justifyContent="center"
              >
                <Avatar
                  sx={{
                    width: "6rem", // Decreased width
                    height: "6rem", // Decreased height
                    objectFit: "cover",
                    border: "4px solid #6556cd",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#ffffff",
                  }}
                  src={avatar.preview}
                />

                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    color: "#ffffff",
                    bgcolor: "rgba(0,0,0,0.6)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.8)",
                    },
                  }}
                  component="label"
                >
                  <>
                    <CameraAltIcon />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </>
                </IconButton>
              </Stack>
            )}

            {!isLogin && avatar.error && (
              <Typography
                m={"1rem auto"}
                width={"fit-content"}
                display={"block"}
                color="error"
                variant="caption"
              >
                {avatar.error}
              </Typography>
            )}

            {!isLogin && (
              <>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff" },
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffffff",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6556cd",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6556cd",
                      },
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  InputLabelProps={{ style: { color: "#ffffff" } }}
                  InputProps={{
                    style: { color: "#ffffff" },
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffffff",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6556cd",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6556cd",
                      },
                    },
                  }}
                />
              </>
            )}

            <TextField
              required
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              value={username.value}
              onChange={username.changeHandler}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{
                style: { color: "#ffffff" },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffffff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6556cd",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6556cd",
                  },
                },
              }}
            />

            {username.error && (
              <Typography color="error" variant="caption">
                {username.error}
              </Typography>
            )}

            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              value={password.value}
              onChange={password.changeHandler}
              InputLabelProps={{ style: { color: "#ffffff" } }}
              InputProps={{
                style: { color: "#ffffff" },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ffffff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6556cd",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6556cd",
                  },
                },
              }}
            />

            {password.error && (
              <Typography color="error" variant="caption">
                {password.error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                marginTop: "1rem",
                borderRadius: "8px",
                bgcolor: "#6556cd",
                ":hover": {
                  bgcolor: "#5745b5",
                },
              }}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <Button
              onClick={toggleLogin}
              fullWidth
              variant="text"
              color="secondary"
              sx={{
                marginTop: "1rem",
                borderRadius: "8px",
                color: "#6556cd",
                ":hover": {
                  bgcolor: "rgba(0,0,0,0.1)",
                },
              }}
            >
              {isLogin ? "Create an account" : "Already have an account? Login"}
            </Button>
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default Login;
