import express from "express";
import multer from "multer";
import path from "path";
import ForensicsService from "../services/ForensicsService";
import { authenticate, authorize } from "../middleware/SecurityMiddleware";

const router = express.Router();
const forensicsService = new ForensicsService();

// إعداد multer لرفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "forensics", "evidence");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 * 1024, // 50GB max file size
  },
  fileFilter: (req, file, cb) => {
    // السماح بجميع أنواع الملفات للأدلة الجنائية
    cb(null, true);
  },
});

// GET /api/forensics/cases - الحصول على جميع القضايا
router.get(
  "/forensics/cases",
  authenticate,
  authorize("forensics.view"),
  (req, res) => {
    try {
      const cases = forensicsService.getAllCases();

      // تصفية البيانات الحساسة حسب الصلاحيات
      const filteredCases = cases.map((case_) => ({
        id: case_.id,
        caseNumber: case_.caseNumber,
        title: case_.title,
        description: case_.description,
        investigator: case_.investigator,
        priority: case_.priority,
        status: case_.status,
        createdAt: case_.createdAt,
        updatedAt: case_.updatedAt,
        evidenceCount: case_.evidenceItems.length,
        findingsCount: case_.findings.length,
        // إخفاء التفاصيل الحساسة للمستخدمين غير المخولين
        evidenceItems: req.user?.permissions?.includes("forensics.evidence")
          ? case_.evidenceItems
          : [],
        findings: req.user?.permissions?.includes("forensics.findings")
          ? case_.findings
          : [],
      }));

      res.json({
        success: true,
        cases: filteredCases,
        total: cases.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve cases",
        details: error.message,
      });
    }
  },
);

// GET /api/forensics/cases/:caseId - الحصول على قضية محددة
router.get(
  "/forensics/cases/:caseId",
  authenticate,
  authorize("forensics.view"),
  (req, res) => {
    try {
      const { caseId } = req.params;
      const case_ = forensicsService.getCase(caseId);

      if (!case_) {
        return res.status(404).json({
          success: false,
          error: "Case not found",
        });
      }

      // التحقق من صلاحيات عرض القضية
      if (
        case_.investigator !== req.user?.username &&
        !req.user?.permissions?.includes("forensics.view_all")
      ) {
        return res.status(403).json({
          success: false,
          error: "Access denied: You can only view your own cases",
        });
      }

      res.json({
        success: true,
        case: case_,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve case",
        details: error.message,
      });
    }
  },
);

// POST /api/forensics/cases - إنشاء قضية جديدة
router.post(
  "/forensics/cases",
  authenticate,
  authorize("forensics.create_case"),
  async (req, res) => {
    try {
      const { title, description, priority } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: "Title and description are required",
        });
      }

      const investigator = req.user?.username || "unknown";

      const newCase = await forensicsService.createCase({
        title,
        description,
        investigator,
        priority: priority || "MEDIUM",
      });

      res.status(201).json({
        success: true,
        message: "Case created successfully",
        case: newCase,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to create case",
        details: error.message,
      });
    }
  },
);

// POST /api/forensics/cases/:caseId/evidence - إضافة دليل للقضية
router.post(
  "/forensics/cases/:caseId/evidence",
  authenticate,
  authorize("forensics.add_evidence"),
  upload.single("evidenceFile"),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const { type, name, description, source, metadata } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Evidence file is required",
        });
      }

      if (!type || !name || !description || !source) {
        return res.status(400).json({
          success: false,
          error: "Type, name, description, and source are required",
        });
      }

      const evidence = await forensicsService.addEvidence(caseId, {
        type,
        name,
        description,
        filePath: req.file.path,
        collectedBy: req.user?.username || "unknown",
        source,
        metadata: metadata ? JSON.parse(metadata) : {},
      });

      res.status(201).json({
        success: true,
        message: "Evidence added successfully",
        evidence: evidence,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to add evidence",
        details: error.message,
      });
    }
  },
);

