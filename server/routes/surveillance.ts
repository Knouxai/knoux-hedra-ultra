import express from "express";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const router = express.Router();

// واجهة لإحصائيات النظام
interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

// واجهة للوجات المراقبة
interface SurveillanceLog {
  timestamp: string;
  tool: string;
  message: string;
  level: "info" | "warning" | "error";
}

// مخزن اللوجات في الذاكرة
let surveillanceLogs: SurveillanceLog[] = [];

// حالة الأدوات
let toolStatuses: { [key: string]: string } = {
  SystemWatchdog: "IDLE",
  LiveNetworkMonitor: "IDLE",
  FileAccessTracker: "IDLE",
  ThirdPartyMonitor: "IDLE",
  UnauthorizedLoginDetector: "IDLE",
  CameraMicMonitor: "IDLE",
  SilentUserLogger: "DISABLED",
};

// دالة لإضافة لوج جديد
function addLog(
  tool: string,
  message: string,
  level: "info" | "warning" | "error" = "info",
) {
  const newLog: SurveillanceLog = {
    timestamp: new Date().toISOString(),
    tool,
    message,
    level,
  };

  surveillanceLogs.unshift(newLog);

  // الاحتفاظ بآخر 100 لوج فقط
  if (surveillanceLogs.length > 100) {
    surveillanceLogs = surveillanceLogs.slice(0, 100);
  }
}

// دالة لحساب إحصائيات النظام
async function getSystemStats(): Promise<SystemStats> {
  return new Promise((resolve) => {
    // CPU Usage
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuUsage = 100 - (totalIdle / totalTick) * 100;

    // Memory Usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

    // مؤقتًا: محاكاة استخدام القرص والشبكة
    const diskUsage = Math.random() * 100;
    const networkUsage = Math.random() * 100;

    resolve({
      cpu: Math.max(0, Math.min(100, cpuUsage || Math.random() * 100)),
      memory: memoryUsage,
      disk: diskUsage,
      network: networkUsage,
    });
  });
}

// دالة لتشغيل أداة المراقبة
async function executeWatchScript(
  toolName: string,
  action: "start" | "stop",
): Promise<any> {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const scriptExt = isWindows ? ".ps1" : ".sh";
    const scriptPath = path.join(
      process.cwd(),
      "microservices",
      "surveillance",
      toolName,
      action === "start" ? `run${scriptExt}` : `stop${scriptExt}`,
    );

    // التحقق من وجود السكربت
    if (!fs.existsSync(scriptPath)) {
      // محاكاة التشغيل في حالة عدم وجود السكربت
      addLog(
        toolName,
        `${action === "start" ? "Started" : "Stopped"} monitoring (simulated)`,
        "info",
      );
      resolve({
        success: true,
        simulated: true,
        status: action === "start" ? "WATCHING" : "IDLE",
      });
      return;
    }

    const command = isWindows
      ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
      : `chmod +x "${scriptPath}" && "${scriptPath}"`;

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        addLog(toolName, `Error ${action}ing: ${error.message}`, "error");
        reject(error);
        return;
      }

      addLog(
        toolName,
        `${action === "start" ? "Started" : "Stopped"} successfully: ${stdout.trim()}`,
        "info",
      );
      resolve({
        success: true,
        output: stdout.trim(),
        status: action === "start" ? "WATCHING" : "IDLE",
      });
    });
  });
}

// GET /api/system/stats - جلب إحصائيات النظام
router.get("/system/stats", async (req, res) => {
  try {
    const stats = await getSystemStats();
    res.json(stats);
  } catch (error) {
    console.error("Error getting system stats:", error);
    res.status(500).json({ error: "Failed to get system stats" });
  }
});

// GET /api/logs/surveillance - جلب لوجات المراقبة
router.get("/logs/surveillance", (req, res) => {
  res.json(surveillanceLogs);
});

