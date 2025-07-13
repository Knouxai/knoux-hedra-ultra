import express from "express";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

const router = express.Router();

// قائمة الأدوات الهجومية المتاحة
const offensiveTools = [
  "AutoRecon",
  "PacketInterceptor",
  "AttackScriptGenerator",
  "WiFiPenTest",
  "OSINTDeepSearch",
  "MACARPSpoofing",
  "CVEExploiter",
];

// واجهة لحالة الأدوات
interface ToolStatus {
  [key: string]: "READY" | "RUNNING" | "COMPLETED" | "ERROR" | "DISABLED";
}

// حالة الأدوات
let toolStatuses: ToolStatus = {
  AutoRecon: "READY",
  PacketInterceptor: "READY",
  AttackScriptGenerator: "READY",
  WiFiPenTest: "READY",
  OSINTDeepSearch: "READY",
  MACARPSpoofing: "READY",
  CVEExploiter: "DISABLED", // معطل لأسب��ب أمنية
};

// Target configuration
let currentTarget = "";

// دالة لتشغيل أداة هجومية
async function executeOffensiveTool(
  toolName: string,
  parameters: any = {},
): Promise<any> {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const scriptExt = isWindows ? ".ps1" : ".sh";
    const scriptPath = path.join(
      process.cwd(),
      "microservices",
      "offensive-tools",
      toolName,
      `run${scriptExt}`,
    );

    // التحقق من وجود السكربت
    if (!fs.existsSync(scriptPath)) {
      // محاكاة التشغيل في حالة عدم وجود السكربت
      const mockResult = {
        success: true,
        simulated: true,
        status: "COMPLETED",
        tool: toolName,
        target: currentTarget || parameters.target || "simulated-target",
        timestamp: new Date().toISOString(),
      };
      resolve(mockResult);
      return;
    }

    // بناء الأمر
    let command = "";
    if (isWindows) {
      command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`;

      // إضافة المعاملات للويندوز
      if (parameters.target || currentTarget) {
        command += ` -Target "${parameters.target || currentTarget}"`;
      }
      if (parameters.outputDir) {
        command += ` -OutputDir "${parameters.outputDir}"`;
      }
      if (parameters.scanType) {
        command += ` -ScanType "${parameters.scanType}"`;
      }
      if (parameters.duration) {
        command += ` -Duration ${parameters.duration}`;
      }
      if (parameters.attackType) {
        command += ` -AttackType "${parameters.attackType}"`;
      }
      if (parameters.interface) {
        command += ` -Interface "${parameters.interface}"`;
      }
    } else {
      command = `chmod +x "${scriptPath}" && "${scriptPath}"`;

      // إضافة المعاملات للينكس
      const args = [];
      if (parameters.target || currentTarget) {
        args.push(parameters.target || currentTarget);
      }
      if (parameters.outputDir) {
        args.push(parameters.outputDir);
      }
      if (parameters.duration) {
        args.push(parameters.duration);
      }
      if (parameters.scanType) {
        args.push(parameters.scanType);
      }

      if (args.length > 0) {
        command += ` ${args.join(" ")}`;
      }
    }

    console.log(`Executing offensive tool: ${toolName}`);
    console.log(`Command: ${command}`);

    exec(command, { timeout: 300000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${toolName}:`, error);
        reject({
          success: false,
          error: error.message,
          tool: toolName,
          stderr: stderr,
        });
        return;
      }

      try {
        // محاولة تحليل النتيجة كـ JSON
        const result = JSON.parse(stdout.trim());
        resolve({
          success: true,
          tool: toolName,
          ...result,
        });
      } catch (parseError) {
        // إذا لم تكن النتيجة JSON صحيح، أرجع النص الخام
        resolve({
          success: true,
          tool: toolName,
          output: stdout.trim(),
          status: "COMPLETED",
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
}

// GET /api/offensive-tools - قائمة جميع الأدوات الهجومية
router.get("/offensive-tools", (req, res) => {
  const toolsList = offensiveTools.map((tool) => ({
    name: tool,
    status: toolStatuses[tool],
    endpoints: {
      run: `/api/offensive-tools/${tool}/run`,
      status: `/api/offensive-tools/${tool}/status`,
      settings: `/api/offensive-tools/${tool}/settings`,
    },
  }));

  res.json({
    tools: toolsList,
    currentTarget: currentTarget,
    totalTools: offensiveTools.length,
    activeTools: Object.values(toolStatuses).filter(
      (status) => status === "RUNNING",
    ).length,
  });
});

// POST /api/offensive-tools/target - تعيين الهدف
router.post("/offensive-tools/target", (req, res) => {
  const { target } = req.body;

  if (!target) {
    return res.status(400).json({ error: "Target is required" });
  }

  currentTarget = target;

  // حفظ الهدف في ملف
  const targetFile = path.join(process.cwd(), "target.txt");
  fs.writeFileSync(targetFile, target);

  res.json({
    success: true,
    target: currentTarget,
    message: "Target configured successfully",
  });
});

// GET /api/offensive-tools/target - الحصول على الهدف الحالي
router.get("/offensive-tools/target", (req, res) => {
  res.json({
    target: currentTarget,
    isConfigured: !!currentTarget,
  });
});

// POST /api/offensive-tools/:toolName/run - تشغيل أداة هجومية
router.post("/offensive-tools/:toolName/run", async (req, res) => {
  const { toolName } = req.params;
  const parameters = req.body;

  if (!offensiveTools.includes(toolName)) {
    return res.status(404).json({ error: "Tool not found" });
  }

  if (toolStatuses[toolName] === "DISABLED") {
    return res.status(403).json({
      error: "Tool is disabled for security reasons",
      tool: toolName,
      status: "DISABLED",
    });
  }

  if (toolStatuses[toolName] === "RUNNING") {
    return res.status(409).json({
      error: "Tool is already running",
      tool: toolName,
      status: "RUNNING",
    });
  }

  try {
    // تحديث حالة الأداة
    toolStatuses[toolName] = "RUNNING";

    const result = await executeOffensiveTool(toolName, parameters);

    // تحديث الحالة بناءً على النتيجة
    toolStatuses[toolName] = result.status === "ERROR" ? "ERROR" : "COMPLETED";

    res.json({
      success: true,
      tool: toolName,
      status: toolStatuses[toolName],
      result: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    toolStatuses[toolName] = "ERROR";

    res.status(500).json({
      success: false,
      tool: toolName,
      status: "ERROR",
      error: error.error || error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/offensive-tools/:toolName/status - حالة أداة هجومية
router.get("/offensive-tools/:toolName/status", (req, res) => {
  const { toolName } = req.params;

  if (!offensiveTools.includes(toolName)) {
    return res.status(404).json({ error: "Tool not found" });
  }

  // قراءة ملف الحالة إذا كان موجوداً
  const statusFile = path.join(
    process.cwd(),
    "microservices",
    "offensive-tools",
    toolName,
    "status.json",
  );

  let detailedStatus = {};
  if (fs.existsSync(statusFile)) {
    try {
      detailedStatus = JSON.parse(fs.readFileSync(statusFile, "utf8"));
    } catch (error) {
      console.error(`Error reading status file for ${toolName}:`, error);
    }
  }

  res.json({
    tool: toolName,
    status: toolStatuses[toolName],
    lastUpdate: new Date().toISOString(),
    currentTarget: currentTarget,
    ...detailedStatus,
  });
});

// GET /api/offensive-tools/:toolName/settings - إعدادات أداة هجومية
router.get("/offensive-tools/:toolName/settings", (req, res) => {
  const { toolName } = req.params;

  if (!offensiveTools.includes(toolName)) {
    return res.status(404).json({ error: "Tool not found" });
  }

  const settingsFile = path.join(
    process.cwd(),
    "microservices",
    "offensive-tools",
    toolName,
    "settings.json",
  );

  if (fs.existsSync(settingsFile)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to read settings file" });
    }
  } else {
    res.json({
      tool: toolName,
      message: "No settings file found",
      defaultSettings: {
        timeout: 300,
        outputDir: `results/offensive/${toolName}`,
        enabled: true,
      },
    });
  }
});

// POST /api/offensive-tools/:toolName/settings - تحديث إعدادات أداة
router.post("/offensive-tools/:toolName/settings", (req, res) => {
  const { toolName } = req.params;
  const newSettings = req.body;

  if (!offensiveTools.includes(toolName)) {
    return res.status(404).json({ error: "Tool not found" });
  }

  const settingsFile = path.join(
    process.cwd(),
    "microservices",
    "offensive-tools",
    toolName,
    "settings.json",
  );

  try {
    // إنشاء مجلد الأداة إذا لم يكن موجوداً
    const toolDir = path.dirname(settingsFile);
    if (!fs.existsSync(toolDir)) {
      fs.mkdirSync(toolDir, { recursive: true });
    }

    fs.writeFileSync(settingsFile, JSON.stringify(newSettings, null, 2));

    res.json({
      success: true,
      tool: toolName,
      message: "Settings updated successfully",
      settings: newSettings,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update settings",
      details: error.message,
    });
  }
});

// POST /api/offensive-tools/reset - إعادة تعيين حالة جميع الأدوات
router.post("/offensive-tools/reset", (req, res) => {
  // إعادة تعيين جميع الحالات إلى READY عدا المعطلة
  Object.keys(toolStatuses).forEach((tool) => {
    if (toolStatuses[tool] !== "DISABLED") {
      toolStatuses[tool] = "READY";
    }
  });

  res.json({
    success: true,
    message: "All tool statuses reset to READY",
    statuses: toolStatuses,
  });
});

// GET /api/offensive-tools/results - الحصول على نتائج الأدوات
router.get("/offensive-tools/results", (req, res) => {
  const resultsDir = path.join(process.cwd(), "results", "offensive");

  if (!fs.existsSync(resultsDir)) {
    return res.json({
      message: "No results directory found",
      results: [],
    });
  }

  try {
    const results = [];
    const toolDirs = fs
      .readdirSync(resultsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const toolDir of toolDirs) {
      const toolPath = path.join(resultsDir, toolDir);
      const files = fs.readdirSync(toolPath);

      results.push({
        tool: toolDir,
        fileCount: files.length,
        files: files.map((file) => ({
          name: file,
          path: path.join(toolPath, file),
          size: fs.statSync(path.join(toolPath, file)).size,
          modified: fs.statSync(path.join(toolPath, file)).mtime,
        })),
      });
    }

    res.json({
      success: true,
      resultsDirectory: resultsDir,
      results: results,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to read results directory",
      details: error.message,
    });
  }
});

export default router;
