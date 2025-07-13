import AlertService from "./AlertService";

// واجهات تحليل السلوك
export interface UserBehaviorProfile {
  userId: string;
  username: string;
  baseline: {
    loginTimes: number[]; // ساعات تسجيل الدخول المعتادة
    loginLocations: string[]; // المواقع المعتادة
    loginDevices: string[]; // الأجهزة المعتادة
    averageSessionDuration: number; // مدة الجلسة المتوسطة
    commonActions: string[]; // الإجراءات الشائعة
    workingDays: number[]; // أيام العمل المعتادة
    dataAccessPatterns: string[]; // أنماط الوصول للبيانات
    apiUsageFrequency: number; // تكرار استخدام API
  };
  recentActivity: UserActivity[];
  riskScore: number; // نقاط المخاطر (0-100)
  lastAnalyzed: string;
  anomalies: BehaviorAnomaly[];
}

export interface UserActivity {
  id: string;
  userId: string;
  timestamp: string;
  activityType:
    | "login"
    | "logout"
    | "file_access"
    | "api_call"
    | "data_export"
    | "privilege_escalation"
    | "system_command"
    | "network_access";
  details: {
    ipAddress: string;
    userAgent: string;
    location?: string;
    resource?: string;
    action?: string;
    responseCode?: number;
    dataSize?: number;
    duration?: number;
  };
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  context: any;
}

export interface BehaviorAnomaly {
  id: string;
  userId: string;
  type:
    | "unusual_login_time"
    | "new_location"
    | "new_device"
    | "excessive_api_calls"
    | "unusual_data_access"
    | "privilege_abuse"
    | "suspicious_downloads"
    | "anomalous_network_activity";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  evidence: any;
  timestamp: string;
  resolved: boolean;
  falsePositive: boolean;
  confidence: number; // مستوى الثقة (0-100)
}

export interface EntityBehaviorProfile {
  entityId: string;
  entityType: "device" | "ip_address" | "application" | "service";
  baseline: {
    normalTrafficVolume: number;
    normalConnections: number;
    commonPorts: number[];
    typicalUsers: string[];
    averageResponseTime: number;
    operatingHours: { start: number; end: number };
  };
  recentActivity: EntityActivity[];
  riskScore: number;
  lastAnalyzed: string;
  anomalies: BehaviorAnomaly[];
}

export interface EntityActivity {
  id: string;
  entityId: string;
  timestamp: string;
  activityType:
    | "network_connection"
    | "service_access"
    | "data_transfer"
    | "process_execution"
    | "configuration_change";
  details: any;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

class UEBAService {
  private userProfiles: Map<string, UserBehaviorProfile> = new Map();
  private entityProfiles: Map<string, EntityBehaviorProfile> = new Map();
  private activities: UserActivity[] = [];
  private entityActivities: EntityActivity[] = [];
  private alertService: AlertService | null = null;
  private analysisInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicAnalysis();
  }

  // تعيين خدمة التنبيهات
  public setAlertService(alertService: AlertService): void {
    this.alertService = alertService;
  }

  // بدء التحليل الدوري
  private startPeriodicAnalysis(): void {
    // تحليل كل 5 دقائق
    this.analysisInterval = setInterval(
      () => {
        this.analyzeAllProfiles();
      },
      5 * 60 * 1000,
    );
  }

  // تسجيل نشاط المستخدم
  public async logUserActivity(
    activity: Omit<UserActivity, "id">,
  ): Promise<void> {
    const userActivity: UserActivity = {
      ...activity,
      id: this.generateId(),
    };

    this.activities.unshift(userActivity);

    // الاحتفاظ بآخر 50000 نشاط
    if (this.activities.length > 50000) {
      this.activities = this.activities.slice(0, 50000);
    }

    // تحديث ملف المستخدم
    await this.updateUserProfile(activity.userId, userActivity);

    // تحليل فوري للأنشطة عالية المخاطر
    if (
      userActivity.riskLevel === "HIGH" ||
      userActivity.riskLevel === "CRITICAL"
    ) {
      await this.analyzeUserProfile(activity.userId);
    }

    console.log(
      `📊 User activity logged: ${activity.activityType} by ${activity.userId}`,
    );
  }

