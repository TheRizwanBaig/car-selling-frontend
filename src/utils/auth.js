export const checkAuth = (req, res) => {
  const token = req.cookies.token; // Get token from cookies

  // If no token, redirect to login
  if (!token) {
    res.writeHead(302, { Location: "/login" });
    res.end();
    return false; // Indicate that the user is not authenticated
  }

  // Here you can also add more logic to validate the token if needed

  return true; // User is authenticated
};
