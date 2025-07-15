import nodemailer from "nodemailer";
import WebSocketService from "./WebSocketService";

// واجهات التنبيهات
export interface Alert {
  id: string;
  type: "security" | "system" | "surveillance" | "ids" | "malware" | "network";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  source: string;
  timestamp: string;
  metadata: any;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  escalated: boolean;
  escalationLevel: number;
}

export interface NotificationChannel {
  type: "email" | "sms" | "push" | "webhook" | "websocket";
  enabled: boolean;
  config: any;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    severity?: string[];
    type?: string[];
    source?: string[];
    keywords?: string[];
  };
  actions: {
    channels: string[];
    escalationTime: number; // minutes
    maxEscalationLevel: number;
    cooldownTime: number; // minutes
  };
  schedule?: {
    enabled: boolean;
    workingHours: { start: string; end: string };
    workingDays: number[]; // 0-6, Sunday-Saturday
    timezone: string;
  };
}

export interface EscalationPath {
  level: number;
  channels: string[];
  delay: number; // minutes
  recipients: string[];
}

class AlertService {
  private alerts: Alert[] = [];
  private alertRules: AlertRule[] = [];
  private notificationChannels: Map<string, NotificationChannel> = new Map();
  private escalationTimers: Map<string, NodeJS.Timeout> = new Map();
  private cooldownTimers: Map<string, Date> = new Map();
  private emailTransporter: nodemailer.Transporter | null = null;
  private wsService: WebSocketService | null = null;

  constructor() {
    this.setupDefaultChannels();
    this.setupDefaultRules();
    this.initializeEmailService();
  }

  // إعداد القنوات الافتراضية
  private setupDefaultChannels(): void {
    this.notificationChannels.set("email_critical", {
      type: "email",
      enabled: true,
      priority: "CRITICAL",
      config: {
        to: ["admin@company.com", "security@company.com"],
        subject: "🚨 CRITICAL Security Alert",
        template: "critical_alert",
      },
    });

    this.notificationChannels.set("email_standard", {
      type: "email",
      enabled: true,
      priority: "MEDIUM",
      config: {
        to: ["security@company.com"],
        subject: "⚠️ Security Alert",
        template: "standard_alert",
      },
    });

    this.notificationChannels.set("websocket_live", {
      type: "websocket",
      enabled: true,
      priority: "LOW",
      config: {
        event: "live_alert",
        rooms: ["alerts", "security"],
      },
    });

    this.notificationChannels.set("webhook_teams", {
      type: "webhook",
      enabled: false,
      priority: "HIGH",
      config: {
        url: process.env.TEAMS_WEBHOOK_URL || "",
        headers: { "Content-Type": "application/json" },
        template: "teams_card",
      },
    });

    this.notificationChannels.set("sms_emergency", {
      type: "sms",
      enabled: false,
      priority: "CRITICAL",
      config: {
        numbers: ["+1234567890"],
        message: "EMERGENCY: Security breach detected at {timestamp}",
      },
    });
  }

  // إعداد القواعد الافتراضية
  private setupDefaultRules(): void {
    this.alertRules.push({
      id: "critical_security",
      name: "Critical Security Events",
      enabled: true,
      conditions: {
        severity: ["CRITICAL"],
        type: ["security", "malware", "ids"],
      },
      actions: {
        channels: ["email_critical", "websocket_live", "webhook_teams"],
        escalationTime: 5, // 5 minutes
        maxEscalationLevel: 3,
        cooldownTime: 30, // 30 minutes
      },
      schedule: {
        enabled: true,
        workingHours: { start: "09:00", end: "17:00" },
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        timezone: "UTC",
      },
    });

    this.alertRules.push({
      id: "surveillance_alerts",
      name: "Surveillance System Alerts",
      enabled: true,
      conditions: {
        type: ["surveillance"],
        severity: ["MEDIUM", "HIGH", "CRITICAL"],
      },
      actions: {
        channels: ["email_standard", "websocket_live"],
        escalationTime: 10, // 10 minutes
        maxEscalationLevel: 2,
        cooldownTime: 15, // 15 minutes
      },
    });

    this.alertRules.push({
      id: "system_monitoring",
      name: "System Health Monitoring",
      enabled: true,
      conditions: {
        type: ["system"],
        severity: ["HIGH", "CRITICAL"],
      },
      actions: {
        channels: ["email_standard", "websocket_live"],
        escalationTime: 15, // 15 minutes
        maxEscalationLevel: 2,
        cooldownTime: 60, // 1 hour
      },
    });
  }

