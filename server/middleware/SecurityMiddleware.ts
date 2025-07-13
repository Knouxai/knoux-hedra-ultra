import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// أنواع البيانات
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    permissions: string[];
  };
  rateLimitInfo?: {
    remaining: number;
    resetTime: Date;
  };
}

export interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "logout"
    | "permission_denied"
    | "rate_limit"
    | "suspicious_activity";
  userId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: any;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// إعدادات الأمان
const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "knox-sentinel-secret-key-2024",
  JWT_EXPIRY: "24h",
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 دقيقة
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 ساعة
  SALT_ROUNDS: 12,
};

// تخزين محاولات تسجيل الدخول الفاشلة
const loginAttempts = new Map<
  string,
  { count: number; lastAttempt: Date; lockedUntil?: Date }
>();

// سجل الأحداث الأمنية
const securityEvents: SecurityEvent[] = [];

// دالة تسجيل الأحداث الأمنية
export function logSecurityEvent(
  event: Omit<SecurityEvent, "id" | "timestamp">,
): void {
  const securityEvent: SecurityEvent = {
    ...event,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  securityEvents.push(securityEvent);

  // الاحتفاظ بآخر 10000 حدث فقط
  if (securityEvents.length > 10000) {
    securityEvents.splice(0, securityEvents.length - 10000);
  }

  // طباعة الأحداث الحرجة
  if (event.severity === "CRITICAL" || event.severity === "HIGH") {
    console.warn(
      `🚨 Security Event [${event.severity}]:`,
      event.type,
      event.details,
    );
  }
}

// تحديد معدل الطلبات - عام
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 1000, // 1000 طلب لكل IP
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent({
      type: "rate_limit",
      userId: (req as AuthenticatedRequest).user?.id || "anonymous",
      ipAddress: getClientIP(req),
      userAgent: req.get("User-Agent") || "unknown",
      details: { limit: "general", endpoint: req.path },
      severity: "MEDIUM",
    });

    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

// تحديد معدل الطلبات - تسجيل الدخول
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10, // 10 محاولات تسجيل دخول لكل IP
  message: {
    error: "Too many login attempts, please try again later.",
    retryAfter: "15 minutes",
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logSecurityEvent({
      type: "rate_limit",
      userId: "anonymous",
      ipAddress: getClientIP(req),
      userAgent: req.get("User-Agent") || "unknown",
      details: { limit: "login", attempts: 10 },
      severity: "HIGH",
    });

    res.status(429).json({
      error: "Too many login attempts, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

// تحديد معدل الطلبات - API حساس
export const sensitiveAPIRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 دقيقة
  max: 20, // 20 طلب في الدقيقة
  message: {
    error: "Rate limit exceeded for sensitive operations.",
    retryAfter: "1 minute",
  },
  handler: (req, res) => {
    logSecurityEvent({
      type: "rate_limit",
      userId: (req as AuthenticatedRequest).user?.id || "anonymous",
      ipAddress: getClientIP(req),
      userAgent: req.get("User-Agent") || "unknown",
      details: { limit: "sensitive_api", endpoint: req.path },
      severity: "HIGH",
    });

    res.status(429).json({
      error: "Rate limit exceeded for sensitive operations.",
      retryAfter: "1 minute",
    });
  },
});

// التحقق من المصادقة
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logSecurityEvent({
      type: "permission_denied",
      userId: "anonymous",
      ipAddress: getClientIP(req),
      userAgent: req.get("User-Agent") || "unknown",
      details: { reason: "missing_token", endpoint: req.path },
      severity: "MEDIUM",
    });

    res.status(401).json({ error: "Access token required" });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, SECURITY_CONFIG.JWT_SECRET) as any;

    // التحقق من انتهاء صلاحية الجلسة
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      permissions: decoded.permissions || [],
    };

    next();
  } catch (error) {
    logSecurityEvent({
      type: "permission_denied",
      userId: "unknown",
      ipAddress: getClientIP(req),
      userAgent: req.get("User-Agent") || "unknown",
      details: {
        reason: "invalid_token",
        error: error.message,
        endpoint: req.path,
      },
      severity: "MEDIUM",
    });

    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// التحقق من الصلاحيات
export function authorize(permission: string) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // المدير له كل الصلاحيات
    if (req.user.role === "admin") {
      next();
      return;
    }

    // التحقق من الصلاحية المحددة
    if (!req.user.permissions.includes(permission)) {
      logSecurityEvent({
        type: "permission_denied",
        userId: req.user.id,
        ipAddress: getClientIP(req),
        userAgent: req.get("User-Agent") || "unknown",
        details: {
          required_permission: permission,
          user_permissions: req.user.permissions,
          endpoint: req.path,
        },
        severity: "MEDIUM",
      });

      res.status(403).json({
        error: "Insufficient permissions",
        required: permission,
      });
      return;
    }

    next();
  };
}

