import { useState } from "react";
import {
  ArrowLeft,
  Settings,
  Palette,
  Moon,
  Sun,
  Bell,
  Zap,
  Shield,
  Key,
  Brain,
  Monitor,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CosmicSettings() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    theme: "cosmic",
    darkMode: true,
    soundEnabled: true,
    notificationsEnabled: true,
    autoToolActivation: false,
    advancedFirewall: true,
    accessControlEnabled: true,
    aiModel: "gpt4",
    language: "ar",
    animationsEnabled: true,
  });

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const toggleSetting = (settingKey: string) => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

  const settingsTools = [
    {
      id: "ui-customizer",
      name: "UI Customizer",
      nameAr: "تخصيص الواجهة بالكامل",
      icon: Palette,
      description: "Complete user interface and color customization",
      status: "CUSTOMIZING",
      emoji: "🎨",
      category: "interface",
    },
    {
      id: "theme-switcher",
      name: "Dark/Light Mode",
      nameAr: "الوضع الليلي/النهاري",
      icon: settings.darkMode ? Moon : Sun,
      description: "Dark and light mode switching",
      status: settings.darkMode ? "DARK" : "LIGHT",
      emoji: settings.darkMode ? "🌙" : "☀️",
      category: "interface",
    },
    {
      id: "alert-manager",
      name: "Alert Manager",
      nameAr: "إدارة التنبيهات (صوت/ضوء/تفاعل)",
      icon: Bell,
      description: "Comprehensive alert and notification management",
      status: settings.notificationsEnabled ? "ACTIVE" : "DISABLED",
      emoji: "🔔",
      category: "notifications",
    },
    {
      id: "tool-activator",
      name: "Conditional Tool Activator",
      nameAr: "تفعيل أدوات محددة حسب الحالة",
      icon: Zap,
      description: "Automatic tool activation based on conditions",
      status: settings.autoToolActivation ? "AUTO" : "MANUAL",
      emoji: "⚡",
      category: "automation",
    },
    {
      id: "advanced-firewall",
      name: "Advanced Firewall Settings",
      nameAr: "إعدادات حماية متقدمة (جدار ناري داخلي)",
      icon: Shield,
      description: "Advanced internal firewall configuration",
      status: settings.advancedFirewall ? "PROTECTING" : "DISABLED",
      emoji: "🛡️",
      category: "security",
    },
    {
      id: "access-control",
      name: "Access Control Manager",
      nameAr: "تغيير صلاحيات الوصول للأدوات",
      icon: Key,
      description: "Tool access permission management",
      status: settings.accessControlEnabled ? "SECURED" : "OPEN",
      emoji: "🔑",
      category: "security",
    },
    {
      id: "ai-model-selector",
      name: "AI Model Selector",
      nameAr: "اختيار موديل الذكاء الاصطناعي المستخدم",
      icon: Brain,
      description: "AI model selection and configuration",
      status: settings.aiModel.toUpperCase(),
      emoji: "🧠",
      category: "ai",
    },
  ];

  const themeOptions = [
    { id: "cosmic", name: "Cosmic Cyber", color: "#8b5cf6" },
    { id: "dark", name: "Dark Matrix", color: "#000000" },
    { id: "neon", name: "Neon Green", color: "#10b981" },
    { id: "cyber-blue", name: "Cyber Blue", color: "#3b82f6" },
    { id: "hacker-red", name: "Hacker Red", color: "#ef4444" },
  ];

  const aiModels = [
    { id: "gpt4", name: "GPT-4 Turbo", provider: "OpenAI" },
    { id: "claude", name: "Claude 3", provider: "Anthropic" },
    { id: "gemini", name: "Gemini Pro", provider: "Google" },
    { id: "local", name: "Local LLaMA", provider: "Local" },
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
              <Settings className="w-6 h-6 text-purple-400 animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-purple-400 neon-glow">
                Cosmic Settings
              </h1>
              <p className="text-cyber-purple-light">
                قسم الإعدادات والتحكم - Module 7 of 7
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
                Cosmic Configuration Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {activeTools.length}/7 CONFIGS ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">OPTIMIZED</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">
                  {settings.theme.toUpperCase()}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Current Theme
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-400">
                  {settings.aiModel.toUpperCase()}
                </div>
                <div className="text-xs text-cyber-purple-light">AI Model</div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(settings).filter(Boolean).length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Features Enabled
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Monitor className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">
                  {settings.language.toUpperCase()}
                </div>
                <div className="text-xs text-cyber-purple-light">Language</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Tools Grid */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-purple-400 mb-4">
                Configuration Arsenal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {settingsTools.map((tool) => {
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
                          className={`w-10 h-10 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform ${
                            isActive
                              ? "bg-purple-400/20 border-purple-400"
                              : "border-cyber-glass-border"
                          } border`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              isActive ? "text-purple-400" : "text-cyber-neon"
                            }`}
                          />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-lg">{tool.emoji}</div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              tool.status === "ACTIVE" ||
                              tool.status === "CUSTOMIZING" ||
                              tool.status === "AUTO" ||
                              tool.status === "PROTECTING" ||
                              tool.status === "SECURED"
                                ? "bg-green-400 animate-pulse"
                                : tool.status === "DISABLED" ||
                                    tool.status === "OPEN"
                                  ? "bg-red-400"
                                  : "bg-purple-400"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          isActive ? "text-purple-400" : "text-cyber-neon"
                        } mb-1`}
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
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono ${
                              isActive
                                ? "text-purple-400"
                                : "text-cyber-purple-light"
                            }`}
                          >
                            {tool.status}
                          </span>
                          <span className="text-xs px-1 py-0.5 rounded bg-cyber-glass text-cyber-purple-light">
                            {tool.category}
                          </span>
                        </div>
                        <button
                          className={`text-xs px-2 py-1 rounded-full border transition-all ${
                            isActive
                              ? "bg-purple-400/10 text-purple-400 border-purple-400"
                              : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-purple-400/10 hover:text-purple-400 hover:border-purple-400"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "CONFIGURE"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Settings */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-4">
                  Quick Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.darkMode ? (
                        <Moon className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Sun className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className="text-sm text-cyber-purple-light">
                        Dark Mode
                      </span>
                    </div>
                    <button
                      onClick={() => toggleSetting("darkMode")}
                      className={`w-12 h-6 rounded-full border-2 transition-all ${
                        settings.darkMode
                          ? "bg-purple-400/20 border-purple-400"
                          : "bg-gray-400/20 border-gray-400"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.darkMode ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm text-cyber-purple-light">
                        Sound Effects
                      </span>
                    </div>
                    <button
                      onClick={() => toggleSetting("soundEnabled")}
                      className={`w-12 h-6 rounded-full border-2 transition-all ${
                        settings.soundEnabled
                          ? "bg-green-400/20 border-green-400"
                          : "bg-gray-400/20 border-gray-400"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.soundEnabled
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-cyber-purple-light">
                        Notifications
                      </span>
                    </div>
                    <button
                      onClick={() => toggleSetting("notificationsEnabled")}
                      className={`w-12 h-6 rounded-full border-2 transition-all ${
                        settings.notificationsEnabled
                          ? "bg-cyan-400/20 border-cyan-400"
                          : "bg-gray-400/20 border-gray-400"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.notificationsEnabled
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-cyber-purple-light">
                        Auto Tools
                      </span>
                    </div>
                    <button
                      onClick={() => toggleSetting("autoToolActivation")}
                      className={`w-12 h-6 rounded-full border-2 transition-all ${
                        settings.autoToolActivation
                          ? "bg-yellow-400/20 border-yellow-400"
                          : "bg-gray-400/20 border-gray-400"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          settings.autoToolActivation
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-4">
                  Theme Selection
                </h3>
                <div className="space-y-2">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, theme: theme.id }))
                      }
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        settings.theme === theme.id
                          ? "border-purple-400 bg-purple-400/10"
                          : "border-cyber-glass-border hover:border-purple-400/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.color }}
                        ></div>
                        <span className="text-sm text-cyber-neon">
                          {theme.name}
                        </span>
                        {settings.theme === theme.id && (
                          <span className="text-xs text-purple-400 ml-auto">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Model Selector */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-4">
                  AI Model Configuration
                </h3>
                <div className="space-y-2">
                  {aiModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, aiModel: model.id }))
                      }
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        settings.aiModel === model.id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-cyber-glass-border hover:border-cyan-400/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-cyber-neon">
                            {model.name}
                          </div>
                          <div className="text-xs text-cyber-purple-light">
                            {model.provider}
                          </div>
                        </div>
                        {settings.aiModel === model.id && (
                          <span className="text-xs text-cyan-400">ACTIVE</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Configuration Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              className="btn-cyber p-4"
              style={{ color: "#d946ef", borderColor: "#d946ef" }}
            >
              <div className="text-center">
                <Palette className="w-6 h-6 mx-auto mb-2" />
                <div>Customize UI</div>
                <div className="text-xs opacity-70">Advanced themes</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#d946ef", borderColor: "#d946ef" }}
            >
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <div>Security Settings</div>
                <div className="text-xs opacity-70">Advanced protection</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#d946ef", borderColor: "#d946ef" }}
            >
              <div className="text-center">
                <Key className="w-6 h-6 mx-auto mb-2" />
                <div>Access Control</div>
                <div className="text-xs opacity-70">User permissions</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#d946ef", borderColor: "#d946ef" }}
            >
              <div className="text-center">
                <Monitor className="w-6 h-6 mx-auto mb-2" />
                <div>System Export</div>
                <div className="text-xs opacity-70">Backup configuration</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
