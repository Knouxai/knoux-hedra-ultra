// نظام إدارة الصلاحيات والأدوار - RBAC
export type UserRole = "admin" | "operator" | "analyst" | "viewer";

export type Permission =
  | "surveillance.start"
  | "surveillance.stop"
  | "surveillance.configure"
  | "surveillance.view_reports"
  | "surveillance.delete_logs"
  | "surveillance.export_data"
  | "offensive.execute"
  | "offensive.configure"
  | "network.monitor"
  | "network.block"
  | "system.restart"
  | "system.shutdown"
  | "users.manage"
  | "audit.view"
  | "audit.export"
  | "settings.global"
  | "alerts.configure"
  | "alerts.acknowledge";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  lastLogin: string;
  isActive: boolean;
  sessions: Session[];
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

export interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "logout"
    | "permission_denied"
    | "suspicious_activity"
    | "unauthorized_access";
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// تعريف الصلاحيات لكل دور
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "surveillance.start",
    "surveillance.stop",
    "surveillance.configure",
    "surveillance.view_reports",
    "surveillance.delete_logs",
    "surveillance.export_data",
    "offensive.execute",
    "offensive.configure",
    "network.monitor",
    "network.block",
    "system.restart",
    "system.shutdown",
    "users.manage",
    "audit.view",
    "audit.export",
    "settings.global",
    "alerts.configure",
    "alerts.acknowledge",
  ],
  operator: [
    "surveillance.start",
    "surveillance.stop",
    "surveillance.configure",
    "surveillance.view_reports",
    "surveillance.export_data",
    "network.monitor",
    "audit.view",
    "alerts.acknowledge",
  ],
  analyst: [
    "surveillance.view_reports",
    "surveillance.export_data",
    "network.monitor",
    "audit.view",
    "audit.export",
    "alerts.acknowledge",
  ],
  viewer: ["surveillance.view_reports", "network.monitor", "audit.view"],
};

class PermissionService {
  private currentUser: User | null = null;
  private securityEvents: SecurityEvent[] = [];

  // تسجيل دخول المستخدم
  async login(
    username: string,
    password: string,
  ): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
  }> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.currentUser = data.user;
        localStorage.setItem("authToken", data.token);

        // تسجيل حدث أمني
        this.logSecurityEvent({
          type: "login",
          userId: data.user.id,
          details: { username },
          severity: "LOW",
        });

        return { success: true, token: data.token, user: data.user };
      } else {
        // تسجيل محاولة دخول فاشلة
        this.logSecurityEvent({
          type: "unauthorized_access",
          userId: "unknown",
          details: { username, reason: data.error },
          severity: "MEDIUM",
        });

        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Connection failed" };
    }
  }

  // تسجيل خروج المستخدم
  async logout(): Promise<void> {
    if (this.currentUser) {
      this.logSecurityEvent({
        type: "logout",
        userId: this.currentUser.id,
        details: {},
        severity: "LOW",
      });
    }

    this.currentUser = null;
    localStorage.removeItem("authToken");

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }

  // التحقق من صلاحية معينة
  hasPermission(permission: Permission): boolean {
    if (!this.currentUser) return false;

    // المدير له كل الصلاحيات
    if (this.currentUser.role === "admin") return true;

    return this.currentUser.permissions.includes(permission);
  }

  // التحقق من عدة صلاحيات
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  // التحقق من أي صلاحية من مجموعة
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  // الحصول على المستخدم الحالي
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // التحقق من صحة الجلسة
  async validateSession(): Promise<boolean> {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      const response = await fetch("/api/auth/validate", {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        this.currentUser = data.user;
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // تسجيل حدث أمني
  private logSecurityEvent(
    event: Omit<SecurityEvent, "id" | "timestamp" | "ipAddress" | "userAgent">,
  ): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
    };

    this.securityEvents.push(securityEvent);

    // إرسال الحدث للخادم
    fetch("/api/security/events", {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(securityEvent),
    }).catch((error) => console.error("Failed to log security event:", error));

    // الاحتفاظ بآخر 1000 حدث فقط
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }
  }

  // التحقق من الصلاحية مع تسجيل الرفض
  checkPermissionWithLogging(permission: Permission, action: string): boolean {
    const hasPermission = this.hasPermission(permission);

    if (!hasPermission) {
      this.logSecurityEvent({
        type: "permission_denied",
        userId: this.currentUser?.id || "unknown",
        details: { permission, action },
        severity: "MEDIUM",
      });
    }

    return hasPermission;
  }

  // تنفيذ إجراء مع التح��ق من الصلاحية
  async executeWithPermission<T>(
    permission: Permission,
    action: string,
    fn: () => Promise<T>,
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    if (!this.checkPermissionWithLogging(permission, action)) {
      return {
        success: false,
        error: `Access denied: Missing permission '${permission}'`,
      };
    }

    try {
      const data = await fn();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // الحصول على رؤوس المصادقة
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // توليد معرف فريد
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // الحصول على عنوان IP العميل (تقريبي)
  private getClientIP(): string {
    // في بيئة الإنتاج، هذا سيأتي من الخادم
    return "client-ip";
  }

  // الحصول على أحداث الأمان
  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  // تصدير سجل الأمان
  exportSecurityLog(): void {
    const logData = {
      events: this.securityEvents,
      exportedAt: new Date().toISOString(),
      exportedBy: this.currentUser?.username || "unknown",
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-log-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // مراقبة النشاط المشبوه
  detectSuspiciousActivity(): void {
    // خوارزمية بسيطة لكشف النشاط المشبوه
    const recentEvents = this.securityEvents.filter(
      (event) =>
        Date.now() - new Date(event.timestamp).getTime() < 5 * 60 * 1000, // آخر 5 دقائق
    );

    const permissionDenials = recentEvents.filter(
      (e) => e.type === "permission_denied",
    );

    if (permissionDenials.length > 5) {
      this.logSecurityEvent({
        type: "suspicious_activity",
        userId: this.currentUser?.id || "unknown",
        details: {
          reason: "Multiple permission denials",
          count: permissionDenials.length,
        },
        severity: "HIGH",
      });
    }
  }
}

// إنشاء مثيل واحد للخدمة
export const permissionService = new PermissionService();

// Hook لاستخدام الصلاحيات في React
export function usePermissions() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const isValid = await permissionService.validateSession();
      if (isValid) {
        setUser(permissionService.getCurrentUser());
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    hasPermission: (permission: Permission) =>
      permissionService.hasPermission(permission),
    hasAllPermissions: (permissions: Permission[]) =>
      permissionService.hasAllPermissions(permissions),
    hasAnyPermission: (permissions: Permission[]) =>
      permissionService.hasAnyPermission(permissions),
    executeWithPermission:
      permissionService.executeWithPermission.bind(permissionService),
    logout: () => permissionService.logout(),
  };
}

export default PermissionService;
