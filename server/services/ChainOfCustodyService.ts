import crypto from "crypto";
import EncryptionService from "./EncryptionService";

// واجهات Chain of Custody
export interface CustodyRecord {
  id: string;
  evidenceId: string;
  caseId: string;
  action:
    | "COLLECTED"
    | "TRANSFERRED"
    | "ANALYZED"
    | "STORED"
    | "ACCESSED"
    | "COPIED"
    | "RETURNED"
    | "DESTROYED";
  performer: string;
  performerRole: string;
  timestamp: string;
  location: string;
  purpose: string;
  notes: string;
  digitalSignature: string;
  witnesses: Witness[];
  metadata: {
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    integrityHash: string;
    fileSize?: number;
    checksums?: {
      md5: string;
      sha1: string;
      sha256: string;
    };
  };
  verificationStatus: "PENDING" | "VERIFIED" | "COMPROMISED" | "DISPUTED";
  previousRecordId?: string;
  nextRecordId?: string;
}

export interface Witness {
  name: string;
  role: string;
  signature: string;
  timestamp: string;
}

export interface CustodyChain {
  evidenceId: string;
  caseId: string;
  records: CustodyRecord[];
  integrityStatus: "INTACT" | "BROKEN" | "DISPUTED";
  lastVerification: string;
  totalTransfers: number;
  currentCustodian: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustodyAudit {
  id: string;
  evidenceId: string;
  auditType:
    | "ROUTINE"
    | "INTEGRITY_CHECK"
    | "DISPUTE_RESOLUTION"
    | "COURT_ORDER";
  auditor: string;
  auditDate: string;
  findings: AuditFinding[];
  recommendation: string;
  status: "PASS" | "FAIL" | "PARTIAL" | "UNDER_REVIEW";
  digitalSignature: string;
}

export interface AuditFinding {
  type:
    | "INTEGRITY_VERIFIED"
    | "HASH_MISMATCH"
    | "MISSING_SIGNATURE"
    | "UNAUTHORIZED_ACCESS"
    | "CHAIN_BREAK";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  evidence: string;
  recommendation: string;
}

class ChainOfCustodyService {
  private custodyChains: Map<string, CustodyChain> = new Map();
  private custodyRecords: Map<string, CustodyRecord> = new Map();
  private audits: Map<string, CustodyAudit> = new Map();
  private encryptionService: EncryptionService;

  constructor() {
    this.encryptionService = new EncryptionService();
  }

  // إنشاء سجل حفظ جديد
  public async createCustodyRecord(
    evidenceId: string,
    caseId: string,
    recordData: {
      action: CustodyRecord["action"];
      performer: string;
      performerRole: string;
      location: string;
      purpose: string;
      notes: string;
      witnesses?: Witness[];
      ipAddress: string;
      userAgent: string;
      sessionId: string;
      fileSize?: number;
      checksums?: CustodyRecord["metadata"]["checksums"];
    },
  ): Promise<CustodyRecord> {
    const recordId = this.generateId();
    const timestamp = new Date().toISOString();

    // إنشاء hash السلامة
    const integrityData = {
      evidenceId,
      caseId,
      action: recordData.action,
      performer: recordData.performer,
      timestamp,
      location: recordData.location,
    };
    const integrityHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(integrityData))
      .digest("hex");

    // إنشاء السج��
    const custodyRecord: CustodyRecord = {
      id: recordId,
      evidenceId,
      caseId,
      action: recordData.action,
      performer: recordData.performer,
      performerRole: recordData.performerRole,
      timestamp,
      location: recordData.location,
      purpose: recordData.purpose,
      notes: recordData.notes,
      digitalSignature: "",
      witnesses: recordData.witnesses || [],
      metadata: {
        ipAddress: recordData.ipAddress,
        userAgent: recordData.userAgent,
        sessionId: recordData.sessionId,
        integrityHash,
        fileSize: recordData.fileSize,
        checksums: recordData.checksums,
      },
      verificationStatus: "PENDING",
    };

    // إنشاء التوقيع الرقمي
    custodyRecord.digitalSignature =
      await this.createDigitalSignature(custodyRecord);

    // ربط السجل بالسلسلة
    await this.linkToChain(custodyRecord);

    // حفظ السجل
    this.custodyRecords.set(recordId, custodyRecord);

    console.log(
      `📋 Custody record created: ${recordData.action} for evidence ${evidenceId} by ${recordData.performer}`,
    );

    return custodyRecord;
  }

