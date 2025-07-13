import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  Monitor,
  Activity,
  FileText,
  Users,
  Camera,
  Mic,
  Shield,
  AlertTriangle,
  Network,
  HardDrive,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Surveillance() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45,
    memoryUsage: 68,
    networkActivity: 23,
    diskUsage: 78,
  });
  const [surveillanceData, setSurveillanceData] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    const newData = {
      id: Date.now(),
      timestamp: new Date(),
      type: "system_activity",
      details: "System monitoring started - tracking all activities",
      status: "active",
    };
    setSurveillanceData((prev) => [newData, ...prev]);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    const newData = {
      id: Date.now(),
      timestamp: new Date(),
      type: "system_activity",
      details: "System monitoring stopped",
      status: "stopped",
    };
    setSurveillanceData((prev) => [newData, ...prev]);
  };

  // Simulate real-time system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpuUsage: Math.max(0, Math.min(100, 45 + (Math.random() - 0.5) * 20)),
        memoryUsage: Math.max(
          0,
          Math.min(100, 68 + (Math.random() - 0.5) * 15),
        ),
        networkActivity: Math.max(
          0,
          Math.min(100, 23 + (Math.random() - 0.5) * 30),
        ),
        diskUsage: Math.max(0, Math.min(100, 78 + (Math.random() - 0.5) * 5)),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const surveillanceTools = [
    {
      id: "system-watchdog",
      name: "System Watchdog",
      nameAr: "مراقبة النظام بالكامل",
      icon: Monitor,
      description: "Comprehensive system activity monitoring",
      status: "MONITORING",
      emoji: "👁️",
      category: "system",
    },
    {
      id: "network-monitor",
      name: "Live Network Monitor",
      nameAr: "مراقبة الشبكة الحية",
      icon: Network,
      description: "Real-time network traffic monitoring",
      status: "ACTIVE",
      emoji: "🌐",
      category: "network",
    },
    {
      id: "file-tracker",
      name: "File Access Tracker",
      nameAr: "تتبع فتح الملفات / السجلات",
      icon: FileText,
      description: "File and log access tracking",
      status: "TRACKING",
      emoji: "📁",
      category: "files",
    },
    {
      id: "third-party-monitor",
      name: "3rd Party Monitor",
      nameAr: "مراقبة أدوات الطرف الثالث",
      icon: Shield,
      description: "Third-party application monitoring",
      status: "ACTIVE",
      emoji: "🔍",
      category: "applications",
    },
    {
      id: "login-detector",
      name: "Unauthorized Login Detector",
      nameAr: "كشف محاولات الدخول الغير مصرح",
      icon: Users,
      description: "Unauthorized login attempt detection",
      status: "SCANNING",
      emoji: "🚨",
      category: "security",
    },
    {
      id: "camera-monitor",
      name: "Camera/Mic Monitor",
      nameAr: "مراقبة الكاميرا/الميكروفون",
      icon: Camera,
      description: "Camera and microphone usage monitoring",
      status: "WATCHING",
      emoji: "📹",
      category: "privacy",
    },
    {
      id: "user-logger",
      name: "Silent User Logger",
      nameAr: "تسجيل نشاط المستخدم بصمت",
      icon: Activity,
      description: "Silent user activity logging (optional)",
      status: "DISABLED",
      emoji: "🔇",
      category: "logging",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      {/* Header */}
      <header className="p-6">
        <div className="glass-cyber rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg glass-cyber flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-cyber-neon" />
            </Link>
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center bg-yellow-400/10 border border-yellow-400">
              <Eye className="w-6 h-6 text-yellow-400 animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-yellow-400 neon-glow">
                Surveillance
              </h1>
              <p className="text-cyber-purple-light">
                قسم أدوات المراقبة - Module 3 of 7
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Module Overview */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-yellow-400">
                Surveillance Operations Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {activeTools.length}/7 WATCHERS ACTIVE
                  </span>
                </div>
                <button
                  onClick={isMonitoring ? stopMonitoring : startMonitoring}
                  className={`btn-cyber px-4 py-2 text-sm ${
                    isMonitoring ? "mode-attack" : "mode-defense"
                  }`}
                >
                  {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
                </button>
              </div>
            </div>

            {/* System Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="glass-cyber rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyber-purple-light">CPU</span>
                  <span className="text-sm font-bold text-yellow-400">
                    {systemStats.cpuUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-cyber-dark rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${systemStats.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyber-purple-light">
                    Memory
                  </span>
                  <span className="text-sm font-bold text-yellow-400">
                    {systemStats.memoryUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-cyber-dark rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${systemStats.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyber-purple-light">
                    Network
                  </span>
                  <span className="text-sm font-bold text-yellow-400">
                    {systemStats.networkActivity.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-cyber-dark rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${systemStats.networkActivity}%` }}
                  ></div>
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-cyber-purple-light">Disk</span>
                  <span className="text-sm font-bold text-yellow-400">
                    {systemStats.diskUsage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-cyber-dark rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${systemStats.diskUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">
                  WATCHING
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Surveillance Active
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Activity className="w-8 h-8 text-cyber-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyber-neon">
                  {activeTools.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Tools Active
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {surveillanceData.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Events Logged
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">
                  {isMonitoring ? "LIVE" : "PAUSED"}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Monitoring Status
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Surveillance Tools Grid */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">
                Surveillance Arsenal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {surveillanceTools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = activeTools.includes(tool.id);
                  const isDisabled = tool.status === "DISABLED";

                  return (
                    <div
                      key={tool.id}
                      className={`glass-card rounded-xl p-4 group cursor-pointer hover:scale-105 transition-all duration-300 ${
                        isDisabled ? "opacity-50" : ""
                      }`}
                      onClick={() => !isDisabled && toggleTool(tool.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform ${
                            isActive
                              ? "bg-yellow-400/20 border-yellow-400"
                              : "border-cyber-glass-border"
                          } border`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              isActive ? "text-yellow-400" : "text-cyber-neon"
                            }`}
                          />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-lg">{tool.emoji}</div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              tool.status === "MONITORING" ||
                              tool.status === "ACTIVE" ||
                              tool.status === "TRACKING" ||
                              tool.status === "SCANNING" ||
                              tool.status === "WATCHING"
                                ? "bg-green-400 animate-pulse"
                                : tool.status === "DISABLED"
                                  ? "bg-gray-400"
                                  : "bg-yellow-400"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          isActive ? "text-yellow-400" : "text-cyber-neon"
                        } mb-1`}
                      >
                        {tool.name}
                      </h4>
                      <h5 className="text-xs text-cyber-purple-light mb-2 font-mono">
                        {tool.nameAr}
                      </h5>
                      <p className="text-cyber-purple-light text-xs mb-3">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono ${
                              isActive
                                ? "text-yellow-400"
                                : "text-cyber-purple-light"
                            }`}
                          >
                            {tool.status}
                          </span>
                          <span className="text-xs px-1 py-0.5 rounded bg-cyber-glass text-cyber-purple-light">
                            {tool.category}
                          </span>
                        </div>
                        <button
                          className={`text-xs px-2 py-1 rounded-full border transition-all ${
                            isDisabled
                              ? "border-gray-600 text-gray-600 cursor-not-allowed"
                              : isActive
                                ? "bg-yellow-400/10 text-yellow-400 border-yellow-400"
                                : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400"
                          }`}
                          disabled={isDisabled}
                        >
                          {isDisabled
                            ? "DISABLED"
                            : isActive
                              ? "WATCHING"
                              : "WATCH"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Surveillance Log */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">
                Live Surveillance Log
              </h3>
              <div className="glass-card rounded-xl p-4 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3">
                  {surveillanceData.length === 0 ? (
                    <div className="text-center text-cyber-purple-light text-sm py-8">
                      No surveillance data yet
                      <br />
                      Start monitoring to see activities
                    </div>
                  ) : (
                    surveillanceData.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-cyber-glass/30 rounded-lg border border-cyber-glass-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-yellow-400">
                            {log.type}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              log.status === "active"
                                ? "bg-green-400/20 text-green-400"
                                : "bg-red-400/20 text-red-400"
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                        <p className="text-xs text-cyber-purple-light">
                          {log.details}
                        </p>
                        <div className="text-xs text-cyber-purple-light/70 mt-1">
                          {log.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => setSurveillanceData([])}
                  className="mt-4 px-3 py-2 bg-red-400/10 border border-red-400 rounded-lg text-red-400 text-sm hover:bg-red-400/20 transition-all"
                >
                  Clear Log
                </button>
              </div>
            </div>
          </div>

          {/* Quick Surveillance Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              className="btn-cyber p-4"
              style={{ color: "#f59e0b", borderColor: "#f59e0b" }}
            >
              <div className="text-center">
                <Monitor className="w-6 h-6 mx-auto mb-2" />
                <div>System Scan</div>
                <div className="text-xs opacity-70">Full system analysis</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#f59e0b", borderColor: "#f59e0b" }}
            >
              <div className="text-center">
                <Network className="w-6 h-6 mx-auto mb-2" />
                <div>Network Trace</div>
                <div className="text-xs opacity-70">Track network activity</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#f59e0b", borderColor: "#f59e0b" }}
            >
              <div className="text-center">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <div>Generate Report</div>
                <div className="text-xs opacity-70">Surveillance summary</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#f59e0b", borderColor: "#f59e0b" }}
            >
              <div className="text-center">
                <HardDrive className="w-6 h-6 mx-auto mb-2" />
                <div>Export Data</div>
                <div className="text-xs opacity-70">Save surveillance data</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
