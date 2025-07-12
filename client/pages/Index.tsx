import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Eye,
  Network,
  Brain,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
} from "lucide-react";
import type { Section, LiveStats, DatabaseStructure } from "@shared/types";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedSection, setSelectedSection] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activeUsers: 148,
    activeSystems: 334,
    totalWarnings: 160,
    systemIntegration: 27.4,
    residualAsset1: 73,
    residualAsset2: 60,
    auraData: [40, 25, 15, 30, 10, 25, 5, 20, 8],
    regionalStats: [
      { region: "Europe", percentage: 90, color: "#8b5cf6" },
      { region: "North Am", percentage: 75, color: "#ec4899" },
      { region: "Oceania", percentage: 55, color: "#3b82f6" },
      { region: "Asia", percentage: 35, color: "#f97316" },
      { region: "S.America", percentage: 20, color: "#ef4444" },
    ],
    individualRisk: 85,
    usedToday: 12,
    barData: [75, 90, 60, 95, 45, 80, 65, 88, 50, 85, 70],
    executingTools: [],
    lastUpdate: new Date(),
  });

  // Load sections data dynamically
  useEffect(() => {
    const loadSections = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/sections.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DatabaseStructure = await response.json();
        setSections(data.sections);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load sections",
        );
        console.error("Error loading sections:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  // Real-time data simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      if (isLiveMode) {
        setLiveStats((prev) => ({
          ...prev,
          activeUsers: Math.max(
            100,
            prev.activeUsers + Math.floor(Math.random() * 6) - 3,
          ),
          activeSystems: Math.max(
            300,
            prev.activeSystems + Math.floor(Math.random() * 10) - 5,
          ),
          totalWarnings: Math.max(
            0,
            prev.totalWarnings + Math.floor(Math.random() * 4) - 2,
          ),
          systemIntegration: Math.max(
            0,
            Math.min(100, prev.systemIntegration + (Math.random() - 0.5) * 2),
          ),
          residualAsset1: Math.max(
            0,
            Math.min(100, prev.residualAsset1 + (Math.random() - 0.5) * 3),
          ),
          residualAsset2: Math.max(
            0,
            Math.min(100, prev.residualAsset2 + (Math.random() - 0.5) * 3),
          ),
          individualRisk: Math.max(
            0,
            Math.min(100, prev.individualRisk + (Math.random() - 0.5) * 2),
          ),
          auraData: prev.auraData.map(() => Math.random() * 50 + 5),
          barData: prev.barData.map(() => Math.random() * 90 + 10),
          regionalStats: prev.regionalStats.map((stat) => ({
            ...stat,
            percentage: Math.max(
              0,
              Math.min(100, stat.percentage + (Math.random() - 0.5) * 5),
            ),
          })),
          lastUpdate: new Date(),
        }));
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [isLiveMode]);

  // Execute tool function
  const executeTool = async (toolId: string, sectionId: number) => {
    try {
      const response = await fetch("/api/execute-tool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId,
          sectionId,
          async: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute tool");
      }

      const result = await response.json();
      console.log("Tool execution started:", result);

      // Update live stats to show tool execution
      setLiveStats((prev) => ({
        ...prev,
        executingTools: [
          ...prev.executingTools,
          {
            toolId,
            sectionId,
            startTime: new Date(),
            status: "running",
            user: "knoux",
          },
        ],
      }));
    } catch (error) {
      console.error("Error executing tool:", error);
    }
  };

  const getIconComponent = (sectionName: string) => {
    const iconMap: Record<string, any> = {
      "Defensive Ops": Shield,
      "Offensive Tools": Zap,
      Surveillance: Eye,
      "Net & VPN Control": Network,
      "AI Cyber Assistant": Brain,
      "Encrypted Reporting": FileText,
      "Cosmic Settings": Settings,
    };
    return iconMap[sectionName] || Settings;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-400">Loading KNOX Sentinel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/20"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <button className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm hover:border-cyan-400 transition-all">
        <ChevronLeft className="w-5 h-5 text-cyan-400" />
      </button>
      <button className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm hover:border-cyan-400 transition-all">
        <ChevronRight className="w-5 h-5 text-cyan-400" />
      </button>

      {/* Header */}
      <header className="relative z-40 pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center border-2 border-cyan-400/50">
                  <span className="text-white font-bold text-xs">KNOUX7</span>
                </div>
                <div className="absolute -inset-1 rounded-full border border-cyan-400/30 animate-ping"></div>
              </div>
              <div>
                <h1
                  className="text-3xl font-bold text-cyan-400 tracking-wider"
                  style={{ textShadow: "0 0 20px #00ffff" }}
                >
                  KNOUX7
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-cyan-400/60 text-sm">.....</span>
                  <span className="text-cyan-400 text-sm font-medium tracking-widest">
                    INTELLIGENT DEVELOPMENT
                  </span>
                  <span className="text-cyan-400/60 text-sm">.....</span>
                </div>
              </div>
            </div>

            {/* Real-time controls */}
            <div className="flex items-center gap-4">
              <div className="text-cyan-400 text-sm font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`p-2 rounded-lg border transition-all ${
                    isLiveMode
                      ? "border-green-400 bg-green-400/10 text-green-400"
                      : "border-gray-600 bg-gray-600/10 text-gray-400"
                  }`}
                  title={
                    isLiveMode ? "Pause Live Updates" : "Resume Live Updates"
                  }
                >
                  {isLiveMode ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  className="p-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:border-cyan-400 transition-all"
                  title="Refresh Data"
                  onClick={() => window.location.reload()}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top status bar */}
      <div className="absolute top-4 right-6 z-40 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">active systems</span>
          <span className="text-cyan-400 font-bold text-lg">
            {liveStats.activeSystems}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">total warnings</span>
          <span className="text-yellow-400 font-bold text-lg">
            {liveStats.totalWarnings}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">system integration</span>
          <span className="text-cyan-400 font-bold text-lg">
            {liveStats.systemIntegration.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-30 pt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-8 h-[500px]">
            {/* Left Panel - Live Stats */}
            <div className="col-span-3 space-y-6">
              {/* Individual Risk Statistics - Circle */}
              <div>
                <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                  INDIVIDUAL RISK STATISTICS
                </h3>
                <div className="w-32 h-32 mx-auto relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(139, 92, 246, 0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#circleGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${liveStats.individualRisk * 3.52} 352`}
                      style={{
                        filter: "drop-shadow(0 0 15px #8b5cf6)",
                        strokeLinecap: "round",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="circleGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"
                      style={{ filter: "drop-shadow(0 0 10px #8b5cf6)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div>
                <div className="flex items-end gap-1 h-32 bg-gray-900/20 rounded-lg p-3">
                  {liveStats.barData.map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-purple-600 via-pink-500 to-purple-400 rounded-sm transition-all duration-1000"
                      style={{
                        height: `${height}%`,
                        filter: "drop-shadow(0 0 4px #8b5cf6)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Used Today */}
              <div>
                <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                  USED TODAY
                </h3>
                <div className="space-y-4">
                  <div
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 rounded-xl"
                    style={{
                      filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))",
                    }}
                  />
                  <div className="grid grid-cols-8 gap-1">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-sm transition-all duration-1000 ${
                          i < liveStats.usedToday
                            ? "bg-cyan-400"
                            : "bg-gray-700/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center Panel - Section Preview */}
            <div className="col-span-6 flex flex-col items-center justify-center">
              {/* Section Selector */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {sections.map((section, index) => {
                  const IconComponent = getIconComponent(section.nameEn);
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(index)}
                      className={`flex-shrink-0 p-3 rounded-lg border transition-all ${
                        selectedSection === index
                          ? "border-cyan-400 bg-cyan-400/20"
                          : "border-gray-700 bg-gray-900/30 hover:border-gray-500"
                      }`}
                      title={section.name}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{
                          color:
                            selectedSection === index
                              ? "#00ffff"
                              : section.color,
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Selected Section Preview */}
              {sections[selectedSection] && (
                <div className="w-full max-w-md">
                  <div
                    className="glass-card rounded-xl p-6 border"
                    style={{
                      borderColor: sections[selectedSection].color + "40",
                    }}
                  >
                    <div className="text-center mb-4">
                      <div
                        className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor:
                            sections[selectedSection].color + "20",
                          border: `2px solid ${sections[selectedSection].color}60`,
                        }}
                      >
                        {(() => {
                          const IconComponent = getIconComponent(
                            sections[selectedSection].nameEn,
                          );
                          return (
                            <IconComponent
                              className="w-8 h-8"
                              style={{ color: sections[selectedSection].color }}
                            />
                          );
                        })()}
                      </div>
                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ color: sections[selectedSection].color }}
                      >
                        {sections[selectedSection].nameEn}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {sections[selectedSection].name}
                      </p>
                      <div
                        className="text-xs px-3 py-1 rounded-full inline-block"
                        style={{
                          backgroundColor:
                            sections[selectedSection].color + "20",
                          color: sections[selectedSection].color,
                        }}
                      >
                        {sections[selectedSection].status}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white text-sm font-bold">
                        Live Tools Status (
                        {sections[selectedSection].tools.length}):
                      </h4>
                      {sections[selectedSection].tools
                        .slice(0, 5)
                        .map((tool, idx) => (
                          <div
                            key={tool.id}
                            className="flex items-center justify-between text-xs p-2 bg-gray-900/30 rounded-lg"
                          >
                            <span className="text-gray-300">{tool.nameEn}</span>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  tool.enabled
                                    ? tool.realtime
                                      ? "bg-green-400 animate-pulse"
                                      : "bg-yellow-400"
                                    : "bg-red-400"
                                }`}
                              />
                              <span className="text-gray-400">
                                {tool.enabled
                                  ? tool.realtime
                                    ? "LIVE"
                                    : "READY"
                                  : "DISABLED"}
                              </span>
                              <button
                                onClick={() =>
                                  executeTool(
                                    tool.id,
                                    sections[selectedSection].id,
                                  )
                                }
                                className={`text-xs px-2 py-1 rounded border transition-all ${
                                  tool.enabled
                                    ? "border-green-400 text-green-400 hover:bg-green-400/10"
                                    : "border-gray-600 text-gray-600 cursor-not-allowed"
                                }`}
                                disabled={!tool.enabled}
                                title={`Execute ${tool.nameEn}`}
                              >
                                ▶
                              </button>
                            </div>
                          </div>
                        ))}
                      {sections[selectedSection].tools.length > 5 && (
                        <p className="text-xs text-gray-400 text-center">
                          +{sections[selectedSection].tools.length - 5} more
                          tools
                        </p>
                      )}
                    </div>

                    <Link
                      to={`/${sections[selectedSection].nameEn.toLowerCase().replace(/\s+/g, "-")}`}
                      className="w-full mt-4 p-3 rounded-lg border-2 text-center font-bold transition-all hover:scale-105 block"
                      style={{
                        borderColor: sections[selectedSection].color,
                        color: sections[selectedSection].color,
                        backgroundColor: sections[selectedSection].color + "10",
                      }}
                    >
                      Launch Module ({sections[selectedSection].tools.length}{" "}
                      tools)
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Additional Stats */}
            <div className="col-span-3 space-y-6">
              {/* Residual Reset Statistics */}
              <div>
                <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                  RESIDUAL RESET STATISTICS
                </h3>
                <div className="flex gap-4 justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 relative">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(6, 182, 212, 0.2)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#06b6d4"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${liveStats.residualAsset1 * 2.51} 251`}
                          style={{
                            filter: "drop-shadow(0 0 10px #06b6d4)",
                            strokeLinecap: "round",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-cyan-400 text-xl font-bold">
                          {Math.round(liveStats.residualAsset1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 relative">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(139, 92, 246, 0.2)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#8b5cf6"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${liveStats.residualAsset2 * 2.51} 251`}
                          style={{
                            filter: "drop-shadow(0 0 10px #8b5cf6)",
                            strokeLinecap: "round",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-purple-400 text-xl font-bold">
                          {Math.round(liveStats.residualAsset2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Risk Statistics */}
              <div>
                <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                  REGIONAL RISK STATISTICS
                </h3>
                <div className="space-y-3">
                  {liveStats.regionalStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-300 text-xs w-16 font-medium">
                        {stat.region}
                      </span>
                      <div className="flex-1 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-2000"
                          style={{
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.color,
                            filter: `drop-shadow(0 0 4px ${stat.color})`,
                          }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs w-8 text-right">
                        {Math.round(stat.percentage)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aura Trend */}
              <div>
                <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                  AURA TREND
                </h3>
                <div className="h-20 bg-gray-900/30 rounded-lg p-3 border border-gray-700/30">
                  <svg className="w-full h-full">
                    <defs>
                      <linearGradient
                        id="auraGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#auraGradient)"
                      strokeWidth="2"
                      points={liveStats.auraData
                        .map((val, i) => `${i * 30},${val}`)
                        .join(" ")}
                      style={{ filter: "drop-shadow(0 0 4px #8b5cf6)" }}
                    />
                    <polygon
                      fill="url(#auraGradient)"
                      opacity="0.2"
                      points={`${liveStats.auraData.map((val, i) => `${i * 30},${val}`).join(" ")} 240,56 0,56`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="mt-8 mb-4">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <span className="text-cyan-400">
                    <span className="font-bold">KNOX Sentinel</span> | Cosmic
                    Cyber Shield™ v1.0 Alpha
                  </span>
                  <span className="text-gray-400">knoux7-core 💎</span>
                  <span className="text-gray-400">
                    Last Update: {liveStats.lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded ${isLiveMode ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"}`}
                  >
                    {isLiveMode ? "LIVE" : "PAUSED"}
                  </span>
                  <span className="text-gray-400">
                    {sections.length} Modules |{" "}
                    {sections.reduce(
                      (total, section) => total + section.tools.length,
                      0,
                    )}{" "}
                    Tools
                  </span>
                  <span className="text-gray-400">
                    {liveStats.executingTools.length} Running
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