  // ربط السجل بسلسلة الحفظ
  private async linkToChain(record: CustodyRecord): Promise<void> {
    let chain = this.custodyChains.get(record.evidenceId);

    if (!chain) {
      // إنشاء سلسلة جديدة
      chain = {
        evidenceId: record.evidenceId,
        caseId: record.caseId,
        records: [],
        integrityStatus: "INTACT",
        lastVerification: record.timestamp,
        totalTransfers: 0,
        currentCustodian: record.performer,
        createdAt: record.timestamp,
        updatedAt: record.timestamp,
      };
    }

    // ربط السجل بالسجل السابق
    if (chain.records.length > 0) {
      const lastRecord = chain.records[chain.records.length - 1];
      lastRecord.nextRecordId = record.id;
      record.previousRecordId = lastRecord.id;
    }

    // إضافة السجل للسلسلة
    chain.records.push(record);
    chain.updatedAt = record.timestamp;
    chain.currentCustodian = record.performer;

    if (record.action === "TRANSFERRED") {
      chain.totalTransfers++;
    }

    this.custodyChains.set(record.evidenceId, chain);
  }

  // التحقق من سلامة السلسلة
  public async verifyCustodyChain(evidenceId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    integrityScore: number;
  }> {
    const chain = this.custodyChains.get(evidenceId);
    if (!chain) {
      return {
        isValid: false,
        errors: ["Chain of custody not found"],
        warnings: [],
        integrityScore: 0,
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    let integrityScore = 100;

    // التحقق من تسلسل السجلات
    for (let i = 0; i < chain.records.length; i++) {
      const record = chain.records[i];

      // التحقق من التوقيع الرقمي
      const signatureValid = await this.verifyDigitalSignature(record);
      if (!signatureValid) {
        errors.push(`Invalid digital signature for record ${record.id}`);
        integrityScore -= 20;
      }

      // التحقق من hash السلامة
      const integrityValid = this.verifyIntegrityHash(record);
      if (!integrityValid) {
        errors.push(`Integrity hash mismatch for record ${record.id}`);
        integrityScore -= 15;
      }

      // التحقق من التسلسل الزمني
      if (i > 0) {
        const prevRecord = chain.records[i - 1];
        if (new Date(record.timestamp) <= new Date(prevRecord.timestamp)) {
          errors.push(
            `Timestamp anomaly: Record ${record.id} timestamp is not after previous record`,
          );
          integrityScore -= 10;
        }

        // التحقق من ربط السجلات
        if (record.previousRecordId !== prevRecord.id) {
          errors.push(
            `Chain link error: Record ${record.id} is not properly linked to previous record`,
          );
          integrityScore -= 25;
        }
      }

      // التحقق من الشهود
      if (["TRANSFERRED", "ANALYZED", "RETURNED"].includes(record.action)) {
        if (record.witnesses.length === 0) {
          warnings.push(
            `No witnesses recorded for ${record.action} action in record ${record.id}`,
          );
          integrityScore -= 5;
        }
      }

      // التحقق من التفاصيل المطلوبة
      if (!record.purpose || !record.location) {
        warnings.push(
          `Missing required details (purpose/location) in record ${record.id}`,
        );
        integrityScore -= 3;
      }
    }

    // التحقق من فجوات زمنية مشبوهة
    for (let i = 1; i < chain.records.length; i++) {
      const timeDiff =
        new Date(chain.records[i].timestamp).getTime() -
        new Date(chain.records[i - 1].timestamp).getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (daysDiff > 30) {
        warnings.push(
          `Large time gap (${Math.round(daysDiff)} days) between records ${chain.records[i - 1].id} and ${chain.records[i].id}`,
        );
        integrityScore -= 2;
      }
    }

    integrityScore = Math.max(0, integrityScore);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      integrityScore,
    };
  }

  // إجراء تدقيق للسلسلة
  public async conductCustodyAudit(
    evidenceId: string,
    auditor: string,
    auditType: CustodyAudit["auditType"],
  ): Promise<CustodyAudit> {
    const auditId = this.generateId();
    const auditDate = new Date().toISOString();

    const verification = await this.verifyCustodyChain(evidenceId);
    const findings: AuditFinding[] = [];

    // تحويل الأخطاء إلى نتائج تدقيق
    verification.errors.forEach((error) => {
      let type: AuditFinding["type"] = "CHAIN_BREAK";
      let severity: AuditFinding["severity"] = "HIGH";

      if (error.includes("signature")) {
        type = "MISSING_SIGNATURE";
        severity = "CRITICAL";
      } else if (error.includes("hash")) {
        type = "HASH_MISMATCH";
        severity = "HIGH";
      } else if (error.includes("unauthorized")) {
        type = "UNAUTHORIZED_ACCESS";
        severity = "CRITICAL";
      }

      findings.push({
        type,
        severity,
        description: error,
        evidence: evidenceId,
        recommendation: this.getRecommendationForFinding(type),
      });
    });

    // إضافة نتائج إيجابية
    if (verification.isValid) {
      findings.push({
        type: "INTEGRITY_VERIFIED",
        severity: "LOW",
        description: "Chain of custody integrity verified successfully",
        evidence: evidenceId,
        recommendation: "Continue standard custody procedures",
      });
    }

    const audit: CustodyAudit = {
      id: auditId,
      evidenceId,
      auditType,
      auditor,
      auditDate,
      findings,
      recommendation: this.generateAuditRecommendation(verification, findings),
      status: verification.isValid
        ? verification.warnings.length > 0
          ? "PARTIAL"
          : "PASS"
        : "FAIL",
      digitalSignature: "",
    };

    // إنشاء التوقيع الرقمي للتدقيق
    audit.digitalSignature = await this.createDigitalSignature(audit);

    this.audits.set(auditId, audit);

    console.log(
      `🔍 Custody audit completed for evidence ${evidenceId}: ${audit.status}`,
    );

    return audit;
  }

  // توليد تقرير سلسلة الحفظ
  public async generateCustodyReport(evidenceId: string): Promise<{
    evidenceId: string;
    reportGeneratedAt: string;
    chain: CustodyChain;
    verification: Awaited<ReturnType<typeof this.verifyCustodyChain>>;
    auditHistory: CustodyAudit[];
    summary: {
      totalRecords: number;
      totalTransfers: number;
      durationInCustody: number; // days
      currentStatus: string;
      integrityScore: number;
    };
  }> {
    const chain = this.custodyChains.get(evidenceId);
    if (!chain) {
      throw new Error(`Chain of custody not found for evidence: ${evidenceId}`);
    }

    const verification = await this.verifyCustodyChain(evidenceId);
    const auditHistory = Array.from(this.audits.values()).filter(
      (audit) => audit.evidenceId === evidenceId,
    );

    const durationInCustody =
      (Date.now() - new Date(chain.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);

    const report = {
      evidenceId,
      reportGeneratedAt: new Date().toISOString(),
      chain,
      verification,
      auditHistory,
      summary: {
        totalRecords: chain.records.length,
        totalTransfers: chain.totalTransfers,
        durationInCustody: Math.round(durationInCustody * 100) / 100,
        currentStatus:
          chain.records[chain.records.length - 1]?.action || "UNKNOWN",
        integrityScore: verification.integrityScore,
      },
    };

    return report;
  }

  // البحث في سجلات الحفظ
  public searchCustodyRecords(filters: {
    evidenceId?: string;
    caseId?: string;
    performer?: string;
    action?: CustodyRecord["action"];
    startDate?: string;
    endDate?: string;
    location?: string;
  }): CustodyRecord[] {
    const allRecords = Array.from(this.custodyRecords.values());

    return allRecords.filter((record) => {
      if (filters.evidenceId && record.evidenceId !== filters.evidenceId)
        return false;
      if (filters.caseId && record.caseId !== filters.caseId) return false;
      if (filters.performer && record.performer !== filters.performer)
        return false;
      if (filters.action && record.action !== filters.action) return false;
      if (
        filters.startDate &&
        new Date(record.timestamp) < new Date(filters.startDate)
      )
        return false;
      if (
        filters.endDate &&
        new Date(record.timestamp) > new Date(filters.endDate)
      )
        return false;
      if (
        filters.location &&
        !record.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;

      return true;
    });
  }

  // دوال مساعدة
  private async createDigitalSignature(data: any): Promise<string> {
    const dataString = JSON.stringify(data, null, 0);
    return crypto.createHash("sha256").update(dataString).digest("hex");
  }

  private async verifyDigitalSignature(
    record: CustodyRecord,
  ): Promise<boolean> {
    const recordCopy = { ...record };
    delete (recordCopy as any).digitalSignature;

    const expectedSignature = await this.createDigitalSignature(recordCopy);
    return expectedSignature === record.digitalSignature;
  }

  private verifyIntegrityHash(record: CustodyRecord): boolean {
    const integrityData = {
      evidenceId: record.evidenceId,
      caseId: record.caseId,
      action: record.action,
      performer: record.performer,
      timestamp: record.timestamp,
      location: record.location,
    };

    const expectedHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(integrityData))
      .digest("hex");

    return expectedHash === record.metadata.integrityHash;
  }

  private getRecommendationForFinding(type: AuditFinding["type"]): string {
    switch (type) {
      case "MISSING_SIGNATURE":
        return "Re-verify the record with proper digital signatures";
      case "HASH_MISMATCH":
        return "Investigate potential data tampering and re-validate integrity";
      case "UNAUTHORIZED_ACCESS":
        return "Conduct security investigation and implement additional access controls";
      case "CHAIN_BREAK":
        return "Reconstruct the chain of custody with missing documentation";
      default:
        return "Follow standard security procedures";
    }
  }

  private generateAuditRecommendation(
    verification: Awaited<ReturnType<typeof this.verifyCustodyChain>>,
    findings: AuditFinding[],
  ): string {
    if (!verification.isValid) {
      const criticalFindings = findings.filter(
        (f) => f.severity === "CRITICAL",
      );
      if (criticalFindings.length > 0) {
        return "CRITICAL: Evidence chain integrity is compromised. Immediate investigation required. Evidence may not be admissible in court.";
      }
      return "Chain of custody has integrity issues that need to be addressed before proceeding.";
    }

    if (verification.warnings.length > 0) {
      return "Chain of custody is generally intact but has minor issues that should be documented and addressed.";
    }

    return "Chain of custody is fully intact and meets all integrity requirements.";
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // واجهات API العامة
  public getCustodyChain(evidenceId: string): CustodyChain | null {
    return this.custodyChains.get(evidenceId) || null;
  }

  public getCustodyRecord(recordId: string): CustodyRecord | null {
    return this.custodyRecords.get(recordId) || null;
  }

  public getAllChains(): CustodyChain[] {
    return Array.from(this.custodyChains.values());
  }

  public getAuditHistory(evidenceId: string): CustodyAudit[] {
    return Array.from(this.audits.values()).filter(
      (audit) => audit.evidenceId === evidenceId,
    );
  }

  public getCustodyStatistics(): {
    totalChains: number;
    totalRecords: number;
    totalAudits: number;
    intactChains: number;
    compromisedChains: number;
    averageIntegrityScore: number;
    mostActiveLocation: string;
    mostActiveCustodian: string;
  } {
    const allChains = Array.from(this.custodyChains.values());
    const allRecords = Array.from(this.custodyRecords.values());
    const allAudits = Array.from(this.audits.values());

    const intactChains = allChains.filter(
      (chain) => chain.integrityStatus === "INTACT",
    ).length;
    const compromisedChains = allChains.filter(
      (chain) => chain.integrityStatus === "BROKEN",
    ).length;

    // حساب متوسط نقاط السلامة
    const passedAudits = allAudits.filter((audit) => audit.status === "PASS");
    const averageIntegrityScore =
      passedAudits.length > 0
        ? passedAudits.reduce((sum, audit) => {
            const integrityFindings = audit.findings.filter(
              (f) => f.type === "INTEGRITY_VERIFIED",
            );
            return sum + (integrityFindings.length > 0 ? 100 : 75);
          }, 0) / passedAudits.length
        : 0;

    // أكثر المواقع نشاطاً
    const locationCounts: { [key: string]: number } = {};
    allRecords.forEach((record) => {
      locationCounts[record.location] =
        (locationCounts[record.location] || 0) + 1;
    });
    const mostActiveLocation =
      Object.keys(locationCounts).sort(
        (a, b) => locationCounts[b] - locationCounts[a],
      )[0] || "Unknown";

    // أكثر المحافظين نشاطاً
    const custodianCounts: { [key: string]: number } = {};
    allRecords.forEach((record) => {
      custodianCounts[record.performer] =
        (custodianCounts[record.performer] || 0) + 1;
    });
    const mostActiveCustodian =
      Object.keys(custodianCounts).sort(
        (a, b) => custodianCounts[b] - custodianCounts[a],
      )[0] || "Unknown";

    return {
      totalChains: allChains.length,
      totalRecords: allRecords.length,
      totalAudits: allAudits.length,
      intactChains,
      compromisedChains,
      averageIntegrityScore: Math.round(averageIntegrityScore),
      mostActiveLocation,
      mostActiveCustodian,
    };
  }
}

export default ChainOfCustodyService;
