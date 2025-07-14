import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server/index";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const expressApp = createServer();

      // Add Express app as middleware for API routes
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api/")) {
          // Get the express app from the http server
          const app = expressApp.listeners("request")[0];
          if (typeof app === "function") {
            app(req, res);
          } else {
            next();
          }
        } else {
          next();
        }
      });
    },
  };
}
