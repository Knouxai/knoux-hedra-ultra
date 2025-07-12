import { useState, useEffect } from "react";
import {
  Shield,
  Zap,
  Eye,
  Network,
  Brain,
  FileText,
  Settings,
  Activity,
  Swords,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState("ONLINE");
  const [threatLevel, setThreatLevel] = useState("SECURE");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cyberModules = [
    {
      id: 1,
      name: "Defensive Ops",
      nameAr: "قسم الدفاع السيبراني",
      icon: Shield,
      status: "ACTIVE",
      type: "defense",
      description: "7 defensive cybersecurity tools",
      path: "/defensive-ops",
      tools: 7,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400",
    },
    {
      id: 2,
      name: "Offensive Tools",
      nameAr: "قسم الهجوم الأخلاقي",
      icon: Swords,
      status: "STANDBY",
      type: "attack",
      description: "Ethical hacking and penetration testing",
      path: "/offensive-tools",
      tools: 7,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400",
    },
    {
      id: 3,
      name: "Surveillance",
      nameAr: "قسم أدوات المراقبة",
      icon: Eye,
      status: "MONITORING",
      type: "surveillance",
      description: "Advanced monitoring and surveillance tools",
      path: "/surveillance",
      tools: 7,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400",
    },
    {
      id: 4,
      name: "Net & VPN Control",
      nameAr: "قسم إدارة الاتصال والشبكات",
      icon: Network,
      status: "CONNECTED",
      type: "network",
      description: "Network management and VPN control",
      path: "/network-control",
      tools: 7,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400",
    },
    {
      id: 5,
      name: "AI Cyber Assistant",
      nameAr: "قسم التفاعل مع الذكاء الاصطناعي",
      icon: Brain,
      status: "LEARNING",
      type: "ai",
      description: "AI-powered cybersecurity assistance",
      path: "/ai-assistant",
      tools: 7,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400",
    },
    {
      id: 6,
      name: "Encrypted Reporting",
      nameAr: "قسم التقارير والتوثيق",
      icon: FileText,
      status: "READY",
      type: "reporting",
      description: "Secure report generation and storage",
      path: "/reporting",
      tools: 7,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400",
    },
    {
      id: 7,
      name: "Cosmic Settings",
      nameAr: "قسم الإعدادات والتحكم",
      icon: Settings,
      status: "CONFIGURED",
      type: "settings",
      description: "Advanced system configuration",
      path: "/cosmic-settings",
      tools: 7,
      color: "text-cyber-neon",
      bgColor: "bg-cyber-neon/10",
      borderColor: "border-cyber-neon",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyber-neon rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-neon-pink rounded-full animate-float animation-delay-1000 opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyber-neon-blue rounded-full animate-float animation-delay-2000 opacity-50"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="glass-cyber rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyber-neon animate-glow-pulse" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-cyber-neon neon-glow">
                  KNOX Sentinel
                </h1>
                <p className="text-cyber-purple-light">
                  Cosmic Cyber Shield™ | الأقسام السبعة
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono">{systemStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-neon rounded-full animate-pulse"></div>
                <span className="text-cyber-neon font-mono">{threatLevel}</span>
              </div>
              <div className="text-cyber-purple-light font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        {/* Welcome Message */}
        <div className="glass-cyber rounded-2xl p-8 mb-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-cyber-neon neon-glow mb-4">
            Welcome to your Cyber Fortress ⚡️
          </h2>
          <p className="text-cyber-purple-light text-lg mb-2">
            Advanced cybersecurity command center with 7 specialized modules
          </p>
          <p className="text-cyber-purple-light text-base mb-6">
            مركز قيادة أمني متقدم مع 7 وحدات متخصصة - كل وحدة تحتوي على 7 أدوات
            دقيقة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-cyber">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Engage All Modules
              </span>
            </button>
            <button className="btn-cyber mode-attack">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Emergency Response
              </span>
            </button>
          </div>
        </div>

        {/* Cyber Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {cyberModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className="glass-card rounded-xl p-6 group cursor-pointer block hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform ${module.bgColor} ${module.borderColor} border`}
                  >
                    <IconComponent className={`w-6 h-6 ${module.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        module.status === "ACTIVE" ||
                        module.status === "MONITORING"
                          ? "bg-green-400 animate-pulse"
                          : module.status === "LEARNING"
                            ? "bg-yellow-400 animate-pulse"
                            : module.status === "CONNECTED"
                              ? "bg-blue-400 animate-pulse"
                              : "bg-cyber-neon"
                      }`}
                    ></div>
                    <span className="text-xs font-mono text-cyber-purple-light">
                      {module.status}
                    </span>
                  </div>
                </div>

                <h3 className={`text-lg font-bold ${module.color} mb-1`}>
                  {module.name}
                </h3>
                <h4 className="text-sm text-cyber-purple-light mb-3 font-mono">
                  {module.nameAr}
                </h4>
                <p className="text-cyber-purple-light text-sm mb-4">
                  {module.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cyber-purple-light">
                      Tools:
                    </span>
                    <span className={`text-sm font-bold ${module.color}`}>
                      {module.tools}
                    </span>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${module.bgColor} ${module.color} border ${module.borderColor}`}
                  >
                    Module {module.id}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* System Status */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyber-neon neon-glow">
              7
            </div>
            <div className="text-cyber-purple-light text-sm">
              Active Modules
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">49</div>
            <div className="text-cyber-purple-light text-sm">Total Tools</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyber-neon neon-glow">
              AI
            </div>
            <div className="text-cyber-purple-light text-sm">Enhanced</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">∞</div>
            <div className="text-cyber-purple-light text-sm">Cyber Power</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 mt-8">
        <div className="glass-cyber rounded-xl p-4 text-center">
          <p className="text-cyber-purple-light text-sm">
            <span className="text-cyber-neon font-bold">KNOX Sentinel</span> |
            Cosmic Cyber Shield™ v1.0 Alpha |
            <span className="font-mono">knoux7-core</span> 💎
          </p>
          <p className="text-cyber-purple-light text-xs mt-1">
            الأقسام السبعة - Seven Modules of Cyber Excellence
          </p>
        </div>
      </footer>
    </div>
  );
}
