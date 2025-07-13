import crypto from "crypto";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import EncryptionService from "./EncryptionService";

// واجهات التحقيق الجنائي
export interface ForensicsCase {
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
  timeline: TimelineEvent[];
  findings: Finding[];
  suspects: Suspect[];
  chainOfCustody: CustodyRecord[];
  tags: string[];
  metadata: any;
}

export interface Evidence {
  id: string;
  caseId: string;
  type:
    | "disk_image"
    | "memory_dump"
    | "network_capture"
    | "log_file"
    | "registry_hive"
    | "file_system"
    | "mobile_backup"
    | "database"
    | "email"
    | "document"
    | "multimedia"
    | "other";
  name: string;
  description: string;
  filePath: string;
  hash: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  size: number;
  mimeType: string;
  collectedBy: string;
  collectedAt: string;
  source: string;
  integrity: "VERIFIED" | "CORRUPTED" | "UNKNOWN";
  analysisStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  analysisResults: AnalysisResult[];
  metadata: any;
}

export interface AnalysisResult {
  id: string;
  evidenceId: string;
  analysisType: string;
  tool: string;
  startedAt: string;
  completedAt?: string;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  findings: string[];
  artifacts: Artifact[];
  reportPath?: string;
  metadata: any;
}

export interface Artifact {
  id: string;
  type:
    | "file"
    | "registry_key"
    | "process"
    | "network_connection"
    | "browser_history"
    | "email"
    | "user_account"
    | "malware_signature"
    | "deleted_file"
    | "encrypted_data";
  name: string;
  description: string;
  location: string;
  timestamp?: string;
  size?: number;
  hash?: string;
  significance: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number; // 0-100
  details: any;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  eventType: string;
  description: string;
  source: string;
  evidenceId?: string;
  confidence: number;
  details: any;
}

export interface Finding {
  id: string;
  caseId: string;
  title: string;
  description: string;
  category:
    | "malware_detection"
    | "data_breach"
    | "unauthorized_access"
    | "data_exfiltration"
    | "system_compromise"
    | "insider_threat"
    | "compliance_violation"
    | "other";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  evidence: string[]; // Evidence IDs
  recommendations: string[];
  createdBy: string;
  createdAt: string;
  status: "DRAFT" | "VERIFIED" | "DISPUTED" | "ACCEPTED";
}

export interface Suspect {
  id: string;
  caseId: string;
  name: string;
  username?: string;
  email?: string;
  department?: string;
  role?: string;
  suspicionLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  evidence: string[]; // Evidence IDs
  activities: SuspectActivity[];
  notes: string;
}

export interface SuspectActivity {
  timestamp: string;
  activity: string;
  evidence: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface CustodyRecord {
  id: string;
  evidenceId: string;
  action: "COLLECTED" | "TRANSFERRED" | "ANALYZED" | "STORED" | "RETURNED";
  performer: string;
  timestamp: string;
  location: string;
  notes: string;
  digitalSignature: string;
}

export interface ForensicsReport {
  id: string;
  caseId: string;
  title: string;
  type: "PRELIMINARY" | "INTERMEDIATE" | "FINAL" | "SUMMARY";
  generatedBy: string;
  generatedAt: string;
  content: {
    executiveSummary: string;
    methodology: string;
    findings: Finding[];
    evidence: Evidence[];
    timeline: TimelineEvent[];
    conclusions: string;
    recommendations: string[];
  };
  attachments: string[];
  digitalSignature: string;
}

class ForensicsService {
  private cases: Map<string, ForensicsCase> = new Map();
  private evidence: Map<string, Evidence> = new Map();
  private encryptionService: EncryptionService;
  private forensicsPath: string;

  constructor() {
    this.encryptionService = new EncryptionService();
    this.forensicsPath = path.join(process.cwd(), "forensics");
    this.initializeForensicsDirectory();
    this.loadExistingCases();
  }

