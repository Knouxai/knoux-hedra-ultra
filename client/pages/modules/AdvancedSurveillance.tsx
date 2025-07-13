import React, { useState, useEffect } from "react";
import {
  Activity,
  Shield,
  Eye,
  Monitor,
  AlertTriangle,
  Camera,
  Mic,
  Server,
  Network,
  Play,
  Square,
  Settings as SettingsIcon,
  Download,
  Bell,
  BellOff,
  Filter,
  Search,
  RefreshCw,
  Zap,
} from "lucide-react";
import AdvancedToolCard from "../../components/AdvancedToolCard";
import { usePermissions } from "../../services/PermissionService";
import io, { Socket } from "socket.io-client";

interface LiveAlert {
  id: string;
  type: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: string;
  processes: number;
  connections: number;
}

interface ToolMetrics {
  alertsCount: number;
  lastActivity: string;
  uptime: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dataProcessed: string;
}

export default function AdvancedSurveillance() {
  const { user, hasPermission } = usePermissions();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    timestamp: "",
    processes: 0,
    connections: 0,
  });

  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [toolStatuses, setToolStatuses] = useState<Record<string, string>>({});
  const [toolMetrics, setToolMetrics] = useState<Record<string, ToolMetrics>>(
    {},
  );
  const [alertFilter, setAlertFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [idsRunning, setIdsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // أدوات المراقبة المحدثة
  const surveillanceTools = [
    {
      id: "SystemWatchdog",
      name: "System Watchdog",
      description:
        "مراقبة شاملة لعمليات النظام والأنشطة المشبوهة مع كشف الثغرات",
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      category: "System Monitoring",
      riskLevel: "MEDIUM" as const,
    },
    {
      id: "LiveNetworkMonitor",
      name: "Network Monitor",
      description: "مراقبة حركة الشبكة والكشف عن التسلل والهجمات السيبرانية",
      icon: <Network className="w-6 h-6 text-green-400" />,
      category: "Network Security",
      riskLevel: "HIGH" as const,
    },
    {
      id: "FileAccessTracker",
      name: "File Access Tracker",
      description: "تتبع دقيق للوصول إلى الملفات الحساسة وكشف التلاعب",
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      category: "Data Protection",
      riskLevel: "HIGH" as const,
    },
    {
      id: "ThirdPartyMonitor",
      name: "Application Monitor",
      description: "مراقبة التطبيقات الخارجية وكشف البرمجيات الخبيثة",
      icon: <Monitor className="w-6 h-6 text-orange-400" />,
      category: "Application Security",
      riskLevel: "MEDIUM" as const,
    },
    {
      id: "UnauthorizedLoginDetector",
      name: "Login Detector",
      description: "كشف متقدم لمحاولات تسجيل الدخول غير المصرح بها والهجمات",
      icon: <Eye className="w-6 h-6 text-red-400" />,
      category: "Access Control",
      riskLevel: "CRITICAL" as const,
    },
    {
      id: "CameraMicMonitor",
      name: "Privacy Monitor",
      description: "مراقبة استخدام الكاميرا والميكروفون لحماية الخصوصية",
      icon: <Camera className="w-6 h-6 text-pink-400" />,
      category: "Privacy Protection",
      riskLevel: "HIGH" as const,
    },
    {
      id: "SilentUserLogger",
      name: "Behavior Analyzer",
      description:
        "تحليل سلوك المستخدم وكشف الأنماط غير الطبيعية (معطل افتراضياً)",
      icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
      category: "Behavioral Analysis",
      riskLevel: "CRITICAL" as const,
    },
  ];

  // اتصال WebSocket
  useEffect(() => {
    const socketConnection = io(window.location.origin);
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Connected to WebSocket");
      socketConnection.emit("subscribe_to_alerts", {
        alertTypes: ["surveillance_alert", "ids_alert", "security_event"],
        severity: "all",
      });
    });

    socketConnection.on("live_update", (update) => {
      handleLiveUpdate(update);
    });

    socketConnection.on("system_stats", (stats) => {
      setSystemStats(stats);
    });

    socketConnection.on("ids_status", (status) => {
      setIdsRunning(status.isRunning);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // معالجة التحديثات المباشرة
  const handleLiveUpdate = (update: any) => {
    if (update.type === "surveillance_alert" || update.type === "ids_alert") {
      const newAlert: LiveAlert = {
        id: update.data.id || Date.now().toString(),
        type: update.type,
        message: update.data.message || update.data.signature,
        severity: update.severity,
        timestamp: update.timestamp,
        source: update.source,
        acknowledged: false,
      };

      setLiveAlerts((prev) => [newAlert, ...prev.slice(0, 99)]);

      // تشغيل صوت التنبيه
      if (audioEnabled && update.severity !== "LOW") {
        playAlertSound(update.severity);
      }
    }

    if (update.type === "tool_status") {
      setToolStatuses((prev) => ({
        ...prev,
        [update.data.toolName]: update.data.status,
      }));
    }
  };

  // تشغيل صوت التنبيه
  const playAlertSound = (severity: string) => {
    try {
      const audio = new Audio();
      audio.volume = 0.3;

      switch (severity) {
        case "CRITICAL":
          audio.src =
            "data:audio/wav;base64,UklGRvI/AABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAAC..."; // صوت إنذار حرج
          break;
        case "HIGH":
          audio.src =
            "data:audio/wav;base64,UklGRvI/AABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAAC..."; // صوت تنبيه عالي
          break;
        default:
          audio.src =
            "data:audio/wav;base64,UklGRvI/AABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAAC..."; // صوت تنبيه عادي
      }

      audio.play().catch(() => {
        // تجاهل أخطاء التشغيل
      });
    } catch (error) {
      console.error("Error playing alert sound:", error);
    }
  };

  // بدء أداة المراقبة
  const startTool = async (toolId: string) => {
    if (!hasPermission("surveillance.start")) {
      alert("Access denied: Insufficient permissions");
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/watch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });

      if (response.ok) {
        setToolStatuses((prev) => ({ ...prev, [toolId]: "WATCHING" }));
      }
    } catch (error) {
      console.error(`Error starting ${toolId}:`, error);
    }
  };

  // إيقاف أداة المراقبة
  const stopTool = async (toolId: string) => {
    if (!hasPermission("surveillance.stop")) {
      alert("Access denied: Insufficient permissions");
      return;
    }

    try {
      const response = await fetch(`/api/tools/${toolId}/watch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });

      if (response.ok) {
        setToolStatuses((prev) => ({ ...prev, [toolId]: "IDLE" }));
      }
    } catch (error) {
      console.error(`Error stopping ${toolId}:`, error);
    }
  };

  // بدء/إيقاف IDS
  const toggleIDS = () => {
    if (!hasPermission("surveillance.configure")) {
      alert("Access denied: Insufficient permissions");
      return;
    }

    if (socket) {
      if (idsRunning) {
        socket.emit("stop_ids");
      } else {
        socket.emit("start_ids");
      }
    }
  };

  // تأكيد التنبيه
  const acknowledgeAlert = (alertId: string) => {
    setLiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert,
      ),
    );

    if (socket) {
      socket.emit("acknowledge_alert", alertId);
    }
  };

  // تصفية التنبيهات
  const filteredAlerts = liveAlerts.filter((alert) => {
    const matchesFilter =
      alertFilter === "all" || alert.severity === alertFilter;
    const matchesSearch =
      searchTerm === "" ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // حساب مستوى التهديد العام
  const getOverallThreatLevel = (): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" => {
    const recentAlerts = liveAlerts.slice(0, 10);
    const criticalCount = recentAlerts.filter(
      (a) => a.severity === "CRITICAL",
    ).length;
    const highCount = recentAlerts.filter((a) => a.severity === "HIGH").length;

    if (criticalCount > 0) return "CRITICAL";
    if (highCount > 2) return "HIGH";
    if (recentAlerts.length > 5) return "MEDIUM";
    return "LOW";
  };

  const overallThreatLevel = getOverallThreatLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                🛡️ Advanced Surveillance Center
              </h1>
              <p className="text-gray-400">
                Comprehensive security monitoring with real-time threat
                detection
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* مؤشر مستوى التهديد العام */}
              <div
                className={`
                px-4 py-2 rounded-lg backdrop-blur-sm border font-bold
                ${
                  overallThreatLevel === "CRITICAL"
                    ? "bg-red-500/20 border-red-400/50 text-red-300"
                    : overallThreatLevel === "HIGH"
                      ? "bg-orange-500/20 border-orange-400/50 text-orange-300"
                      : overallThreatLevel === "MEDIUM"
                        ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-300"
                        : "bg-green-500/20 border-green-400/50 text-green-300"
                }
              `}
              >
                Threat Level: {overallThreatLevel}
              </div>

              {/* زر IDS */}
              <button
                onClick={toggleIDS}
                disabled={!hasPermission("surveillance.configure")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm border transition-all
                  ${
                    idsRunning
                      ? "bg-green-500/20 border-green-400/50 text-green-300"
                      : "bg-gray-500/20 border-gray-400/50 text-gray-300"
                  }
                  ${
                    hasPermission("surveillance.configure")
                      ? "hover:scale-105 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <Zap className="w-4 h-4" />
                IDS {idsRunning ? "Running" : "Stopped"}
              </button>

              {/* زر الصوت */}
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`
                  p-2 rounded-lg backdrop-blur-sm border transition-all
                  ${
                    audioEnabled
                      ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                      : "bg-gray-500/20 border-gray-400/50 text-gray-400"
                  }
                `}
              >
                {audioEnabled ? (
                  <Bell className="w-4 h-4" />
                ) : (
                  <BellOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* System Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-400">CPU</h3>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {systemStats.cpu.toFixed(1)}%
            </div>
            <div className="w-full bg-blue-900/30 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(systemStats.cpu, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">Memory</h3>
              <Server className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {systemStats.memory.toFixed(1)}%
            </div>
            <div className="w-full bg-green-900/30 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(systemStats.memory, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">Network</h3>
              <Network className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {systemStats.connections}
            </div>
            <div className="text-sm text-gray-400">Active Connections</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-400">Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {liveAlerts.length}
            </div>
            <div className="text-sm text-gray-400">Recent Alerts</div>
          </div>
        </div>

        {/* Surveillance Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            🔍 Surveillance Arsenal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveillanceTools.map((tool) => (
              <AdvancedToolCard
                key={tool.id}
                tool={tool}
                status={
                  (toolStatuses[tool.id] as any) ||
                  (tool.id === "SilentUserLogger" ? "DISABLED" : "IDLE")
                }
                metrics={{
                  alertsCount: Math.floor(Math.random() * 20),
                  lastActivity: "2 minutes ago",
                  uptime: Math.floor(Math.random() * 3600),
                  threatLevel: ["LOW", "MEDIUM", "HIGH", "CRITICAL"][
                    Math.floor(Math.random() * 4)
                  ] as any,
                  dataProcessed: `${Math.floor(Math.random() * 100)}MB`,
                }}
                permissions={{
                  canStart: hasPermission("surveillance.start"),
                  canStop: hasPermission("surveillance.stop"),
                  canConfigure: hasPermission("surveillance.configure"),
                  canViewReports: hasPermission("surveillance.view_reports"),
                }}
                onStart={() => startTool(tool.id)}
                onStop={() => stopTool(tool.id)}
                onConfigure={() => setShowSettings(true)}
                onViewReports={() => {
                  /* Handle reports */
                }}
                onToggleAudio={() => setAudioEnabled(!audioEnabled)}
                audioEnabled={audioEnabled}
              />
            ))}
          </div>
        </div>

        {/* Live Alerts Panel */}
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-400">
              📡 Live Security Feed
            </h2>

            <div className="flex items-center gap-4">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-black/30 backdrop-blur-sm border border-purple-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* التصفية */}
              <select
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 backdrop-blur-sm border border-purple-400/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No alerts match your current filters
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`
                    p-4 rounded-lg backdrop-blur-sm border transition-all duration-200
                    ${
                      alert.acknowledged
                        ? "bg-gray-500/10 border-gray-400/30 opacity-60"
                        : alert.severity === "CRITICAL"
                          ? "bg-red-500/20 border-red-400/50 animate-pulse"
                          : alert.severity === "HIGH"
                            ? "bg-orange-500/20 border-orange-400/50"
                            : alert.severity === "MEDIUM"
                              ? "bg-yellow-500/20 border-yellow-400/50"
                              : "bg-blue-500/20 border-blue-400/50"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`
                            px-2 py-1 rounded-full text-xs font-bold
                            ${
                              alert.severity === "CRITICAL"
                                ? "bg-red-500/30 text-red-300"
                                : alert.severity === "HIGH"
                                  ? "bg-orange-500/30 text-orange-300"
                                  : alert.severity === "MEDIUM"
                                    ? "bg-yellow-500/30 text-yellow-300"
                                    : "bg-blue-500/30 text-blue-300"
                            }
                          `}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-400">
                          {alert.source}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white">{alert.message}</p>
                    </div>

                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="ml-4 px-3 py-1 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded hover:bg-purple-400/30 transition-colors text-sm"
                      >
                        ACK
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
