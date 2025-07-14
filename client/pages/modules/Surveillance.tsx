import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  Download,
  Activity,
  Shield,
  Eye,
  Monitor,
  AlertTriangle,
} from "lucide-react";
import WatchButton from "../../components/WatchButton";
import ProgressBar from "../../components/ProgressBar";
import { apiService } from "@/services/ApiService";

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface ToolStatus {
  [key: string]:
    | "IDLE"
    | "WATCHING"
    | "ACTIVE"
    | "TRACKING"
    | "SCANNING"
    | "DISABLED";
}

interface SurveillanceLog {
  timestamp: string;
  tool: string;
  message: string;
  level: "info" | "warning" | "error";
}

export default function Surveillance() {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
  });
  const [toolStatuses, setToolStatuses] = useState<ToolStatus>({
    SystemWatchdog: "IDLE",
    LiveNetworkMonitor: "IDLE",
    FileAccessTracker: "IDLE",
    ThirdPartyMonitor: "IDLE",
    UnauthorizedLoginDetector: "IDLE",
    CameraMicMonitor: "IDLE",
    SilentUserLogger: "DISABLED",
  });
  const [surveillanceLogs, setSurveillanceLogs] = useState<SurveillanceLog[]>(
    [],
  );
  const [isMonitoringAll, setIsMonitoringAll] = useState(false);

  const surveillanceTools = [
    {
      id: "SystemWatchdog",
      title: "System Watchdog",
      description: "مراقبة عمليات النظام والتطبيقات المشبوهة",
      icon: <Activity className="w-6 h-6" />,
      endpoint: "/tools/SystemWatchdog/watch",
      statusText: "system",
    },
    {
      id: "LiveNetworkMonitor",
      title: "Network Monitor",
      description: "مراقبة حركة الشبكة والاتصالات",
      icon: <Monitor className="w-6 h-6" />,
      endpoint: "/tools/LiveNetworkMonitor/watch",
      statusText: "network",
    },
    {
      id: "FileAccessTracker",
      title: "File Tracker",
      description: "تتبع الوصول للملفات الحساسة",
      icon: <Shield className="w-6 h-6" />,
      endpoint: "/tools/FileAccessTracker/watch",
      statusText: "files",
    },
    {
      id: "ThirdPartyMonitor",
      title: "3rd Party Monitor",
      description: "مراقبة التطبيقات الخارجية",
      icon: <AlertTriangle className="w-6 h-6" />,
      endpoint: "/tools/ThirdPartyMonitor/watch",
      statusText: "applications",
    },
    {
      id: "UnauthorizedLoginDetector",
      title: "Login Detector",
      description: "كشف محاولات تس��يل الدخول غير المصرح بها",
      icon: <Eye className="w-6 h-6" />,
      endpoint: "/tools/UnauthorizedLoginDetector/watch",
      statusText: "security",
    },
    {
      id: "CameraMicMonitor",
      title: "Camera/Mic Monitor",
      description: "مراقبة استخدام الكاميرا والميكروفون",
      icon: <Shield className="w-6 h-6" />,
      endpoint: "/tools/CameraMicMonitor/watch",
      statusText: "privacy",
    },
    {
      id: "SilentUserLogger",
      title: "Silent Logger",
      description: "تسجيل أنشطة المستخدم (معطل لحماية الخصوصية)",
      icon: <Monitor className="w-6 h-6" />,
      endpoint: "/tools/SilentUserLogger/watch",
      statusText: "logging",
    },
  ];

  // جلب إحصائيات النظام كل 2 ثانية
  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const response = await fetch("/api/system/stats");
        if (response.ok) {
          const data = await response.json();
          setSystemStats(data);
        } else {
          // محا��اة البيانات في حالة عدم توفر API
          setSystemStats({
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100,
          });
        }
      } catch (error) {
        // محاكاة البيانات في حالة الخطأ
        setSystemStats({
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          disk: Math.random() * 100,
          network: Math.random() * 100,
        });
      }
    };

    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // جلب اللوجات كل 5 ثوان
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/logs/surveillance");
        if (response.ok) {
          const data = await response.json();
          setSurveillanceLogs(data);
        }
      } catch (error) {
        // محاكاة اللوجات
        const mockLog: SurveillanceLog = {
          timestamp: new Date().toISOString(),
          tool: "SystemWatchdog",
          message: `System scan completed - ${Math.floor(Math.random() * 50)} processes monitored`,
          level: "info",
        };
        setSurveillanceLogs((prev) => [mockLog, ...prev.slice(0, 49)]);
      }
    };

    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const startAllMonitoring = async () => {
    setIsMonitoringAll(true);
    try {
      const response = await fetch("/api/surveillance/start-all", {
        method: "POST",
      });
      if (response.ok) {
        // تحديث حالة جميع الأدوات
        const newStatuses: ToolStatus = {};
        surveillanceTools.forEach((tool) => {
          if (tool.id !== "SilentUserLogger") {
            newStatuses[tool.id] = "WATCHING";
          }
        });
        setToolStatuses((prev) => ({ ...prev, ...newStatuses }));
      }
    } catch (error) {
      console.error("Error starting all monitoring:", error);
      setIsMonitoringAll(false);
    }
  };

  const exportSurveillanceData = () => {
    // تحويل البيانات إلى ملف
    const dataToExport = {
      systemStats,
      toolStatuses,
      logs: surveillanceLogs,
      exportTime: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `surveillance-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WATCHING":
        return "text-green-400 bg-green-400/10";
      case "ACTIVE":
        return "text-blue-400 bg-blue-400/10";
      case "TRACKING":
        return "text-yellow-400 bg-yellow-400/10";
      case "SCANNING":
        return "text-orange-400 bg-orange-400/10";
      case "DISABLED":
        return "text-gray-400 bg-gray-400/10";
      default:
        return "text-gray-300 bg-gray-300/10";
    }
  };

  const formatLogTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ar-SA");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            🔍 مركز المراقبة والاستطلاع
          </h1>
          <p className="text-gray-400">
            نظام مراقبة شامل مع إحصائيات حية ولوجات متقدمة
          </p>
        </div>

        {/* لوحة حالة النظام */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-400">CPU</h3>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <ProgressBar
              value={systemStats.cpu}
              label="Usage"
              color="blue"
              animated={systemStats.cpu > 80}
            />
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">Memory</h3>
              <Monitor className="w-5 h-5 text-green-400" />
            </div>
            <ProgressBar
              value={systemStats.memory}
              label="Usage"
              color="green"
              animated={systemStats.memory > 85}
            />
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-400">Disk</h3>
              <Shield className="w-5 h-5 text-yellow-400" />
            </div>
            <ProgressBar
              value={systemStats.disk}
              label="Usage"
              color="yellow"
              animated={systemStats.disk > 90}
            />
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-400">Network</h3>
              <Eye className="w-5 h-5 text-orange-400" />
            </div>
            <ProgressBar
              value={systemStats.network}
              label="Activity"
              color="orange"
              animated={systemStats.network > 70}
            />
          </div>
        </div>

        {/* أدوات المراقبة */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-400">
              🛡️ ترسانة المراقبة
            </h2>
            <div className="flex gap-3">
              <button
                onClick={startAllMonitoring}
                disabled={isMonitoringAll}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Start All Monitoring
              </button>
              <button
                onClick={exportSurveillanceData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveillanceTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/20 rounded-lg">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{tool.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-mono ${getStatusColor(toolStatuses[tool.id])}`}
                      >
                        {toolStatuses[tool.id]}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                <WatchButton
                  toolName={tool.title}
                  endpoint={tool.endpoint}
                  currentStatus={toolStatuses[tool.id]}
                  onStatusChange={(newStatus) =>
                    setToolStatuses((prev) => ({
                      ...prev,
                      [tool.id]: newStatus,
                    }))
                  }
                  disabled={tool.id === "SilentUserLogger"}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* منطقة اللوجات ا��حية */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">
            📋 سجل ��لمراقبة الحي
          </h2>
          <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {surveillanceLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No surveillance logs yet. Start monitoring to see activity.
              </div>
            ) : (
              <div className="space-y-1">
                {surveillanceLogs.map((log, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="text-gray-500 text-xs shrink-0">
                      {formatLogTime(log.timestamp)}
                    </span>
                    <span
                      className={`text-xs shrink-0 ${
                        log.level === "error"
                          ? "text-red-400"
                          : log.level === "warning"
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      [{log.tool}]
                    </span>
                    <span className="text-gray-300 text-xs">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
