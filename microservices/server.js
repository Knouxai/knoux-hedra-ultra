const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.KOTS_PORT || 7070;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 7071 });

// KOTS™ Tool Registry - All 49 Tools Across 7 Modules
const toolsRegistry = {
  // DEFENSIVE OPS MODULE (7 tools)
  ActiveServicesScanner: {
    module: "defensive-ops",
    run:
      process.platform === "win32"
        ? "defensive-ops/ActiveServicesScanner/run.ps1"
        : "defensive-ops/ActiveServicesScanner/run.sh",
    update:
      process.platform === "win32"
        ? "defensive-ops/ActiveServicesScanner/update.ps1"
        : "defensive-ops/ActiveServicesScanner/update.sh",
    settings: "defensive-ops/ActiveServicesScanner/settings.json",
    status: "defensive-ops/ActiveServicesScanner/status.json",
    category: "defense",
    riskLevel: "low",
  },
  PortsShield: {
    module: "defensive-ops",
    run:
      process.platform === "win32"
        ? "defensive-ops/PortsShield/run.ps1"
        : "defensive-ops/PortsShield/run.sh",
    update:
      process.platform === "win32"
        ? "defensive-ops/PortsShield/update.ps1"
        : "defensive-ops/PortsShield/update.sh",
    settings: "defensive-ops/PortsShield/settings.json",
    status: "defensive-ops/PortsShield/status.json",
    category: "defense",
    riskLevel: "medium",
  },
  ProcessMonitor: {
    module: "defensive-ops",
    run:
      process.platform === "win32"
        ? "defensive-ops/ProcessMonitor/run.ps1"
        : "defensive-ops/ProcessMonitor/run.sh",
    update:
      process.platform === "win32"
        ? "defensive-ops/ProcessMonitor/update.ps1"
        : "defensive-ops/ProcessMonitor/update.sh",
    settings: "defensive-ops/ProcessMonitor/settings.json",
    status: "defensive-ops/ProcessMonitor/status.json",
    category: "defense",
    riskLevel: "low",
  },
  RealTimeBlocker: {
    module: "defensive-ops",
    run:
      process.platform === "win32"
        ? "defensive-ops/RealTimeBlocker/run.ps1"
        : "defensive-ops/RealTimeBlocker/run.sh",
    update:
      process.platform === "win32"
        ? "defensive-ops/RealTimeBlocker/update.ps1"
        : "defensive-ops/RealTimeBlocker/update.sh",
    settings: "defensive-ops/RealTimeBlocker/settings.json",
    status: "defensive-ops/RealTimeBlocker/status.json",
    category: "defense",
    riskLevel: "high",
  },
  VaultPass: {
    module: "defensive-ops",
    run:
      process.platform === "win32"
        ? "defensive-ops/VaultPass/run.ps1"
        : "defensive-ops/VaultPass/run.sh",
    update:
      process.platform === "win32"
        ? "defensive-ops/VaultPass/update.ps1"
        : "defensive-ops/VaultPass/update.sh",
    settings: "defensive-ops/VaultPass/settings.json",
    status: "defensive-ops/VaultPass/status.json",
    category: "defense",
    riskLevel: "critical",
  },
  AESEncryption: {
    module: "defensive-ops",
    run:
      process.platform === "win32"
        ? "defensive-ops/AESEncryption/run.ps1"
        : "defensive-ops/AESEncryption/run.sh",
    update:
      process.platform === "win32"
        ? "defensive-ops/AESEncryption/update.ps1"
        : "defensive-ops/AESEncryption/update.sh",
    settings: "defensive-ops/AESEncryption/settings.json",
    status: "defensive-ops/AESEncryption/status.json",
    category: "defense",
    riskLevel: "medium",
  },
  SentinelAlerts: {
    module: "defensive-ops",
    run:
      process.platform === "win32"
        ? "defensive-ops/SentinelAlerts/run.ps1"
        : "defensive-ops/SentinelAlerts/run.sh",
    update:
      process.platform === "win32"
        ? "defensive-ops/SentinelAlerts/update.ps1"
        : "defensive-ops/SentinelAlerts/update.sh",
    settings: "defensive-ops/SentinelAlerts/settings.json",
    status: "defensive-ops/SentinelAlerts/status.json",
    category: "defense",
    riskLevel: "high",
  },

  // OFFENSIVE TOOLS MODULE (7 tools)
  AutoRecon: {
    module: "offensive-tools",
    run:
      process.platform === "win32"
        ? "offensive-tools/AutoRecon/run.ps1"
        : "offensive-tools/AutoRecon/run.sh",
    update:
      process.platform === "win32"
        ? "offensive-tools/AutoRecon/update.ps1"
        : "offensive-tools/AutoRecon/update.sh",
    settings: "offensive-tools/AutoRecon/settings.json",
    status: "offensive-tools/AutoRecon/status.json",
    category: "offense",
    riskLevel: "medium",
  },
  PacketInterceptor: {
    module: "offensive-tools",
    run:
      process.platform === "win32"
        ? "offensive-tools/PacketInterceptor/run.ps1"
        : "offensive-tools/PacketInterceptor/run.sh",
    update:
      process.platform === "win32"
        ? "offensive-tools/PacketInterceptor/update.ps1"
        : "offensive-tools/PacketInterceptor/update.sh",
    settings: "offensive-tools/PacketInterceptor/settings.json",
    status: "offensive-tools/PacketInterceptor/status.json",
    category: "offense",
    riskLevel: "high",
  },
  AttackScriptGenerator: {
    module: "offensive-tools",
    run:
      process.platform === "win32"
        ? "offensive-tools/AttackScriptGenerator/run.ps1"
        : "offensive-tools/AttackScriptGenerator/run.sh",
    update:
      process.platform === "win32"
        ? "offensive-tools/AttackScriptGenerator/update.ps1"
        : "offensive-tools/AttackScriptGenerator/update.sh",
    settings: "offensive-tools/AttackScriptGenerator/settings.json",
    status: "offensive-tools/AttackScriptGenerator/status.json",
    category: "offense",
    riskLevel: "critical",
  },
  WiFiPenTest: {
    module: "offensive-tools",
    run:
      process.platform === "win32"
        ? "offensive-tools/WiFiPenTest/run.ps1"
        : "offensive-tools/WiFiPenTest/run.sh",
    update:
      process.platform === "win32"
        ? "offensive-tools/WiFiPenTest/update.ps1"
        : "offensive-tools/WiFiPenTest/update.sh",
    settings: "offensive-tools/WiFiPenTest/settings.json",
    status: "offensive-tools/WiFiPenTest/status.json",
    category: "offense",
    riskLevel: "high",
  },
  OSINTDeepSearch: {
    module: "offensive-tools",
    run:
      process.platform === "win32"
        ? "offensive-tools/OSINTDeepSearch/run.ps1"
        : "offensive-tools/OSINTDeepSearch/run.sh",
    update:
      process.platform === "win32"
        ? "offensive-tools/OSINTDeepSearch/update.ps1"
        : "offensive-tools/OSINTDeepSearch/update.sh",
    settings: "offensive-tools/OSINTDeepSearch/settings.json",
    status: "offensive-tools/OSINTDeepSearch/status.json",
    category: "offense",
    riskLevel: "low",
  },
  MACARPSpoofing: {
    module: "offensive-tools",
    run:
      process.platform === "win32"
        ? "offensive-tools/MACARPSpoofing/run.ps1"
        : "offensive-tools/MACARPSpoofing/run.sh",
    update:
      process.platform === "win32"
        ? "offensive-tools/MACARPSpoofing/update.ps1"
        : "offensive-tools/MACARPSpoofing/update.sh",
    settings: "offensive-tools/MACARPSpoofing/settings.json",
    status: "offensive-tools/MACARPSpoofing/status.json",
    category: "offense",
    riskLevel: "high",
  },
  CVEExploiter: {
    module: "offensive-tools",
    run:
      process.platform === "win32"
        ? "offensive-tools/CVEExploiter/run.ps1"
        : "offensive-tools/CVEExploiter/run.sh",
    update:
      process.platform === "win32"
        ? "offensive-tools/CVEExploiter/update.ps1"
        : "offensive-tools/CVEExploiter/update.sh",
    settings: "offensive-tools/CVEExploiter/settings.json",
    status: "offensive-tools/CVEExploiter/status.json",
    category: "offense",
    riskLevel: "critical",
  },

  // SURVEILLANCE MODULE (7 tools)
  SystemWatchdog: {
    module: "surveillance",
    run:
      process.platform === "win32"
        ? "surveillance/SystemWatchdog/run.ps1"
        : "surveillance/SystemWatchdog/run.sh",
    update:
      process.platform === "win32"
        ? "surveillance/SystemWatchdog/update.ps1"
        : "surveillance/SystemWatchdog/update.sh",
    settings: "surveillance/SystemWatchdog/settings.json",
    status: "surveillance/SystemWatchdog/status.json",
    category: "surveillance",
    riskLevel: "low",
  },
  LiveNetworkMonitor: {
    module: "surveillance",
    run:
      process.platform === "win32"
        ? "surveillance/LiveNetworkMonitor/run.ps1"
        : "surveillance/LiveNetworkMonitor/run.sh",
    update:
      process.platform === "win32"
        ? "surveillance/LiveNetworkMonitor/update.ps1"
        : "surveillance/LiveNetworkMonitor/update.sh",
    settings: "surveillance/LiveNetworkMonitor/settings.json",
    status: "surveillance/LiveNetworkMonitor/status.json",
    category: "surveillance",
    riskLevel: "medium",
  },
  FileAccessTracker: {
    module: "surveillance",
    run:
      process.platform === "win32"
        ? "surveillance/FileAccessTracker/run.ps1"
        : "surveillance/FileAccessTracker/run.sh",
    update:
      process.platform === "win32"
        ? "surveillance/FileAccessTracker/update.ps1"
        : "surveillance/FileAccessTracker/update.sh",
    settings: "surveillance/FileAccessTracker/settings.json",
    status: "surveillance/FileAccessTracker/status.json",
    category: "surveillance",
    riskLevel: "medium",
  },
  ThirdPartyMonitor: {
    module: "surveillance",
    run:
      process.platform === "win32"
        ? "surveillance/ThirdPartyMonitor/run.ps1"
        : "surveillance/ThirdPartyMonitor/run.sh",
    update:
      process.platform === "win32"
        ? "surveillance/ThirdPartyMonitor/update.ps1"
        : "surveillance/ThirdPartyMonitor/update.sh",
    settings: "surveillance/ThirdPartyMonitor/settings.json",
    status: "surveillance/ThirdPartyMonitor/status.json",
    category: "surveillance",
    riskLevel: "medium",
  },
  UnauthorizedLoginDetector: {
    module: "surveillance",
    run:
      process.platform === "win32"
        ? "surveillance/UnauthorizedLoginDetector/run.ps1"
        : "surveillance/UnauthorizedLoginDetector/run.sh",
    update:
      process.platform === "win32"
        ? "surveillance/UnauthorizedLoginDetector/update.ps1"
        : "surveillance/UnauthorizedLoginDetector/update.sh",
    settings: "surveillance/UnauthorizedLoginDetector/settings.json",
    status: "surveillance/UnauthorizedLoginDetector/status.json",
    category: "surveillance",
    riskLevel: "high",
  },
  CameraMicMonitor: {
    module: "surveillance",
    run:
      process.platform === "win32"
        ? "surveillance/CameraMicMonitor/run.ps1"
        : "surveillance/CameraMicMonitor/run.sh",
    update:
      process.platform === "win32"
        ? "surveillance/CameraMicMonitor/update.ps1"
        : "surveillance/CameraMicMonitor/update.sh",
    settings: "surveillance/CameraMicMonitor/settings.json",
    status: "surveillance/CameraMicMonitor/status.json",
    category: "surveillance",
    riskLevel: "medium",
  },
  SilentUserLogger: {
    module: "surveillance",
    run:
      process.platform === "win32"
        ? "surveillance/SilentUserLogger/run.ps1"
        : "surveillance/SilentUserLogger/run.sh",
    update:
      process.platform === "win32"
        ? "surveillance/SilentUserLogger/update.ps1"
        : "surveillance/SilentUserLogger/update.sh",
    settings: "surveillance/SilentUserLogger/settings.json",
    status: "surveillance/SilentUserLogger/status.json",
    category: "surveillance",
    riskLevel: "high",
  },

  // NETWORK CONTROL MODULE (7 tools)
  NetworkMapper: {
    module: "network-control",
    run:
      process.platform === "win32"
        ? "network-control/NetworkMapper/run.ps1"
        : "network-control/NetworkMapper/run.sh",
    update:
      process.platform === "win32"
        ? "network-control/NetworkMapper/update.ps1"
        : "network-control/NetworkMapper/update.sh",
    settings: "network-control/NetworkMapper/settings.json",
    status: "network-control/NetworkMapper/status.json",
    category: "network",
    riskLevel: "low",
  },
  VPNControl: {
    module: "network-control",
    run:
      process.platform === "win32"
        ? "network-control/VPNControl/run.ps1"
        : "network-control/VPNControl/run.sh",
    update:
      process.platform === "win32"
        ? "network-control/VPNControl/update.ps1"
        : "network-control/VPNControl/update.sh",
    settings: "network-control/VPNControl/settings.json",
    status: "network-control/VPNControl/status.json",
    category: "network",
    riskLevel: "medium",
  },
  DNSLeakChecker: {
    module: "network-control",
    run:
      process.platform === "win32"
        ? "network-control/DNSLeakChecker/run.ps1"
        : "network-control/DNSLeakChecker/run.sh",
    update:
      process.platform === "win32"
        ? "network-control/DNSLeakChecker/update.ps1"
        : "network-control/DNSLeakChecker/update.sh",
    settings: "network-control/DNSLeakChecker/settings.json",
    status: "network-control/DNSLeakChecker/status.json",
    category: "network",
    riskLevel: "medium",
  },
  ProxyDetector: {
    module: "network-control",
    run:
      process.platform === "win32"
        ? "network-control/ProxyDetector/run.ps1"
        : "network-control/ProxyDetector/run.sh",
    update:
      process.platform === "win32"
        ? "network-control/ProxyDetector/update.ps1"
        : "network-control/ProxyDetector/update.sh",
    settings: "network-control/ProxyDetector/settings.json",
    status: "network-control/ProxyDetector/status.json",
    category: "network",
    riskLevel: "high",
  },
  SpeedTest: {
    module: "network-control",
    run:
      process.platform === "win32"
        ? "network-control/SpeedTest/run.ps1"
        : "network-control/SpeedTest/run.sh",
    update:
      process.platform === "win32"
        ? "network-control/SpeedTest/update.ps1"
        : "network-control/SpeedTest/update.sh",
    settings: "network-control/SpeedTest/settings.json",
    status: "network-control/SpeedTest/status.json",
    category: "network",
    riskLevel: "low",
  },
  LANDefender: {
    module: "network-control",
    run:
      process.platform === "win32"
        ? "network-control/LANDefender/run.ps1"
        : "network-control/LANDefender/run.sh",
    update:
      process.platform === "win32"
        ? "network-control/LANDefender/update.ps1"
        : "network-control/LANDefender/update.sh",
    settings: "network-control/LANDefender/settings.json",
    status: "network-control/LANDefender/status.json",
    category: "network",
    riskLevel: "medium",
  },
  WebRTCBlocker: {
    module: "network-control",
    run:
      process.platform === "win32"
        ? "network-control/WebRTCBlocker/run.ps1"
        : "network-control/WebRTCBlocker/run.sh",
    update:
      process.platform === "win32"
        ? "network-control/WebRTCBlocker/update.ps1"
        : "network-control/WebRTCBlocker/update.sh",
    settings: "network-control/WebRTCBlocker/settings.json",
    status: "network-control/WebRTCBlocker/status.json",
    category: "network",
    riskLevel: "medium",
  },

  // AI ASSISTANT MODULE (7 tools)
  KnouxScriptGen: {
    module: "ai-assistant",
    run:
      process.platform === "win32"
        ? "ai-assistant/KnouxScriptGen/run.ps1"
        : "ai-assistant/KnouxScriptGen/run.sh",
    update:
      process.platform === "win32"
        ? "ai-assistant/KnouxScriptGen/update.ps1"
        : "ai-assistant/KnouxScriptGen/update.sh",
    settings: "ai-assistant/KnouxScriptGen/settings.json",
    status: "ai-assistant/KnouxScriptGen/status.json",
    category: "ai",
    riskLevel: "medium",
  },
  ToolRecommender: {
    module: "ai-assistant",
    run:
      process.platform === "win32"
        ? "ai-assistant/ToolRecommender/run.ps1"
        : "ai-assistant/ToolRecommender/run.sh",
    update:
      process.platform === "win32"
        ? "ai-assistant/ToolRecommender/update.ps1"
        : "ai-assistant/ToolRecommender/update.sh",
    settings: "ai-assistant/ToolRecommender/settings.json",
    status: "ai-assistant/ToolRecommender/status.json",
    category: "ai",
    riskLevel: "low",
  },
  FileVulnerabilityAnalyzer: {
    module: "ai-assistant",
    run:
      process.platform === "win32"
        ? "ai-assistant/FileVulnerabilityAnalyzer/run.ps1"
        : "ai-assistant/FileVulnerabilityAnalyzer/run.sh",
    update:
      process.platform === "win32"
        ? "ai-assistant/FileVulnerabilityAnalyzer/update.ps1"
        : "ai-assistant/FileVulnerabilityAnalyzer/update.sh",
    settings: "ai-assistant/FileVulnerabilityAnalyzer/settings.json",
    status: "ai-assistant/FileVulnerabilityAnalyzer/status.json",
    category: "ai",
    riskLevel: "medium",
  },
  ChatKnoxAI: {
    module: "ai-assistant",
    run:
      process.platform === "win32"
        ? "ai-assistant/ChatKnoxAI/run.ps1"
        : "ai-assistant/ChatKnoxAI/run.sh",
    update:
      process.platform === "win32"
        ? "ai-assistant/ChatKnoxAI/update.ps1"
        : "ai-assistant/ChatKnoxAI/update.sh",
    settings: "ai-assistant/ChatKnoxAI/settings.json",
    status: "ai-assistant/ChatKnoxAI/status.json",
    category: "ai",
    riskLevel: "low",
  },
  SystemOptimizer: {
    module: "ai-assistant",
    run:
      process.platform === "win32"
        ? "ai-assistant/SystemOptimizer/run.ps1"
        : "ai-assistant/SystemOptimizer/run.sh",
    update:
      process.platform === "win32"
        ? "ai-assistant/SystemOptimizer/update.ps1"
        : "ai-assistant/SystemOptimizer/update.sh",
    settings: "ai-assistant/SystemOptimizer/settings.json",
    status: "ai-assistant/SystemOptimizer/status.json",
    category: "ai",
    riskLevel: "low",
  },
  YOLOWhisperIntegration: {
    module: "ai-assistant",
    run:
      process.platform === "win32"
        ? "ai-assistant/YOLOWhisperIntegration/run.ps1"
        : "ai-assistant/YOLOWhisperIntegration/run.sh",
    update:
      process.platform === "win32"
        ? "ai-assistant/YOLOWhisperIntegration/update.ps1"
        : "ai-assistant/YOLOWhisperIntegration/update.sh",
    settings: "ai-assistant/YOLOWhisperIntegration/settings.json",
    status: "ai-assistant/YOLOWhisperIntegration/status.json",
    category: "ai",
    riskLevel: "medium",
  },
  VoiceCommands: {
    module: "ai-assistant",
    run:
      process.platform === "win32"
        ? "ai-assistant/VoiceCommands/run.ps1"
        : "ai-assistant/VoiceCommands/run.sh",
    update:
      process.platform === "win32"
        ? "ai-assistant/VoiceCommands/update.ps1"
        : "ai-assistant/VoiceCommands/update.sh",
    settings: "ai-assistant/VoiceCommands/settings.json",
    status: "ai-assistant/VoiceCommands/status.json",
    category: "ai",
    riskLevel: "low",
  },

  // REPORTING MODULE (7 tools)
  EncryptedPDFGenerator: {
    module: "reporting",
    run:
      process.platform === "win32"
        ? "reporting/EncryptedPDFGenerator/run.ps1"
        : "reporting/EncryptedPDFGenerator/run.sh",
    update:
      process.platform === "win32"
        ? "reporting/EncryptedPDFGenerator/update.ps1"
        : "reporting/EncryptedPDFGenerator/update.sh",
    settings: "reporting/EncryptedPDFGenerator/settings.json",
    status: "reporting/EncryptedPDFGenerator/status.json",
    category: "reporting",
    riskLevel: "low",
  },
  DetailedOperationReport: {
    module: "reporting",
    run:
      process.platform === "win32"
        ? "reporting/DetailedOperationReport/run.ps1"
        : "reporting/DetailedOperationReport/run.sh",
    update:
      process.platform === "win32"
        ? "reporting/DetailedOperationReport/update.ps1"
        : "reporting/DetailedOperationReport/update.sh",
    settings: "reporting/DetailedOperationReport/settings.json",
    status: "reporting/DetailedOperationReport/status.json",
    category: "reporting",
    riskLevel: "low",
  },
  KnouxDigitalSignature: {
    module: "reporting",
    run:
      process.platform === "win32"
        ? "reporting/KnouxDigitalSignature/run.ps1"
        : "reporting/KnouxDigitalSignature/run.sh",
    update:
      process.platform === "win32"
        ? "reporting/KnouxDigitalSignature/update.ps1"
        : "reporting/KnouxDigitalSignature/update.sh",
    settings: "reporting/KnouxDigitalSignature/settings.json",
    status: "reporting/KnouxDigitalSignature/status.json",
    category: "reporting",
    riskLevel: "low",
  },
  PerformanceAnalytics: {
    module: "reporting",
    run:
      process.platform === "win32"
        ? "reporting/PerformanceAnalytics/run.ps1"
        : "reporting/PerformanceAnalytics/run.sh",
    update:
      process.platform === "win32"
        ? "reporting/PerformanceAnalytics/update.ps1"
        : "reporting/PerformanceAnalytics/update.sh",
    settings: "reporting/PerformanceAnalytics/settings.json",
    status: "reporting/PerformanceAnalytics/status.json",
    category: "reporting",
    riskLevel: "low",
  },
  MasterPasswordProtection: {
    module: "reporting",
    run:
      process.platform === "win32"
        ? "reporting/MasterPasswordProtection/run.ps1"
        : "reporting/MasterPasswordProtection/run.sh",
    update:
      process.platform === "win32"
        ? "reporting/MasterPasswordProtection/update.ps1"
        : "reporting/MasterPasswordProtection/update.sh",
    settings: "reporting/MasterPasswordProtection/settings.json",
    status: "reporting/MasterPasswordProtection/status.json",
    category: "reporting",
    riskLevel: "high",
  },
  CloudSync: {
    module: "reporting",
    run:
      process.platform === "win32"
        ? "reporting/CloudSync/run.ps1"
        : "reporting/CloudSync/run.sh",
    update:
      process.platform === "win32"
        ? "reporting/CloudSync/update.ps1"
        : "reporting/CloudSync/update.sh",
    settings: "reporting/CloudSync/settings.json",
    status: "reporting/CloudSync/status.json",
    category: "reporting",
    riskLevel: "medium",
  },
  ArchiveManager: {
    module: "reporting",
    run:
      process.platform === "win32"
        ? "reporting/ArchiveManager/run.ps1"
        : "reporting/ArchiveManager/run.sh",
    update:
      process.platform === "win32"
        ? "reporting/ArchiveManager/update.ps1"
        : "reporting/ArchiveManager/update.sh",
    settings: "reporting/ArchiveManager/settings.json",
    status: "reporting/ArchiveManager/status.json",
    category: "reporting",
    riskLevel: "low",
  },

  // COSMIC SETTINGS MODULE (7 tools)
  UICustomizer: {
    module: "cosmic-settings",
    run:
      process.platform === "win32"
        ? "cosmic-settings/UICustomizer/run.ps1"
        : "cosmic-settings/UICustomizer/run.sh",
    update:
      process.platform === "win32"
        ? "cosmic-settings/UICustomizer/update.ps1"
        : "cosmic-settings/UICustomizer/update.sh",
    settings: "cosmic-settings/UICustomizer/settings.json",
    status: "cosmic-settings/UICustomizer/status.json",
    category: "settings",
    riskLevel: "low",
  },
  ThemeSwitcher: {
    module: "cosmic-settings",
    run:
      process.platform === "win32"
        ? "cosmic-settings/ThemeSwitcher/run.ps1"
        : "cosmic-settings/ThemeSwitcher/run.sh",
    update:
      process.platform === "win32"
        ? "cosmic-settings/ThemeSwitcher/update.ps1"
        : "cosmic-settings/ThemeSwitcher/update.sh",
    settings: "cosmic-settings/ThemeSwitcher/settings.json",
    status: "cosmic-settings/ThemeSwitcher/status.json",
    category: "settings",
    riskLevel: "low",
  },
  AlertManager: {
    module: "cosmic-settings",
    run:
      process.platform === "win32"
        ? "cosmic-settings/AlertManager/run.ps1"
        : "cosmic-settings/AlertManager/run.sh",
    update:
      process.platform === "win32"
        ? "cosmic-settings/AlertManager/update.ps1"
        : "cosmic-settings/AlertManager/update.sh",
    settings: "cosmic-settings/AlertManager/settings.json",
    status: "cosmic-settings/AlertManager/status.json",
    category: "settings",
    riskLevel: "low",
  },
  ConditionalToolActivator: {
    module: "cosmic-settings",
    run:
      process.platform === "win32"
        ? "cosmic-settings/ConditionalToolActivator/run.ps1"
        : "cosmic-settings/ConditionalToolActivator/run.sh",
    update:
      process.platform === "win32"
        ? "cosmic-settings/ConditionalToolActivator/update.ps1"
        : "cosmic-settings/ConditionalToolActivator/update.sh",
    settings: "cosmic-settings/ConditionalToolActivator/settings.json",
    status: "cosmic-settings/ConditionalToolActivator/status.json",
    category: "settings",
    riskLevel: "medium",
  },
  AdvancedFirewallSettings: {
    module: "cosmic-settings",
    run:
      process.platform === "win32"
        ? "cosmic-settings/AdvancedFirewallSettings/run.ps1"
        : "cosmic-settings/AdvancedFirewallSettings/run.sh",
    update:
      process.platform === "win32"
        ? "cosmic-settings/AdvancedFirewallSettings/update.ps1"
        : "cosmic-settings/AdvancedFirewallSettings/update.sh",
    settings: "cosmic-settings/AdvancedFirewallSettings/settings.json",
    status: "cosmic-settings/AdvancedFirewallSettings/status.json",
    category: "settings",
    riskLevel: "high",
  },
  AccessControlManager: {
    module: "cosmic-settings",
    run:
      process.platform === "win32"
        ? "cosmic-settings/AccessControlManager/run.ps1"
        : "cosmic-settings/AccessControlManager/run.sh",
    update:
      process.platform === "win32"
        ? "cosmic-settings/AccessControlManager/update.ps1"
        : "cosmic-settings/AccessControlManager/update.sh",
    settings: "cosmic-settings/AccessControlManager/settings.json",
    status: "cosmic-settings/AccessControlManager/status.json",
    category: "settings",
    riskLevel: "high",
  },
  AIModelSelector: {
    module: "cosmic-settings",
    run:
      process.platform === "win32"
        ? "cosmic-settings/AIModelSelector/run.ps1"
        : "cosmic-settings/AIModelSelector/run.sh",
    update:
      process.platform === "win32"
        ? "cosmic-settings/AIModelSelector/update.ps1"
        : "cosmic-settings/AIModelSelector/update.sh",
    settings: "cosmic-settings/AIModelSelector/settings.json",
    status: "cosmic-settings/AIModelSelector/status.json",
    category: "settings",
    riskLevel: "medium",
  },
};

