import express from "express";
import cors from "cors";
import { createServer } from "http";
import { handleDemo } from "./routes/demo";
import { handleExecuteTool } from "./routes/execute-tool";
import surveillanceRouter from "./routes/surveillance";
import offensiveToolsRouter from "./routes/offensive-tools";
import WebSocketService from "./services/WebSocketService";

export function createServer() {
  const app = express();
  const httpServer = createServer(app);

  // إنشاء خدمة WebSocket
  const wsService = new WebSocketService(httpServer);

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

  // Offensive tools endpoints
  app.use("/api", offensiveToolsRouter);

  return app;
}
