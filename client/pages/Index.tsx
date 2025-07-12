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
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface LiveStats {
  activeUsers: number;
  activeSystems: number;
  totalWarnings: number;
  systemIntegration: number;
  residualAsset1: number;
  residualAsset2: number;
  auraData: number[];
  regionalStats: { region: string; percentage: number; color: string }[];
  individualRisk: number;
  usedToday: number;
  barData: number[];
}

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedModule, setSelectedModule] = useState(0);
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
  });

  // Real-time data simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      if (isLiveMode) {
        setLiveStats((prev) => ({
          ...prev,
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 6) - 3,
          activeSystems: prev.activeSystems + Math.floor(Math.random() * 10) - 5,
          totalWarnings: Math.max(0, prev.totalWarnings + Math.floor(Math.random() * 4) - 2),
          systemIntegration: Math.max(0, Math.min(100, prev.systemIntegration + (Math.random() - 0.5) * 2)),
          residualAsset1: Math.max(0, Math.min(100, prev.residualAsset1 + (Math.random() - 0.5) * 3)),
          residualAsset2: Math.max(0, Math.min(100, prev.residualAsset2 + (Math.random() - 0.5) * 3)),
          individualRisk: Math.max(0, Math.min(100, prev.individualRisk + (Math.random() - 0.5) * 2)),
          auraData: prev.auraData.map(() => Math.random() * 50 + 5),
          barData: prev.barData.map(() => Math.random() * 90 + 10),
          regionalStats: prev.regionalStats.map(stat => ({
            ...stat,
            percentage: Math.max(0, Math.min(100, stat.percentage + (Math.random() - 0.5) * 5))
          }))
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLiveMode]);

  const modules = [
    {
      name: "Defensive Ops",
      nameAr: "الدفاع السيبراني",
      path: "/defensive-ops",
      icon: Shield,
      status: "SECURE",
      color: "#10b981",
      tools: ["Active Services", "Ports Shield", "Process Monitor", "Malware Blocker", "VaultPass", "AES Encryption", "Sentinel Alerts"]
    },
    {
      name: "Offensive Tools", 
      nameAr: "الهجوم الأخلاقي",
      path: "/offensive-tools",
      icon: Zap,
      status: "ARMED",
      color: "#ef4444",
      tools: ["AutoRecon", "Packet Sniffer", "Script Gen", "WiFi Pentest", "OSINT Tools", "MAC Spoof", "CVE Exploit"]
    },
    {
      name: "Surveillance",
      nameAr: "المراقبة", 
      path: "/surveillance",
      icon: Eye,
      status: "MONITORING",
      color: "#f59e0b",
      tools: ["System Watchdog", "Network Monitor", "File Tracker", "3rd Party Monitor", "Login Detector", "Camera Monitor", "User Logger"]
    },
    {
      name: "Network Control",
      nameAr: "الشبكات",
      path: "/network-control", 
      icon: Network,
      status: "CONNECTED",
      color: "#3b82f6",
      tools: ["Network Map", "VPN Control", "DNS Leak Check", "Proxy Detector", "Speed Test", "LAN Defender", "WebRTC Blocker"]
    },
    {
      name: "AI Assistant",
      nameAr: "الذكاء الاصطناعي",
      path: "/ai-assistant",
      icon: Brain,
      status: "LEARNING", 
      color: "#8b5cf6",
      tools: ["Script Generator", "Tool Recommender", "File Analyzer", "ChatKnox AI", "System Optimizer", "YOLO/Whisper", "Voice Commands"]
    },
    {
      name: "Reporting",
      nameAr: "التقارير",
      path: "/reporting",
      icon: FileText,
      status: "READY",
      color: "#06b6d4",
      tools: ["PDF Generator", "Attack Reports", "Knoux Signature", "Time Analysis", "Password Protection", "Cloud Sync", "Archive Manager"]
    },
    {
      name: "Settings",
      nameAr: "الإعدادات",
      path: "/cosmic-settings",
      icon: Settings,
      status: "CONFIGURED",
      color: "#d946ef",
      tools: ["UI Customizer", "Dark/Light Mode", "Alert Manager", "Tool Selector", "Firewall Settings", "Access Control", "AI Model Selection"]
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10"></div>
      
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
                <h1 className="text-3xl font-bold text-cyan-400 tracking-wider" style={{ textShadow: "0 0 20px #00ffff" }}>
                  KNOUX7
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-cyan-400/60 text-sm">.....</span>
                  <span className="text-cyan-400 text-sm font-medium tracking-widest">INTELLIGENT DEVELOPMENT</span>
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
                      ? 'border-green-400 bg-green-400/10 text-green-400' 
                      : 'border-gray-600 bg-gray-600/10 text-gray-400'
                  }`}
                >
                  {isLiveMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:border-cyan-400 transition-all">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="relative z-30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6 h-[480px]">
            
            {/* Left Panel - Live Stats */}
            <div className="col-span-3 space-y-4">
              {/* Real-time Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-lg">{liveStats.activeUsers}</span>
                  <span className="text-gray-400 text-xs">online</span>
                  <span className="text-gray-500 text-xs">users connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-lg">{liveStats.activeSystems}</span>
                  <span className="text-gray-400 text-xs">GDP</span>
                  <span className="text-gray-500 text-xs">active systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">{liveStats.totalWarnings}</span>
                  <span className="text-gray-400 text-xs">SSS</span>
                  <span className="text-gray-500 text-xs">total warnings</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold text-lg">{liveStats.systemIntegration.toFixed(1)}%</span>
                  <span className="text-gray-400 text-xs">system</span>
                  <span className="text-gray-500 text-xs">integration</span>
                </div>
              </div>

              {/* Residual Asset Statistics */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  RESIDUAL RESET STATISTICS
                </h3>
                <div className="flex gap-6 justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 relative">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="6" fill="none" />
                        <circle
                          cx="40" cy="40" r="32"
                          stroke="#06b6d4" strokeWidth="6" fill="none"
                          strokeDasharray={`${liveStats.residualAsset2 * 2.01} 201`}
                          style={{ filter: "drop-shadow(0 0 8px #06b6d4)", strokeLinecap: "round" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-cyan-400 text-lg font-bold">{Math.round(liveStats.residualAsset2)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 relative">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="6" fill="none" />
                        <circle
                          cx="40" cy="40" r="32"
                          stroke="#8b5cf6" strokeWidth="6" fill="none"
                          strokeDasharray={`${liveStats.residualAsset1 * 2.01} 201`}
                          style={{ filter: "drop-shadow(0 0 8px #8b5cf6)", strokeLinecap: "round" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-purple-400 text-lg font-bold">{Math.round(liveStats.residualAsset1)}%</span>
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
                  {liveStats.regionalStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-300 text-xs w-16 font-medium">{stat.region}</span>
                      <div className="flex-1 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.color,
                            filter: `drop-shadow(0 0 4px ${stat.color})`,
                          }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs w-8 text-right">{Math.round(stat.percentage)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aura Trend */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">AURA TREND</h3>
                <div className="h-16 bg-gray-900/30 rounded-lg p-2 border border-gray-700/30">
                  <svg className="w-full h-full">
                    <defs>
                      <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none" stroke="url(#auraGradient)" strokeWidth="2"
                      points={liveStats.auraData.map((val, i) => `${i * 30},${val}`).join(' ')}
                      style={{ filter: "drop-shadow(0 0 4px #8b5cf6)" }}
                    />
                    <polygon
                      fill="url(#auraGradient)" opacity="0.1"
                      points={`${liveStats.auraData.map((val, i) => `${i * 30},${val}`).join(' ')} 240,48 0,48`}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Center Panel - Module Preview */}
            <div className="col-span-6 flex flex-col items-center justify-center">
              {/* Module Selector */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {modules.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedModule(index)}
                      className={`flex-shrink-0 p-3 rounded-lg border transition-all ${
                        selectedModule === index
                          ? 'border-cyan-400 bg-cyan-400/20'
                          : 'border-gray-700 bg-gray-900/30 hover:border-gray-500'
                      }`}
                    >
                      <IconComponent 
                        className="w-5 h-5" 
                        style={{ color: selectedModule === index ? '#00ffff' : module.color }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Selected Module Preview */}
              <div className="w-full max-w-md">
                <div className="glass-card rounded-xl p-6 border" style={{ borderColor: modules[selectedModule].color + '40' }}>
                  <div className="text-center mb-4">
                    <div 
                      className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                      style={{ 
                        backgroundColor: modules[selectedModule].color + '20',
                        border: `2px solid ${modules[selectedModule].color}60`
                      }}
                    >
                      <modules[selectedModule].icon 
                        className="w-8 h-8" 
                        style={{ color: modules[selectedModule].color }}
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: modules[selectedModule].color }}>
                      {modules[selectedModule].name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{modules[selectedModule].nameAr}</p>
                    <div 
                      className="text-xs px-3 py-1 rounded-full inline-block"
                      style={{ 
                        backgroundColor: modules[selectedModule].color + '20',
                        color: modules[selectedModule].color
                      }}
                    >
                      {modules[selectedModule].status}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white text-sm font-bold">Live Tools Status:</h4>
                    {modules[selectedModule].tools.map((tool, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{tool}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`w-2 h-2 rounded-full ${
                              Math.random() > 0.3 ? 'bg-green-400' : 'bg-yellow-400'
                            } animate-pulse`}
                          />
                          <span className="text-gray-400">
                            {Math.random() > 0.3 ? 'ACTIVE' : 'STANDBY'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link 
                    to={modules[selectedModule].path}
                    className="w-full mt-4 p-3 rounded-lg border-2 text-center font-bold transition-all hover:scale-105 block"
                    style={{ 
                      borderColor: modules[selectedModule].color,
                      color: modules[selectedModule].color,
                      backgroundColor: modules[selectedModule].color + '10'
                    }}
                  >
                    Launch Module
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Panel - Additional Stats */}
            <div className="col-span-3 space-y-4">
              {/* Individual Risk Statistics */}
              <div className="text-center">
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  INDIVIDUAL RISK STATISTICS
                </h3>
                <div className="w-24 h-24 mx-auto relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="8" fill="none" />
                    <circle
                      cx="48" cy="48" r="40"
                      stroke="url(#individualGradient)" strokeWidth="8" fill="none"
                      strokeDasharray={`${liveStats.individualRisk * 2.51} 251`}
                      style={{ filter: "drop-shadow(0 0 12px #8b5cf6)", strokeLinecap: "round" }}
                    />
                    <defs>
                      <linearGradient id="individualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ filter: "drop-shadow(0 0 8px #8b5cf6)" }} />
                  </div>
                </div>
              </div>

              {/* Individual Bar Chart */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">
                  INDIVIDUAL RISK STATISTICS
                </h3>
                <div className="flex items-end gap-1 h-20 bg-gray-900/20 rounded-lg p-2 border border-gray-700/20">
                  {liveStats.barData.map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-purple-600 via-purple-500 to-pink-400 rounded-sm transition-all duration-1000"
                      style={{
                        height: `${height}%`,
                        filter: "drop-shadow(0 0 3px #8b5cf6)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Used Today */}
              <div>
                <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-wider">USED TODAY</h3>
                <div className="space-y-3">
                  <div 
                    className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl border border-cyan-400/30"
                    style={{ filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))" }}
                  />
                  <div className="grid grid-cols-6 gap-1">
                    {[...Array(18)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-sm transition-all duration-1000 ${
                          i < liveStats.usedToday ? 'bg-cyan-400' : 'bg-gray-700/50'
                        }`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      />
                    ))}
                  </div>
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
                    <span className="font-bold">KNOX Sentinel</span> | Cosmic Cyber Shield™ v1.0 Alpha
                  </span>
                  <span className="text-gray-400">knoux7-core 💎</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded ${isLiveMode ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                    {isLiveMode ? 'LIVE' : 'PAUSED'}
                  </span>
                  <span className="text-gray-400">7 Modules Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}