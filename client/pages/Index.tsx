import { useState, useEffect } from "react";
import { Shield, Zap, Eye, Lock, Target, Activity } from "lucide-react";

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

  const cyberTools = [
    {
      id: 1,
      name: "SerpentTrap",
      icon: Eye,
      status: "ACTIVE",
      type: "monitor",
      description: "Process monitoring & threat detection",
    },
    {
      id: 2,
      name: "3D Deterrence",
      icon: Shield,
      status: "STANDBY",
      type: "defense",
      description: "Animated defense protocols",
    },
    {
      id: 3,
      name: "Script Generator",
      icon: Zap,
      status: "READY",
      type: "tool",
      description: "Attack/Defense script creation",
    },
    {
      id: 4,
      name: "VPN Shield",
      icon: Lock,
      status: "DISCONNECTED",
      type: "network",
      description: "WireGuard/OpenVPN control",
    },
    {
      id: 5,
      name: "System Scanner",
      icon: Target,
      status: "READY",
      type: "scan",
      description: "Full system security audit",
    },
    {
      id: 6,
      name: "AI Sentinel",
      icon: Activity,
      status: "LEARNING",
      type: "ai",
      description: "Intelligent threat analysis",
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
                <p className="text-cyber-purple-light">Cosmic Cyber Shield™</p>
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
          <p className="text-cyber-purple-light text-lg mb-6">
            Advanced cybersecurity command center with AI-powered threat
            detection and response
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-cyber">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Engage All Defenses
              </span>
            </button>
            <button className="btn-cyber mode-attack">
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Counterstrike Mode
              </span>
            </button>
          </div>
        </div>

        {/* Cyber Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cyberTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                className="glass-card rounded-xl p-6 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-cyber-neon" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tool.status === "ACTIVE"
                          ? "bg-green-400 animate-pulse"
                          : tool.status === "LEARNING"
                            ? "bg-yellow-400 animate-pulse"
                            : tool.status === "DISCONNECTED"
                              ? "bg-red-400"
                              : "bg-cyber-neon"
                      }`}
                    ></div>
                    <span className="text-xs font-mono text-cyber-purple-light">
                      {tool.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-cyber-neon mb-2">
                  {tool.name}
                </h3>
                <p className="text-cyber-purple-light text-sm mb-4">
                  {tool.description}
                </p>

                <div className="flex gap-2">
                  <button className="btn-cyber text-xs px-3 py-1.5 mode-defense">
                    Defend
                  </button>
                  <button className="btn-cyber text-xs px-3 py-1.5 mode-attack">
                    Attack
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyber-neon neon-glow">
              24/7
            </div>
            <div className="text-cyber-purple-light text-sm">System Uptime</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-cyber-purple-light text-sm">
              Active Threats
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyber-neon neon-glow">
              156
            </div>
            <div className="text-cyber-purple-light text-sm">
              Blocked Attempts
            </div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">AI</div>
            <div className="text-cyber-purple-light text-sm">Mode Active</div>
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
        </div>
      </footer>
    </div>
  );
}
