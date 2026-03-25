// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // ✅ Allows clean imports like "@/components/Navbar"
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // ✅ The Proxy acts as a "Bridge" between the browser and your Node server
    proxy: {
      "/api": {
        // ✅ CHANGED: Using 'localhost' matches the standard Node server output
        target: "http://localhost:5000", 
        changeOrigin: true,
        secure: false,
        // Keep this commented out unless your backend DOES NOT use the "/api" prefix
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});