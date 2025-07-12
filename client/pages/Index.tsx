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
} from "lucide-react";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globeRotation, setGlobeRotation] = useState(0);
  const [liveStats, setLiveStats] = useState({
    activeSystems: 334,
    totalWarnings: 160,
    systemIntegration: 27.4,
    individualRisk: 73,
    residualAsset1: 60,
    residualAsset2: 73,
    barData: [85, 95, 70, 90, 60, 80, 75, 88, 65, 92],
    usedToday: 12,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setGlobeRotation((prev) => (prev + 0.5) % 360);

      // Simulate real-time data updates
      setLiveStats((prev) => ({
        ...prev,
        activeSystems: prev.activeSystems + Math.floor(Math.random() * 6) - 3,
        totalWarnings: Math.max(
          0,
          prev.totalWarnings + Math.floor(Math.random() * 4) - 2,
        ),
        systemIntegration: Math.max(
          0,
          Math.min(100, prev.systemIntegration + (Math.random() - 0.5) * 1),
        ),
        individualRisk: Math.max(
          0,
          Math.min(100, prev.individualRisk + (Math.random() - 0.5) * 2),
        ),
        barData: prev.barData.map(() => Math.random() * 40 + 50),
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const modules = [
    {
      name: "Defensive Ops",
      nameAr: "الدفاع السيبراني",
      path: "/defensive-ops",
      icon: Shield,
    },
    {
      name: "Offensive Tools",
      nameAr: "الهجوم الأخلاقي",
      path: "/offensive-tools",
      icon: Zap,
    },
    {
      name: "Surveillance",
      nameAr: "المراقبة",
      path: "/surveillance",
      icon: Eye,
    },
    {
      name: "Network Control",
      nameAr: "الشبكات",
      path: "/network-control",
      icon: Network,
    },
    {
      name: "AI Assistant",
      nameAr: "الذكاء الاصطناعي",
      path: "/ai-assistant",
      icon: Brain,
    },
    {
      name: "Reporting",
      nameAr: "التقارير",
      path: "/reporting",
      icon: FileText,
    },
    {
      name: "Settings",
      nameAr: "الإعدادات",
      path: "/cosmic-settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-gray-900/60 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm hover:border-purple-500 transition-all">
        <ChevronLeft className="w-6 h-6 text-purple-400" />
      </button>
      <button className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-gray-900/60 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm hover:border-purple-500 transition-all">
        <ChevronRight className="w-6 h-6 text-purple-400" />
      </button>

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
            {/* Left Panel */}
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

            {/* Center Panel - 3D Globe */}
            <div className="col-span-6 flex items-center justify-center">
              <div className="relative w-96 h-96">
                {/* Outer rotating rings */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-purple-500/40"
                  style={{
                    animation: "spin 40s linear infinite",
                    filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))",
                  }}
                />
                <div
                  className="absolute inset-8 rounded-full border border-cyan-400/50"
                  style={{
                    animation: "spin 30s linear infinite reverse",
                    filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.4))",
                  }}
                />

                {/* Main Globe Container */}
                <div className="absolute inset-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-900/30 via-blue-900/40 to-pink-900/30 border border-purple-400/40 backdrop-blur-sm">
                  {/* Globe grid pattern */}
                  <div className="absolute inset-0">
                    {/* Latitude lines */}
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400/50"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/70"></div>
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400/50"></div>

                    {/* Longitude lines */}
                    <div className="absolute top-0 bottom-0 left-1/4 w-px bg-cyan-400/50"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/70"></div>
                    <div className="absolute top-0 bottom-0 left-3/4 w-px bg-cyan-400/50"></div>

                    {/* Curved grid simulation */}
                    <div className="absolute inset-4 rounded-full border border-cyan-400/40"></div>
                    <div className="absolute inset-8 rounded-full border border-cyan-400/30"></div>
                  </div>

                  {/* Continents simulation with dots */}
                  <div className="absolute inset-0">
                    {[...Array(400)].map((_, i) => {
                      const angle = i * 137.5 * (Math.PI / 180);
                      const radius = Math.sqrt(i) * 1.5;
                      const x = 50 + (radius * Math.cos(angle)) / 3;
                      const y = 50 + (radius * Math.sin(angle)) / 3;

                      if (x > 20 && x < 80 && y > 20 && y < 80) {
                        return (
                          <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              animationDelay: `${Math.random() * 4}s`,
                              opacity: Math.random() * 0.8 + 0.2,
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Floating data particles */}
                  <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
                        style={{
                          left: `${50 + 40 * Math.cos(((i * 30 + globeRotation) * Math.PI) / 180)}%`,
                          top: `${50 + 40 * Math.sin(((i * 30 + globeRotation) * Math.PI) / 180)}%`,
                          filter: "drop-shadow(0 0 6px #00ffff)",
                          animation: "pulse 2s ease-in-out infinite",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Central platform */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div
                      className="w-16 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full"
                      style={{
                        filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.8))",
                      }}
                    />
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div
                        className="w-12 h-8 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-lg flex items-center justify-center border border-cyan-400/50"
                        style={{
                          filter:
                            "drop-shadow(0 0 10px rgba(139, 92, 246, 0.6))",
                        }}
                      >
                        <span className="text-white font-bold text-xs">
                          KNOUX7
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbital elements */}
                <div
                  className="absolute inset-0"
                  style={{ animation: "spin 50s linear infinite" }}
                >
                  <div
                    className="absolute top-4 left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2"
                    style={{ filter: "drop-shadow(0 0 8px #8b5cf6)" }}
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{ animation: "spin 45s linear infinite reverse" }}
                >
                  <div
                    className="absolute bottom-4 left-1/2 w-2 h-2 bg-cyan-500 rounded-full transform -translate-x-1/2"
                    style={{ filter: "drop-shadow(0 0 6px #06b6d4)" }}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel */}
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
                  {[
                    { region: "Europe", percentage: 85, color: "#8b5cf6" },
                    { region: "North Am", percentage: 70, color: "#ec4899" },
                    { region: "Oceania", percentage: 55, color: "#3b82f6" },
                    { region: "Asia", percentage: 35, color: "#f97316" },
                    { region: "S.America", percentage: 20, color: "#ef4444" },
                  ].map((stat, index) => (
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
                        {stat.percentage}%
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
                      points="0,50 30,35 60,25 90,40 120,20 150,30 180,15 210,25 240,10"
                      style={{ filter: "drop-shadow(0 0 4px #8b5cf6)" }}
                    />
                    <polygon
                      fill="url(#auraGradient)"
                      opacity="0.2"
                      points="0,50 30,35 60,25 90,40 120,20 150,30 180,15 210,25 240,10 240,56 0,56"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom modules navigation */}
          <div className="mt-12 mb-8">
            <div className="grid grid-cols-7 gap-4">
              {modules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <Link
                    key={index}
                    to={module.path}
                    className="group text-center p-4 rounded-xl bg-gray-900/20 backdrop-blur-sm border border-gray-700/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-cyan-400 text-xs font-bold mb-1">
                      {module.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{module.nameAr}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
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
