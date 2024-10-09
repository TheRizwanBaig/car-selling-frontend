import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

// Create a custom theme using Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize your primary color
    },
    secondary: {
      main: "#dc004e", // Customize your secondary color
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // Set your custom font if needed
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