// POST /api/tools/:toolName/watch - تشغيل/إيقاف أداة المراقبة
router.post("/tools/:toolName/watch", async (req, res) => {
  const { toolName } = req.params;
  const { action } = req.body;

  if (!action || !["start", "stop"].includes(action)) {
    return res
      .status(400)
      .json({ error: "Invalid action. Use 'start' or 'stop'" });
  }

  try {
    const result = await executeWatchScript(toolName, action);

    // تحديث حالة الأداة
    toolStatuses[toolName] = result.status;

    res.json({
      success: true,
      status: result.status,
      message: `Tool ${toolName} ${action}ed successfully`,
      simulated: result.simulated || false,
    });
  } catch (error) {
    console.error(`Error ${action}ing ${toolName}:`, error);
    res.status(500).json({
      error: `Failed to ${action} ${toolName}`,
      details: error.message,
    });
  }
});

// GET /api/tools/:toolName/status - جلب حالة أداة المراقبة
router.get("/tools/:toolName/status", (req, res) => {
  const { toolName } = req.params;
  const status = toolStatuses[toolName] || "IDLE";

  res.json({
    tool: toolName,
    status: status,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/surveillance/start-all - تشغيل جميع أدوات المراقبة
router.post("/surveillance/start-all", async (req, res) => {
  const tools = [
    "SystemWatchdog",
    "LiveNetworkMonitor",
    "FileAccessTracker",
    "ThirdPartyMonitor",
    "UnauthorizedLoginDetector",
    "CameraMicMonitor",
  ];

  const results = [];

  for (const tool of tools) {
    try {
      const result = await executeWatchScript(tool, "start");
      toolStatuses[tool] = result.status;
      results.push({ tool, success: true, status: result.status });
    } catch (error) {
      results.push({ tool, success: false, error: error.message });
    }
  }

  addLog("System", "All surveillance tools started", "info");

  res.json({
    success: true,
    message: "Bulk monitoring start completed",
    results: results,
  });
});

// POST /api/surveillance/stop-all - إيقاف جميع أدوات المراقبة
router.post("/surveillance/stop-all", async (req, res) => {
  const tools = Object.keys(toolStatuses).filter(
    (tool) => tool !== "SilentUserLogger",
  );

  const results = [];

  for (const tool of tools) {
    try {
      const result = await executeWatchScript(tool, "stop");
      toolStatuses[tool] = result.status;
      results.push({ tool, success: true, status: result.status });
    } catch (error) {
      results.push({ tool, success: false, error: error.message });
    }
  }

  addLog("System", "All surveillance tools stopped", "info");

  res.json({
    success: true,
    message: "Bulk monitoring stop completed",
    results: results,
  });
});

// GET /api/surveillance/export - تصدير بيانات المراقبة
router.get("/surveillance/export", async (req, res) => {
  try {
    const stats = await getSystemStats();
    const exportData = {
      systemStats: stats,
      toolStatuses: toolStatuses,
      logs: surveillanceLogs,
      exportTime: new Date().toISOString(),
      totalLogs: surveillanceLogs.length,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=surveillance-export-${new Date().toISOString().split("T")[0]}.json`,
    );
    res.json(exportData);
  } catch (error) {
    console.error("Error exporting surveillance data:", error);
    res.status(500).json({ error: "Failed to export surveillance data" });
  }
});

// WebSocket support for real-time updates (placeholder)
router.get("/surveillance/realtime", (req, res) => {
  res.json({
    message: "Real-time updates available via WebSocket",
    endpoint: "ws://localhost:7071/surveillance",
    protocols: ["surveillance-v1"],
  });
});

// إضافة بعض ��للوجات التجريبية عند بدء الخادم
addLog("System", "Surveillance API initialized", "info");
addLog("SystemWatchdog", "Ready for monitoring", "info");
addLog("LiveNetworkMonitor", "Network interfaces detected", "info");

export default router;
