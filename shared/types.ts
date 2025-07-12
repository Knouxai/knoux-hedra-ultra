// Shared types for the KNOX Sentinel system

export interface Tool {
  id: string;
  name: string;
  nameEn: string;
  icon_prompt: string;
  description: string;
  descriptionEn: string;
  command: string;
  scriptPath: string;
  category: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  executionTime: string;
  enabled: boolean;
  realtime: boolean;
  output:
    | "table"
    | "chart"
    | "alert"
    | "form"
    | "progress"
    | "notification"
    | "stream"
    | "code"
    | "status"
    | "report"
    | "terminal"
    | "dashboard"
    | "log"
    | "graph"
    | "map"
    | "gauge"
    | "shield"
    | "toggle"
    | "cards"
    | "recommendations"
    | "visual"
    | "voice"
    | "chat"
    | "file"
    | "signature"
    | "security"
    | "sync"
    | "archive"
    | "preview"
    | "config"
    | "permissions"
    | "selector"
    | "hidden";
}

export interface Section {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  logo_prompt: string;
  color: string;
  status: string;
  category: string;
  priority: number;
  enabled: boolean;
  tools: Tool[];
}

export interface DatabaseMetadata {
  version: string;
  lastUpdated: string;
  totalSections: number;
  totalTools: number;
  signature: string;
}

export interface DatabaseStructure {
  metadata: DatabaseMetadata;
  sections: Section[];
}

export interface ToolExecution {
  toolId: string;
  sectionId: number;
  startTime: Date;
  endTime?: Date;
  status: "running" | "completed" | "failed" | "cancelled";
  output?: any;
  error?: string;
  user: string;
}

export interface LiveStats {
  activeUsers: number;
  activeSystems: number;
  totalWarnings: number;
  systemIntegration: number;
  residualAsset1: number;
  residualAsset2: number;
  auraData: number[];
  regionalStats: RegionalStat[];
  individualRisk: number;
  usedToday: number;
  barData: number[];
  executingTools: ToolExecution[];
  lastUpdate: Date;
}

export interface RegionalStat {
  region: string;
  percentage: number;
  color: string;
}

export interface SystemNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  toolId?: string;
  sectionId?: number;
}

export interface UserPreferences {
  theme: "dark" | "light" | "cosmic";
  language: "ar" | "en";
  notifications: boolean;
  soundEnabled: boolean;
  autoExecute: boolean;
  riskLevelFilter: string[];
  favoriteTools: string[];
  customColors: Record<string, string>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  signature: string;
}

export interface ToolExecutionRequest {
  toolId: string;
  sectionId: number;
  parameters?: Record<string, any>;
  async?: boolean;
}

export interface ToolExecutionResponse {
  executionId: string;
  status: "started" | "queued" | "failed";
  estimatedTime?: string;
  output?: any;
}
