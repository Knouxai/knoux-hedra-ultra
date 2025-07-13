import { useState } from "react";
import {
  ArrowLeft,
  Brain,
  Code,
  MessageSquare,
  Search,
  Settings,
  FileSearch,
  Mic,
  Play,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AIAssistant() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      type: "system",
      message: "ChatKnox AI initialized. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      type: "user",
      message: chatInput,
      timestamp: new Date(),
    };

    const aiResponse = {
      type: "ai",
      message: `AI Response: Analyzing "${chatInput}" for security implications...`,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage, aiResponse]);
    setChatInput("");
  };

  const aiTools = [
    {
      id: "script-gen",
      name: "Knoux ScriptGen",
      nameAr: "توليد سكربت من وصف بسيط",
      icon: Code,
      description: "AI-powered custom script generation",
      status: "READY",
      emoji: "🧠",
    },
    {
      id: "tool-recommender",
      name: "Tool Recommender",
      nameAr: "توصية بالأدوات الأنسب للهجمة/الدفاع",
      icon: Search,
      description: "Scenario-based tool recommendation",
      status: "ACTIVE",
      emoji: "🤖",
    },
    {
      id: "file-analyzer",
      name: "File Vulnerability Analyzer",
      nameAr: "تحليل ملف وشرح الثغرات الموجودة فيه",
      icon: FileSearch,
      description: "Intelligent file analysis and vulnerability detection",
      status: "READY",
      emoji: "🔍",
    },
    {
      id: "chat-knox",
      name: "ChatKnox AI",
      nameAr: "محادثة أمنية مع ChatKnox AI",
      icon: MessageSquare,
      description: "Interactive security assistant chat",
      status: "ONLINE",
      emoji: "💬",
    },
    {
      id: "system-optimizer",
      name: "System Optimizer",
      nameAr: "اقتراح إعدادات أفضل لحماية النظام",
      icon: Settings,
      description: "Intelligent system security optimization",
      status: "READY",
      emoji: "⚡",
    },
    {
      id: "yolo-whisper",
      name: "YOLO/Whisper Integration",
      nameAr: "استدعاء YOLO/Whisper لفحص صور/صوت",
      icon: Brain,
      description: "AI-powered image and audio analysis",
      status: "READY",
      emoji: "👁️",
    },
    {
      id: "voice-commands",
      name: "Voice Commands",
      nameAr: "دعم الأوامر الصوتية للأدوات",
      icon: Mic,
      description: "Voice-activated tool execution",
      status: "LISTENING",
      emoji: "🎤",
    },
  ];

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
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center bg-purple-400/10 border border-purple-400">
              <Brain className="w-6 h-6 text-purple-400 animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-purple-400 neon-glow">
                AI Cyber Assistant
              </h1>
              <p className="text-cyber-purple-light">
                قسم التفاعل مع الذكاء الاصطناعي - Module 5 of 7
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Module Overview */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-purple-400">
                AI Cyber Operations Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {activeTools.length}/7 AI TOOLS ACTIVE
                  </span>
                </div>
                <button
                  onClick={() =>
                    setActiveTools(
                      activeTools.length === 7 ? [] : aiTools.map((t) => t.id),
                    )
                  }
                  className="btn-cyber px-4 py-2 text-sm"
                  style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
                >
                  {activeTools.length === 7 ? "Disable All" : "Enable All"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">AI</div>
                <div className="text-xs text-cyber-purple-light">
                  Intelligence Ready
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Zap className="w-8 h-8 text-cyber-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyber-neon">
                  {activeTools.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Tools Active
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {chatMessages.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Chat Messages
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Settings className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">GPT-4</div>
                <div className="text-xs text-cyber-purple-light">
                  AI Model Active
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Tools Grid */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-purple-400 mb-4">
                AI Cyber Tools Arsenal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {aiTools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = activeTools.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      className="glass-card rounded-xl p-4 group cursor-pointer hover:scale-105 transition-all duration-300"
                      onClick={() => toggleTool(tool.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform ${isActive ? "bg-purple-400/20 border-purple-400" : "border-cyber-glass-border"} border`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${isActive ? "text-purple-400" : "text-cyber-neon"}`}
                          />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-lg">{tool.emoji}</div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              tool.status === "ACTIVE" ||
                              tool.status === "ONLINE" ||
                              tool.status === "LISTENING"
                                ? "bg-green-400 animate-pulse"
                                : "bg-purple-400"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <h4
                        className={`text-sm font-bold ${isActive ? "text-purple-400" : "text-cyber-neon"} mb-1`}
                      >
                        {tool.name}
                      </h4>
                      <h5 className="text-xs text-cyber-purple-light mb-2 font-mono">
                        {tool.nameAr}
                      </h5>
                      <p className="text-cyber-purple-light text-xs mb-3">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono ${isActive ? "text-purple-400" : "text-cyber-purple-light"}`}
                        >
                          {tool.status}
                        </span>
                        <button
                          className={`text-xs px-2 py-1 rounded-full border transition-all ${
                            isActive
                              ? "bg-purple-400/10 text-purple-400 border-purple-400"
                              : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-purple-400/10 hover:text-purple-400 hover:border-purple-400"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "ACTIVATE"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ChatKnox AI Interface */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-bold text-purple-400 mb-4">
                ChatKnox AI Interface
              </h3>
              <div className="glass-card rounded-xl p-4 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-sm ${
                        msg.type === "user"
                          ? "bg-purple-400/10 text-purple-400 ml-4"
                          : msg.type === "ai"
                            ? "bg-cyber-neon/10 text-cyber-neon mr-4"
                            : "bg-cyber-glass/50 text-cyber-purple-light"
                      }`}
                    >
                      <div className="font-mono text-xs opacity-70 mb-1">
                        {msg.type.toUpperCase()} •{" "}
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                      {msg.message}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask ChatKnox AI..."
                    className="flex-1 px-3 py-2 bg-cyber-glass/30 border border-cyber-glass-border rounded-lg text-cyber-neon placeholder-cyber-purple-light focus:border-purple-400 focus:outline-none text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-purple-400/10 border border-purple-400 rounded-lg text-purple-400 hover:bg-purple-400/20 transition-all"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              className="btn-cyber p-4"
              style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
            >
              <div className="text-center">
                <Code className="w-6 h-6 mx-auto mb-2" />
                <div>Generate Script</div>
                <div className="text-xs opacity-70">AI script generation</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
            >
              <div className="text-center">
                <FileSearch className="w-6 h-6 mx-auto mb-2" />
                <div>Analyze File</div>
                <div className="text-xs opacity-70">Vulnerability scan</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
            >
              <div className="text-center">
                <Settings className="w-6 h-6 mx-auto mb-2" />
                <div>Optimize System</div>
                <div className="text-xs opacity-70">AI recommendations</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
            >
              <div className="text-center">
                <Mic className="w-6 h-6 mx-auto mb-2" />
                <div>Voice Commands</div>
                <div className="text-xs opacity-70">Activate voice control</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