// التحقق من عدة صلاحيات (يجب أن تتوفر جميعها)
export function authorizeAll(permissions: string[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (req.user.role === "admin") {
      next();
      return;
    }

    const missingPermissions = permissions.filter(
      (perm) => !req.user!.permissions.includes(perm),
    );

    if (missingPermissions.length > 0) {
      logSecurityEvent({
        type: "permission_denied",
        userId: req.user.id,
        ipAddress: getClientIP(req),
        userAgent: req.get("User-Agent") || "unknown",
        details: {
          required_permissions: permissions,
          missing_permissions: missingPermissions,
          endpoint: req.path,
        },
        severity: "MEDIUM",
      });

      res.status(403).json({
        error: "Insufficient permissions",
        required: permissions,
        missing: missingPermissions,
      });
      return;
    }

    next();
  };
}

// التحقق من أي صلاحية من مجموعة (يكفي واحدة)
export function authorizeAny(permissions: string[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (req.user.role === "admin") {
      next();
      return;
    }

    const hasAnyPermission = permissions.some((perm) =>
      req.user!.permissions.includes(perm),
    );

    if (!hasAnyPermission) {
      logSecurityEvent({
        type: "permission_denied",
        userId: req.user.id,
        ipAddress: getClientIP(req),
        userAgent: req.get("User-Agent") || "unknown",
        details: {
          required_any_of: permissions,
          user_permissions: req.user.permissions,
          endpoint: req.path,
        },
        severity: "MEDIUM",
      });

      res.status(403).json({
        error: "Insufficient permissions",
        required_any_of: permissions,
      });
      return;
    }

    next();
  };
}

