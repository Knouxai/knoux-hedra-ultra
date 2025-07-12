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
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globeRotation, setGlobeRotation] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setGlobeRotation((prev) => (prev + 0.5) % 360);
    }, 50);

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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
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

      {/* Navigation Arrows */}
      <button className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm hover:border-cyan-400 transition-all">
        <ChevronLeft className="w-5 h-5 text-cyan-400" />
      </button>
      <button className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-black/30 border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm hover:border-cyan-400 transition-all">
        <ChevronRight className="w-5 h-5 text-cyan-400" />
      </button>

      {/* Header */}
      <header className="relative z-40 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center border-2 border-cyan-400/50">
                  <span className="text-white font-bold text-xs">KNOUX7</span>
                </div>
                <div className="absolute -inset-1 rounded-full border border-cyan-400/30 animate-ping"></div>
              </div>
              <div className="text-center">
                <h1
                  className="text-4xl font-bold text-cyan-400 tracking-wider"
                  style={{ textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff" }}
                >
                  KNOUX7
                </h1>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-cyan-400/60 text-sm">.....</span>
                  <span className="text-cyan-400 text-sm font-medium tracking-widest">
                    INTELLIGENT DEVELOPMENT
                  </span>
                  <span className="text-cyan-400/60 text-sm">.....</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="relative z-30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 h-[500px]">
            {/* Left Panel */}
            <div className="col-span-3 space-y-6">
              {/* Stats Row */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-lg">148</span>
                  <span className="text-gray-400 text-xs">online</span>
                  <span className="text-gray-500 text-xs">users connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-lg">334</span>
                  <span className="text-gray-400 text-xs">GDP</span>
                  <span className="text-gray-500 text-xs">active systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">160</span>
                  <span className="text-gray-400 text-xs">SSS</span>
                  <span className="text-gray-500 text-xs">total warnings</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-lg">27.4%</span>
                  <span className="text-gray-400 text-xs">system</span>
                  <span className="text-gray-500 text-xs">integration</span>
                </div>
              </div>

              {/* Residual Asset Statistics */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  RESIDUAL ASSET STATISTICS
                </h3>
                <div className="flex gap-6 justify-center">
                  {/* 73% Circle */}
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
                          strokeDasharray={`${73 * 2.51} 251`}
                          style={{
                            filter: "drop-shadow(0 0 8px #8b5cf6)",
                            strokeLinecap: "round",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-purple-400 text-xl font-bold">
                          73%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 60% Circle */}
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
                          strokeDasharray={`${60 * 2.51} 251`}
                          style={{
                            filter: "drop-shadow(0 0 8px #06b6d4)",
                            strokeLinecap: "round",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-cyan-400 text-xl font-bold">
                          60%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Risk Statistics */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  REGIONAL RISK STATISTICS
                </h3>
                <div className="space-y-2">
                  {[
                    { region: "Europe", percentage: 90, color: "#8b5cf6" },
                    { region: "North Am", percentage: 75, color: "#ec4899" },
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
                          className="h-full rounded-full transition-all duration-2000 ease-out"
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
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
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
                      points="0,40 30,25 60,15 90,30 120,10 150,25 180,5 210,20 240,8"
                      style={{ filter: "drop-shadow(0 0 4px #8b5cf6)" }}
                    />
                    {/* Glow effect area */}
                    <polygon
                      fill="url(#auraGradient)"
                      opacity="0.1"
                      points="0,40 30,25 60,15 90,30 120,10 150,25 180,5 210,20 240,8 240,56 0,56"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Center Panel - 3D Globe */}
            <div className="col-span-6 flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Outer rotating ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/40"
                  style={{
                    animation: "spin 30s linear infinite",
                    filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.3))",
                  }}
                />

                {/* Inner rotating ring */}
                <div
                  className="absolute inset-6 rounded-full border border-purple-500/60"
                  style={{
                    animation: "spin 20s linear infinite reverse",
                    filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))",
                  }}
                />

                {/* Main Globe */}
                <div className="absolute inset-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-pink-900/20 border border-cyan-400/30 backdrop-blur-sm">
                  {/* Globe grid lines */}
                  <div className="absolute inset-0">
                    {/* Horizontal lines */}
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400/40"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/60"></div>
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400/40"></div>

                    {/* Vertical lines */}
                    <div className="absolute top-0 bottom-0 left-1/4 w-px bg-cyan-400/40"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/60"></div>
                    <div className="absolute top-0 bottom-0 left-3/4 w-px bg-cyan-400/40"></div>

                    {/* Curved grid simulation */}
                    <div className="absolute inset-3 rounded-full border border-cyan-400/30"></div>
                    <div className="absolute inset-6 rounded-full border border-cyan-400/20"></div>
                  </div>

                  {/* Continent dots pattern */}
                  <div className="absolute inset-0">
                    {[...Array(300)].map((_, i) => {
                      const angle = i * 137.5 * (Math.PI / 180);
                      const radius = Math.sqrt(i) * 2;
                      const x = 50 + (radius * Math.cos(angle)) / 4;
                      const y = 50 + (radius * Math.sin(angle)) / 4;

                      if (x > 15 && x < 85 && y > 15 && y < 85) {
                        return (
                          <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              animationDelay: `${Math.random() * 3}s`,
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
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
                        style={{
                          left: `${50 + 35 * Math.cos(((i * 45 + globeRotation) * Math.PI) / 180)}%`,
                          top: `${50 + 35 * Math.sin(((i * 45 + globeRotation) * Math.PI) / 180)}%`,
                          filter: "drop-shadow(0 0 4px #00ffff)",
                          animation: "pulse 1.5s ease-in-out infinite",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Platform */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6">
                  {/* Platform shadow */}
                  <div className="w-32 h-8 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-full blur-md"></div>

                  {/* Platform base */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <div
                      className="w-28 h-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full"
                      style={{
                        filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))",
                      }}
                    ></div>

                    {/* Platform top surface */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-pink-400/60 rounded-full border border-cyan-400/40"></div>

                    {/* KNOUX7 cube on platform */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                      <div
                        className="w-16 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-lg border border-cyan-400/50 flex items-center justify-center"
                        style={{
                          filter:
                            "drop-shadow(0 0 12px rgba(139, 92, 246, 0.8))",
                          clipPath:
                            "polygon(0 100%, 0 20%, 20% 0, 100% 0, 100% 80%, 80% 100%)",
                        }}
                      >
                        <span className="text-white font-bold text-xs tracking-wider">
                          KNOUX7
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbital elements */}
                <div
                  className="absolute inset-0"
                  style={{ animation: "spin 40s linear infinite" }}
                >
                  <div
                    className="absolute top-2 left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2"
                    style={{ filter: "drop-shadow(0 0 6px #8b5cf6)" }}
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{ animation: "spin 35s linear infinite reverse" }}
                >
                  <div
                    className="absolute bottom-2 left-1/2 w-2 h-2 bg-cyan-500 rounded-full transform -translate-x-1/2"
                    style={{ filter: "drop-shadow(0 0 6px #06b6d4)" }}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-3 space-y-6">
              {/* Individual Risk Statistics - Circular */}
              <div className="text-center">
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  INDIVIDUAL RISK STATISTICS
                </h3>
                <div className="w-28 h-28 mx-auto relative">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="rgba(139, 92, 246, 0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="url(#individualGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${85 * 3.02} 302`}
                      style={{
                        filter: "drop-shadow(0 0 12px #8b5cf6)",
                        strokeLinecap: "round",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="individualGradient"
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
                      className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                      style={{ filter: "drop-shadow(0 0 8px #8b5cf6)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Individual Risk Statistics - Bar Chart */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  INDIVIDUAL RISK STATISTICS
                </h3>
                <div className="flex items-end gap-1 h-24 bg-gray-900/20 rounded-lg p-2 border border-gray-700/20">
                  {[75, 90, 60, 95, 45, 80, 65, 88, 50, 85, 70].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-purple-600 via-purple-500 to-pink-400 rounded-sm transition-all duration-1000"
                        style={{
                          height: `${height}%`,
                          filter: "drop-shadow(0 0 3px #8b5cf6)",
                          animationDelay: `${index * 0.1}s`,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Used Today */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  USED TODAY
                </h3>
                <div className="space-y-4">
                  <div
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl border border-cyan-400/30"
                    style={{
                      filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))",
                    }}
                  ></div>
                  <div className="grid grid-cols-6 gap-1">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 bg-gray-700/50 rounded-sm transition-all duration-1000 hover:bg-cyan-400/60"
                        style={{
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Modules */}
          <div className="mt-16 mb-8">
            <div className="grid grid-cols-7 gap-3">
              {modules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <Link
                    key={index}
                    to={module.path}
                    className="group text-center p-3 rounded-xl bg-gray-900/20 backdrop-blur-sm border border-gray-700/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-white" />
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
      </main>

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
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
