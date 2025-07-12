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
  Cpu,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setAnimationStep((prev) => (prev + 1) % 360);
    }, 100);

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
      {/* Background Grid and Particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-full glass-cyber hover:scale-110 transition-transform">
        <ChevronLeft className="w-6 h-6 text-cyan-400" />
      </button>
      <button className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-full glass-cyber hover:scale-110 transition-transform">
        <ChevronRight className="w-6 h-6 text-cyan-400" />
      </button>

      {/* Header */}
      <header className="relative z-40 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative">
                <span className="text-white font-bold text-sm">KNOUX7</span>
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse"></div>
              </div>
              <div>
                <h1
                  className="text-3xl font-bold text-cyan-400"
                  style={{ textShadow: "0 0 20px #00ffff" }}
                >
                  KNOUX7
                </h1>
                <div className="flex items-center gap-4 text-cyan-400 text-sm">
                  <span>.....</span>
                  <span>INTELLIGENT DEVELOPMENT</span>
                  <span>.....</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="relative z-30 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
          {/* Left Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Stats */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-bold">148</span>
                <span className="text-gray-400 text-xs">online</span>
                <span className="text-gray-500 text-xs">users connected</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-bold">334</span>
                <span className="text-gray-400 text-xs">GDP</span>
                <span className="text-gray-500 text-xs">active systems</span>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold">160</span>
                <span className="text-gray-400 text-xs">SSS</span>
                <span className="text-gray-500 text-xs">total warnings</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-bold">27.4%</span>
                <span className="text-gray-400 text-xs">system</span>
                <span className="text-gray-500 text-xs">integration</span>
              </div>
            </div>

            {/* Residual Asset Statistics */}
            <div className="mt-8">
              <h3 className="text-white text-sm font-bold mb-4">
                RESIDUAL ASSET STATISTICS
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="rgba(138, 43, 226, 0.3)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="url(#purpleGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${73 * 2.2} 220`}
                        className="drop-shadow-lg"
                        style={{ filter: "drop-shadow(0 0 10px #8b5cf6)" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-purple-400 text-lg font-bold">
                        73%
                      </span>
                    </div>
                    <defs>
                      <linearGradient
                        id="purpleGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="rgba(6, 182, 212, 0.3)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="url(#cyanGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${60 * 2.2} 220`}
                        style={{ filter: "drop-shadow(0 0 10px #06b6d4)" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-cyan-400 text-lg font-bold">
                        60%
                      </span>
                    </div>
                    <defs>
                      <linearGradient
                        id="cyanGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Risk Statistics */}
            <div className="mt-8">
              <h3 className="text-white text-sm font-bold mb-4">
                REGIONAL RISK STATISTICS
              </h3>
              <div className="space-y-3">
                {[
                  { region: "Europe", percentage: 85, color: "bg-purple-500" },
                  { region: "North Am", percentage: 70, color: "bg-pink-500" },
                  { region: "Oceania", percentage: 55, color: "bg-blue-500" },
                  { region: "Asia", percentage: 40, color: "bg-orange-500" },
                  { region: "S.America", percentage: 25, color: "bg-red-500" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs w-16">
                      {stat.region}
                    </span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} transition-all duration-2000 shadow-lg`}
                        style={{
                          width: `${stat.percentage}%`,
                          filter: "drop-shadow(0 0 4px currentColor)",
                        }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs w-8">
                      {stat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aura Trend */}
            <div className="mt-8">
              <h3 className="text-white text-sm font-bold mb-4">AURA TREND</h3>
              <div className="h-24 relative bg-gray-900/50 rounded-lg p-2">
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
                    points="0,60 30,45 60,30 90,40 120,25 150,35 180,20 210,30 240,15"
                    style={{ filter: "drop-shadow(0 0 4px #8b5cf6)" }}
                  />
                  {/* Data points */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((x, i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={[60, 45, 30, 40, 25, 35, 20, 30, 15][i]}
                      r="2"
                      fill="#8b5cf6"
                      className="animate-pulse"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Center Panel - 3D Globe */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-96 h-96">
              {/* Outer Rings */}
              <div
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                style={{
                  animation: "spin 20s linear infinite",
                  filter: "drop-shadow(0 0 20px #00ffff50)",
                }}
              />
              <div
                className="absolute inset-8 rounded-full border border-purple-500/50"
                style={{
                  animation: "spin 15s linear infinite reverse",
                  filter: "drop-shadow(0 0 15px #8b5cf650)",
                }}
              />

              {/* Main Globe Container */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-cyan-400/30 overflow-hidden">
                {/* Globe Grid Pattern */}
                <div className="absolute inset-0 rounded-full">
                  {/* Latitude lines */}
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400/40"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/60"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400/40"></div>

                  {/* Longitude lines */}
                  <div className="absolute top-0 bottom-0 left-1/4 w-px bg-cyan-400/40"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/60"></div>
                  <div className="absolute top-0 bottom-0 left-3/4 w-px bg-cyan-400/40"></div>

                  {/* Curved lines simulation */}
                  <div className="absolute inset-4 rounded-full border border-cyan-400/30"></div>
                  <div className="absolute inset-8 rounded-full border border-cyan-400/20"></div>
                </div>

                {/* Continents Simulation with Dots */}
                <div className="absolute inset-0">
                  {[...Array(200)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                      style={{
                        left: `${15 + Math.random() * 70}%`,
                        top: `${15 + Math.random() * 70}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        opacity: Math.random() * 0.8 + 0.2,
                      }}
                    />
                  ))}
                </div>

                {/* Central Platform */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* Platform Base */}
                    <div className="w-24 h-6 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full blur-sm"></div>
                    <div className="absolute inset-0 w-24 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>

                    {/* Platform Surface */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-r from-blue-500/60 to-purple-500/60 rounded-full border border-cyan-400/50"></div>

                    {/* KNOUX7 Logo */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center border border-cyan-400/50">
                        <span className="text-white font-bold text-xs">
                          KNOUX7
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Data Particles */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                    style={{
                      left: `${20 + Math.cos(i * 0.52 + animationStep * 0.01) * 60}%`,
                      top: `${20 + Math.sin(i * 0.52 + animationStep * 0.01) * 60}%`,
                      filter: "drop-shadow(0 0 4px #00ffff)",
                      animation: "pulse 2s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Orbiting Elements */}
              <div
                className="absolute inset-0"
                style={{ animation: "spin 25s linear infinite" }}
              >
                <div
                  className="absolute top-4 left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2 shadow-lg"
                  style={{ filter: "drop-shadow(0 0 6px #8b5cf6)" }}
                />
                <div
                  className="absolute bottom-4 left-1/2 w-2 h-2 bg-cyan-500 rounded-full transform -translate-x-1/2 shadow-lg"
                  style={{ filter: "drop-shadow(0 0 6px #06b6d4)" }}
                />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Individual Risk Statistics */}
            <div className="text-center">
              <h3 className="text-white text-sm font-bold mb-4">
                INDIVIDUAL RISK STATISTICS
              </h3>
              <div className="w-32 h-32 mx-auto relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="55"
                    stroke="rgba(138, 43, 226, 0.2)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="55"
                    stroke="url(#riskGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${85 * 3.45} 345`}
                    style={{ filter: "drop-shadow(0 0 15px #8b5cf6)" }}
                  />
                  <defs>
                    <linearGradient
                      id="riskGradient"
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
                    style={{ filter: "drop-shadow(0 0 8px #8b5cf6)" }}
                  />
                </div>
              </div>
            </div>

            {/* Individual Bar Chart */}
            <div className="mt-8">
              <h3 className="text-white text-sm font-bold mb-4">
                INDIVIDUAL RISK STATISTICS
              </h3>
              <div className="flex items-end gap-1 h-24 bg-gray-900/30 rounded-lg p-2">
                {[70, 85, 55, 95, 40, 75, 60, 88, 45, 80].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t transition-all duration-1000"
                      style={{
                        height: `${height}%`,
                        filter: "drop-shadow(0 0 4px #8b5cf6)",
                        animationDelay: `${index * 0.1}s`,
                      }}
                    />
                  ),
                )}
              </div>
            </div>

            {/* Used Today */}
            <div className="mt-8">
              <h3 className="text-white text-sm font-bold mb-4">USED TODAY</h3>
              <div className="space-y-4">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mx-auto"
                  style={{ filter: "drop-shadow(0 0 10px #06b6d4)" }}
                />
                <div className="grid grid-cols-6 gap-1">
                  {[...Array(18)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 bg-gray-700 rounded transition-all duration-1000 hover:bg-cyan-400"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Modules */}
        <div className="max-w-7xl mx-auto mt-12">
          <div className="grid grid-cols-7 gap-4">
            {modules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Link
                  key={index}
                  to={module.path}
                  className="group text-center p-4 rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
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
      `}</style>
    </div>
  );
}
