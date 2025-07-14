import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ModuleDashboard from "@/components/ModuleDashboard";
import ToolExecutionPanel from "@/components/ToolExecutionPanel";

interface Tool {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: string;
  riskLevel: string;
  enabled: boolean;
  realtime: boolean;
  status?: "idle" | "running" | "completed" | "failed";
  lastRun?: Date;
  executionTime?: string;
  output?: string;
}

interface ToolExecution {
  id: string;
  toolId: string;
  toolName: string;
  status: "idle" | "running" | "completed" | "failed" | "cancelled";
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  progress: number;
  result?: any;
  logs: Array<{
    timestamp: Date;
    level: "info" | "warning" | "error" | "success";
    message: string;
    data?: any;
  }>;
  outputType: "text" | "json" | "table" | "chart" | "file";
}

export default function DefensiveOpsEnhanced() {
  const { t, language, isRTL } = useLanguage();
  const [runningExecutions, setRunningExecutions] = useState<ToolExecution[]>(
    [],
  );

  // بيانات الأدوات الدفاعية
  const defensiveTools: Tool[] = [
    {
      id: "def_001",
      name: "فحص الخدمات النشطة",
      nameEn: "Active Services Scanner",
      description:
        "فحص ومراقبة جميع الخدمات النشطة في النظام للكشف عن التهديدات",
      category: "monitoring",
      riskLevel: "low",
      enabled: true,
      realtime: true,
      status: "idle",
      executionTime: "2-5 seconds",
    },
    {
      id: "def_002",
      name: "حماية منافذ النظام",
      nameEn: "Ports Shield",
      description: "حماية ومراقبة منافذ الشبكة من التهديدات والاختراقات",
      category: "network",
      riskLevel: "medium",
      enabled: true,
      realtime: true,
      status: "idle",
      executionTime: "5-10 seconds",
    },
    {
      id: "def_003",
      name: "تحليل العمليات الجارية",
      nameEn: "Process Monitor",
      description:
        "مراقبة وتحليل العمليات الجارية في النظام للكشف عن الأنشطة المشبوهة",
      category: "monitoring",
      riskLevel: "low",
      enabled: true,
      realtime: true,
      status: "idle",
      executionTime: "3-7 seconds",
    },
    {
      id: "def_004",
      name: "منع البرمجيات الضارة",
      nameEn: "Real-time Blocker",
      description:
        "منع وحظر البرمجيات الضارة في الوقت الفعلي باستخدام تقنيات متقدمة",
      category: "security",
      riskLevel: "high",
      enabled: true,
      realtime: true,
      status: "idle",
      executionTime: "10-15 seconds",
    },
    {
      id: "def_005",
      name: "إدارة كلمات المرور",
      nameEn: "VaultPass™",
      description: "إدارة آمنة لكلمات المرور والمفاتيح مع تشفير متقدم",
      category: "security",
      riskLevel: "critical",
      enabled: true,
      realtime: false,
      status: "idle",
      executionTime: "5-8 seconds",
    },
    {
      id: "def_006",
      name: "تشفير التقارير والمجلدات",
      nameEn: "AES512 Encryption",
      description:
        "تشفير متقدم للملفات والمجلدات باستخدام AES-512 وخوارزميات محسنة",
      category: "encryption",
      riskLevel: "medium",
      enabled: true,
      realtime: false,
      status: "idle",
      executionTime: "15-30 seconds",
    },
    {
      id: "def_007",
      name: "نظام تنبيه مباشر عند التهديد",
      nameEn: "Sentinel Alerts",
      description: "نظام إنذار فوري عند اكتشاف التهديدات مع تحليل متقدم",
      category: "monitoring",
      riskLevel: "high",
      enabled: true,
      realtime: true,
      status: "idle",
      executionTime: "5-12 seconds",
    },
  ];

  // تنفيذ أداة
  const handleExecuteTool = async (toolId: string) => {
    const tool = defensiveTools.find((t) => t.id === toolId);
    if (!tool) return;

    const execution: ToolExecution = {
      id: `exec_${Date.now()}`,
      toolId,
      toolName: language === "ar" ? tool.name : tool.nameEn,
      status: "running",
      startTime: new Date(),
      progress: 0,
      logs: [
        {
          timestamp: new Date(),
          level: "info",
          message: `Starting ${tool.nameEn}...`,
        },
      ],
      outputType: "text",
    };

    setRunningExecutions((prev) => [...prev, execution]);

    // محاكاة تقدم التنفيذ
    simulateExecution(execution.id, tool);
  };

  // محاكاة تنفيذ الأداة
  const simulateExecution = (executionId: string, tool: Tool) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;

      setRunningExecutions((prev) =>
        prev.map((exec) => {
          if (exec.id === executionId) {
            const newLogs = [...exec.logs];

            // إضافة رسائل السجل التدريجية
            if (progress > 25 && newLogs.length === 1) {
              newLogs.push({
                timestamp: new Date(),
                level: "info",
                message: "Initializing security protocols...",
              });
            }
            if (progress > 50 && newLogs.length === 2) {
              newLogs.push({
                timestamp: new Date(),
                level: "success",
                message: "Security scan in progress...",
              });
            }
            if (progress > 75 && newLogs.length === 3) {
              newLogs.push({
                timestamp: new Date(),
                level: "info",
                message: "Analyzing results...",
              });
            }

            if (progress >= 100) {
              clearInterval(interval);
              return {
                ...exec,
                status: "completed" as const,
                progress: 100,
                endTime: new Date(),
                duration: Date.now() - (exec.startTime?.getTime() || 0),
                result: generateMockResult(tool),
                logs: [
                  ...newLogs,
                  {
                    timestamp: new Date(),
                    level: "success",
                    message: `${tool.nameEn} completed successfully`,
                  },
                ],
              };
            }

            return {
              ...exec,
              progress: Math.min(progress, 100),
              logs: newLogs,
            };
          }
          return exec;
        }),
      );
    }, 300);
  };

  // توليد نتائج وهمية
  const generateMockResult = (tool: Tool) => {
    switch (tool.category) {
      case "monitoring":
        return [
          { service: "Windows Security", status: "Running", pid: 1234 },
          { service: "Windows Defender", status: "Running", pid: 5678 },
          { service: "System Guard", status: "Running", pid: 9012 },
        ];
      case "network":
        return [
          { port: 80, protocol: "TCP", status: "LISTENING", process: "httpd" },
          { port: 443, protocol: "TCP", status: "LISTENING", process: "httpd" },
          { port: 22, protocol: "TCP", status: "LISTENING", process: "sshd" },
        ];
      case "security":
        return {
          threats_detected: 0,
          files_scanned: 12847,
          quarantined: 0,
          last_scan: new Date().toISOString(),
        };
      default:
        return `Tool ${tool.nameEn} executed successfully at ${new Date().toLocaleTimeString()}`;
    }
  };

  // إيقاف تنفيذ أداة
  const handleStopTool = (executionId: string) => {
    setRunningExecutions((prev) =>
      prev.map((exec) =>
        exec.id === executionId
          ? {
              ...exec,
              status: "cancelled" as const,
              endTime: new Date(),
              logs: [
                ...exec.logs,
                {
                  timestamp: new Date(),
                  level: "warning",
                  message: "Execution cancelled by user",
                },
              ],
            }
          : exec,
      ),
    );
  };

  // إعادة تشغيل أداة
  const handleRestartTool = (toolId: string) => {
    handleExecuteTool(toolId);
  };

  // إعداد أداة
  const handleConfigureTool = (toolId: string) => {
    console.log("Configure tool:", toolId);
    // يمكن إضافة نافذة إعدادات هنا
  };

  // تحميل النتائج
  const handleDownloadResults = (execution: ToolExecution) => {
    const dataStr = JSON.stringify(execution.result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${execution.toolName}_results.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-foreground">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/20"></div>

      {/* Header */}
      <header className="relative z-40 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link
              to="/"
              className={`flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 px-3 py-2 rounded-lg transition-all ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              {t("general.back")}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-8">
            {/* Module Dashboard */}
            <ModuleDashboard
              moduleId={1}
              moduleName="العمليات الدفاعية"
              moduleNameEn="Defensive Ops"
              moduleColor="#10b981"
              tools={defensiveTools}
              onExecuteTool={handleExecuteTool}
              onStopTool={(toolId) => {
                const execution = runningExecutions.find(
                  (e) => e.toolId === toolId && e.status === "running",
                );
                if (execution) handleStopTool(execution.id);
              }}
              onConfigureTool={handleConfigureTool}
            />

            {/* Running Executions */}
            {runningExecutions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t("dashboard.running_tools")} ({runningExecutions.length})
                </h2>
                <div className="space-y-3">
                  {runningExecutions.map((execution) => (
                    <ToolExecutionPanel
                      key={execution.id}
                      execution={execution}
                      onStop={() => handleStopTool(execution.id)}
                      onRestart={() => handleRestartTool(execution.toolId)}
                      onDownload={() => handleDownloadResults(execution)}
                      expanded={execution.status === "running"}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
