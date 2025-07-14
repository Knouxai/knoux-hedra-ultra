import express from "express";
import cors from "cors";
import { createServer as createHttpServer } from "http";
import { handleDemo } from "./routes/demo";
import { handleExecuteTool } from "./routes/execute-tool";
import {
  handleSystemStats,
  handleSurveillanceLogs,
  handleSurveillanceStartAll,
} from "./routes/system";
import surveillanceRouter from "./routes/surveillance";
import offensiveToolsRouter from "./routes/offensive-tools";
import forensicsRouter from "./routes/forensics";
import WebSocketService from "./services/WebSocketService";

export function createServer() {
  const app = express();
  const httpServer = createHttpServer(app);

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

  // System API routes
  app.get("/api/system/stats", handleSystemStats);
  app.get("/api/logs/surveillance", handleSurveillanceLogs);
  app.post("/api/surveillance/start-all", handleSurveillanceStartAll);

  // Surveillance and monitoring endpoints
  app.use("/api", surveillanceRouter);

  // Offensive tools endpoints
  app.use("/api", offensiveToolsRouter);

  // Digital forensics endpoints
  app.use("/api", forensicsRouter);

  // إضافة خدمة WebSocket إلى التطبيق للوصول إليها من الطرق ��لأخرى
  app.locals.wsService = wsService;

  return httpServer;
}