// POST /api/forensics/evidence/:evidenceId/analyze - تحليل دليل
router.post(
  "/forensics/evidence/:evidenceId/analyze",
  authenticate,
  authorize("forensics.analyze_evidence"),
  async (req, res) => {
    try {
      const { evidenceId } = req.params;
      const { analysisType, tool } = req.body;

      if (!analysisType || !tool) {
        return res.status(400).json({
          success: false,
          error: "Analysis type and tool are required",
        });
      }

      // بدء التحليل في الخلفية
      forensicsService
        .analyzeEvidence(evidenceId, analysisType, tool)
        .then((result) => {
          console.log(`Analysis completed for evidence ${evidenceId}:`, result);
        })
        .catch((error) => {
          console.error(`Analysis failed for evidence ${evidenceId}:`, error);
        });

      res.json({
        success: true,
        message: "Analysis started successfully",
        evidenceId: evidenceId,
        analysisType: analysisType,
        tool: tool,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to start analysis",
        details: error.message,
      });
    }
  },
);

// GET /api/forensics/evidence/:evidenceId - الحصول على تفاصيل دليل
router.get(
  "/forensics/evidence/:evidenceId",
  authenticate,
  authorize("forensics.view_evidence"),
  (req, res) => {
    try {
      const { evidenceId } = req.params;
      const evidence = forensicsService.getEvidence(evidenceId);

      if (!evidence) {
        return res.status(404).json({
          success: false,
          error: "Evidence not found",
        });
      }

      res.json({
        success: true,
        evidence: evidence,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve evidence",
        details: error.message,
      });
    }
  },
);

// POST /api/forensics/cases/:caseId/findings - إضافة نتيجة للقضية
router.post(
  "/forensics/cases/:caseId/findings",
  authenticate,
  authorize("forensics.add_finding"),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const {
        title,
        description,
        category,
        severity,
        confidence,
        evidence,
        recommendations,
      } = req.body;

      if (!title || !description || !category || !severity) {
        return res.status(400).json({
          success: false,
          error: "Title, description, category, and severity are required",
        });
      }

      const finding = await forensicsService.addFinding(caseId, {
        title,
        description,
        category,
        severity,
        confidence: confidence || 80,
        evidence: evidence || [],
        recommendations: recommendations || [],
        createdBy: req.user?.username || "unknown",
      });

      res.status(201).json({
        success: true,
        message: "Finding added successfully",
        finding: finding,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to add finding",
        details: error.message,
      });
    }
  },
);

// POST /api/forensics/cases/:caseId/report - إنشاء تقرير للقضية
router.post(
  "/forensics/cases/:caseId/report",
  authenticate,
  authorize("forensics.generate_report"),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const { reportType = "FINAL" } = req.body;

      const report = await forensicsService.generateFinalReport(
        caseId,
        req.user?.username || "unknown",
      );

      res.json({
        success: true,
        message: "Report generated successfully",
        report: {
          id: report.id,
          title: report.title,
          type: report.type,
          generatedAt: report.generatedAt,
          generatedBy: report.generatedBy,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to generate report",
        details: error.message,
      });
    }
  },
);

// GET /api/forensics/statistics - إحصائيات التحقيق الجنائي
router.get(
  "/forensics/statistics",
  authenticate,
  authorize("forensics.view_stats"),
  (req, res) => {
    try {
      const stats = forensicsService.getForensicsStatistics();

      res.json({
        success: true,
        statistics: stats,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve statistics",
        details: error.message,
      });
    }
  },
);

// GET /api/forensics/investigator/:investigator/cases - قضايا محقق محدد
router.get(
  "/forensics/investigator/:investigator/cases",
  authenticate,
  authorize("forensics.view"),
  (req, res) => {
    try {
      const { investigator } = req.params;

      // التحقق من الصلاحيات - المحققون يمكنهم رؤية قضاياهم فقط
      if (
        investigator !== req.user?.username &&
        !req.user?.permissions?.includes("forensics.view_all")
      ) {
        return res.status(403).json({
          success: false,
          error: "Access denied: You can only view your own cases",
        });
      }

      const cases = forensicsService.getCasesByInvestigator(investigator);

      res.json({
        success: true,
        investigator: investigator,
        cases: cases,
        total: cases.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve investigator cases",
        details: error.message,
      });
    }
  },
);

// GET /api/forensics/status/:status/cases - قضايا بحالة محددة
router.get(
  "/forensics/status/:status/cases",
  authenticate,
  authorize("forensics.view"),
  (req, res) => {
    try {
      const { status } = req.params;

      if (!["OPEN", "IN_PROGRESS", "CLOSED", "ARCHIVED"].includes(status)) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid status. Must be one of: OPEN, IN_PROGRESS, CLOSED, ARCHIVED",
        });
      }

      const cases = forensicsService.getCasesByStatus(status as any);

      res.json({
        success: true,
        status: status,
        cases: cases,
        total: cases.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve cases by status",
        details: error.message,
      });
    }
  },
);

