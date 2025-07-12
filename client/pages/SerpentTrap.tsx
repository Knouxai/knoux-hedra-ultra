import { useState } from "react";
import { Eye, ArrowLeft, Shield, Activity, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function SerpentTrap() {
  const [isActive, setIsActive] = useState(false);

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
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center">
              <Eye className="w-6 h-6 text-cyber-neon animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-cyber-neon neon-glow">
                SerpentTrap
              </h1>
              <p className="text-cyber-purple-light">
                Process Monitoring & Threat Detection
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Control Panel */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-cyber-neon">
                Monitoring Control
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isActive ? "bg-green-400 animate-pulse" : "bg-red-400"
                    }`}
                  ></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {isActive ? "ACTIVE" : "STANDBY"}
                  </span>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`btn-cyber px-6 py-2 ${
                    isActive ? "mode-attack" : "mode-defense"
                  }`}
                >
                  {isActive ? "Stop Monitor" : "Start Monitor"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Activity className="w-8 h-8 text-cyber-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyber-neon">1,247</div>
                <div className="text-xs text-cyber-purple-light">
                  Processes Monitored
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">98.2%</div>
                <div className="text-xs text-cyber-purple-light">
                  Security Score
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">3</div>
                <div className="text-xs text-cyber-purple-light">
                  Suspicious Activities
                </div>
              </div>
            </div>
          </div>

          {/* Live Feed */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-cyber-neon mb-4">
              Live Process Feed
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {[
                {
                  pid: "1234",
                  name: "chrome.exe",
                  status: "safe",
                  cpu: "12.3%",
                },
                {
                  pid: "5678",
                  name: "svchost.exe",
                  status: "safe",
                  cpu: "2.1%",
                },
                {
                  pid: "9012",
                  name: "unknown_proc.exe",
                  status: "suspicious",
                  cpu: "45.2%",
                },
                {
                  pid: "3456",
                  name: "explorer.exe",
                  status: "safe",
                  cpu: "8.7%",
                },
              ].map((process) => (
                <div
                  key={process.pid}
                  className="flex items-center justify-between p-3 glass-cyber rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        process.status === "safe"
                          ? "bg-green-400"
                          : "bg-red-400 animate-pulse"
                      }`}
                    ></div>
                    <div>
                      <div className="text-cyber-neon font-mono text-sm">
                        {process.name}
                      </div>
                      <div className="text-xs text-cyber-purple-light">
                        PID: {process.pid}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyber-neon font-mono text-sm">
                      {process.cpu}
                    </div>
                    <div
                      className={`text-xs ${
                        process.status === "safe"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {process.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn-cyber p-4 mode-defense">
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <div>Generate Defense Report</div>
                <div className="text-xs opacity-70">
                  PDF with knoux signature
                </div>
              </div>
            </button>
            <button className="btn-cyber p-4 mode-attack">
              <div className="text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                <div>Terminate Threats</div>
                <div className="text-xs opacity-70">
                  Automated threat response
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
