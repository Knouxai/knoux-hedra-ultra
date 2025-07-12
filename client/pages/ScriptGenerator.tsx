import { useState } from "react";
import { Zap, ArrowLeft, Code, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function ScriptGenerator() {
  const [scriptType, setScriptType] = useState<"defense" | "attack">("defense");
  const [language, setLanguage] = useState<"powershell" | "bash" | "python">(
    "powershell",
  );

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
              <Zap className="w-6 h-6 text-cyber-neon animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-cyber-neon neon-glow">
                Script Generator
              </h1>
              <p className="text-cyber-purple-light">
                AI-Powered Cyber Script Creation
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
            <h2 className="text-xl font-bold text-cyber-neon mb-6">
              Script Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cyber-purple-light text-sm font-medium mb-2">
                  Script Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setScriptType("defense")}
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      scriptType === "defense"
                        ? "border-green-400 bg-green-400/10 text-green-400"
                        : "border-cyber-glass-border text-cyber-purple-light"
                    }`}
                  >
                    Defense
                  </button>
                  <button
                    onClick={() => setScriptType("attack")}
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      scriptType === "attack"
                        ? "border-red-400 bg-red-400/10 text-red-400"
                        : "border-cyber-glass-border text-cyber-purple-light"
                    }`}
                  >
                    Attack
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-cyber-purple-light text-sm font-medium mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value as "powershell" | "bash" | "python",
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg bg-cyber-dark/50 border border-cyber-glass-border text-cyber-neon focus:border-cyber-neon focus:outline-none"
                >
                  <option value="powershell">PowerShell</option>
                  <option value="bash">Bash</option>
                  <option value="python">Python</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-cyber-purple-light text-sm font-medium mb-2">
                Script Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-cyber-dark/50 border border-cyber-glass-border text-cyber-neon placeholder-cyber-purple-light/50 focus:border-cyber-neon focus:outline-none resize-none"
                rows={3}
                placeholder="Describe what you want the script to do..."
              />
            </div>

            <button className="w-full btn-cyber mt-6 py-4">
              <span className="flex items-center justify-center gap-2">
                <Code className="w-5 h-5" />
                Generate Script
              </span>
            </button>
          </div>

          {/* Generated Script */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-cyber-neon">
                Generated Script
              </h3>
              <button className="btn-cyber px-4 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </span>
              </button>
            </div>

            <div className="bg-cyber-dark rounded-lg p-4 font-mono text-sm">
              <div className="text-cyber-purple-light mb-2">
                # Generated by knoux7-core Script Generator
              </div>
              <div className="text-cyber-neon">
                {language === "powershell" && (
                  <>
                    <div># PowerShell Defense Script</div>
                    <div>Get-Process | Where-Object &#123;</div>
                    <div>&nbsp;&nbsp;$_.ProcessName -notmatch "system"</div>
                    <div>&#125; | Select-Object Name, Id, CPU</div>
                  </>
                )}
                {language === "bash" && (
                  <>
                    <div>#!/bin/bash</div>
                    <div># Bash Defense Script</div>
                    <div>
                      ps aux | grep -v "system" | awk '&#123;print $2,
                      $11&#125;'
                    </div>
                  </>
                )}
                {language === "python" && (
                  <>
                    <div>#!/usr/bin/env python3</div>
                    <div># Python Defense Script</div>
                    <div>import psutil</div>
                    <div>for proc in psutil.process_iter():</div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;print(proc.name(), proc.pid)
                    </div>
                  </>
                )}
              </div>
              <div className="text-cyber-purple-light mt-4 text-xs">
                Signature: knoux7-core | Cosmic Cyber Shield™
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
