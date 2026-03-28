// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Global CSS path matches your assets/styles folder
import "./assets/styles/global.css";

// ✅ Context providers
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ThemeProvider wraps everything so dark mode works globally */}
    <ThemeProvider>
      {/* AuthProvider makes user/session data available across the app */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
