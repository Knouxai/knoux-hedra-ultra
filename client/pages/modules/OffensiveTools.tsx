import { useState } from "react";
import {
  ArrowLeft,
  Swords,
  Zap,
  Search,
  Wifi,
  Globe,
  Eye,
  Bug,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OffensiveTools() {
  const [activeTools, setActiveTools] = useState<string[]>([]);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const offensiveTools = [
    {
      id: "auto-recon",
      name: "AutoRecon",
      nameAr: "ماسح الثغرات الذكي",
      icon: Search,
      description: "Intelligent vulnerability scanner",
      status: "READY",
      emoji: "🧨",
    },
    {
      id: "packet-sniffer",
      name: "Packet Interceptor",
      nameAr: "Sniffer & Packet Interceptor",
      icon: Eye,
      description: "Network packet capture and analysis",
      status: "LISTENING",
      emoji: "🕷️",
    },
    {
      id: "script-gen",
      name: "Attack Script Generator",
      nameAr: "توليد سكربتات هجوم تلقائية",
      icon: Zap,
      description: "Automated attack script generation",
      status: "READY",
      emoji: "💣",
    },
    {
      id: "wifi-pentesting",
      name: "WiFi Penetration",
      nameAr: "استهداف WiFi/APs واختبار الاختراق",
      icon: Wifi,
      description: "WiFi and Access Point testing",
      status: "SCANNING",
      emoji: "🎯",
    },
    {
      id: "osint-tools",
      name: "OSINT Deep Search",
      nameAr: "أدوات OSINT للبحث العميق",
      icon: Globe,
      description: "Open Source Intelligence gathering",
      status: "SEARCHING",
      emoji: "🛰️",
    },
    {
      id: "mac-spoof",
      name: "MAC/ARP Spoofing",
      nameAr: "انتحال MAC/ARP/Spoof",
      icon: Eye,
      description: "Network identity spoofing tools",
      status: "READY",
      emoji: "🎭",
    },
    {
      id: "cve-exploit",
      name: "CVE Exploiter",
      nameAr: "استغلال الثغرات المعروفة",
      icon: Bug,
      description: "Known vulnerability exploitation",
      status: "LOADED",
      emoji: "🧪",
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
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center bg-red-400/10 border border-red-400">
              <Swords className="w-6 h-6 text-red-400 animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-red-400 neon-glow">
                Offensive Tools
              </h1>
              <p className="text-cyber-purple-light">
                قسم الهجوم الأخلاقي - Module 2 of 7
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="p-6 pt-0">
        <div className="glass-card rounded-xl p-4 border-l-4 border-red-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center text-xs font-bold text-white">
              !
            </div>
            <div>
              <h3 className="text-red-400 font-bold text-sm">
                Ethical Use Only
              </h3>
              <p className="text-cyber-purple-light text-xs">
                These tools are for authorized penetration testing and security
                research only. Unauthorized use is illegal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6 pt-0">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Module Overview */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-red-400">
                Penetration Testing Arsenal
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {activeTools.length}/7 ARMED
                  </span>
                </div>
                <button
                  onClick={() =>
                    setActiveTools(
                      activeTools.length === 7
                        ? []
                        : offensiveTools.map((t) => t.id),
                    )
                  }
                  className="btn-cyber px-4 py-2 mode-attack text-sm"
                >
                  {activeTools.length === 7 ? "Disarm All" : "Arm All"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Swords className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">ARMED</div>
                <div className="text-xs text-cyber-purple-light">
                  Attack Ready
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Bug className="w-8 h-8 text-cyber-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyber-neon">
                  {activeTools.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Tools Armed
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Search className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">127</div>
                <div className="text-xs text-cyber-purple-light">
                  Targets Found
                </div>
              </div>
            </div>
          </div>

          {/* Offensive Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offensiveTools.map((tool) => {
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
                      className={`w-12 h-12 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform ${isActive ? "bg-red-400/20 border-red-400" : "border-cyber-glass-border"} border`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${isActive ? "text-red-400" : "text-cyber-neon"}`}
                      />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-2xl">{tool.emoji}</div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          tool.status === "LISTENING" ||
                          tool.status === "SCANNING" ||
                          tool.status === "SEARCHING"
                            ? "bg-red-400 animate-pulse"
                            : tool.status === "LOADED"
                              ? "bg-yellow-400 animate-pulse"
                              : "bg-cyber-neon"
                        }`}
                      ></div>
                    </div>
                  </div>

                  <h3
                    className={`text-lg font-bold ${isActive ? "text-red-400" : "text-cyber-neon"} mb-1`}
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
                      className={`text-xs font-mono ${isActive ? "text-red-400" : "text-cyber-purple-light"}`}
                    >
                      {tool.status}
                    </span>
                    <button
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        isActive
                          ? "bg-red-400/10 text-red-400 border-red-400"
                          : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-red-400/10 hover:text-red-400 hover:border-red-400"
                      }`}
                    >
                      {isActive ? "ARMED" : "ARM"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <Search className="w-6 h-6 mx-auto mb-2" />
                <div>Target Discovery</div>
                <div className="text-xs opacity-70">
                  Automated reconnaissance
                </div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <div>Launch Attack</div>
                <div className="text-xs opacity-70">
                  Execute penetration test
                </div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <Bug className="w-6 h-6 mx-auto mb-2" />
                <div>Exploit Report</div>
                <div className="text-xs opacity-70">Generate findings</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