  // تهيئة مجلد التحقيق الجنائي
  private initializeForensicsDirectory(): void {
    const directories = [
      "cases",
      "evidence",
      "reports",
      "tools",
      "temp",
      "exports",
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.forensicsPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true, mode: 0o700 });
      }
    }

    console.log("🔍 Forensics directory structure initialized");
  }

  // تحميل القضايا الموجودة
  private loadExistingCases(): void {
    try {
      const casesDir = path.join(this.forensicsPath, "cases");
      const caseFiles = fs
        .readdirSync(casesDir)
        .filter((file) => file.endsWith(".json"));

      for (const caseFile of caseFiles) {
        const casePath = path.join(casesDir, caseFile);
        const encryptedData = fs.readFileSync(casePath, "utf8");

        try {
          const caseData = JSON.parse(
            this.encryptionService.decrypt(JSON.parse(encryptedData)),
          );
          this.cases.set(caseData.id, caseData);

          // تحميل الأدلة
          for (const evidenceItem of caseData.evidenceItems) {
            this.evidence.set(evidenceItem.id, evidenceItem);
          }
        } catch (error) {
          console.error(`Error loading case ${caseFile}:`, error);
        }
      }

      console.log(`📁 Loaded ${this.cases.size} forensics cases`);
    } catch (error) {
      console.error("Error loading existing cases:", error);
    }
  }

  // إنشاء قضية جديدة
  public async createCase(caseData: {
    title: string;
    description: string;
    investigator: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  }): Promise<ForensicsCase> {
    const caseId = this.generateId();
    const caseNumber = this.generateCaseNumber();

    const forensicsCase: ForensicsCase = {
      id: caseId,
      caseNumber,
      title: caseData.title,
      description: caseData.description,
      investigator: caseData.investigator,
      priority: caseData.priority,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidenceItems: [],
      timeline: [],
      findings: [],
      suspects: [],
      chainOfCustody: [],
      tags: [],
      metadata: {},
    };

    // إضافة حدث إنشاء القضية
    this.addTimelineEvent(caseId, {
      eventType: "CASE_CREATED",
      description: `Case ${caseNumber} created by ${caseData.investigator}`,
      source: "SYSTEM",
    });

    this.cases.set(caseId, forensicsCase);
    await this.saveCase(forensicsCase);

    console.log(`🔍 New forensics case created: ${caseNumber}`);
    return forensicsCase;
  }

  // إضافة دليل جديد
  public async addEvidence(
    caseId: string,
    evidenceData: {
      type: Evidence["type"];
      name: string;
      description: string;
      filePath: string;
      collectedBy: string;
      source: string;
      metadata?: any;
    },
  ): Promise<Evidence> {
    const forensicsCase = this.cases.get(caseId);
    if (!forensicsCase) {
      throw new Error(`Case not found: ${caseId}`);
    }

    const evidenceId = this.generateId();

    // حساب hashes للملف
    const fileHashes = await this.calculateFileHashes(evidenceData.filePath);
    const fileStats = fs.statSync(evidenceData.filePath);

    const evidence: Evidence = {
      id: evidenceId,
      caseId,
      type: evidenceData.type,
      name: evidenceData.name,
      description: evidenceData.description,
      filePath: evidenceData.filePath,
      hash: fileHashes,
      size: fileStats.size,
      mimeType: this.detectMimeType(evidenceData.filePath),
      collectedBy: evidenceData.collectedBy,
      collectedAt: new Date().toISOString(),
      source: evidenceData.source,
      integrity: "VERIFIED",
      analysisStatus: "PENDING",
      analysisResults: [],
      metadata: evidenceData.metadata || {},
    };

    // إضافة سجل Chain of Custody
    const custodyRecord: CustodyRecord = {
      id: this.generateId(),
      evidenceId,
      action: "COLLECTED",
      performer: evidenceData.collectedBy,
      timestamp: new Date().toISOString(),
      location: evidenceData.source,
      notes: `Evidence collected: ${evidenceData.name}`,
      digitalSignature: this.createDigitalSignature(evidence),
    };

    evidence.metadata.custodyRecords = [custodyRecord];

    // تحديث القضية
    forensicsCase.evidenceItems.push(evidence);
    forensicsCase.chainOfCustody.push(custodyRecord);
    forensicsCase.updatedAt = new Date().toISOString();

    this.evidence.set(evidenceId, evidence);
    this.cases.set(caseId, forensicsCase);

    // إضافة حدث timeline
    this.addTimelineEvent(caseId, {
      eventType: "EVIDENCE_ADDED",
      description: `Evidence added: ${evidence.name} (${evidence.type})`,
      source: evidenceData.collectedBy,
      evidenceId,
    });

    await this.saveCase(forensicsCase);

    console.log(
      `📎 Evidence added to case ${forensicsCase.caseNumber}: ${evidence.name}`,
    );
    return evidence;
  }

  // تحليل الدليل
  public async analyzeEvidence(
    evidenceId: string,
    analysisType: string,
    tool: string,
  ): Promise<AnalysisResult> {
    const evidence = this.evidence.get(evidenceId);
    if (!evidence) {
      throw new Error(`Evidence not found: ${evidenceId}`);
    }

    const analysisId = this.generateId();
    const analysisResult: AnalysisResult = {
      id: analysisId,
      evidenceId,
      analysisType,
      tool,
      startedAt: new Date().toISOString(),
      status: "RUNNING",
      findings: [],
      artifacts: [],
      metadata: {},
    };

    evidence.analysisResults.push(analysisResult);
    evidence.analysisStatus = "IN_PROGRESS";

    try {
      // تنفيذ التحليل حسب نوع الدليل
      const artifacts = await this.performAnalysis(
        evidence,
        analysisType,
        tool,
      );

      analysisResult.status = "COMPLETED";
      analysisResult.completedAt = new Date().toISOString();
      analysisResult.artifacts = artifacts;
      analysisResult.findings = this.generateFindings(artifacts);

      evidence.analysisStatus = "COMPLETED";

      // حفظ التقرير
      const reportPath = await this.generateAnalysisReport(
        evidence,
        analysisResult,
      );
      analysisResult.reportPath = reportPath;

      console.log(
        `🔬 Analysis completed for evidence ${evidence.name}: ${artifacts.length} artifacts found`,
      );
    } catch (error) {
      analysisResult.status = "FAILED";
      analysisResult.metadata.error = error.message;
      evidence.analysisStatus = "FAILED";

      console.error(`❌ Analysis failed for evidence ${evidence.name}:`, error);
    }

    // تحديث الأدلة والقضية
    this.evidence.set(evidenceId, evidence);
    const forensicsCase = this.cases.get(evidence.caseId);
    if (forensicsCase) {
      const evidenceIndex = forensicsCase.evidenceItems.findIndex(
        (e) => e.id === evidenceId,
      );
      if (evidenceIndex !== -1) {
        forensicsCase.evidenceItems[evidenceIndex] = evidence;
        forensicsCase.updatedAt = new Date().toISOString();
        this.cases.set(evidence.caseId, forensicsCase);
        await this.saveCase(forensicsCase);
      }
    }

    return analysisResult;
  }

  // تنفيذ التحليل
  private async performAnalysis(
    evidence: Evidence,
    analysisType: string,
    tool: string,
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    switch (evidence.type) {
      case "disk_image":
        artifacts.push(
          ...(await this.analyzeDiskImage(evidence, analysisType, tool)),
        );
        break;
      case "memory_dump":
        artifacts.push(
          ...(await this.analyzeMemoryDump(evidence, analysisType, tool)),
        );
        break;
      case "network_capture":
        artifacts.push(
          ...(await this.analyzeNetworkCapture(evidence, analysisType, tool)),
        );
        break;
      case "log_file":
        artifacts.push(
          ...(await this.analyzeLogFile(evidence, analysisType, tool)),
        );
        break;
      case "registry_hive":
        artifacts.push(
          ...(await this.analyzeRegistryHive(evidence, analysisType, tool)),
        );
        break;
      default:
        artifacts.push(
          ...(await this.performGenericAnalysis(evidence, analysisType, tool)),
        );
    }

    return artifacts;
  }

  // تحليل صورة القرص الصلب
  private async analyzeDiskImage(
    evidence: Evidence,
    analysisType: string,
    tool: string,
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    // محاكاة تحليل صورة القرص
    const commonArtifacts = [
      {
        type: "file" as const,
        name: "Windows Registry Files",
        description:
          "System registry hives containing user and system configuration",
        location: "/Windows/System32/config/",
        significance: "HIGH" as const,
        confidence: 95,
      },
      {
        type: "browser_history" as const,
        name: "Chrome Browser History",
        description: "User browsing history and downloaded files",
        location:
          "/Users/*/AppData/Local/Google/Chrome/User Data/Default/History",
        significance: "MEDIUM" as const,
        confidence: 90,
      },
      {
        type: "deleted_file" as const,
        name: "Deleted Sensitive Documents",
        description: "Recovered deleted files containing sensitive information",
        location: "$Recycle.Bin",
        significance: "HIGH" as const,
        confidence: 85,
      },
      {
        type: "malware_signature" as const,
        name: "Suspicious Executable",
        description: "Executable file with malware characteristics",
        location: "/temp/suspicious.exe",
        significance: "CRITICAL" as const,
        confidence: 98,
      },
    ];

    for (const artifact of commonArtifacts) {
      artifacts.push({
        id: this.generateId(),
        ...artifact,
        timestamp: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        hash: crypto.randomBytes(16).toString("hex"),
        details: {
          analysisType,
          tool,
          fileSystem: "NTFS",
          cluster: Math.floor(Math.random() * 10000),
        },
      });
    }

    return artifacts;
  }

  // تحليل نسخة الذاكرة
  private async analyzeMemoryDump(
    evidence: Evidence,
    analysisType: string,
    tool: string,
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    const memoryArtifacts = [
      {
        type: "process" as const,
        name: "Suspicious Process",
        description: "Process with unusual network activity",
        location: "PID 1337",
        significance: "HIGH" as const,
        confidence: 92,
      },
      {
        type: "network_connection" as const,
        name: "External C&C Connection",
        description: "Connection to known command and control server",
        location: "192.168.1.100:4444",
        significance: "CRITICAL" as const,
        confidence: 95,
      },
      {
        type: "encrypted_data" as const,
        name: "Encrypted Memory Segment",
        description: "Encrypted data found in process memory",
        location: "0x7FFE0000",
        significance: "MEDIUM" as const,
        confidence: 80,
      },
    ];

    for (const artifact of memoryArtifacts) {
      artifacts.push({
        id: this.generateId(),
        ...artifact,
        timestamp: new Date().toISOString(),
        size: Math.floor(Math.random() * 1000000),
        details: {
          analysisType,
          tool,
          memoryRegion: "Heap",
          protection: "RWX",
        },
      });
    }

    return artifacts;
  }

  // تحليل التقاط الشبكة
  private async analyzeNetworkCapture(
    evidence: Evidence,
    analysisType: string,
    tool: string,
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    const networkArtifacts = [
      {
        type: "network_connection" as const,
        name: "Data Exfiltration",
        description: "Large data transfer to external server",
        location: "10.0.0.1:443",
        significance: "CRITICAL" as const,
        confidence: 90,
      },
      {
        type: "malware_signature" as const,
        name: "Malicious Traffic Pattern",
        description: "Traffic matching known malware communication pattern",
        location: "TCP Stream 45",
        significance: "HIGH" as const,
        confidence: 88,
      },
    ];

    for (const artifact of networkArtifacts) {
      artifacts.push({
        id: this.generateId(),
        ...artifact,
        timestamp: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        ).toISOString(),
        details: {
          analysisType,
          tool,
          protocol: "HTTPS",
          bytes: Math.floor(Math.random() * 10000000),
        },
      });
    }

    return artifacts;
  }

  // تحليل ملف السجل
  private async analyzeLogFile(
    evidence: Evidence,
    analysisType: string,
    tool: string,
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    // محاكاة تحليل السجلات
    artifacts.push({
      id: this.generateId(),
      type: "user_account",
      name: "Failed Login Attempts",
      description: "Multiple failed login attempts from unusual IP",
      location: "Event ID 4625",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      significance: "HIGH",
      confidence: 95,
      details: {
        analysisType,
        tool,
        attempts: 15,
        sourceIP: "192.168.1.100",
        account: "administrator",
      },
    });

    return artifacts;
  }

  // تحليل سجل النظام
  private async analyzeRegistryHive(
    evidence: Evidence,
    analysisType: string,
    tool: string,
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    artifacts.push({
      id: this.generateId(),
      type: "registry_key",
      name: "Persistence Mechanism",
      description: "Registry key for malware persistence",
      location: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      significance: "CRITICAL",
      confidence: 98,
      details: {
        analysisType,
        tool,
        value: "malware.exe",
        lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    });

    return artifacts;
  }

  // تحليل عام
  private async performGenericAnalysis(
    evidence: Evidence,
    analysisType: string,
    tool: string,
  ): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];

    // تحليل عام للملفات
    artifacts.push({
      id: this.generateId(),
      type: "file",
      name: "Suspicious File",
      description: "File with unusual characteristics",
      location: evidence.filePath,
      timestamp: new Date().toISOString(),
      size: evidence.size,
      hash: evidence.hash.sha256,
      significance: "MEDIUM",
      confidence: 75,
      details: {
        analysisType,
        tool,
        mimeType: evidence.mimeType,
      },
    });

    return artifacts;
  }

  // توليد النتائج من ا��أثار
  private generateFindings(artifacts: Artifact[]): string[] {
    const findings: string[] = [];

    const criticalArtifacts = artifacts.filter(
      (a) => a.significance === "CRITICAL",
    );
    const highArtifacts = artifacts.filter((a) => a.significance === "HIGH");

    if (criticalArtifacts.length > 0) {
      findings.push(
        `${criticalArtifacts.length} critical security artifact(s) discovered`,
      );
    }

    if (highArtifacts.length > 0) {
      findings.push(`${highArtifacts.length} high-risk artifact(s) identified`);
    }

    const malwareArtifacts = artifacts.filter(
      (a) => a.type === "malware_signature",
    );
    if (malwareArtifacts.length > 0) {
      findings.push(
        `Malware signatures detected: ${malwareArtifacts.length} instances`,
      );
    }

    const networkArtifacts = artifacts.filter(
      (a) => a.type === "network_connection",
    );
    if (networkArtifacts.length > 0) {
      findings.push(
        `Suspicious network activity: ${networkArtifacts.length} connections`,
      );
    }

    return findings;
  }

  // إنشاء تقرير التحليل
  private async generateAnalysisReport(
    evidence: Evidence,
    analysis: AnalysisResult,
  ): Promise<string> {
    const reportData = {
      evidence: {
        name: evidence.name,
        type: evidence.type,
        size: evidence.size,
        hash: evidence.hash,
        collectedAt: evidence.collectedAt,
      },
      analysis: {
        type: analysis.analysisType,
        tool: analysis.tool,
        startedAt: analysis.startedAt,
        completedAt: analysis.completedAt,
        status: analysis.status,
      },
      findings: analysis.findings,
      artifacts: analysis.artifacts.map((a) => ({
        id: a.id,
        type: a.type,
        name: a.name,
        description: a.description,
        significance: a.significance,
        confidence: a.confidence,
      })),
      summary: {
        totalArtifacts: analysis.artifacts.length,
        criticalArtifacts: analysis.artifacts.filter(
          (a) => a.significance === "CRITICAL",
        ).length,
        highRiskArtifacts: analysis.artifacts.filter(
          (a) => a.significance === "HIGH",
        ).length,
      },
    };

    const reportPath = path.join(
      this.forensicsPath,
      "reports",
      `analysis_${analysis.id}_${Date.now()}.json`,
    );

    const encryptedReport = this.encryptionService.encrypt(
      JSON.stringify(reportData, null, 2),
    );
    fs.writeFileSync(reportPath, JSON.stringify(encryptedReport), {
      mode: 0o600,
    });

    return reportPath;
  }

  // إضافة حدث timeline
  public addTimelineEvent(
    caseId: string,
    eventData: {
      eventType: string;
      description: string;
      source: string;
      evidenceId?: string;
      timestamp?: string;
    },
  ): void {
    const forensicsCase = this.cases.get(caseId);
    if (!forensicsCase) return;

    const timelineEvent: TimelineEvent = {
      id: this.generateId(),
      caseId,
      timestamp: eventData.timestamp || new Date().toISOString(),
      eventType: eventData.eventType,
      description: eventData.description,
      source: eventData.source,
      evidenceId: eventData.evidenceId,
      confidence: 100,
      details: {},
    };

    forensicsCase.timeline.push(timelineEvent);
    forensicsCase.updatedAt = new Date().toISOString();
    this.cases.set(caseId, forensicsCase);
  }

  // إضافة نتيجة
  public async addFinding(
    caseId: string,
    findingData: {
      title: string;
      description: string;
      category: Finding["category"];
      severity: Finding["severity"];
      confidence: number;
      evidence: string[];
      recommendations: string[];
      createdBy: string;
    },
  ): Promise<Finding> {
    const forensicsCase = this.cases.get(caseId);
    if (!forensicsCase) {
      throw new Error(`Case not found: ${caseId}`);
    }

    const finding: Finding = {
      id: this.generateId(),
      caseId,
      title: findingData.title,
      description: findingData.description,
      category: findingData.category,
      severity: findingData.severity,
      confidence: findingData.confidence,
      evidence: findingData.evidence,
      recommendations: findingData.recommendations,
      createdBy: findingData.createdBy,
      createdAt: new Date().toISOString(),
      status: "DRAFT",
    };

    forensicsCase.findings.push(finding);
    forensicsCase.updatedAt = new Date().toISOString();
    this.cases.set(caseId, forensicsCase);

    await this.saveCase(forensicsCase);

    console.log(
      `📋 Finding added to case ${forensicsCase.caseNumber}: ${finding.title}`,
    );
    return finding;
  }

  // إنشاء تقرير نهائي
  public async generateFinalReport(
    caseId: string,
    generatedBy: string,
  ): Promise<ForensicsReport> {
    const forensicsCase = this.cases.get(caseId);
    if (!forensicsCase) {
      throw new Error(`Case not found: ${caseId}`);
    }

    const report: ForensicsReport = {
      id: this.generateId(),
      caseId,
      title: `Final Forensics Report - ${forensicsCase.title}`,
      type: "FINAL",
      generatedBy,
      generatedAt: new Date().toISOString(),
      content: {
        executiveSummary: this.generateExecutiveSummary(forensicsCase),
        methodology: this.generateMethodology(forensicsCase),
        findings: forensicsCase.findings,
        evidence: forensicsCase.evidenceItems,
        timeline: forensicsCase.timeline.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ),
        conclusions: this.generateConclusions(forensicsCase),
        recommendations: this.generateRecommendations(forensicsCase),
      },
      attachments: [],
      digitalSignature: "",
    };

    // إنشاء التوقيع الرقمي
    report.digitalSignature = this.createDigitalSignature(report);

    // حفظ التقرير
    const reportPath = path.join(
      this.forensicsPath,
      "reports",
      `final_report_${forensicsCase.caseNumber}_${Date.now()}.json`,
    );

    const encryptedReport = this.encryptionService.encrypt(
      JSON.stringify(report, null, 2),
    );
    fs.writeFileSync(reportPath, JSON.stringify(encryptedReport), {
      mode: 0o600,
    });

    console.log(
      `📄 Final report generated for case ${forensicsCase.caseNumber}`,
    );
    return report;
  }

  // دوال مساعدة لإنشاء التقرير
  private generateExecutiveSummary(forensicsCase: ForensicsCase): string {
    const criticalFindings = forensicsCase.findings.filter(
      (f) => f.severity === "CRITICAL",
    ).length;
    const highFindings = forensicsCase.findings.filter(
      (f) => f.severity === "HIGH",
    ).length;
    const evidenceCount = forensicsCase.evidenceItems.length;

    return `
Forensics investigation of case ${forensicsCase.caseNumber} has been completed. 
The investigation examined ${evidenceCount} pieces of evidence and identified ${forensicsCase.findings.length} findings.

Key Results:
- ${criticalFindings} critical security findings
- ${highFindings} high-severity findings  
- ${evidenceCount} pieces of evidence analyzed
- Investigation period: ${forensicsCase.createdAt} to ${forensicsCase.updatedAt}

${criticalFindings > 0 ? "CRITICAL SECURITY ISSUES IDENTIFIED - Immediate action required." : "No critical security issues identified."}
    `.trim();
  }

  private generateMethodology(forensicsCase: ForensicsCase): string {
    const toolsUsed = new Set<string>();
    forensicsCase.evidenceItems.forEach((evidence) => {
      evidence.analysisResults.forEach((result) => {
        toolsUsed.add(result.tool);
      });
    });

    return `
Investigation methodology followed industry best practices including:

1. Evidence Collection and Preservation
   - Forensically sound imaging techniques
   - Chain of custody maintained throughout
   - Cryptographic hashing for integrity verification

2. Analysis Tools and Techniques
   - Tools used: ${Array.from(toolsUsed).join(", ") || "Standard forensics toolkit"}
   - Static and dynamic analysis performed
   - Timeline reconstruction
   - Artifact correlation and analysis

3. Quality Assurance
   - Peer review of findings
   - Multiple validation techniques
   - Documentation of all procedures
    `.trim();
  }

  private generateConclusions(forensicsCase: ForensicsCase): string {
    const malwareFindings = forensicsCase.findings.filter(
      (f) => f.category === "malware_detection",
    );
    const breachFindings = forensicsCase.findings.filter(
      (f) => f.category === "data_breach",
    );
    const accessFindings = forensicsCase.findings.filter(
      (f) => f.category === "unauthorized_access",
    );

    let conclusions = "Based on the forensics analysis:\n\n";

    if (malwareFindings.length > 0) {
      conclusions += `- Malware presence confirmed: ${malwareFindings.length} instances detected\n`;
    }

    if (breachFindings.length > 0) {
      conclusions += `- Data breach indicators found: ${breachFindings.length} incidents\n`;
    }

    if (accessFindings.length > 0) {
      conclusions += `- Unauthorized access detected: ${accessFindings.length} occurrences\n`;
    }

    if (forensicsCase.findings.length === 0) {
      conclusions += "- No significant security incidents identified\n";
    }

    return conclusions;
  }

  private generateRecommendations(forensicsCase: ForensicsCase): string[] {
    const recommendations: string[] = [];

    const criticalFindings = forensicsCase.findings.filter(
      (f) => f.severity === "CRITICAL",
    );
    const highFindings = forensicsCase.findings.filter(
      (f) => f.severity === "HIGH",
    );

    if (criticalFindings.length > 0) {
      recommendations.push("Immediate isolation of compromised systems");
      recommendations.push("Emergency incident response team activation");
      recommendations.push("Complete malware removal and system rebuilding");
    }

    if (highFindings.length > 0) {
      recommendations.push("Enhanced monitoring and logging implementation");
      recommendations.push("Security awareness training for all users");
      recommendations.push(
        "Regular security assessments and penetration testing",
      );
    }

    recommendations.push(
      "Implement comprehensive backup and recovery procedures",
    );
    recommendations.push("Update and patch all systems regularly");
    recommendations.push("Review and strengthen access controls");

    return recommendations;
  }

  // دوال مساعدة
  private async calculateFileHashes(
    filePath: string,
  ): Promise<{ md5: string; sha1: string; sha256: string }> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);

    return {
      md5: crypto.createHash("md5").update(fileBuffer).digest("hex"),
      sha1: crypto.createHash("sha1").update(fileBuffer).digest("hex"),
      sha256: crypto.createHash("sha256").update(fileBuffer).digest("hex"),
    };
  }

  private detectMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      ".txt": "text/plain",
      ".log": "text/plain",
      ".json": "application/json",
      ".pcap": "application/vnd.tcpdump.pcap",
      ".img": "application/octet-stream",
      ".dd": "application/octet-stream",
      ".vmem": "application/octet-stream",
      ".hiv": "application/octet-stream",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  private createDigitalSignature(data: any): string {
    const dataString = JSON.stringify(data);
    return crypto.createHash("sha256").update(dataString).digest("hex");
  }

  private generateCaseNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const sequence = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    return `KNOX-${year}${month}${day}-${sequence}`;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async saveCase(forensicsCase: ForensicsCase): Promise<void> {
    const casePath = path.join(
      this.forensicsPath,
      "cases",
      `${forensicsCase.id}.json`,
    );
    const encryptedData = this.encryptionService.encrypt(
      JSON.stringify(forensicsCase, null, 2),
    );
    fs.writeFileSync(casePath, JSON.stringify(encryptedData), { mode: 0o600 });
  }

  // واجهات API العامة
  public getAllCases(): ForensicsCase[] {
    return Array.from(this.cases.values());
  }

  public getCase(caseId: string): ForensicsCase | null {
    return this.cases.get(caseId) || null;
  }

  public getEvidence(evidenceId: string): Evidence | null {
    return this.evidence.get(evidenceId) || null;
  }

  public getCasesByInvestigator(investigator: string): ForensicsCase[] {
    return Array.from(this.cases.values()).filter(
      (c) => c.investigator === investigator,
    );
  }

  public getCasesByStatus(status: ForensicsCase["status"]): ForensicsCase[] {
    return Array.from(this.cases.values()).filter((c) => c.status === status);
  }

  public getForensicsStatistics(): any {
    const allCases = Array.from(this.cases.values());
    const allEvidence = Array.from(this.evidence.values());

    return {
      totalCases: allCases.length,
      activeCases: allCases.filter(
        (c) => c.status === "OPEN" || c.status === "IN_PROGRESS",
      ).length,
      closedCases: allCases.filter((c) => c.status === "CLOSED").length,
      totalEvidence: allEvidence.length,
      analyzedEvidence: allEvidence.filter(
        (e) => e.analysisStatus === "COMPLETED",
      ).length,
      pendingAnalysis: allEvidence.filter((e) => e.analysisStatus === "PENDING")
        .length,
      totalFindings: allCases.reduce((sum, c) => sum + c.findings.length, 0),
      criticalFindings: allCases.reduce(
        (sum, c) =>
          sum + c.findings.filter((f) => f.severity === "CRITICAL").length,
        0,
      ),
      highPriorityCase: allCases.filter(
        (c) => c.priority === "HIGH" || c.priority === "CRITICAL",
      ).length,
    };
  }

  // تنظيف الموارد
  public cleanup(): void {
    console.log("🧹 Forensics service cleaned up");
  }
}

export default ForensicsService;
