import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Square,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Eye,
  Network,
  Brain,
  FileText,
  Cog,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: string;
  riskLevel: string;
  enabled: boolean;
  realtime: boolean;
  status?: "idle" | "running" | "completed" | "failed";
  lastRun?: Date;
  executionTime?: string;
  output?: string;
}

interface ModuleStats {
  totalTools: number;
  activeTools: number;
  runningTools: number;
  completedToday: number;
  failedToday: number;
  avgExecutionTime: string;
  successRate: number;
  lastUpdate: Date;
}

interface ModuleDashboardProps {
  moduleId: number;
  moduleName: string;
  moduleNameEn: string;
  moduleColor: string;
  tools: Tool[];
  onExecuteTool: (toolId: string) => void;
  onStopTool: (toolId: string) => void;
  onConfigureTool: (toolId: string) => void;
}

const ModuleDashboard: React.FC<ModuleDashboardProps> = ({
  moduleId,
  moduleName,
  moduleNameEn,
  moduleColor,
  tools,
  onExecuteTool,
  onStopTool,
  onConfigureTool,
}) => {
  const { t, language, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [moduleStats, setModuleStats] = useState<ModuleStats>({
    totalTools: tools.length,
    activeTools: tools.filter((t) => t.enabled).length,
    runningTools: tools.filter((t) => t.status === "running").length,
    completedToday: Math.floor(Math.random() * 15) + 5,
    failedToday: Math.floor(Math.random() * 3),
    avgExecutionTime: "12.5s",
    successRate: 94.2,
    lastUpdate: new Date(),
  });

  // تحديث إحصائيات الوحدة
  useEffect(() => {
    const interval = setInterval(() => {
      setModuleStats((prev) => ({
        ...prev,
        runningTools: tools.filter((t) => t.status === "running").length,
        lastUpdate: new Date(),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [tools]);

  const getModuleIcon = (name: string) => {
    const iconMap: Record<string, any> = {
      "Defensive Ops": Shield,
      "Offensive Tools": Zap,
      Surveillance: Eye,
      "Net & VPN Control": Network,
      "AI Cyber Assistant": Brain,
      "Encrypted Reporting": FileText,
      "Cosmic Settings": Cog,
    };
    return iconMap[name] || Settings;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "running":
        return <Activity className="w-4 h-4 text-green-400 animate-pulse" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || tool.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "enabled" && tool.enabled) ||
      (filterStatus === "disabled" && !tool.enabled) ||
      (filterStatus === "running" && tool.status === "running");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(tools.map((t) => t.category)));
  const ModuleIcon = getModuleIcon(moduleNameEn);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div
        className="glass-cyber rounded-xl p-6 border"
        style={{ borderColor: moduleColor + "40" }}
      >
        <div
          className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: moduleColor + "20",
                border: `2px solid ${moduleColor}60`,
              }}
            >
              <ModuleIcon className="w-8 h-8" style={{ color: moduleColor }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: moduleColor }}>
                {language === "ar" ? moduleName : moduleNameEn}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {t(
                  `modules.${moduleNameEn.toLowerCase().replace(/[^\w]/g, "_")}_desc`,
                )}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Badge
              variant="outline"
              className="text-green-400 border-green-400/30"
            >
              {moduleStats.runningTools} {t("dashboard.running_tools")}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-cyber border-cyber-purple/30">
          <CardContent className="pt-6">
            <div
              className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-sm text-gray-400">
                  {t("dashboard.total_tools")}
                </p>
                <p className="text-2xl font-bold text-cyan-400">
                  {moduleStats.totalTools}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-cyan-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-cyber border-cyber-purple/30">
          <CardContent className="pt-6">
            <div
              className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-sm text-gray-400">{t("general.active")}</p>
                <p className="text-2xl font-bold text-green-400">
                  {moduleStats.activeTools}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-cyber border-cyber-purple/30">
          <CardContent className="pt-6">
            <div
              className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {moduleStats.successRate}%
                </p>
              </div>
              <PieChart className="w-8 h-8 text-purple-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-cyber border-cyber-purple/30">
          <CardContent className="pt-6">
            <div
              className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div>
                <p className="text-sm text-gray-400">Avg. Time</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {moduleStats.avgExecutionTime}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-cyber border-cyber-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Filter className="w-5 h-5" />
            {t("general.settings")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isRTL ? "text-right" : ""}`}
          >
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                <Search className="w-4 h-4 inline mr-1" />
                Search Tools
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-cyan-400 focus:outline-none"
                placeholder="Search by name..."
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {t("general.status")}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="enabled">{t("general.enabled")}</option>
                <option value="disabled">{t("general.disabled")}</option>
                <option value="running">{t("general.running")}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <Card
            key={tool.id}
            className="glass-cyber border-cyber-purple/30 hover:border-cyan-400/50 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div
                className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className="flex-1">
                  <CardTitle className="text-white text-sm font-bold leading-tight">
                    {language === "ar" ? tool.name : tool.nameEn}
                  </CardTitle>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    {tool.description.substring(0, 80)}...
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Status and Risk Level */}
                <div
                  className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {getStatusIcon(tool.status)}
                    <span className="text-xs text-gray-400">
                      {tool.status || "idle"}
                    </span>
                  </div>
                  <Badge
                    className={`text-xs ${getRiskLevelColor(tool.riskLevel)}`}
                  >
                    {tool.riskLevel}
                  </Badge>
                </div>

                {/* Tool Actions */}
                <div
                  className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {tool.status === "running" ? (
                    <Button
                      onClick={() => onStopTool(tool.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-400/30 text-red-400 hover:bg-red-400/10"
                    >
                      <Square className="w-3 h-3 mr-1" />
                      {t("tools.stop")}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onExecuteTool(tool.id)}
                      disabled={!tool.enabled}
                      size="sm"
                      className="flex-1 btn-cyber"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {t("tools.execute")}
                    </Button>
                  )}
                  <Button
                    onClick={() => onConfigureTool(tool.id)}
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:border-cyan-400"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 space-y-1">
                  {tool.lastRun && (
                    <div
                      className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span>Last run:</span>
                      <span>{tool.lastRun.toLocaleTimeString()}</span>
                    </div>
                  )}
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span>Category:</span>
                    <span className="capitalize">{tool.category}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <Card className="glass-cyber border-cyber-purple/30">
          <CardContent className="pt-6 text-center">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              No tools found matching your criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleDashboard;
