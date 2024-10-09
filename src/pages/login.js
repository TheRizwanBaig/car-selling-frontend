// src/pages/login.js

import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    console.log({ data });

    setLoading(true);
    setLoginError(""); // Reset any previous error

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        data
      );

      // Save token in cookies
      Cookies.set("token", response.data.token, { expires: 7 }); // Token will expire in 7 days
      router.push("/"); // Redirect on successful login
    } catch (error) {
      setLoginError("Invalid email or password"); // Handle login error
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="flex flex-col items-center justify-center min-h-screen"
      maxWidth="sm"
    >
      <Card className="shadow-lg bg-white rounded-lg py-5">
        <CardContent>
          <Typography variant="h4" className="mb-4 text-center">
            Login
          </Typography>
          {loginError && (
            <Typography className="text-red-500 mb-2 text-center">
              {loginError}
            </Typography>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <TextField
              {...register("email", { required: "Email is required" })}
              fullWidth
              margin="normal"
              label="Email"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              variant="outlined"
              className="rounded"
            />
            <TextField
              {...register("password", { required: "Password is required" })}
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              variant="outlined"
              className="rounded"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="flex items-center justify-center w-full"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

// Server-side authentication check
export async function getServerSideProps(context) {
  const { req, res } = context;

  // Check if the user is authenticated
  const token = req.cookies.token || ""; // Get the token from cookies
  if (token) {
    // If token exists, redirect to home
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Pass any necessary props to the page
  };
}

export default LoginPage;
