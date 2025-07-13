import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleExecuteTool } from "./routes/execute-tool";
import surveillanceRouter from "./routes/surveillance";
import offensiveToolsRouter from "./routes/offensive-tools";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/execute-tool", handleExecuteTool);

  // Surveillance and monitoring endpoints
  app.use("/api", surveillanceRouter);

  return app;
}