  // تحديث ملف المستخدم
  private async updateUserProfile(
    userId: string,
    activity: UserActivity,
  ): Promise<void> {
    let profile = this.userProfiles.get(userId);

    if (!profile) {
      // إنشاء ملف جديد
      profile = {
        userId,
        username: userId, // سيتم تحديثه لاحقاً
        baseline: {
          loginTimes: [],
          loginLocations: [],
          loginDevices: [],
          averageSessionDuration: 0,
          commonActions: [],
          workingDays: [],
          dataAccessPatterns: [],
          apiUsageFrequency: 0,
        },
        recentActivity: [],
        riskScore: 0,
        lastAnalyzed: new Date().toISOString(),
        anomalies: [],
      };
    }

    // إضافة النشاط الحديث
    profile.recentActivity.unshift(activity);

    // الاحتفاظ بآخر 1000 نشاط
    if (profile.recentActivity.length > 1000) {
      profile.recentActivity = profile.recentActivity.slice(0, 1000);
    }

    // تحديث البيانات الأساسية
    await this.updateBaseline(profile, activity);

    this.userProfiles.set(userId, profile);
  }

  // تحديث البيانات الأساسية للمستخدم
  private async updateBaseline(
    profile: UserBehaviorProfile,
    activity: UserActivity,
  ): Promise<void> {
    const activityDate = new Date(activity.timestamp);
    const hour = activityDate.getHours();
    const day = activityDate.getDay();

    // تحديث أوقات تسجيل الدخول
    if (activity.activityType === "login") {
      if (!profile.baseline.loginTimes.includes(hour)) {
        profile.baseline.loginTimes.push(hour);
      }

      // تحديث المواقع
      if (
        activity.details.location &&
        !profile.baseline.loginLocations.includes(activity.details.location)
      ) {
        profile.baseline.loginLocations.push(activity.details.location);
      }

      // تحديث الأجهزة
      if (
        activity.details.userAgent &&
        !profile.baseline.loginDevices.includes(activity.details.userAgent)
      ) {
        profile.baseline.loginDevices.push(activity.details.userAgent);
      }

      // تحديث أيام العمل
      if (!profile.baseline.workingDays.includes(day)) {
        profile.baseline.workingDays.push(day);
      }
    }

    // تحديث الإجراءات الشائعة
    if (
      activity.details.action &&
      !profile.baseline.commonActions.includes(activity.details.action)
    ) {
      profile.baseline.commonActions.push(activity.details.action);
    }

    // حساب متوسط استخدام API
    const apiCalls = profile.recentActivity.filter(
      (a) => a.activityType === "api_call",
    );
    profile.baseline.apiUsageFrequency =
      apiCalls.length / Math.max(1, profile.recentActivity.length / 24); // في اليوم
  }

  // تحليل ملف المستخدم
  private async analyzeUserProfile(userId: string): Promise<void> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    const anomalies: BehaviorAnomaly[] = [];

    // تحليل أنماط تسجيل الدخول
    const loginAnomalies = await this.analyzeLoginPatterns(profile);
    anomalies.push(...loginAnomalies);

    // تحليل استخدام API
    const apiAnomalies = await this.analyzeAPIUsage(profile);
    anomalies.push(...apiAnomalies);

    // تحليل الوصول للبيانات
    const dataAccessAnomalies = await this.analyzeDataAccess(profile);
    anomalies.push(...dataAccessAnomalies);

    // تحليل الامتيازات
    const privilegeAnomalies = await this.analyzePrivilegeUsage(profile);
    anomalies.push(...privilegeAnomalies);

    // إضافة الشذوذات الجديدة
    for (const anomaly of anomalies) {
      const existingAnomaly = profile.anomalies.find(
        (a) =>
          a.type === anomaly.type &&
          Date.now() - new Date(a.timestamp).getTime() < 24 * 60 * 60 * 1000,
      );

      if (!existingAnomaly) {
        profile.anomalies.push(anomaly);

        // إرسال تنبيه للشذوذات عالية المخاطر
        if (anomaly.severity === "HIGH" || anomaly.severity === "CRITICAL") {
          await this.sendAnomalyAlert(profile, anomaly);
        }
      }
    }

    // حساب نقاط المخاطر
    profile.riskScore = this.calculateRiskScore(profile);
    profile.lastAnalyzed = new Date().toISOString();

