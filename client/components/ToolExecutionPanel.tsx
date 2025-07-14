import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Square,
  RefreshCw,
  Download,
  Copy,
  Terminal,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Code,
  Eye,
  FileText,
  BarChart3,
  TrendingUp,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ExecutionLog {
  timestamp: Date;
  level: "info" | "warning" | "error" | "success";
  message: string;
  data?: any;
}

interface ToolExecution {
  id: string;
  toolId: string;
  toolName: string;
  status: "idle" | "running" | "completed" | "failed" | "cancelled";
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  progress: number;
  result?: any;
  logs: ExecutionLog[];
  outputType: "text" | "json" | "table" | "chart" | "file";
}

interface ToolExecutionPanelProps {
  execution: ToolExecution;
  onStop: () => void;
  onRestart: () => void;
  onDownload?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const ToolExecutionPanel: React.FC<ToolExecutionPanelProps> = ({
  execution,
  onStop,
  onRestart,
  onDownload,
  expanded = false,
  onToggleExpand,
}) => {
  const { t, isRTL } = useLanguage();
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [execution.logs, autoScroll]);

  const getStatusIcon = () => {
    switch (execution.status) {
      case "running":
        return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "cancelled":
        return <Square className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (execution.status) {
      case "running":
        return "border-blue-400/30 bg-blue-400/10";
      case "completed":
        return "border-green-400/30 bg-green-400/10";
      case "failed":
        return "border-red-400/30 bg-red-400/10";
      case "cancelled":
        return "border-orange-400/30 bg-orange-400/10";
      default:
        return "border-gray-400/30 bg-gray-400/10";
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-3 h-3 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      default:
        return <Eye className="w-3 h-3 text-blue-400" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderOutput = () => {
    if (!execution.result) return null;

    switch (execution.outputType) {
      case "json":
        return (
          <pre className="text-xs bg-gray-900/50 rounded-lg p-3 overflow-auto max-h-64 text-green-400 font-mono">
            {JSON.stringify(execution.result, null, 2)}
          </pre>
        );
      case "table":
        return (
          <div className="overflow-auto max-h-64">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  {Object.keys(execution.result[0] || {}).map((key) => (
                    <th key={key} className="text-left p-2 text-gray-400">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(execution.result as any[]).map((row, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    {Object.values(row).map((value: any, j) => (
                      <td key={j} className="p-2 text-gray-300">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "chart":
        return (
          <div className="flex items-center justify-center h-32 bg-gray-900/50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            <span className="ml-2 text-gray-400">Chart visualization</span>
          </div>
        );
      default:
        return (
          <pre className="text-xs bg-gray-900/50 rounded-lg p-3 overflow-auto max-h-64 text-gray-300 font-mono whitespace-pre-wrap">
            {String(execution.result)}
          </pre>
        );
    }
  };

  return (
    <Card
      className={`glass-cyber ${getStatusColor()} transition-all duration-300`}
    >
      <CardHeader className="pb-3">
        <div
          className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {getStatusIcon()}
            <div>
              <CardTitle className="text-white text-sm">
                {execution.toolName}
              </CardTitle>
              <div
                className={`flex items-center gap-2 text-xs text-gray-400 mt-1 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Badge variant="outline" className="text-xs">
                  {execution.status}
                </Badge>
                {execution.startTime && (
                  <span>{execution.startTime.toLocaleTimeString()}</span>
                )}
                {execution.duration && (
                  <span>({formatDuration(execution.duration)})</span>
                )}
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {execution.status === "running" && (
              <Button
                onClick={onStop}
                size="sm"
                variant="outline"
                className="border-red-400/30 text-red-400 hover:bg-red-400/10"
              >
                <Square className="w-3 h-3" />
              </Button>
            )}

            {(execution.status === "completed" ||
              execution.status === "failed") && (
              <Button
                onClick={onRestart}
                size="sm"
                variant="outline"
                className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            )}

            {onDownload && execution.result && (
              <Button
                onClick={onDownload}
                size="sm"
                variant="outline"
                className="border-green-400/30 text-green-400 hover:bg-green-400/10"
              >
                <Download className="w-3 h-3" />
              </Button>
            )}

            {onToggleExpand && (
              <Button
                onClick={onToggleExpand}
                size="sm"
                variant="ghost"
                className="text-gray-400"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {execution.status === "running" && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{t("general.progress")}</span>
              <span>{execution.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${execution.progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      {expanded && (
        <CardContent>
          {/* Output Section */}
          {execution.result && (
            <div className="mb-4">
              <div
                className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  {t("tools.output")}
                </h4>
                <Button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(execution.result, null, 2))
                  }
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-cyan-400"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              {renderOutput()}
            </div>
          )}

          {/* Logs Section */}
          <div>
            <div
              className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t("tools.logs")} ({execution.logs.length})
              </h4>
              <label
                className={`flex items-center gap-2 text-xs text-gray-400 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded"
                />
                Auto-scroll
              </label>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3 max-h-48 overflow-auto">
              {execution.logs.length === 0 ? (
                <div className="text-gray-500 text-xs text-center py-4">
                  No logs available
                </div>
              ) : (
                <div className="space-y-1">
                  {execution.logs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 text-xs ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      {getLogIcon(log.level)}
                      <span className="text-gray-500 font-mono">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="text-gray-300 flex-1">
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ToolExecutionPanel;