// PUT /api/forensics/cases/:caseId/status - تحديث حالة القضية
router.put(
  "/forensics/cases/:caseId/status",
  authenticate,
  authorize("forensics.update_case"),
  async (req, res) => {
    try {
      const { caseId } = req.params;
      const { status, notes } = req.body;

      if (!["OPEN", "IN_PROGRESS", "CLOSED", "ARCHIVED"].includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Invalid status",
        });
      }

      const case_ = forensicsService.getCase(caseId);
      if (!case_) {
        return res.status(404).json({
          success: false,
          error: "Case not found",
        });
      }

      // التحقق من الصلاحيات
      if (
        case_.investigator !== req.user?.username &&
        !req.user?.permissions?.includes("forensics.update_all")
      ) {
        return res.status(403).json({
          success: false,
          error: "Access denied: You can only update your own cases",
        });
      }

      // تحديث الحالة
      case_.status = status;
      case_.updatedAt = new Date().toISOString();

      // إضافة حدث timeline
      forensicsService.addTimelineEvent(caseId, {
        eventType: "STATUS_CHANGED",
        description: `Case status changed to ${status}${notes ? `: ${notes}` : ""}`,
        source: req.user?.username || "unknown",
      });

      res.json({
        success: true,
        message: "Case status updated successfully",
        case: case_,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to update case status",
        details: error.message,
      });
    }
  },
);

// GET /api/forensics/analysis-tools - الحصول على أدوات التحليل المتاحة
router.get(
  "/forensics/analysis-tools",
  authenticate,
  authorize("forensics.view"),
  (req, res) => {
    const analysisTools = {
      disk_analysis: [
        {
          name: "Autopsy",
          description: "Digital forensics platform",
          supported: true,
        },
        {
          name: "Sleuth Kit",
          description: "File system analysis",
          supported: true,
        },
        {
          name: "FTK Imager",
          description: "Disk imaging and analysis",
          supported: false,
        },
      ],
      memory_analysis: [
        {
          name: "Volatility",
          description: "Memory forensics framework",
          supported: true,
        },
        {
          name: "Rekall",
          description: "Memory analysis framework",
          supported: true,
        },
        {
          name: "Memoryze",
          description: "Windows memory analysis",
          supported: false,
        },
      ],
      network_analysis: [
        {
          name: "Wireshark",
          description: "Network protocol analyzer",
          supported: true,
        },
        {
          name: "NetworkMiner",
          description: "Network forensics tool",
          supported: true,
        },
        { name: "Tcpdump", description: "Packet analyzer", supported: true },
      ],
      malware_analysis: [
        {
          name: "YARA",
          description: "Malware identification",
          supported: true,
        },
        { name: "ClamAV", description: "Antivirus engine", supported: true },
        {
          name: "VirusTotal API",
          description: "Online malware scanner",
          supported: false,
        },
      ],
    };

    res.json({
      success: true,
      tools: analysisTools,
      total: Object.values(analysisTools).reduce(
        (sum, category) => sum + category.length,
        0,
      ),
    });
  },
);

// POST /api/forensics/timeline - البحث في timeline
router.post(
  "/forensics/timeline",
  authenticate,
  authorize("forensics.view"),
  (req, res) => {
    try {
      const { caseId, startDate, endDate, eventTypes } = req.body;

      if (!caseId) {
        return res.status(400).json({
          success: false,
          error: "Case ID is required",
        });
      }

      const case_ = forensicsService.getCase(caseId);
      if (!case_) {
        return res.status(404).json({
          success: false,
          error: "Case not found",
        });
      }

      let timeline = case_.timeline;

      // تصفية بالتاريخ
      if (startDate) {
        timeline = timeline.filter(
          (event) => new Date(event.timestamp) >= new Date(startDate),
        );
      }
      if (endDate) {
        timeline = timeline.filter(
          (event) => new Date(event.timestamp) <= new Date(endDate),
        );
      }

      // تصفية بنوع الحدث
      if (eventTypes && eventTypes.length > 0) {
        timeline = timeline.filter((event) =>
          eventTypes.includes(event.eventType),
        );
      }

      // ترتيب بالوقت
      timeline.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      res.json({
        success: true,
        timeline: timeline,
        total: timeline.length,
        filters: {
          startDate,
          endDate,
          eventTypes,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to retrieve timeline",
        details: error.message,
      });
    }
  },
);

export default router;