// التحقق من صحة البيانات المدخلة
export function validateInput(validationRules: any) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(validationRules)) {
      const value = req.body[field];
      const ruleArray = Array.isArray(rules) ? rules : [rules];

      for (const rule of ruleArray) {
        if (typeof rule === "function") {
          const result = rule(value);
          if (result !== true) {
            errors.push(`${field}: ${result}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      logSecurityEvent({
        type: "suspicious_activity",
        userId: (req as AuthenticatedRequest).user?.id || "anonymous",
        ipAddress: getClientIP(req),
        userAgent: req.get("User-Agent") || "unknown",
        details: { validation_errors: errors, endpoint: req.path },
        severity: "LOW",
      });

      res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
      return;
    }

    next();
  };
}

// قواعد التحقق المشتركة
export const ValidationRules = {
  required: (value: any) =>
    value !== undefined && value !== null && value !== ""
      ? true
      : "Field is required",
  email: (value: string) =>
    validator.isEmail(value) ? true : "Invalid email format",
  strongPassword: (value: string) => {
    if (!value || value.length < 8)
      return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(value))
      return "Password must contain lowercase letters";
    if (!/(?=.*[A-Z])/.test(value))
      return "Password must contain uppercase letters";
    if (!/(?=.*\d)/.test(value)) return "Password must contain numbers";
    if (!/(?=.*[@$!%*?&])/.test(value))
      return "Password must contain special characters";
    return true;
  },
  username: (value: string) => {
    if (!value || value.length < 3)
      return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_-]+$/.test(value))
      return "Username can only contain letters, numbers, underscore and dash";
    return true;
  },
  ipAddress: (value: string) =>
    validator.isIP(value) ? true : "Invalid IP address",
  noScripts: (value: string) => {
    if (/<script/i.test(value) || /javascript:/i.test(value)) {
      return "Script content not allowed";
    }
    return true;
  },
};

// منع هجمات برموز التسلسل
export function preventInjection(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const checkForInjection = (obj: any): boolean => {
    if (typeof obj === "string") {
      const dangerous = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\s*\(/i,
        /expression\s*\(/i,
        /union\s+select/i,
        /drop\s+table/i,
        /delete\s+from/i,
        /insert\s+into/i,
      ];

      return dangerous.some((pattern) => pattern.test(obj));
    }

    if (typeof obj === "object" && obj !== null) {
      return Object.values(obj).some(checkForInjection);
    }

    return false;
  };

  if (checkForInjection(req.body) || checkForInjection(req.query)) {
    logSecurityEvent({
      type: "suspicious_activity",
      userId: (req as AuthenticatedRequest).user?.id || "anonymous",
      ipAddress: getClientIP(req),
      userAgent: req.get("User-Agent") || "unknown",
      details: {
        injection_attempt: true,
        body: req.body,
        query: req.query,
        endpoint: req.path,
      },
      severity: "HIGH",
    });

    res.status(400).json({ error: "Malicious content detected" });
    return;
  }

  next();
}

// مراقبة الأنشطة المشبوهة
export function detectSuspiciousActivity(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const clientIP = getClientIP(req);
  const userAgent = req.get("User-Agent") || "unknown";

  // فحص محاولات الوصول المشبوهة
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /\|/, // Command injection
    /\$/, // Variable injection
    /`/, // Command execution
  ];

  const fullUrl = req.originalUrl;
  const isSuspicious = suspiciousPatterns.some((pattern) =>
    pattern.test(fullUrl),
  );

  if (isSuspicious) {
    logSecurityEvent({
      type: "suspicious_activity",
      userId: req.user?.id || "anonymous",
      ipAddress: clientIP,
      userAgent: userAgent,
      details: {
        suspicious_url: fullUrl,
        method: req.method,
        endpoint: req.path,
      },
      severity: "HIGH",
    });
  }

  // فحص User-Agent المشبوه
  const suspiciousAgents = [
    "sqlmap",
    "nikto",
    "nmap",
    "masscan",
    "burp",
    "zap",
    "dirb",
  ];

  if (
    suspiciousAgents.some((agent) => userAgent.toLowerCase().includes(agent))
  ) {
    logSecurityEvent({
      type: "suspicious_activity",
      userId: req.user?.id || "anonymous",
      ipAddress: clientIP,
      userAgent: userAgent,
      details: {
        suspicious_user_agent: userAgent,
        endpoint: req.path,
      },
      severity: "HIGH",
    });
  }

  next();
}

// تسجيل طلبات API للمراجعة
export function auditLog(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();

  // تسجيل تفاصيل الطلب
  const auditEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: getClientIP(req),
    userAgent: req.get("User-Agent"),
    userId: req.user?.id,
    username: req.user?.username,
    role: req.user?.role,
  };

  // تسجيل الاستجابة
  const originalSend = res.send;
  res.send = function (data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // تسجيل تفاصيل الاستجابة
    console.log(
      `[AUDIT] ${auditEntry.method} ${auditEntry.url} - ${res.statusCode} - ${responseTime}ms - User: ${auditEntry.username || "anonymous"}`,
    );

    return originalSend.call(this, data);
  };

  next();
}

// الحصول على عنوان IP العميل
function getClientIP(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string) ||
    (req.headers["x-real-ip"] as string) ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown"
  )
    .split(",")[0]
    .trim();
}

// توليد معرف فريد
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// الحصول على سجل الأحداث الأمنية
export function getSecurityEvents(): SecurityEvent[] {
  return [...securityEvents];
}

// تصدير سجل الأمان
export function exportSecurityLog(): any {
  return {
    events: securityEvents,
    summary: {
      totalEvents: securityEvents.length,
      criticalEvents: securityEvents.filter((e) => e.severity === "CRITICAL")
        .length,
      highSeverityEvents: securityEvents.filter((e) => e.severity === "HIGH")
        .length,
      recentEvents: securityEvents.filter(
        (e) =>
          Date.now() - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000,
      ).length,
    },
    exportedAt: new Date().toISOString(),
  };
}

// تشفير كلمة المرور
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SECURITY_CONFIG.SALT_ROUNDS);
}

// التحقق من كلمة المرور
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// إنشاء JWT token
export function generateToken(payload: any): string {
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    expiresIn: SECURITY_CONFIG.JWT_EXPIRY,
  });
}

export default {
  generalRateLimit,
  loginRateLimit,
  sensitiveAPIRateLimit,
  authenticate,
  authorize,
  authorizeAll,
  authorizeAny,
  validateInput,
  ValidationRules,
  preventInjection,
  detectSuspiciousActivity,
  auditLog,
  logSecurityEvent,
  getSecurityEvents,
  exportSecurityLog,
  hashPassword,
  verifyPassword,
  generateToken,
};
