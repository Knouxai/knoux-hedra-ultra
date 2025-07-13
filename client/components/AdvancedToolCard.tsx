import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  Settings,
  FileText,
  Activity,
  AlertTriangle,
  Shield,
  Eye,
  Monitor,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
} from "lucide-react";

interface ToolMetrics {
  alertsCount: number;
  lastActivity: string;
  uptime: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dataProcessed: string;
}

interface AdvancedToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
  status: "IDLE" | "WATCHING" | "ACTIVE" | "TRACKING" | "SCANNING" | "DISABLED";
  metrics: ToolMetrics;
  permissions: {
    canStart: boolean;
    canStop: boolean;
    canConfigure: boolean;
    canViewReports: boolean;
  };
  onStart: () => void;
  onStop: () => void;
  onConfigure: () => void;
  onViewReports: () => void;
  onToggleAudio: () => void;
  audioEnabled: boolean;
  className?: string;
}

export default function AdvancedToolCard({
  tool,
  status,
  metrics,
  permissions,
  onStart,
  onStop,
  onConfigure,
  onViewReports,
  onToggleAudio,
  audioEnabled,
  className = "",
}: AdvancedToolCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [pulse, setPulse] = useState(false);

  const isActive = ["WATCHING", "ACTIVE", "TRACKING", "SCANNING"].includes(
    status,
  );

  // تأثير النبض للحالات النشطة
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 300);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const getStatusColor = () => {
    switch (status) {
      case "WATCHING":
        return "from-green-500/20 to-emerald-600/20 border-green-400/50";
      case "ACTIVE":
        return "from-blue-500/20 to-cyan-600/20 border-blue-400/50";
      case "TRACKING":
        return "from-yellow-500/20 to-orange-600/20 border-yellow-400/50";
      case "SCANNING":
        return "from-purple-500/20 to-violet-600/20 border-purple-400/50";
      case "DISABLED":
        return "from-gray-500/20 to-slate-600/20 border-gray-400/50";
      default:
        return "from-slate-500/20 to-gray-600/20 border-slate-400/50";
    }
  };

  const getThreatLevelColor = () => {
    switch (metrics.threatLevel) {
      case "CRITICAL":
        return "text-red-400 bg-red-500/20";
      case "HIGH":
        return "text-orange-400 bg-orange-500/20";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-green-400 bg-green-500/20";
    }
  };

  const getRiskLevelIcon = () => {
    switch (tool.riskLevel) {
      case "CRITICAL":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "HIGH":
        return <Shield className="w-4 h-4 text-orange-400" />;
      case "MEDIUM":
        return <Eye className="w-4 h-4 text-yellow-400" />;
      default:
        return <Monitor className="w-4 h-4 text-green-400" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div
      className={`
        relative group transition-all duration-500 ease-out
        ${isHovered ? "scale-105 z-10" : "scale-100"}
        ${pulse ? "animate-pulse" : ""}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* خلفية النيون */}
      <div
        className={`
          absolute inset-0 rounded-2xl blur-sm transition-all duration-500
          bg-gradient-to-br ${getStatusColor()}
          ${isHovered ? "blur-md scale-110 opacity-80" : "blur-sm opacity-40"}
        `}
      />

      {/* الكرت الرئيسي */}
      <div
        className={`
          relative bg-gradient-to-br ${getStatusColor()}
          backdrop-blur-xl border rounded-2xl p-6
          shadow-2xl transition-all duration-500
          ${isHovered ? "shadow-purple-500/25 border-purple-400/60" : "shadow-black/30"}
        `}
      >
        {/* رأس الكرت */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                p-3 rounded-xl bg-black/30 backdrop-blur-sm
                ${isActive ? "animate-pulse" : ""}
                transition-all duration-300
              `}
            >
              {tool.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {tool.name}
                {getRiskLevelIcon()}
              </h3>
              <p className="text-xs text-gray-300 opacity-80">
                {tool.category}
              </p>
            </div>
          </div>

          {/* مؤشر الحالة */}
          <div className="flex flex-col items-end gap-2">
            <div
              className={`
                px-3 py-1 rounded-full text-xs font-mono font-bold
                backdrop-blur-sm border transition-all duration-300
                ${
                  isActive
                    ? "bg-green-500/20 border-green-400/50 text-green-300"
                    : status === "DISABLED"
                      ? "bg-gray-500/20 border-gray-400/50 text-gray-300"
                      : "bg-slate-500/20 border-slate-400/50 text-slate-300"
                }
              `}
            >
              {status}
            </div>

            {/* زر الصوت */}
            <button
              onClick={onToggleAudio}
              className={`
                p-2 rounded-lg backdrop-blur-sm border transition-all duration-200
                ${
                  audioEnabled
                    ? "bg-purple-500/20 border-purple-400/50 text-purple-300 hover:bg-purple-400/30"
                    : "bg-gray-500/20 border-gray-400/50 text-gray-400 hover:bg-gray-400/30"
                }
              `}
              title={`Audio alerts ${audioEnabled ? "enabled" : "disabled"}`}
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* وصف الأداة */}
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          {tool.description}
        </p>

        {/* الإحصائيات الحية */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Alerts</span>
            </div>
            <div className="text-lg font-bold text-white">
              {metrics.alertsCount}
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Uptime</span>
            </div>
            <div className="text-lg font-bold text-white">
              {formatUptime(metrics.uptime)}
            </div>
          </div>
        </div>

        {/* مستوى التهديد */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Threat Level</span>
            <span
              className={`
                px-2 py-1 rounded-full text-xs font-bold
                ${getThreatLevelColor()}
              `}
            >
              {metrics.threatLevel}
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div
              className={`
                h-2 rounded-full transition-all duration-500
                ${
                  metrics.threatLevel === "CRITICAL"
                    ? "bg-red-500 w-full"
                    : metrics.threatLevel === "HIGH"
                      ? "bg-orange-500 w-3/4"
                      : metrics.threatLevel === "MEDIUM"
                        ? "bg-yellow-500 w-1/2"
                        : "bg-green-500 w-1/4"
                }
              `}
            />
          </div>
        </div>

        {/* آخر نشاط */}
        <div className="mb-6">
          <span className="text-xs text-gray-400">Last Activity:</span>
          <p className="text-sm text-gray-300 font-mono">
            {metrics.lastActivity}
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex gap-2 mt-auto">
          {/* زر التشغيل/الإيقاف */}
          {isActive ? (
            <button
              onClick={onStop}
              disabled={!permissions.canStop}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                font-medium transition-all duration-200
                ${
                  permissions.canStop
                    ? "bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-400/30 hover:scale-105"
                    : "bg-gray-500/20 border border-gray-400/50 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <Square className="w-4 h-4" />
              Stop
              {!permissions.canStop && (
                <Lock className="w-3 h-3 ml-1 opacity-50" />
              )}
            </button>
          ) : (
            <button
              onClick={onStart}
              disabled={!permissions.canStart || status === "DISABLED"}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                font-medium transition-all duration-200
                ${
                  permissions.canStart && status !== "DISABLED"
                    ? "bg-green-500/20 border border-green-400/50 text-green-300 hover:bg-green-400/30 hover:scale-105"
                    : "bg-gray-500/20 border border-gray-400/50 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <Play className="w-4 h-4" />
              Start
              {!permissions.canStart && (
                <Lock className="w-3 h-3 ml-1 opacity-50" />
              )}
            </button>
          )}

          {/* زر الإعدادات */}
          <button
            onClick={onConfigure}
            disabled={!permissions.canConfigure}
            className={`
              px-4 py-3 rounded-lg transition-all duration-200
              ${
                permissions.canConfigure
                  ? "bg-purple-500/20 border border-purple-400/50 text-purple-300 hover:bg-purple-400/30 hover:scale-105"
                  : "bg-gray-500/20 border border-gray-400/50 text-gray-500 cursor-not-allowed"
              }
            `}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            {!permissions.canConfigure && (
              <Lock className="w-3 h-3 ml-1 opacity-50" />
            )}
          </button>

          {/* زر التقارير */}
          <button
            onClick={onViewReports}
            disabled={!permissions.canViewReports}
            className={`
              px-4 py-3 rounded-lg transition-all duration-200
              ${
                permissions.canViewReports
                  ? "bg-blue-500/20 border border-blue-400/50 text-blue-300 hover:bg-blue-400/30 hover:scale-105"
                  : "bg-gray-500/20 border border-gray-400/50 text-gray-500 cursor-not-allowed"
              }
            `}
            title="Reports"
          >
            <FileText className="w-4 h-4" />
            {!permissions.canViewReports && (
              <Lock className="w-3 h-3 ml-1 opacity-50" />
            )}
          </button>
        </div>

        {/* تفاصيل موسعة */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Data Processed:</span>
                <p className="text-white font-mono">{metrics.dataProcessed}</p>
              </div>
              <div>
                <span className="text-gray-400">Performance:</span>
                <p className="text-green-400 font-mono">Optimal</p>
              </div>
            </div>
          </div>
        )}

        {/* زر التفاصيل */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-300 transition-colors"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* تأثيرات إضافية للحالة النشطة */}
      {isActive && (
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur-sm animate-pulse opacity-30" />
      )}
    </div>
  );
}
