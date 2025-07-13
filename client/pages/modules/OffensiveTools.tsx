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
  Shield,
  Terminal,
  Network,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OffensiveTools() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [attackResults, setAttackResults] = useState<any[]>([]);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const executeTool = async (toolId: string) => {
    const newResult = {
      id: Date.now(),
      toolId,
      timestamp: new Date(),
      status: "running",
      output: "Initializing attack sequence...",
    };

    setAttackResults((prev) => [newResult, ...prev]);

    // Simulate attack execution
    setTimeout(() => {
      setAttackResults((prev) =>
        prev.map((result) =>
          result.id === newResult.id
            ? {
                ...result,
                status: "completed",
                output: "Attack sequence completed successfully",
              }
            : result,
        ),
      );
    }, 3000);
  };

  const offensiveTools = [
    {
      id: "auto-recon",
      name: "AutoRecon",
      nameAr: "ماسح الثغرات الذكي",
      icon: Search,
      description: "Intelligent vulnerability scanner",
      status: "READY",
      emoji: "🔍",
      riskLevel: "medium",
    },
    {
      id: "packet-sniffer",
      name: "Packet Interceptor",
      nameAr: "Sniffer & Packet Interceptor",
      icon: Eye,
      description: "Network packet capture and analysis",
      status: "LISTENING",
      emoji: "🕷️",
      riskLevel: "high",
    },
    {
      id: "script-gen",
      name: "Attack Script Generator",
      nameAr: "توليد سكربتات هجوم تلقائية",
      icon: Zap,
      description: "Automated attack script generation",
      status: "READY",
      emoji: "⚡",
      riskLevel: "critical",
    },
    {
      id: "wifi-pentest",
      name: "WiFi Penetration Testing",
      nameAr: "استهداف WiFi/APs واختبار الاختراق",
      icon: Wifi,
      description: "WiFi and Access Point security testing",
      status: "READY",
      emoji: "📡",
      riskLevel: "high",
    },
    {
      id: "osint-tools",
      name: "OSINT Deep Search",
      nameAr: "أدوات OSINT للبحث العميق",
      icon: Globe,
      description: "Open Source Intelligence gathering",
      status: "ACTIVE",
      emoji: "🛰️",
      riskLevel: "low",
    },
    {
      id: "mac-spoof",
      name: "MAC/ARP Spoofing",
      nameAr: "انتحال MAC/ARP/Spoof",
      icon: Network,
      description: "MAC and ARP address spoofing tools",
      status: "READY",
      emoji: "🎭",
      riskLevel: "high",
    },
    {
      id: "cve-exploit",
      name: "CVE Exploiter",
      nameAr: "استغلال الثغرات المعروفة",
      icon: Bug,
      description: "Known CVE vulnerability exploitation",
      status: "DISABLED",
      emoji: "💥",
      riskLevel: "critical",
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

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Module Overview */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-red-400">
                Offensive Operations Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {activeTools.length}/7 WEAPONS ARMED
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Swords className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">ARMED</div>
                <div className="text-xs text-cyber-purple-light">
                  Attack Ready
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-cyber-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyber-neon">
                  {activeTools.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Tools Active
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Terminal className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">
                  {attackResults.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Attacks Executed
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">HIGH</div>
                <div className="text-xs text-cyber-purple-light">
                  Risk Level
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Offensive Tools Grid */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-red-400 mb-4">
                Penetration Testing Arsenal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {offensiveTools.map((tool) => {
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
                              ? "bg-red-400/20 border-red-400"
                              : "border-cyber-glass-border"
                          } border`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              isActive ? "text-red-400" : "text-cyber-neon"
                            }`}
                          />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-lg">{tool.emoji}</div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              tool.status === "ACTIVE" ||
                              tool.status === "LISTENING"
                                ? "bg-green-400 animate-pulse"
                                : tool.status === "DISABLED"
                                  ? "bg-gray-400"
                                  : "bg-red-400"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          isActive ? "text-red-400" : "text-cyber-neon"
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
                                ? "text-red-400"
                                : "text-cyber-purple-light"
                            }`}
                          >
                            {tool.status}
                          </span>
                          <span
                            className={`text-xs px-1 py-0.5 rounded text-white ${
                              tool.riskLevel === "critical"
                                ? "bg-red-500"
                                : tool.riskLevel === "high"
                                  ? "bg-orange-500"
                                  : tool.riskLevel === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                          >
                            {tool.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDisabled) executeTool(tool.id);
                          }}
                          disabled={isDisabled}
                          className={`text-xs px-2 py-1 rounded-full border transition-all ${
                            isDisabled
                              ? "border-gray-600 text-gray-600 cursor-not-allowed"
                              : isActive
                                ? "bg-red-400/10 text-red-400 border-red-400"
                                : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-red-400/10 hover:text-red-400 hover:border-red-400"
                          }`}
                        >
                          {isDisabled ? "DISABLED" : "EXECUTE"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target & Results */}
            <div className="lg:col-span-1 space-y-6">
              {/* Target Selection */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-red-400 mb-4">
                  Target Configuration
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    placeholder="Enter target IP/domain..."
                    className="w-full px-3 py-2 bg-cyber-glass/30 border border-cyber-glass-border rounded-lg text-cyber-neon placeholder-cyber-purple-light focus:border-red-400 focus:outline-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-red-400/10 border border-red-400 rounded-lg text-red-400 text-sm hover:bg-red-400/20 transition-all">
                      Scan Target
                    </button>
                    <button className="flex-1 px-3 py-2 bg-cyber-glass/30 border border-cyber-glass-border rounded-lg text-cyber-neon text-sm hover:border-cyber-neon transition-all">
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Attack Results */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-red-400 mb-4">
                  Attack Results
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {attackResults.length === 0 ? (
                    <div className="text-center text-cyber-purple-light text-sm py-8">
                      No attacks executed yet
                    </div>
                  ) : (
                    attackResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 bg-cyber-glass/30 rounded-lg border border-cyber-glass-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-cyber-neon">
                            {result.toolId}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              result.status === "running"
                                ? "bg-yellow-400/20 text-yellow-400"
                                : "bg-green-400/20 text-green-400"
                            }`}
                          >
                            {result.status}
                          </span>
                        </div>
                        <p className="text-xs text-cyber-purple-light">
                          {result.output}
                        </p>
                        <div className="text-xs text-cyber-purple-light/70 mt-1">
                          {result.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Attack Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <Search className="w-6 h-6 mx-auto mb-2" />
                <div>Reconnaissance</div>
                <div className="text-xs opacity-70">Target discovery</div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <div>Generate Payload</div>
                <div className="text-xs opacity-70">Custom attack scripts</div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <Network className="w-6 h-6 mx-auto mb-2" />
                <div>Network Mapping</div>
                <div className="text-xs opacity-70">Infrastructure scan</div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <Terminal className="w-6 h-6 mx-auto mb-2" />
                <div>Generate Report</div>
                <div className="text-xs opacity-70">Attack summary</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
