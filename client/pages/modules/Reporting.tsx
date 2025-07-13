import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  Lock,
  Shield,
  Archive,
  BarChart3,
  Clock,
  Key,
  Cloud,
  Printer,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Reporting() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [selectedReportType, setSelectedReportType] = useState("security");
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const generateReport = (type: string) => {
    const newReport = {
      id: Date.now(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      timestamp: new Date(),
      status: "generating",
      encrypted: encryptionEnabled,
      size: "0 KB",
    };

    setGeneratedReports((prev) => [newReport, ...prev]);

    // Simulate report generation
    setTimeout(() => {
      setGeneratedReports((prev) =>
        prev.map((report) =>
          report.id === newReport.id
            ? {
                ...report,
                status: "completed",
                size: `${Math.floor(Math.random() * 500 + 100)} KB`,
              }
            : report,
        ),
      );
    }, 3000);
  };

  const reportingTools = [
    {
      id: "pdf-generator",
      name: "Encrypted PDF Generator",
      nameAr: "توليد تقارير PDF مشفرة",
      icon: FileText,
      description: "Password-protected PDF report generation",
      status: "READY",
      emoji: "📄",
      category: "generation",
    },
    {
      id: "operation-report",
      name: "Detailed Operation Report",
      nameAr: "تقرير مفصل لكل عملية هجوم/دفاع",
      icon: BarChart3,
      description: "Detailed security operation reports",
      status: "READY",
      emoji: "📊",
      category: "documentation",
    },
    {
      id: "digital-signature",
      name: "Knoux Digital Signature",
      nameAr: "إضافة توقيع knoux على كل تقرير",
      icon: Key,
      description: "Certified digital signature for all reports",
      status: "ACTIVE",
      emoji: "🔏",
      category: "authentication",
    },
    {
      id: "performance-analytics",
      name: "Performance Analytics",
      nameAr: "عرض المدة + النتائج + النسبة",
      icon: Clock,
      description: "Performance analysis and statistical reporting",
      status: "ANALYZING",
      emoji: "⏱️",
      category: "analytics",
    },
    {
      id: "password-protection",
      name: "Master Password Protection",
      nameAr: "حماية التقارير بكلمة مرور رئيسية",
      icon: Lock,
      description: "Advanced master password protection",
      status: "SECURED",
      emoji: "🔒",
      category: "security",
    },
    {
      id: "cloud-sync",
      name: "Cloud Sync",
      nameAr: "إرسال نسخة للتخزين المحلي أو السحابي",
      icon: Cloud,
      description: "Report synchronization with cloud storage",
      status: "SYNCING",
      emoji: "☁️",
      category: "backup",
    },
    {
      id: "archive-manager",
      name: "Archive Manager",
      nameAr: "إدارة أرشيف التقارير",
      icon: Archive,
      description: "Legacy report archive management",
      status: "READY",
      emoji: "📦",
      category: "management",
    },
  ];

  const reportTypes = [
    { id: "security", name: "Security Report", icon: Shield, color: "#10b981" },
    {
      id: "performance",
      name: "Performance Report",
      icon: BarChart3,
      color: "#3b82f6",
    },
    { id: "network", name: "Network Report", icon: FileText, color: "#f59e0b" },
    {
      id: "compliance",
      name: "Compliance Report",
      icon: Lock,
      color: "#8b5cf6",
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
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center bg-cyan-400/10 border border-cyan-400">
              <FileText className="w-6 h-6 text-cyan-400 animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-cyan-400 neon-glow">
                Encrypted Reporting
              </h1>
              <p className="text-cyber-purple-light">
                قسم التقارير والتوثيق - Module 6 of 7
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
              <h2 className="text-xl font-bold text-cyan-400">
                Reporting Operations Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    {generatedReports.length} REPORTS GENERATED
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">ENCRYPTED</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-400">
                  {generatedReports.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Total Reports
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {generatedReports.filter((r) => r.encrypted).length}/
                  {generatedReports.length}
                </div>
                <div className="text-xs text-cyber-purple-light">Encrypted</div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Cloud className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">
                  {Math.floor(
                    generatedReports.reduce((acc, r) => {
                      const size = parseInt(r.size) || 0;
                      return acc + size;
                    }, 0) / 1024,
                  )}
                  MB
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Total Size
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">
                  {activeTools.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Tools Active
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reporting Tools Grid */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">
                Reporting Arsenal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {reportingTools.map((tool) => {
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
                              ? "bg-cyan-400/20 border-cyan-400"
                              : "border-cyber-glass-border"
                          } border`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              isActive ? "text-cyan-400" : "text-cyber-neon"
                            }`}
                          />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-lg">{tool.emoji}</div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              tool.status === "ACTIVE" ||
                              tool.status === "ANALYZING" ||
                              tool.status === "SECURED" ||
                              tool.status === "SYNCING"
                                ? "bg-green-400 animate-pulse"
                                : "bg-cyan-400"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          isActive ? "text-cyan-400" : "text-cyber-neon"
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
                                ? "text-cyan-400"
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
                              ? "bg-cyan-400/10 text-cyan-400 border-cyan-400"
                              : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400"
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

            {/* Report Generator & History */}
            <div className="lg:col-span-1 space-y-6">
              {/* Report Generator */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">
                  Report Generator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-cyber-purple-light mb-2 block">
                      Report Type
                    </label>
                    <select
                      value={selectedReportType}
                      onChange={(e) => setSelectedReportType(e.target.value)}
                      className="w-full px-3 py-2 bg-cyber-glass/30 border border-cyber-glass-border rounded-lg text-cyber-neon focus:border-cyan-400 focus:outline-none text-sm"
                    >
                      {reportTypes.map((type) => (
                        <option
                          key={type.id}
                          value={type.id}
                          className="bg-cyber-dark"
                        >
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-cyber-glass/30 rounded-lg">
                    <span className="text-sm text-cyber-purple-light">
                      Encryption
                    </span>
                    <button
                      onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                      className={`w-12 h-6 rounded-full border-2 transition-all ${
                        encryptionEnabled
                          ? "bg-green-400/20 border-green-400"
                          : "bg-gray-400/20 border-gray-400"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          encryptionEnabled ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <button
                    onClick={() => generateReport(selectedReportType)}
                    className="w-full px-4 py-3 bg-cyan-400/10 border border-cyan-400 rounded-lg text-cyan-400 font-bold hover:bg-cyan-400/20 transition-all"
                  >
                    🔐 Generate Encrypted Report
                  </button>
                </div>
              </div>

              {/* Generated Reports */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">
                  Generated Reports
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {generatedReports.length === 0 ? (
                    <div className="text-center text-cyber-purple-light text-sm py-8">
                      No reports generated yet
                    </div>
                  ) : (
                    generatedReports.map((report) => (
                      <div
                        key={report.id}
                        className="p-3 bg-cyber-glass/30 rounded-lg border border-cyber-glass-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-cyan-400">
                            {report.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {report.encrypted && (
                              <Lock className="w-3 h-3 text-green-400" />
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                report.status === "generating"
                                  ? "bg-yellow-400/20 text-yellow-400"
                                  : "bg-green-400/20 text-green-400"
                              }`}
                            >
                              {report.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-cyber-purple-light">
                            {report.size}
                          </span>
                          <span className="text-xs text-cyber-purple-light">
                            {report.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        {report.status === "completed" && (
                          <div className="mt-2 flex gap-2">
                            <button className="flex-1 px-2 py-1 bg-blue-400/10 border border-blue-400 rounded text-blue-400 text-xs hover:bg-blue-400/20 transition-all">
                              <Download className="w-3 h-3 inline mr-1" />
                              Download
                            </button>
                            <button className="flex-1 px-2 py-1 bg-purple-400/10 border border-purple-400 rounded text-purple-400 text-xs hover:bg-purple-400/20 transition-all">
                              <Upload className="w-3 h-3 inline mr-1" />
                              Share
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Report Statistics */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">
                  Report Statistics
                </h3>
                <div className="space-y-3">
                  {reportTypes.map((type, idx) => (
                    <div key={type.id} className="flex items-center gap-3">
                      <type.icon
                        className="w-4 h-4"
                        style={{ color: type.color }}
                      />
                      <span className="text-sm text-cyber-purple-light flex-1">
                        {type.name}
                      </span>
                      <span className="text-sm font-bold text-cyber-neon">
                        {
                          generatedReports.filter((r) => r.type === type.id)
                            .length
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Report Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              className="btn-cyber p-4"
              style={{ color: "#06b6d4", borderColor: "#06b6d4" }}
              onClick={() => generateReport("security")}
            >
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <div>Security Report</div>
                <div className="text-xs opacity-70">
                  Generate security summary
                </div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#06b6d4", borderColor: "#06b6d4" }}
              onClick={() => generateReport("performance")}
            >
              <div className="text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                <div>Performance Report</div>
                <div className="text-xs opacity-70">
                  System performance data
                </div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#06b6d4", borderColor: "#06b6d4" }}
            >
              <div className="text-center">
                <Archive className="w-6 h-6 mx-auto mb-2" />
                <div>Archive Reports</div>
                <div className="text-xs opacity-70">Manage old reports</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#06b6d4", borderColor: "#06b6d4" }}
            >
              <div className="text-center">
                <Printer className="w-6 h-6 mx-auto mb-2" />
                <div>Print Report</div>
                <div className="text-xs opacity-70">Physical document</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