// Track running processes
const runningProcesses = new Map();

// Utility function to execute scripts
function executeScript(scriptPath, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const command = isWindows ? "powershell.exe" : "bash";
    const scriptArgs = isWindows
      ? ["-ExecutionPolicy", "Bypass", "-File", scriptPath, ...args]
      : [scriptPath, ...args];

    const execution = exec(
      `${command} ${scriptArgs.join(" ")}`,
      {
        cwd: __dirname,
        timeout: options.timeout || 300000, // 5 minutes default timeout
        ...options,
      },
      (error, stdout, stderr) => {
        if (error) {
          reject({ error: error.message, stderr, stdout });
        } else {
          resolve({ stdout, stderr });
        }
      },
    );

    // Store process for potential killing
    if (options.processId) {
      runningProcesses.set(options.processId, execution);
    }
  });
}

// Utility function to read JSON file
function readJSONFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, "utf8"));
    }
    return null;
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

// Utility function to write JSON file
function writeJSONFile(filePath, data) {
  try {
    const fullPath = path.join(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    return false;
  }
}

// Broadcast to WebSocket clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// KOTS™ API Endpoints

// List all tools
app.get("/api/tools", (req, res) => {
  const toolsList = Object.keys(toolsRegistry).map((toolName) => ({
    name: toolName,
    module: toolsRegistry[toolName].module,
    category: toolsRegistry[toolName].category,
    riskLevel: toolsRegistry[toolName].riskLevel,
    status: readJSONFile(toolsRegistry[toolName].status) || {
      status: "UNKNOWN",
    },
  }));

  res.json({
    success: true,
    totalTools: toolsList.length,
    tools: toolsList,
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// List tools by module
app.get("/api/tools/:module", (req, res) => {
  const module = req.params.module;
  const moduleTools = Object.keys(toolsRegistry)
    .filter((toolName) => toolsRegistry[toolName].module === module)
    .map((toolName) => ({
      name: toolName,
      category: toolsRegistry[toolName].category,
      riskLevel: toolsRegistry[toolName].riskLevel,
      status: readJSONFile(toolsRegistry[toolName].status) || {
        status: "UNKNOWN",
      },
    }));

  if (moduleTools.length === 0) {
    return res.status(404).json({
      success: false,
      error: `Module '${module}' not found`,
      signature: "KNOUX7-KOTS™",
    });
  }

  res.json({
    success: true,
    module,
    toolCount: moduleTools.length,
    tools: moduleTools,
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// Execute tool - POST /:tool/run
app.post("/api/:tool/run", async (req, res) => {
  const toolName = req.params.tool;
  const tool = toolsRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: `Tool '${toolName}' not found`,
      signature: "KNOUX7-KOTS™",
    });
  }

  const executionId = uuidv4();
  const { args = [], async = false, timeout } = req.body;

  // Update status to running
  const statusData = readJSONFile(tool.status) || {};
  statusData.status = "RUNNING";
  statusData.lastExecuted = new Date().toISOString();
  statusData.executionId = executionId;
  writeJSONFile(tool.status, statusData);

  // Broadcast status update
  broadcast({
    type: "tool_status_update",
    tool: toolName,
    status: "RUNNING",
    executionId,
    timestamp: new Date().toISOString(),
  });

  if (async) {
    // Asynchronous execution
    res.json({
      success: true,
      message: `Tool '${toolName}' execution started`,
      executionId,
      async: true,
      signature: "KNOUX7-KOTS™",
      timestamp: new Date().toISOString(),
    });

    // Execute in background
    executeScript(tool.run, args, { processId: executionId, timeout })
      .then((result) => {
        statusData.status = "COMPLETED";
        statusData.lastOutput = result.stdout;
        statusData.completedAt = new Date().toISOString();
        writeJSONFile(tool.status, statusData);

        broadcast({
          type: "tool_execution_complete",
          tool: toolName,
          executionId,
          result,
          timestamp: new Date().toISOString(),
        });
      })
      .catch((error) => {
        statusData.status = "FAILED";
        statusData.lastError = error.error;
        statusData.failedAt = new Date().toISOString();
        writeJSONFile(tool.status, statusData);

        broadcast({
          type: "tool_execution_failed",
          tool: toolName,
          executionId,
          error,
          timestamp: new Date().toISOString(),
        });
      })
      .finally(() => {
        runningProcesses.delete(executionId);
      });
  } else {
    // Synchronous execution
    try {
      const result = await executeScript(tool.run, args, { timeout });

      statusData.status = "COMPLETED";
      statusData.lastOutput = result.stdout;
      statusData.completedAt = new Date().toISOString();
      writeJSONFile(tool.status, statusData);

      broadcast({
        type: "tool_execution_complete",
        tool: toolName,
        executionId,
        result,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: `Tool '${toolName}' execution completed`,
        executionId,
        result,
        signature: "KNOUX7-KOTS™",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      statusData.status = "FAILED";
      statusData.lastError = error.error;
      statusData.failedAt = new Date().toISOString();
      writeJSONFile(tool.status, statusData);

      broadcast({
        type: "tool_execution_failed",
        tool: toolName,
        executionId,
        error,
        timestamp: new Date().toISOString(),
      });

      res.status(500).json({
        success: false,
        error: `Tool '${toolName}' execution failed: ${error.error}`,
        executionId,
        details: error,
        signature: "KNOUX7-KOTS™",
        timestamp: new Date().toISOString(),
      });
    }
  }
});

// Update tool - POST /:tool/update
app.post("/api/:tool/update", async (req, res) => {
  const toolName = req.params.tool;
  const tool = toolsRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: `Tool '${toolName}' not found`,
      signature: "KNOUX7-KOTS™",
    });
  }

  try {
    const result = await executeScript(tool.update);

    const statusData = readJSONFile(tool.status) || {};
    statusData.lastUpdated = new Date().toISOString();
    statusData.updateOutput = result.stdout;
    writeJSONFile(tool.status, statusData);

    broadcast({
      type: "tool_updated",
      tool: toolName,
      result,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Tool '${toolName}' updated successfully`,
      result,
      signature: "KNOUX7-KOTS™",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Tool '${toolName}' update failed: ${error.error}`,
      details: error,
      signature: "KNOUX7-KOTS™",
      timestamp: new Date().toISOString(),
    });
  }
});

// Get tool settings - GET /:tool/settings
app.get("/api/:tool/settings", (req, res) => {
  const toolName = req.params.tool;
  const tool = toolsRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: `Tool '${toolName}' not found`,
      signature: "KNOUX7-KOTS™",
    });
  }

  const settings = readJSONFile(tool.settings);
  if (!settings) {
    return res.status(404).json({
      success: false,
      error: `Settings for tool '${toolName}' not found`,
      signature: "KNOUX7-KOTS™",
    });
  }

  res.json({
    success: true,
    tool: toolName,
    settings,
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// Update tool settings - PUT /:tool/settings
app.put("/api/:tool/settings", (req, res) => {
  const toolName = req.params.tool;
  const tool = toolsRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: `Tool '${toolName}' not found`,
      signature: "KNOUX7-KOTS™",
    });
  }

  const newSettings = req.body;
  const success = writeJSONFile(tool.settings, newSettings);

  if (!success) {
    return res.status(500).json({
      success: false,
      error: `Failed to update settings for tool '${toolName}'`,
      signature: "KNOUX7-KOTS™",
    });
  }

  broadcast({
    type: "tool_settings_updated",
    tool: toolName,
    settings: newSettings,
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: `Settings for tool '${toolName}' updated successfully`,
    settings: newSettings,
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// Get tool status - GET /:tool/status
app.get("/api/:tool/status", (req, res) => {
  const toolName = req.params.tool;
  const tool = toolsRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: `Tool '${toolName}' not found`,
      signature: "KNOUX7-KOTS™",
    });
  }

  const status = readJSONFile(tool.status) || { status: "UNKNOWN" };

  res.json({
    success: true,
    tool: toolName,
    module: tool.module,
    category: tool.category,
    riskLevel: tool.riskLevel,
    status,
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// Kill running process - DELETE /:tool/kill
app.delete("/api/:tool/kill", (req, res) => {
  const { executionId } = req.body;

  if (!executionId || !runningProcesses.has(executionId)) {
    return res.status(404).json({
      success: false,
      error: "Execution process not found",
      signature: "KNOUX7-KOTS™",
    });
  }

  const process = runningProcesses.get(executionId);
  process.kill("SIGTERM");
  runningProcesses.delete(executionId);

  broadcast({
    type: "tool_execution_killed",
    executionId,
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: "Process killed successfully",
    executionId,
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    platform: process.platform,
    uptime: process.uptime(),
    totalTools: Object.keys(toolsRegistry).length,
    runningProcesses: runningProcesses.size,
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// System information
app.get("/api/system", (req, res) => {
  res.json({
    success: true,
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid,
    },
    kots: {
      version: "1.0.0",
      totalTools: Object.keys(toolsRegistry).length,
      modules: [
        ...new Set(Object.values(toolsRegistry).map((tool) => tool.module)),
      ],
      runningProcesses: runningProcesses.size,
    },
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("🔌 New WebSocket client connected");

  ws.send(
    JSON.stringify({
      type: "connection_established",
      message: "Connected to KNOUX7 KOTS™ Real-time Stream",
      totalTools: Object.keys(toolsRegistry).length,
      timestamp: new Date().toISOString(),
    }),
  );

  ws.on("close", () => {
    console.log("🔌 WebSocket client disconnected");
  });

  ws.on("error", (error) => {
    console.error("🔌 WebSocket error:", error);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("🚨 Server Error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    availableEndpoints: [
      "GET /api/tools",
      "GET /api/tools/:module",
      "POST /api/:tool/run",
      "POST /api/:tool/update",
      "GET /api/:tool/settings",
      "PUT /api/:tool/settings",
      "GET /api/:tool/status",
      "DELETE /api/:tool/kill",
      "GET /api/health",
      "GET /api/system",
    ],
    signature: "KNOUX7-KOTS™",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(port, () => {
  console.log(`
🚀 KNOUX7 KOTS™ Microservices Server
🔥 Running on: http://localhost:${port}
🔗 WebSocket: ws://localhost:7071
🛡️  Platform: ${process.platform}
⚡ Total Tools: ${Object.keys(toolsRegistry).length}
📊 Modules: ${[...new Set(Object.values(toolsRegistry).map((tool) => tool.module))].length}
💎 Signature: KNOUX7-KOTS™ v1.0.0
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");

  // Kill all running processes
  runningProcesses.forEach((process, id) => {
    console.log(`🔪 Killing process: ${id}`);
    process.kill("SIGTERM");
  });

  // Close WebSocket server
  wss.close(() => {
    console.log("🔌 WebSocket server closed");
  });

  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  process.emit("SIGTERM");
});
