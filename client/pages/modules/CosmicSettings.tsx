import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function CosmicSettings() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <header className="p-6">
        <div className="glass-cyber rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg glass-cyber flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-cyber-neon" />
            </Link>
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center bg-cyber-neon/10 border border-cyber-neon">
              <Settings className="w-6 h-6 text-cyber-neon animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-cyber-neon neon-glow">
                Cosmic Settings
              </h1>
              <p className="text-cyber-purple-light">
                قسم الإعدادات والتحكم - Module 7 of 7
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-cyber-neon mb-4">
              Cosmic Settings Module
            </h2>
            <p className="text-cyber-purple-light mb-6">
              Advanced system configuration with 7 control tools. Full
              implementation coming soon...
            </p>
            <div className="w-32 h-32 mx-auto bg-cyber-dark rounded-xl flex items-center justify-center mb-6">
              <Settings className="w-16 h-16 text-cyber-neon animate-glow-pulse" />
            </div>
            <button className="btn-cyber">Configure System</button>
          </div>
        </div>
      </main>
    </div>
  );
}