  // تهيئة خدمة البريد الإلكتروني
  private initializeEmailService(): void {
    try {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "localhost",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || "",
        },
      });

      console.log("Email service initialized");
    } catch (error) {
      console.error("Failed to initialize email service:", error);
    }
  }

  // تعيين خدمة WebSocket
  public setWebSocketService(wsService: WebSocketService): void {
    this.wsService = wsService;
  }

  // إنشاء تنبيه جديد
  public async createAlert(
    alertData: Omit<Alert, "id" | "timestamp">,
  ): Promise<Alert> {
    const alert: Alert = {
      ...alertData,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      acknowledged: false,
      escalated: false,
      escalationLevel: 0,
    };

    this.alerts.unshift(alert);

    // الاحتفاظ بآخر 10000 تنبيه
    if (this.alerts.length > 10000) {
      this.alerts = this.alerts.slice(0, 10000);
    }

    // معالجة التنبيه
    await this.processAlert(alert);

    console.log(
      `🔔 Alert created: [${alert.severity}] ${alert.title} from ${alert.source}`,
    );

    return alert;
  }

  // معالجة التنبيه
  private async processAlert(alert: Alert): Promise<void> {
    // العثور على القواعد المطبقة
    const applicableRules = this.alertRules.filter((rule) =>
      this.ruleMatches(rule, alert),
    );

    if (applicableRules.length === 0) {
      console.log(`No matching rules for alert ${alert.id}`);
      return;
    }

    // تطبيق كل قاعدة مطبقة
    for (const rule of applicableRules) {
      await this.applyRule(rule, alert);
    }
  }

  // التحقق من تطابق القاعدة مع التنبيه
  private ruleMatches(rule: AlertRule, alert: Alert): boolean {
    if (!rule.enabled) return false;

    // التحقق من شروط الخطورة
    if (
      rule.conditions.severity &&
      !rule.conditions.severity.includes(alert.severity)
    ) {
      return false;
    }

    // التحقق من شروط النوع
    if (rule.conditions.type && !rule.conditions.type.includes(alert.type)) {
      return false;
    }

    // التحقق من شروط المصدر
    if (
      rule.conditions.source &&
      !rule.conditions.source.includes(alert.source)
    ) {
      return false;
    }

    // التحقق من الكلمات المفتاحية
    if (rule.conditions.keywords) {
      const messageText = (alert.title + " " + alert.message).toLowerCase();
      const hasKeyword = rule.conditions.keywords.some((keyword) =>
        messageText.includes(keyword.toLowerCase()),
      );
      if (!hasKeyword) return false;
    }

    // التحقق من الجدولة
    if (rule.schedule?.enabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();

      // التحقق من أيام العمل
      if (
        rule.schedule.workingDays &&
        !rule.schedule.workingDays.includes(currentDay)
      ) {
        return false;
      }

      // التحقق من ساعات العمل
      if (rule.schedule.workingHours) {
        const startHour = parseInt(
          rule.schedule.workingHours.start.split(":")[0],
        );
        const endHour = parseInt(rule.schedule.workingHours.end.split(":")[0]);

        if (currentHour < startHour || currentHour >= endHour) {
          return false;
        }
      }
    }

    return true;
  }

  // تطبيق قاعدة على التنبيه
  private async applyRule(rule: AlertRule, alert: Alert): Promise<void> {
    // التحقق من cooldown
    const cooldownKey = `${rule.id}_${alert.type}_${alert.source}`;
    const lastNotification = this.cooldownTimers.get(cooldownKey);

    if (lastNotification) {
      const cooldownExpiry = new Date(
        lastNotification.getTime() + rule.actions.cooldownTime * 60 * 1000,
      );
      if (new Date() < cooldownExpiry) {
        console.log(
          `Rule ${rule.id} is in cooldown for alert type ${alert.type}`,
        );
        return;
      }
    }

    // إرسال التنبيهات عبر القنوات المحددة
    for (const channelId of rule.actions.channels) {
      await this.sendNotification(channelId, alert);
    }

    // تعيين cooldown
    this.cooldownTimers.set(cooldownKey, new Date());

    // جدولة التصعيد
    if (
      rule.actions.escalationTime > 0 &&
      rule.actions.maxEscalationLevel > 0
    ) {
      this.scheduleEscalation(rule, alert);
    }
  }

  // إرسال إشعار عبر قناة محددة
  private async sendNotification(
    channelId: string,
    alert: Alert,
  ): Promise<boolean> {
    const channel = this.notificationChannels.get(channelId);

    if (!channel || !channel.enabled) {
      console.log(`Channel ${channelId} is disabled or not found`);
      return false;
    }

    try {
      switch (channel.type) {
        case "email":
          return await this.sendEmailNotification(channel, alert);
        case "websocket":
          return await this.sendWebSocketNotification(channel, alert);
        case "webhook":
          return await this.sendWebhookNotification(channel, alert);
        case "sms":
          return await this.sendSMSNotification(channel, alert);
        case "push":
          return await this.sendPushNotification(channel, alert);
        default:
          console.error(`Unknown channel type: ${channel.type}`);
          return false;
      }
    } catch (error) {
      console.error(`Failed to send notification via ${channelId}:`, error);
      return false;
    }
  }

  // إرسال إشعار بريد إلكترون��
  private async sendEmailNotification(
    channel: NotificationChannel,
    alert: Alert,
  ): Promise<boolean> {
    if (!this.emailTransporter) {
      console.error("Email transporter not initialized");
      return false;
    }

    const htmlContent = this.generateEmailHTML(alert, channel.config.template);

    const mailOptions = {
      from: process.env.SMTP_FROM || "security@company.com",
      to: channel.config.to,
      subject: `${channel.config.subject} - ${alert.title}`,
      html: htmlContent,
      priority:
        alert.severity === "CRITICAL" ? ("high" as const) : ("normal" as const),
    };

    try {
      await this.emailTransporter.sendMail(mailOptions);
      console.log(`Email sent for alert ${alert.id}`);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  // إرسال إشعار WebSocket
  private async sendWebSocketNotification(
    channel: NotificationChannel,
    alert: Alert,
  ): Promise<boolean> {
    if (!this.wsService) {
      console.error("WebSocket service not available");
      return false;
    }

    this.wsService.broadcastUpdate({
      type: "surveillance_alert",
      timestamp: alert.timestamp,
      data: alert,
      severity: alert.severity,
      source: alert.source,
    });

    return true;
  }

  // إرسال إشعار Webhook
  private async sendWebhookNotification(
    channel: NotificationChannel,
    alert: Alert,
  ): Promise<boolean> {
    const payload = this.generateWebhookPayload(alert, channel.config.template);

    try {
      const response = await fetch(channel.config.url, {
        method: "POST",
        headers: channel.config.headers || {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`Webhook sent for alert ${alert.id}`);
        return true;
      } else {
        console.error(`Webhook failed with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error("Failed to send webhook:", error);
      return false;
    }
  }

  // إرسال إشعار SMS (محاكاة)
  private async sendSMSNotification(
    channel: NotificationChannel,
    alert: Alert,
  ): Promise<boolean> {
    // في الإنتاج، هنا ستكون خدمة SMS حقيقية مثل Twilio
    console.log(
      `📱 SMS Alert sent to ${channel.config.numbers.join(", ")}: ${alert.title}`,
    );

    // محاكاة إرسال SMS
    const message = channel.config.message
      .replace("{title}", alert.title)
      .replace("{severity}", alert.severity)
      .replace("{timestamp}", new Date(alert.timestamp).toLocaleString());

    console.log(`SMS Content: ${message}`);

    return true;
  }

  // إرسال إشعار Push (محاكاة)
  private async sendPushNotification(
    channel: NotificationChannel,
    alert: Alert,
  ): Promise<boolean> {
    // في الإنتاج، هنا ستكون خدمة Push حقيقية
    console.log(
      `📢 Push notification sent: ${alert.title} (${alert.severity})`,
    );

    return true;
  }

  // جدولة التصعيد
  private scheduleEscalation(rule: AlertRule, alert: Alert): void {
    const escalationTimer = setTimeout(
      () => {
        this.escalateAlert(rule, alert);
      },
      rule.actions.escalationTime * 60 * 1000,
    );

    this.escalationTimers.set(alert.id, escalationTimer);
  }

  // تصعيد التنبيه
  private async escalateAlert(rule: AlertRule, alert: Alert): Promise<void> {
    // التحقق من أن التنبيه لم يتم تأكيده
    const currentAlert = this.alerts.find((a) => a.id === alert.id);
    if (!currentAlert || currentAlert.acknowledged) {
      console.log(
        `Alert ${alert.id} already acknowledged, skipping escalation`,
      );
      return;
    }

    currentAlert.escalated = true;
    currentAlert.escalationLevel++;

    console.log(
      `🔺 Escalating alert ${alert.id} to level ${currentAlert.escalationLevel}`,
    );

    // إذا وصلنا للحد الأقصى من التصعيد
    if (currentAlert.escalationLevel >= rule.actions.maxEscalationLevel) {
      console.log(`Alert ${alert.id} reached maximum escalation level`);

      // إرسال تنبيه حرج نهائي
      await this.sendNotification("email_critical", {
        ...currentAlert,
        title: `🚨 ESCALATED: ${currentAlert.title}`,
        message: `Alert has been escalated ${currentAlert.escalationLevel} times without acknowledgment. Immediate attention required.\n\nOriginal message: ${currentAlert.message}`,
        severity: "CRITICAL",
      });

      return;
    }

    // إرسال تنبيه التصعيد
    for (const channelId of rule.actions.channels) {
      await this.sendNotification(channelId, {
        ...currentAlert,
        title: `🔺 ESCALATED (Level ${currentAlert.escalationLevel}): ${currentAlert.title}`,
        message: `Alert has been escalated due to lack of acknowledgment.\n\nOriginal message: ${currentAlert.message}`,
      });
    }

    // جدولة التصعيد التالي
    this.scheduleEscalation(rule, currentAlert);
  }

  // تأكيد التنبيه
  public acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);

    if (!alert) {
      console.error(`Alert ${alertId} not found`);
      return false;
    }

    if (alert.acknowledged) {
      console.log(`Alert ${alertId} already acknowledged`);
      return false;
    }

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date().toISOString();

    // إلغاء أي تصعيد مجدول
    const escalationTimer = this.escalationTimers.get(alertId);
    if (escalationTimer) {
      clearTimeout(escalationTimer);
      this.escalationTimers.delete(alertId);
    }

    console.log(`✅ Alert ${alertId} acknowledged by ${acknowledgedBy}`);

    return true;
  }

  // توليد HTML للبريد الإلكتروني
  private generateEmailHTML(alert: Alert, template: string): string {
    const severityColor = {
      LOW: "#3b82f6",
      MEDIUM: "#f59e0b",
      HIGH: "#f97316",
      CRITICAL: "#ef4444",
    };

    return `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background-color: ${severityColor[alert.severity]}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">${alert.severity} Security Alert</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">${alert.source} • ${new Date(alert.timestamp).toLocaleString()}</p>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #333; margin-top: 0;">${alert.title}</h2>
              <p style="color: #666; line-height: 1.6;">${alert.message}</p>
              
              ${
                alert.metadata
                  ? `
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
                  <h3 style="margin-top: 0; color: #333;">Additional Details:</h3>
                  <pre style="margin: 0; color: #666; font-size: 12px; overflow-x: auto;">${JSON.stringify(alert.metadata, null, 2)}</pre>
                </div>
              `
                  : ""
              }
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                  Alert ID: ${alert.id}<br>
                  Generated by KNOX Sentinel™ Security System
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // توليد payload للـ webhook
  private generateWebhookPayload(alert: Alert, template: string): any {
    if (template === "teams_card") {
      return {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        themeColor:
          alert.severity === "CRITICAL"
            ? "FF0000"
            : alert.severity === "HIGH"
              ? "FF8C00"
              : alert.severity === "MEDIUM"
                ? "FFD700"
                : "0078D4",
        summary: `Security Alert: ${alert.title}`,
        sections: [
          {
            activityTitle: `🛡️ ${alert.severity} Security Alert`,
            activitySubtitle: `From: ${alert.source}`,
            activityImage:
              "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Shield/SVG/ic_fluent_shield_error_24_filled.svg",
            facts: [
              { name: "Severity:", value: alert.severity },
              { name: "Source:", value: alert.source },
              {
                name: "Time:",
                value: new Date(alert.timestamp).toLocaleString(),
              },
              { name: "Alert ID:", value: alert.id },
            ],
            markdown: true,
          },
          {
            activityTitle: "Details",
            activityText: alert.message,
          },
        ],
      };
    }

    // Default webhook payload
    return {
      alert_id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      source: alert.source,
      timestamp: alert.timestamp,
      metadata: alert.metadata,
    };
  }

  // الحصول على جميع التنبيهات
  public getAlerts(filters?: {
    severity?: string;
    type?: string;
    acknowledged?: boolean;
    limit?: number;
  }): Alert[] {
    let filteredAlerts = [...this.alerts];

    if (filters) {
      if (filters.severity) {
        filteredAlerts = filteredAlerts.filter(
          (alert) => alert.severity === filters.severity,
        );
      }

      if (filters.type) {
        filteredAlerts = filteredAlerts.filter(
          (alert) => alert.type === filters.type,
        );
      }

      if (filters.acknowledged !== undefined) {
        filteredAlerts = filteredAlerts.filter(
          (alert) => alert.acknowledged === filters.acknowledged,
        );
      }

      if (filters.limit) {
        filteredAlerts = filteredAlerts.slice(0, filters.limit);
      }
    }

    return filteredAlerts;
  }

  // إحصائيات التنبيهات
  public getAlertStatistics(): any {
    const last24Hours = this.alerts.filter(
      (alert) =>
        Date.now() - new Date(alert.timestamp).getTime() < 24 * 60 * 60 * 1000,
    );

    return {
      total: this.alerts.length,
      last24Hours: last24Hours.length,
      acknowledged: this.alerts.filter((a) => a.acknowledged).length,
      unacknowledged: this.alerts.filter((a) => !a.acknowledged).length,
      escalated: this.alerts.filter((a) => a.escalated).length,
      bySeverity: {
        CRITICAL: this.alerts.filter((a) => a.severity === "CRITICAL").length,
        HIGH: this.alerts.filter((a) => a.severity === "HIGH").length,
        MEDIUM: this.alerts.filter((a) => a.severity === "MEDIUM").length,
        LOW: this.alerts.filter((a) => a.severity === "LOW").length,
      },
      byType: {
        security: this.alerts.filter((a) => a.type === "security").length,
        surveillance: this.alerts.filter((a) => a.type === "surveillance")
          .length,
        system: this.alerts.filter((a) => a.type === "system").length,
        ids: this.alerts.filter((a) => a.type === "ids").length,
        malware: this.alerts.filter((a) => a.type === "malware").length,
        network: this.alerts.filter((a) => a.type === "network").length,
      },
    };
  }

  // توليد معرف فريد
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // تنظيف الموارد
  public cleanup(): void {
    // إلغاء جميع مؤقتات التصعيد
    this.escalationTimers.forEach((timer) => clearTimeout(timer));
    this.escalationTimers.clear();

    // إغلاق اتصال البريد الإلكتروني
    if (this.emailTransporter) {
      this.emailTransporter.close();
    }
  }
}

export default AlertService;
