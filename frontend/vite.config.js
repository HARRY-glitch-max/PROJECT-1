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
    // ✅ The Proxy acts as a "Bridge" between Jeremiah's browser and your Node server
    proxy: {
      "/api": {
        // Change 'localhost' to '127.0.0.1' to match your Backend server exactly
        target: "http://127.0.0.1:5000", 
        changeOrigin: true,
        secure: false,
        // Optional: rewrite the path if your backend doesn't expect "/api"
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});