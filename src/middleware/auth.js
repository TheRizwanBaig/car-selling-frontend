// utils/auth.js

export const checkAuth = (req = null) => {
  let token;

  // Server-side check
  if (req && req.cookies) {
    token = req.cookies.token; // Get token from cookies in server context
  } else {
    // Client-side check
    token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  }

  // If no token, return false
  if (!token) {
    return { isAuthenticated: false, token: null };
  }

  // Optionally add more logic to validate the token here

  return { isAuthenticated: true, token }; // User is authenticated
};
