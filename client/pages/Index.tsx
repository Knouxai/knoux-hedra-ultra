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
  Globe,
  Activity,
  Users,
  TrendingUp,
  AlertTriangle,
  Lock,
  Cpu,
} from "lucide-react";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    online: 148,
    active: 334,
    warnings: 160,
    efficiency: 27.4,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate real-time data updates
    const statsTimer = setInterval(() => {
      setSystemStats((prev) => ({
        online: prev.online + Math.floor(Math.random() * 3) - 1,
        active: prev.active + Math.floor(Math.random() * 5) - 2,
        warnings: prev.warnings + Math.floor(Math.random() * 2) - 1,
        efficiency: Math.max(
          0,
          Math.min(100, prev.efficiency + (Math.random() - 0.5) * 2),
        ),
      }));
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(statsTimer);
    };
  }, []);

  const modules = [
    {
      id: 1,
      name: "Defensive Ops",
      nameAr: "الدفاع السيبراني",
      icon: Shield,
      path: "/defensive-ops",
      color: "from-green-500 to-emerald-600",
      value: "73%",
      status: "SECURE",
    },
    {
      id: 2,
      name: "Offensive Tools",
      nameAr: "الهجوم الأخلاقي",
      icon: Zap,
      path: "/offensive-tools",
      color: "from-red-500 to-pink-600",
      value: "60%",
      status: "ARMED",
    },
    {
      id: 3,
      name: "Surveillance",
      nameAr: "المراقبة",
      icon: Eye,
      path: "/surveillance",
      color: "from-yellow-500 to-orange-600",
      value: "89%",
      status: "MONITORING",
    },
    {
      id: 4,
      name: "Network Control",
      nameAr: "إدارة الشبكات",
      icon: Network,
      path: "/network-control",
      color: "from-blue-500 to-cyan-600",
      value: "92%",
      status: "CONNECTED",
    },
    {
      id: 5,
      name: "AI Assistant",
      nameAr: "الذكاء الاصطناعي",
      icon: Brain,
      path: "/ai-assistant",
      color: "from-purple-500 to-violet-600",
      value: "AI",
      status: "LEARNING",
    },
    {
      id: 6,
      name: "Reporting",
      nameAr: "التقارير",
      icon: FileText,
      path: "/reporting",
      color: "from-cyan-500 to-teal-600",
      value: "156",
      status: "READY",
    },
    {
      id: 7,
      name: "Settings",
      nameAr: "الإعدادات",
      icon: Settings,
      path: "/cosmic-settings",
      color: "from-indigo-500 to-purple-600",
      value: "∞",
      status: "CONFIGURED",
    },
  ];

  const regionalStats = [
    { region: "Europe", percentage: 85, color: "bg-purple-500" },
    { region: "North Am", percentage: 60, color: "bg-pink-500" },
    { region: "Oceania", percentage: 45, color: "bg-blue-500" },
    { region: "Asia", percentage: 30, color: "bg-orange-500" },
    { region: "S.America", percentage: 15, color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-neon rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full glass-cyber flex items-center justify-center relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">K7</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-cyber-neon animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyber-neon neon-glow">
                KNOUX7
              </h1>
              <p className="text-cyber-purple-light text-sm">
                INTELLIGENT DEVELOPMENT
              </p>
            </div>
          </div>

          <div className="text-cyber-purple-light text-sm font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="relative z-40 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Stats */}
          <div className="space-y-6">
            {/* Top Stats */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-cyber-neon" />
                <span className="text-cyber-neon text-sm font-bold">
                  {systemStats.online}
                </span>
                <span className="text-cyber-purple-light text-xs">
                  online users connected
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-bold">
                  {systemStats.active}
                </span>
                <span className="text-cyber-purple-light text-xs">
                  active systems
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-bold">
                  {systemStats.warnings}
                </span>
                <span className="text-cyber-purple-light text-xs">
                  total warnings
                </span>
              </div>
            </div>

            {/* Residual Asset Statistics */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-cyber-neon text-sm font-bold mb-4">
                RESIDUAL ASSET STATISTICS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 relative">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-cyber-dark-secondary"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${73 * 1.76} 176`}
                        className="text-purple-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-purple-500 text-xs font-bold">
                        73%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 relative">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-cyber-dark-secondary"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${60 * 1.76} 176`}
                        className="text-cyan-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-cyan-500 text-xs font-bold">
                        60%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Risk Statistics */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-cyber-neon text-sm font-bold mb-4">
                REGIONAL RISK STATISTICS
              </h3>
              <div className="space-y-3">
                {regionalStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-cyber-purple-light text-xs w-16">
                      {stat.region}
                    </span>
                    <div className="flex-1 h-2 bg-cyber-dark-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} transition-all duration-1000`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-cyber-purple-light text-xs w-8">
                      {stat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aura Trend */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-cyber-neon text-sm font-bold mb-4">
                AURA TREND
              </h3>
              <div className="h-20 relative">
                <svg className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    points="0,60 20,45 40,30 60,40 80,25 100,35 120,20 140,30 160,15"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Center Panel - Main Globe/Visual */}
          <div className="flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyber-neon animate-pulse opacity-30"></div>
              <div className="absolute inset-4 rounded-full border border-purple-500 animate-pulse opacity-50"></div>

              {/* Central Globe Container */}
              <div className="absolute inset-8 rounded-full glass-cyber flex items-center justify-center overflow-hidden">
                {/* Globe Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-full"></div>

                {/* Globe Grid Pattern */}
                <div className="absolute inset-0 rounded-full opacity-30">
                  <div className="w-full h-full rounded-full border border-cyber-neon"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-cyber-neon"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyber-neon"></div>
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-cyber-neon opacity-50"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-cyber-neon opacity-50"></div>
                </div>

                {/* KNOUX7 Logo in Center */}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-glow-pulse">
                    <span className="text-white font-bold text-lg">K7</span>
                  </div>
                  <div className="text-cyber-neon text-xs font-mono">
                    KNOUX7
                  </div>
                </div>

                {/* Floating Data Points */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyber-neon rounded-full animate-ping"
                    style={{
                      left: `${20 + Math.cos(i * 0.785) * 80}%`,
                      top: `${20 + Math.sin(i * 0.785) * 80}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Orbiting Elements */}
              <div
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: "20s" }}
              >
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-500 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* Right Panel - Individual Stats & Used Today */}
          <div className="space-y-6">
            {/* System Integration */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-cyber-neon" />
                <span className="text-cyber-neon text-sm font-bold">
                  {systemStats.efficiency.toFixed(1)}%
                </span>
                <span className="text-cyber-purple-light text-xs">
                  system integration
                </span>
              </div>
            </div>

            {/* Individual Risk Statistics */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-cyber-neon text-sm font-bold mb-4">
                INDIVIDUAL RISK STATISTICS
              </h3>
              <div className="w-24 h-24 mx-auto relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-cyber-dark-secondary"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${85 * 2.51} 251`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Individual Bar Chart */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-cyber-neon text-sm font-bold mb-4">
                INDIVIDUAL RISK STATISTICS
              </h3>
              <div className="flex items-end gap-2 h-20">
                {[60, 80, 45, 90, 35, 70, 55, 85].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Used Today */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-cyber-neon text-sm font-bold mb-4">
                USED TODAY
              </h3>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 bg-cyber-dark-secondary rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Modules Section */}
        <div className="max-w-7xl mx-auto mt-8">
          <h2 className="text-cyber-neon text-xl font-bold mb-6 text-center neon-glow">
            الأقسام السبعة | Seven Modules
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.path}
                  className="glass-card rounded-xl p-4 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-cyber-neon text-xs font-bold mb-1">
                      {module.name}
                    </h3>
                    <p className="text-cyber-purple-light text-xs mb-2">
                      {module.nameAr}
                    </p>
                    <div className="text-lg font-bold text-cyber-neon neon-glow">
                      {module.value}
                    </div>
                    <div className="text-xs text-cyber-purple-light">
                      {module.status}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-40 p-6 text-center">
        <p className="text-cyber-purple-light text-sm">
          <span className="text-cyber-neon font-bold">KNOX Sentinel</span> |
          Cosmic Cyber Shield™ v1.0 Alpha |{" "}
          <span className="font-mono">knoux7-core</span> 💎
        </p>
      </footer>
    </div>
  );
}