    console.log(
      `🔍 UEBA Analysis completed for user ${userId}, Risk Score: ${profile.riskScore}`,
    );
  }

  // تحليل أنماط تسجيل الدخول
  private async analyzeLoginPatterns(
    profile: UserBehaviorProfile,
  ): Promise<BehaviorAnomaly[]> {
    const anomalies: BehaviorAnomaly[] = [];
    const recentLogins = profile.recentActivity.filter(
      (a) =>
        a.activityType === "login" &&
        Date.now() - new Date(a.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000, // آخر أسبوع
    );

    for (const login of recentLogins) {
      const loginDate = new Date(login.timestamp);
      const hour = loginDate.getHours();
      const day = loginDate.getDay();

      // تحقق من الوقت غير المعتاد
      if (
        profile.baseline.loginTimes.length > 0 &&
        !this.isTimeInRange(hour, profile.baseline.loginTimes, 2)
      ) {
        anomalies.push({
          id: this.generateId(),
          userId: profile.userId,
          type: "unusual_login_time",
          severity: "MEDIUM",
          description: `Login at unusual time: ${hour}:00. Normal times: ${profile.baseline.loginTimes.join(", ")}`,
          evidence: {
            loginTime: hour,
            normalTimes: profile.baseline.loginTimes,
          },
          timestamp: login.timestamp,
          resolved: false,
          falsePositive: false,
          confidence: 75,
        });
      }

      // تحقق من موقع جديد
      if (
        login.details.location &&
        !profile.baseline.loginLocations.includes(login.details.location)
      ) {
        anomalies.push({
          id: this.generateId(),
          userId: profile.userId,
          type: "new_location",
          severity: "HIGH",
          description: `Login from new location: ${login.details.location}`,
          evidence: {
            newLocation: login.details.location,
            knownLocations: profile.baseline.loginLocations,
          },
          timestamp: login.timestamp,
          resolved: false,
          falsePositive: false,
          confidence: 90,
        });
      }

      // تحقق ��ن جهاز جديد
      if (
        login.details.userAgent &&
        !this.isKnownDevice(
          login.details.userAgent,
          profile.baseline.loginDevices,
        )
      ) {
        anomalies.push({
          id: this.generateId(),
          userId: profile.userId,
          type: "new_device",
          severity: "MEDIUM",
          description: `Login from new device: ${login.details.userAgent}`,
          evidence: {
            newDevice: login.details.userAgent,
            knownDevices: profile.baseline.loginDevices,
          },
          timestamp: login.timestamp,
          resolved: false,
          falsePositive: false,
          confidence: 80,
        });
      }
    }

    return anomalies;
  }

  // تحليل استخدام API
  private async analyzeAPIUsage(
    profile: UserBehaviorProfile,
  ): Promise<BehaviorAnomaly[]> {
    const anomalies: BehaviorAnomaly[] = [];
    const recentAPICalls = profile.recentActivity.filter(
      (a) =>
        a.activityType === "api_call" &&
        Date.now() - new Date(a.timestamp).getTime() < 24 * 60 * 60 * 1000, // آخر 24 ساعة
    );

    const currentAPIUsage = recentAPICalls.length;
    const threshold = profile.baseline.apiUsageFrequency * 3; // 3 أضعاف المعدل الطبيعي

    if (currentAPIUsage > threshold && threshold > 0) {
      anomalies.push({
        id: this.generateId(),
        userId: profile.userId,
        type: "excessive_api_calls",
        severity: currentAPIUsage > threshold * 2 ? "CRITICAL" : "HIGH",
        description: `Excessive API usage: ${currentAPIUsage} calls (normal: ${profile.baseline.apiUsageFrequency.toFixed(1)})`,
        evidence: {
          currentUsage: currentAPIUsage,
          normalUsage: profile.baseline.apiUsageFrequency,
        },
        timestamp: new Date().toISOString(),
        resolved: false,
        falsePositive: false,
        confidence: 85,
      });
    }

    return anomalies;
  }

  // تحليل الوصول للبيانات
  private async analyzeDataAccess(
    profile: UserBehaviorProfile,
  ): Promise<BehaviorAnomaly[]> {
    const anomalies: BehaviorAnomaly[] = [];
    const recentDataAccess = profile.recentActivity.filter(
      (a) =>
        (a.activityType === "file_access" ||
          a.activityType === "data_export") &&
        Date.now() - new Date(a.timestamp).getTime() < 24 * 60 * 60 * 1000,
    );

    // تحقق من الوصول لبيانات حساسة
    const sensitiveDataAccess = recentDataAccess.filter(
      (a) =>
        a.details.resource &&
        (a.details.resource.includes("confidential") ||
          a.details.resource.includes("secret") ||
          a.details.resource.includes("private") ||
          a.details.resource.includes("admin")),
    );

    if (sensitiveDataAccess.length > 0) {
      anomalies.push({
        id: this.generateId(),
        userId: profile.userId,
        type: "unusual_data_access",
        severity: "HIGH",
        description: `Access to sensitive data: ${sensitiveDataAccess.length} incidents`,
        evidence: { sensitiveAccess: sensitiveDataAccess },
        timestamp: new Date().toISOString(),
        resolved: false,
        falsePositive: false,
        confidence: 90,
      });
    }

    // تحقق من تنزيلات مشبوهة
    const largeDownloads = recentDataAccess.filter(
      (a) => a.details.dataSize && a.details.dataSize > 100 * 1024 * 1024, // أكثر من 100MB
    );

    if (largeDownloads.length > 3) {
      anomalies.push({
        id: this.generateId(),
        userId: profile.userId,
        type: "suspicious_downloads",
        severity: "MEDIUM",
        description: `Multiple large downloads: ${largeDownloads.length} files`,
        evidence: { downloads: largeDownloads },
        timestamp: new Date().toISOString(),
        resolved: false,
        falsePositive: false,
        confidence: 70,
      });
    }

    return anomalies;
  }

  // تحليل استخدام الامتيازات
  private async analyzePrivilegeUsage(
    profile: UserBehaviorProfile,
  ): Promise<BehaviorAnomaly[]> {
    const anomalies: BehaviorAnomaly[] = [];
    const privilegeActivities = profile.recentActivity.filter(
      (a) =>
        a.activityType === "privilege_escalation" ||
        a.activityType === "system_command",
    );

    if (privilegeActivities.length > 0) {
      // تحقق من محاولات تصعيد الامتيازات
      const escalations = privilegeActivities.filter(
        (a) => a.activityType === "privilege_escalation",
      );

      if (escalations.length > 0) {
        anomalies.push({
          id: this.generateId(),
          userId: profile.userId,
          type: "privilege_abuse",
          severity: "CRITICAL",
          description: `Privilege escalation attempts: ${escalations.length}`,
          evidence: { escalations },
          timestamp: new Date().toISOString(),
          resolved: false,
          falsePositive: false,
          confidence: 95,
        });
      }
    }

    return anomalies;
  }

  // حساب نقاط المخاطر
  private calculateRiskScore(profile: UserBehaviorProfile): number {
    let score = 0;

    // نقاط الشذوذات الحديثة
    const recentAnomalies = profile.anomalies.filter(
      (a) =>
        !a.resolved &&
        !a.falsePositive &&
        Date.now() - new Date(a.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000,
    );

    for (const anomaly of recentAnomalies) {
      switch (anomaly.severity) {
        case "CRITICAL":
          score += 40 * (anomaly.confidence / 100);
          break;
        case "HIGH":
          score += 25 * (anomaly.confidence / 100);
          break;
        case "MEDIUM":
          score += 15 * (anomaly.confidence / 100);
          break;
        case "LOW":
          score += 5 * (anomaly.confidence / 100);
          break;
      }
    }

    // نقاط الأنشطة عالية المخاطر
    const highRiskActivities = profile.recentActivity.filter(
      (a) => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL",
    );
    score += highRiskActivities.length * 5;

    // تطبيق حد أقصى
    return Math.min(100, Math.max(0, score));
  }

  // إرسال تنبيه الشذوذ
  private async sendAnomalyAlert(
    profile: UserBehaviorProfile,
    anomaly: BehaviorAnomaly,
  ): Promise<void> {
    if (!this.alertService) return;

    await this.alertService.createAlert({
      type: "security",
      severity: anomaly.severity,
      title: `UEBA: ${anomaly.type.replace(/_/g, " ").toUpperCase()}`,
      message: `User ${profile.username} (${profile.userId}) - ${anomaly.description}`,
      source: "UEBA_Engine",
      metadata: {
        userId: profile.userId,
        username: profile.username,
        anomalyType: anomaly.type,
        confidence: anomaly.confidence,
        evidence: anomaly.evidence,
        riskScore: profile.riskScore,
      },
      acknowledged: false,
      escalated: false,
      escalationLevel: 0,
    });
  }

  // تحليل جميع الملفات الشخصية
  private async analyzeAllProfiles(): Promise<void> {
    console.log("🔍 Starting periodic UEBA analysis...");

    for (const [userId] of this.userProfiles) {
      try {
        await this.analyzeUserProfile(userId);
      } catch (error) {
        console.error(`Error analyzing user ${userId}:`, error);
      }
    }

    // تنظيف البيانات القديمة
    this.cleanupOldData();

    console.log(
      `✅ UEBA analysis completed for ${this.userProfiles.size} users`,
    );
  }

  // تنظيف البيانات القديمة
  private cleanupOldData(): void {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    // تنظيف الأنشطة القديمة
    this.activities = this.activities.filter(
      (activity) => new Date(activity.timestamp).getTime() > oneWeekAgo,
    );

    // تنظي�� الشذوذات القديمة من الملفات الشخصية
    for (const [userId, profile] of this.userProfiles) {
      profile.anomalies = profile.anomalies.filter(
        (anomaly) =>
          new Date(anomaly.timestamp).getTime() > oneWeekAgo ||
          !anomaly.resolved,
      );
    }
  }

  // دوال مساعدة
  private isTimeInRange(
    hour: number,
    normalTimes: number[],
    tolerance: number,
  ): boolean {
    return normalTimes.some(
      (normalHour) =>
        Math.abs(hour - normalHour) <= tolerance ||
        Math.abs(hour - normalHour + 24) <= tolerance ||
        Math.abs(hour - normalHour - 24) <= tolerance,
    );
  }

  private isKnownDevice(userAgent: string, knownDevices: string[]): boolean {
    return knownDevices.some(
      (device) => this.calculateStringSimilarity(userAgent, device) > 0.7,
    );
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // واجهات API العامة
  public getUserProfile(userId: string): UserBehaviorProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  public getAllUserProfiles(): UserBehaviorProfile[] {
    return Array.from(this.userProfiles.values());
  }

  public getHighRiskUsers(): UserBehaviorProfile[] {
    return Array.from(this.userProfiles.values())
      .filter((profile) => profile.riskScore > 50)
      .sort((a, b) => b.riskScore - a.riskScore);
  }

  public markAnomalyAsResolved(anomalyId: string): boolean {
    for (const [userId, profile] of this.userProfiles) {
      const anomaly = profile.anomalies.find((a) => a.id === anomalyId);
      if (anomaly) {
        anomaly.resolved = true;
        return true;
      }
    }
    return false;
  }

  public markAnomalyAsFalsePositive(anomalyId: string): boolean {
    for (const [userId, profile] of this.userProfiles) {
      const anomaly = profile.anomalies.find((a) => a.id === anomalyId);
      if (anomaly) {
        anomaly.falsePositive = true;
        // إعادة حساب نقاط المخاطر
        profile.riskScore = this.calculateRiskScore(profile);
        return true;
      }
    }
    return false;
  }

  public getUEBAStatistics(): any {
    const allProfiles = Array.from(this.userProfiles.values());
    const totalAnomalies = allProfiles.reduce(
      (sum, profile) => sum + profile.anomalies.length,
      0,
    );
    const unresolvedAnomalies = allProfiles.reduce(
      (sum, profile) =>
        sum +
        profile.anomalies.filter((a) => !a.resolved && !a.falsePositive).length,
      0,
    );

    return {
      totalUsers: allProfiles.length,
      highRiskUsers: allProfiles.filter((p) => p.riskScore > 70).length,
      mediumRiskUsers: allProfiles.filter(
        (p) => p.riskScore > 30 && p.riskScore <= 70,
      ).length,
      lowRiskUsers: allProfiles.filter((p) => p.riskScore <= 30).length,
      totalAnomalies,
      unresolvedAnomalies,
      totalActivities: this.activities.length,
      averageRiskScore:
        allProfiles.length > 0
          ? allProfiles.reduce((sum, p) => sum + p.riskScore, 0) /
            allProfiles.length
          : 0,
    };
  }

  // تنظيف الموارد
  public cleanup(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
  }
}

export default UEBAService;
