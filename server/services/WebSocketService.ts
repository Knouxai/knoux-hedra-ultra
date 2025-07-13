import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";

// واجهات التحديثات
export interface LiveUpdate {
  type:
    | "system_stats"
    | "surveillance_alert"
    | "ids_alert"
    | "tool_status"
    | "security_event"
    | "network_event"
    | "process_event";
  timestamp: string;
  data: any;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source: string;
}

export interface SurveillanceAlert {
  id: string;
  toolName: string;
  alertType: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
  metadata: any;
}

export interface IDSAlert {
  id: string;
  signature: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  timestamp: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  rawAlert: string;
}

export interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: string;
  processes: number;
  connections: number;
}

class WebSocketService {
  private io: SocketIOServer;
  private connectedClients: Map<string, Socket> = new Map();
  private snortProcess: ChildProcess | null = null;
  private suricataProcess: ChildProcess | null = null;
  private systemStatsInterval: NodeJS.Timeout | null = null;
  private alertQueue: LiveUpdate[] = [];
  private isIDSRunning = false;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.setupEventHandlers();
    this.startSystemMonitoring();
  }

  private setupEventHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, socket);

      // إرسال حالة النظام الحالية للعميل الجديد
      this.sendInitialData(socket);

      // معالجة الأحداث
      socket.on("subscribe_to_alerts", (data) => {
        this.handleSubscription(socket, data);
      });

      socket.on("start_ids", () => {
        this.startIDS(socket);
      });

      socket.on("stop_ids", () => {
        this.stopIDS(socket);
      });

      socket.on("acknowledge_alert", (alertId: string) => {
        this.acknowledgeAlert(socket, alertId);
      });

      socket.on("get_system_stats", () => {
        this.sendSystemStats(socket);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });

      // معالجة الأخطاء
      socket.on("error", (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  private async sendInitialData(socket: Socket): Promise<void> {
    try {
      // إرسال حالة النظام
      await this.sendSystemStats(socket);

      // إرسال حالة IDS
      socket.emit("ids_status", {
        isRunning: this.isIDSRunning,
        snortRunning: !!this.snortProcess,
        suricataRunning: !!this.suricataProcess,
      });

      // إرسال آخر التنبيهات
      const recentAlerts = this.alertQueue.slice(-10);
      socket.emit("recent_alerts", recentAlerts);
    } catch (error) {
      console.error("Error sending initial data:", error);
    }
  }

  private handleSubscription(socket: Socket, data: any): void {
    const { alertTypes, severity } = data;

    socket.join("alerts");

    if (alertTypes && Array.isArray(alertTypes)) {
      alertTypes.forEach((type) => {
        socket.join(`alerts:${type}`);
      });
    }

    if (severity) {
      socket.join(`severity:${severity}`);
    }

    console.log(
      `Client ${socket.id} subscribed to alerts:`,
      alertTypes,
      severity,
    );
  }

  // بدء مراقبة النظام
  private startSystemMonitoring(): void {
    // مراقبة إحصائيات النظام كل 2 ثانية
    this.systemStatsInterval = setInterval(async () => {
      try {
        const stats = await this.collectSystemStats();
        this.broadcastUpdate({
          type: "system_stats",
          timestamp: new Date().toISOString(),
          data: stats,
          severity: "LOW",
          source: "system_monitor",
        });
      } catch (error) {
        console.error("Error collecting system stats:", error);
      }
    }, 2000);
  }

  // جمع إحصائيات النظام
  private async collectSystemStats(): Promise<SystemStats> {
    const os = await import("os");

    // حساب استخدام المعالج
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuUsage = Math.max(0, 100 - (totalIdle / totalTick) * 100);

    // حساب استخدام الذاكرة
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

    // محاكاة إحصائيات إضافية
    const diskUsage = Math.random() * 100;
    const networkUsage = Math.random() * 100;
    const processes = Math.floor(Math.random() * 200) + 50;
    const connections = Math.floor(Math.random() * 100) + 10;

    return {
      cpu: Math.round(cpuUsage * 100) / 100,
      memory: Math.round(memoryUsage * 100) / 100,
      disk: Math.round(diskUsage * 100) / 100,
      network: Math.round(networkUsage * 100) / 100,
      timestamp: new Date().toISOString(),
      processes,
      connections,
    };
  }

  // بدء تشغيل IDS
  private startIDS(socket: Socket): void {
    if (this.isIDSRunning) {
      socket.emit("ids_error", { message: "IDS is already running" });
      return;
    }

    console.log("Starting IDS...");

    // محاولة تشغيل Snort أولاً
    this.startSnort();

    // إذا فشل Snort، جرب Suricata
    setTimeout(() => {
      if (!this.snortProcess) {
        this.startSuricata();
      }
    }, 2000);

    // إذا فشل كلاهما، استخدم المحاكاة
    setTimeout(() => {
      if (!this.snortProcess && !this.suricataProcess) {
        this.startMockIDS();
      }
    }, 5000);

    this.isIDSRunning = true;
    this.broadcastUpdate({
      type: "security_event",
      timestamp: new Date().toISOString(),
      data: { message: "IDS started", status: "running" },
      severity: "MEDIUM",
      source: "ids_manager",
    });
  }

  // بدء تشغيل Snort
  private startSnort(): void {
    try {
      const snortConfigPath = "/etc/snort/snort.conf";

      // التحقق من وجود Snort والإعدادات
      if (!fs.existsSync(snortConfigPath)) {
        console.log("Snort config not found, skipping...");
        return;
      }

      this.snortProcess = spawn("snort", [
        "-A",
        "console",
        "-q",
        "-c",
        snortConfigPath,
        "-i",
        "any",
      ]);

      this.snortProcess.stdout?.on("data", (data) => {
        this.parseSnortAlert(data.toString());
      });

      this.snortProcess.stderr?.on("data", (data) => {
        console.error("Snort stderr:", data.toString());
      });

      this.snortProcess.on("close", (code) => {
        console.log(`Snort exited with code ${code}`);
        this.snortProcess = null;

        // إعادة التشغيل التلقائي
        if (this.isIDSRunning) {
          setTimeout(() => this.startSnort(), 10000);
        }
      });

      console.log("Snort started successfully");
    } catch (error) {
      console.error("Failed to start Snort:", error);
    }
  }

  // بدء تشغيل Suricata
  private startSuricata(): void {
    try {
      const suricataConfigPath = "/etc/suricata/suricata.yaml";

      if (!fs.existsSync(suricataConfigPath)) {
        console.log("Suricata config not found, skipping...");
        return;
      }

      this.suricataProcess = spawn("suricata", [
        "-c",
        suricataConfigPath,
        "-i",
        "any",
        "--init-errors-fatal",
      ]);

      this.suricataProcess.stdout?.on("data", (data) => {
        this.parseSuricataAlert(data.toString());
      });

      this.suricataProcess.stderr?.on("data", (data) => {
        console.error("Suricata stderr:", data.toString());
      });

      this.suricataProcess.on("close", (code) => {
        console.log(`Suricata exited with code ${code}`);
        this.suricataProcess = null;

        if (this.isIDSRunning) {
          setTimeout(() => this.startSuricata(), 10000);
        }
      });

      console.log("Suricata started successfully");
    } catch (error) {
      console.error("Failed to start Suricata:", error);
    }
  }

  // بدء IDS المحاكي
  private startMockIDS(): void {
    console.log("Starting mock IDS for demonstration...");

    // محاكاة تنبيهات IDS
    const mockAlerts = [
      "Port scan detected from 192.168.1.100",
      "Suspicious HTTP request to /admin",
      "Potential SQL injection attempt",
      "Unusual network traffic pattern",
      "Malware signature detected",
      "Brute force attack on SSH",
      "DNS tunneling activity",
      "Cryptocurrency mining detected",
    ];

    const generateMockAlert = () => {
      const alert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      const severity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"][
        Math.floor(Math.random() * 4)
      ] as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

      this.broadcastIDSAlert({
        id: this.generateId(),
        signature: alert,
        sourceIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
        destinationIP: `10.0.0.${Math.floor(Math.random() * 255)}`,
        protocol: ["TCP", "UDP", "ICMP"][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString(),
        severity,
        rawAlert: `MOCK: ${alert}`,
      });
    };

    // إرسال تنبيه كل 10-30 ثانية
    const scheduleNext = () => {
      if (this.isIDSRunning) {
        setTimeout(
          () => {
            generateMockAlert();
            scheduleNext();
          },
          Math.random() * 20000 + 10000,
        );
      }
    };

    scheduleNext();
  }

  // تحليل تنبيهات Snort
  private parseSnortAlert(data: string): void {
    const lines = data.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      if (line.includes("[**]")) {
        const alert: IDSAlert = {
          id: this.generateId(),
          signature: this.extractSignature(line),
          sourceIP: this.extractSourceIP(line),
          destinationIP: this.extractDestinationIP(line),
          protocol: this.extractProtocol(line),
          timestamp: new Date().toISOString(),
          severity: this.determineSeverity(line),
          rawAlert: line,
        };

        this.broadcastIDSAlert(alert);
      }
    });
  }

  // تحليل تنبيهات Suricata
  private parseSuricataAlert(data: string): void {
    try {
      const jsonAlert = JSON.parse(data);

      if (jsonAlert.event_type === "alert") {
        const alert: IDSAlert = {
          id: this.generateId(),
          signature: jsonAlert.alert?.signature || "Unknown",
          sourceIP: jsonAlert.src_ip || "Unknown",
          destinationIP: jsonAlert.dest_ip || "Unknown",
          protocol: jsonAlert.proto || "Unknown",
          timestamp: jsonAlert.timestamp || new Date().toISOString(),
          severity: this.mapSuricataSeverity(jsonAlert.alert?.severity),
          rawAlert: data,
        };

        this.broadcastIDSAlert(alert);
      }
    } catch (error) {
      // ليس JSON صالح، تجاهل
    }
  }

  // بث تنبيه IDS
  private broadcastIDSAlert(alert: IDSAlert): void {
    this.broadcastUpdate({
      type: "ids_alert",
      timestamp: alert.timestamp,
      data: alert,
      severity: alert.severity,
      source: "ids",
    });

    console.log(`IDS Alert: ${alert.signature} (${alert.severity})`);
  }

  // إيقاف IDS
  private stopIDS(socket: Socket): void {
    console.log("Stopping IDS...");

    this.isIDSRunning = false;

    if (this.snortProcess) {
      this.snortProcess.kill();
      this.snortProcess = null;
    }

    if (this.suricataProcess) {
      this.suricataProcess.kill();
      this.suricataProcess = null;
    }

    this.broadcastUpdate({
      type: "security_event",
      timestamp: new Date().toISOString(),
      data: { message: "IDS stopped", status: "stopped" },
      severity: "MEDIUM",
      source: "ids_manager",
    });

    socket.emit("ids_stopped");
  }

  // إرسال إحصائيات النظام
  private async sendSystemStats(socket: Socket): Promise<void> {
    try {
      const stats = await this.collectSystemStats();
      socket.emit("system_stats", stats);
    } catch (error) {
      console.error("Error sending system stats:", error);
    }
  }

  // تأكيد التنبيه
  private acknowledgeAlert(socket: Socket, alertId: string): void {
    console.log(`Alert ${alertId} acknowledged by ${socket.id}`);

    this.broadcastUpdate({
      type: "security_event",
      timestamp: new Date().toISOString(),
      data: {
        message: "Alert acknowledged",
        alertId,
        acknowledgedBy: socket.id,
      },
      severity: "LOW",
      source: "alert_manager",
    });
  }

  // بث التحديث لجميع العملاء
  public broadcastUpdate(update: LiveUpdate): void {
    this.alertQueue.push(update);

    // الاحتفاظ بآخر 1000 تحديث
    if (this.alertQueue.length > 1000) {
      this.alertQueue = this.alertQueue.slice(-1000);
    }

    // بث لجميع العملاء المشتركين
    this.io.to("alerts").emit("live_update", update);

    // بث حسب نوع التحديث
    this.io.to(`alerts:${update.type}`).emit("live_update", update);

    // بث حسب مستوى الخطورة
    this.io.to(`severity:${update.severity}`).emit("live_update", update);

    // بث للجميع إذا كان حرجاً
    if (update.severity === "CRITICAL") {
      this.io.emit("critical_alert", update);
    }
  }

  // إرسال تنبيه مراقبة
  public sendSurveillanceAlert(alert: SurveillanceAlert): void {
    this.broadcastUpdate({
      type: "surveillance_alert",
      timestamp: alert.timestamp,
      data: alert,
      severity: alert.severity,
      source: alert.toolName,
    });
  }

  // دوال مساعدة لتحليل تنبيهات Snort
  private extractSignature(line: string): string {
    const match = line.match(/\[\*\*\]\s*\[.*?\]\s*(.*?)\s*\[\*\*\]/);
    return match ? match[1] : "Unknown signature";
  }

  private extractSourceIP(line: string): string {
    const match = line.match(/(\d+\.\d+\.\d+\.\d+):\d+\s*->/);
    return match ? match[1] : "Unknown";
  }

  private extractDestinationIP(line: string): string {
    const match = line.match(/-> (\d+\.\d+\.\d+\.\d+):\d+/);
    return match ? match[1] : "Unknown";
  }

  private extractProtocol(line: string): string {
    if (line.includes("TCP")) return "TCP";
    if (line.includes("UDP")) return "UDP";
    if (line.includes("ICMP")) return "ICMP";
    return "Unknown";
  }

  private determineSeverity(
    line: string,
  ): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes("critical") || lowerLine.includes("exploit")) {
      return "CRITICAL";
    }
    if (lowerLine.includes("high") || lowerLine.includes("attack")) {
      return "HIGH";
    }
    if (lowerLine.includes("medium") || lowerLine.includes("suspicious")) {
      return "MEDIUM";
    }
    return "LOW";
  }

  private mapSuricataSeverity(
    severity: number,
  ): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    if (severity <= 1) return "CRITICAL";
    if (severity <= 2) return "HIGH";
    if (severity <= 3) return "MEDIUM";
    return "LOW";
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // تنظيف الموارد
  public cleanup(): void {
    if (this.systemStatsInterval) {
      clearInterval(this.systemStatsInterval);
    }

    if (this.snortProcess) {
      this.snortProcess.kill();
    }

    if (this.suricataProcess) {
      this.suricataProcess.kill();
    }

    this.io.close();
  }
}

export default WebSocketService;
