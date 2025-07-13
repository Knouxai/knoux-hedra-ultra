import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  FileText,
  Shield,
  AlertTriangle,
  Clock,
  User,
  Database,
  Download,
  Eye,
  ChevronRight,
  Filter,
  BarChart3,
  Activity,
  HardDrive,
  Network,
  Zap,
  Lock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface ForensicsCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  investigator: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  evidenceItems: Evidence[];
  findings: Finding[];
}

interface Evidence {
  id: string;
  type: string;
  name: string;
  description: string;
  size: number;
  collectedBy: string;
  collectedAt: string;
  analysisStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  integrity: "VERIFIED" | "CORRUPTED" | "UNKNOWN";
}

interface Finding {
  id: string;
  title: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  status: "DRAFT" | "VERIFIED" | "DISPUTED" | "ACCEPTED";
  createdAt: string;
}

interface ForensicsStats {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  totalEvidence: number;
  analyzedEvidence: number;
  pendingAnalysis: number;
  totalFindings: number;
  criticalFindings: number;
}

export default function ForensicsCenter() {
  const [cases, setCases] = useState<ForensicsCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<ForensicsCase | null>(null);
  const [stats, setStats] = useState<ForensicsStats>({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    totalEvidence: 0,
    analyzedEvidence: 0,
    pendingAnalysis: 0,
    totalFindings: 0,
    criticalFindings: 0,
  });
  const [view, setView] = useState<
    "overview" | "cases" | "evidence" | "reports"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  // تحميل البيانات
  useEffect(() => {
    loadForensicsData();
  }, []);

  const loadForensicsData = async () => {
    try {
      // محاكاة تحميل البيانات
      const mockCases: ForensicsCase[] = [
        {
          id: "1",
          caseNumber: "KNOX-20241201-001",
          title: "Suspected Data Breach Investigation",
          description:
            "Investigation of potential data exfiltration from HR database",
          investigator: "Agent Smith",
          priority: "CRITICAL",
          status: "IN_PROGRESS",
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          evidenceItems: [
            {
              id: "e1",
              type: "disk_image",
              name: "HR Server Disk Image",
              description: "Complete disk image of compromised HR server",
              size: 500000000000, // 500GB
              collectedBy: "Agent Smith",
              collectedAt: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              analysisStatus: "COMPLETED",
              integrity: "VERIFIED",
            },
            {
              id: "e2",
              type: "memory_dump",
              name: "Memory Dump",
              description: "RAM dump from compromised system",
              size: 16000000000, // 16GB
              collectedBy: "Agent Jones",
              collectedAt: new Date(
                Date.now() - 1 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              analysisStatus: "IN_PROGRESS",
              integrity: "VERIFIED",
            },
          ],
          findings: [
            {
              id: "f1",
              title: "Malware Detected",
              category: "malware_detection",
              severity: "CRITICAL",
              confidence: 95,
              status: "VERIFIED",
              createdAt: new Date(
                Date.now() - 12 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ],
        },
        {
          id: "2",
          caseNumber: "KNOX-20241130-002",
          title: "Insider Threat Analysis",
          description: "Investigation of suspicious employee activities",
          investigator: "Agent Johnson",
          priority: "HIGH",
          status: "OPEN",
          createdAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          evidenceItems: [
            {
              id: "e3",
              type: "log_file",
              name: "Access Logs",
              description: "System access logs for the past 30 days",
              size: 50000000, // 50MB
              collectedBy: "Agent Johnson",
              collectedAt: new Date(
                Date.now() - 4 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              analysisStatus: "PENDING",
              integrity: "VERIFIED",
            },
          ],
          findings: [],
        },
      ];

      setCases(mockCases);

      // حساب الإحصائيات
      const mockStats: ForensicsStats = {
        totalCases: mockCases.length,
        activeCases: mockCases.filter(
          (c) => c.status === "OPEN" || c.status === "IN_PROGRESS",
        ).length,
        closedCases: mockCases.filter((c) => c.status === "CLOSED").length,
        totalEvidence: mockCases.reduce(
          (sum, c) => sum + c.evidenceItems.length,
          0,
        ),
        analyzedEvidence: mockCases.reduce(
          (sum, c) =>
            sum +
            c.evidenceItems.filter((e) => e.analysisStatus === "COMPLETED")
              .length,
          0,
        ),
        pendingAnalysis: mockCases.reduce(
          (sum, c) =>
            sum +
            c.evidenceItems.filter((e) => e.analysisStatus === "PENDING")
              .length,
          0,
        ),
        totalFindings: mockCases.reduce((sum, c) => sum + c.findings.length, 0),
        criticalFindings: mockCases.reduce(
          (sum, c) =>
            sum + c.findings.filter((f) => f.severity === "CRITICAL").length,
          0,
        ),
      };

      setStats(mockStats);
    } catch (error) {
      console.error("Error loading forensics data:", error);
    }
  };

  // تصفية القضايا
  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      searchTerm === "" ||
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.investigator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || caseItem.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || caseItem.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatFileSize = (bytes: number): string => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "text-red-400 bg-red-500/20 border-red-500/50";
      case "HIGH":
        return "text-orange-400 bg-orange-500/20 border-orange-500/50";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
      default:
        return "text-green-400 bg-green-500/20 border-green-500/50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "text-blue-400 bg-blue-500/20 border-blue-500/50";
      case "OPEN":
        return "text-green-400 bg-green-500/20 border-green-500/50";
      case "CLOSED":
        return "text-gray-400 bg-gray-500/20 border-gray-500/50";
      default:
        return "text-purple-400 bg-purple-500/20 border-purple-500/50";
    }
  };

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case "disk_image":
        return <HardDrive className="w-4 h-4" />;
      case "memory_dump":
        return <Activity className="w-4 h-4" />;
      case "network_capture":
        return <Network className="w-4 h-4" />;
      case "log_file":
        return <FileText className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getAnalysisStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "IN_PROGRESS":
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                🔍 Digital Forensics Center
              </h1>
              <p className="text-gray-400">
                Advanced digital investigation and evidence analysis
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNewCaseModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Case
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "cases", label: "Cases", icon: FileText },
              { id: "evidence", label: "Evidence", icon: Database },
              { id: "reports", label: "Reports", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md transition-all
                  ${
                    view === tab.id
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Dashboard */}
        {view === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-indigo-400">
                    Total Cases
                  </h3>
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalCases}
                </div>
                <div className="text-sm text-gray-400">
                  {stats.activeCases} active • {stats.closedCases} closed
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-400">
                    Evidence Items
                  </h3>
                  <Database className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalEvidence}
                </div>
                <div className="text-sm text-gray-400">
                  {stats.analyzedEvidence} analyzed • {stats.pendingAnalysis}{" "}
                  pending
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-400">
                    Findings
                  </h3>
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalFindings}
                </div>
                <div className="text-sm text-gray-400">
                  {stats.criticalFindings} critical issues
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-400">
                    Analysis Rate
                  </h3>
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stats.totalEvidence > 0
                    ? Math.round(
                        (stats.analyzedEvidence / stats.totalEvidence) * 100,
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-400">Completion rate</div>
              </div>
            </div>

            {/* Recent Cases */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-indigo-400 mb-6">
                Recent Cases
              </h2>
              <div className="space-y-4">
                {cases.slice(0, 3).map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="bg-slate-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">
                            {caseItem.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(caseItem.priority)}`}
                          >
                            {caseItem.priority}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(caseItem.status)}`}
                          >
                            {caseItem.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">
                          {caseItem.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Case: {caseItem.caseNumber}</span>
                          <span>Investigator: {caseItem.investigator}</span>
                          <span>
                            Evidence: {caseItem.evidenceItems.length} items
                          </span>
                          <span>Updated: {formatDate(caseItem.updatedAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCase(caseItem);
                          setView("cases");
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cases View */}
        {view === "cases" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="all">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="all">All Priorities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cases List */}
            <div className="space-y-4">
              {filteredCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className={`
                    bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all duration-200
                    ${
                      selectedCase?.id === caseItem.id
                        ? "border-indigo-400/50 bg-indigo-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }
                  `}
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">
                          {caseItem.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(caseItem.priority)}`}
                        >
                          {caseItem.priority}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(caseItem.status)}`}
                        >
                          {caseItem.status}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-4">
                        {caseItem.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Case Number:</span>
                          <p className="text-white font-mono">
                            {caseItem.caseNumber}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Investigator:</span>
                          <p className="text-white">{caseItem.investigator}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Evidence Items:</span>
                          <p className="text-white">
                            {caseItem.evidenceItems.length}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Findings:</span>
                          <p className="text-white">
                            {caseItem.findings.length}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
                        <span>Created: {formatDate(caseItem.createdAt)}</span>
                        <span>Updated: {formatDate(caseItem.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Evidence Preview */}
                  {selectedCase?.id === caseItem.id && (
                    <div className="mt-6 pt-6 border-t border-slate-600">
                      <h4 className="text-lg font-semibold text-indigo-400 mb-4">
                        Evidence Items
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {caseItem.evidenceItems.map((evidence) => (
                          <div
                            key={evidence.id}
                            className="bg-slate-700/50 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-indigo-600/20 rounded-lg">
                                {getEvidenceTypeIcon(evidence.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-medium text-white">
                                    {evidence.name}
                                  </h5>
                                  {getAnalysisStatusIcon(
                                    evidence.analysisStatus,
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 mb-2">
                                  {evidence.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>
                                    Size: {formatFileSize(evidence.size)}
                                  </span>
                                  <span>
                                    Collected:{" "}
                                    {formatDate(evidence.collectedAt)}
                                  </span>
                                  <span
                                    className={`
                                    px-2 py-1 rounded-full font-medium
                                    ${
                                      evidence.integrity === "VERIFIED"
                                        ? "text-green-400 bg-green-500/20"
                                        : "text-red-400 bg-red-500/20"
                                    }
                                  `}
                                  >
                                    {evidence.integrity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Findings */}
                      {caseItem.findings.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold text-orange-400 mb-4">
                            Key Findings
                          </h4>
                          <div className="space-y-3">
                            {caseItem.findings.map((finding) => (
                              <div
                                key={finding.id}
                                className="bg-slate-700/50 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h5 className="font-medium text-white">
                                        {finding.title}
                                      </h5>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(finding.severity)}`}
                                      >
                                        {finding.severity}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        Confidence: {finding.confidence}%
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                      {finding.category}
                                    </p>
                                  </div>
                                  <span
                                    className={`
                                    px-2 py-1 rounded-full text-xs font-medium
                                    ${
                                      finding.status === "VERIFIED"
                                        ? "text-green-400 bg-green-500/20"
                                        : finding.status === "DISPUTED"
                                          ? "text-red-400 bg-red-500/20"
                                          : "text-yellow-400 bg-yellow-500/20"
                                    }
                                  `}
                                  >
                                    {finding.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence View */}
        {view === "evidence" && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-6">
              Evidence Management
            </h2>
            <div className="text-center py-12 text-gray-400">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Evidence management interface coming soon...</p>
            </div>
          </div>
        )}

        {/* Reports View */}
        {view === "reports" && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              Forensics Reports
            </h2>
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Report generation and management interface coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
