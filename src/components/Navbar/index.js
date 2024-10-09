import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    setIsAuthenticated(!!token); // Set isAuthenticated based on token existence
    setLoading(false); // Set loading to false after checking
  };

  useEffect(() => {
    checkAuthStatus(); // Check auth status on initial render

    // Listen for route changes to re-check authentication status
    const handleRouteChange = () => {
      checkAuthStatus();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup listener on component unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]); // Add router.events to the dependency array

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/"; // Clear token cookie
    setIsAuthenticated(false); // Update state to reflect logout
    router.push("/login"); // Redirect to login page
  };

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Car Selling App
          </Typography>
          <CircularProgress color="inherit" /> {/* Show loading spinner */}
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Car Selling App
        </Typography>
        {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={() => router.push("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
