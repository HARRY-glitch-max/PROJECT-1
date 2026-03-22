import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 1. Updated CSS path to match your 'assets/styles' folder
import "./assets/styles/global.css"; 

// 2. Added the 's' to 'contexts' to match your folder name exactly
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ThemeProvider wraps everything so dark mode works globally */}
    <ThemeProvider> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);