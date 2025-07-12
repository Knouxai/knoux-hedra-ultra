import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Activity,
  Lock,
  Eye,
  AlertTriangle,
  HardDrive,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DefensiveOps() {
  const [activeTools, setActiveTools] = useState<string[]>([]);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const defensiveTools = [
    {
      id: "active-services",
      name: "Active Services Scanner",
      nameAr: "فحص الخدمات النشطة",
      icon: Activity,
      description: "Scan and monitor all active system services",
      status: "READY",
      emoji: "🔰",
    },
    {
      id: "ports-shield",
      name: "Ports Shield",
      nameAr: "حماية منافذ النظام",
      icon: Shield,
      description: "Advanced port protection and monitoring",
      status: "ACTIVE",
      emoji: "🛡️",
    },
    {
      id: "process-monitor",
      name: "Process Monitor",
      nameAr: "تحليل العمليات الجارية",
      icon: Eye,
      description: "Real-time process analysis and monitoring",
      status: "MONITORING",
      emoji: "🧬",
    },
    {
      id: "malware-blocker",
      name: "Real-time Blocker",
      nameAr: "منع البرمجيات الضارة",
      icon: AlertTriangle,
      description: "Real-time malware detection and blocking",
      status: "ACTIVE",
      emoji: "🧯",
    },
    {
      id: "vault-pass",
      name: "VaultPass™",
      nameAr: "إدارة كلمات المرور",
      icon: Lock,
      description: "Secure password management system",
      status: "SECURED",
      emoji: "🔐",
    },
    {
      id: "aes-encryption",
      name: "AES512 Encryption",
      nameAr: "تشفير التقارير والمجلدات",
      icon: HardDrive,
      description: "Advanced file and folder encryption",
      status: "READY",
      emoji: "🗜️",
    },
    {
      id: "sentinel-alerts",
      name: "Sentinel Alerts",
      nameAr: "نظام تنبيه مباشر عند التهديد",
      icon: Bell,
      description: "Instant threat notification system",
      status: "LISTENING",
      emoji: "🚨",
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
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center bg-green-400/10 border border-green-400">
              <Shield className="w-6 h-6 text-green-400 animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-green-400 neon-glow">
                Defensive Ops
              </h1>
              <p className="text-cyber-purple-light">
                قسم الدفاع السيبراني - Module 1 of 7
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Module Overview */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-green-400">
                Defensive Operations Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {activeTools.length}/7 ACTIVE
                  </span>
                </div>
                <button
                  onClick={() =>
                    setActiveTools(
                      activeTools.length === 7
                        ? []
                        : defensiveTools.map((t) => t.id),
                    )
                  }
                  className="btn-cyber px-4 py-2 mode-defense text-sm"
                >
                  {activeTools.length === 7 ? "Disable All" : "Enable All"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">100%</div>
                <div className="text-xs text-cyber-purple-light">
                  Defense Ready
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
                <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">0</div>
                <div className="text-xs text-cyber-purple-light">
                  Threats Detected
                </div>
              </div>
            </div>
          </div>

          {/* Defensive Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {defensiveTools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTools.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  className="glass-card rounded-xl p-6 group cursor-pointer hover:scale-105 transition-all duration-300"
                  onClick={() => toggleTool(tool.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform ${isActive ? "bg-green-400/20 border-green-400" : "border-cyber-glass-border"} border`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${isActive ? "text-green-400" : "text-cyber-neon"}`}
                      />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-2xl">{tool.emoji}</div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          tool.status === "ACTIVE" ||
                          tool.status === "MONITORING" ||
                          tool.status === "LISTENING"
                            ? "bg-green-400 animate-pulse"
                            : tool.status === "SECURED"
                              ? "bg-blue-400 animate-pulse"
                              : "bg-cyber-neon"
                        }`}
                      ></div>
                    </div>
                  </div>

                  <h3
                    className={`text-lg font-bold ${isActive ? "text-green-400" : "text-cyber-neon"} mb-1`}
                  >
                    {tool.name}
                  </h3>
                  <h4 className="text-sm text-cyber-purple-light mb-3 font-mono">
                    {tool.nameAr}
                  </h4>
                  <p className="text-cyber-purple-light text-sm mb-4">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono ${isActive ? "text-green-400" : "text-cyber-purple-light"}`}
                    >
                      {tool.status}
                    </span>
                    <button
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        isActive
                          ? "bg-green-400/10 text-green-400 border-green-400"
                          : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-green-400/10 hover:text-green-400 hover:border-green-400"
                      }`}
                    >
                      {isActive ? "ACTIVE" : "ACTIVATE"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-cyber p-4 mode-defense">
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <div>Full System Scan</div>
                <div className="text-xs opacity-70">
                  Comprehensive security check
                </div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-defense">
              <div className="text-center">
                <Lock className="w-6 h-6 mx-auto mb-2" />
                <div>Secure Vault</div>
                <div className="text-xs opacity-70">Lock down all systems</div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-defense">
              <div className="text-center">
                <Activity className="w-6 h-6 mx-auto mb-2" />
                <div>Generate Report</div>
                <div className="text-xs opacity-70">Defense status report</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
