import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Network,
  Shield,
  Globe,
  Wifi,
  Zap,
  Lock,
  Gauge,
  Map,
  AlertTriangle,
  Activity,
  Server,
  Terminal,
  Search,
  Router,
  Smartphone,
  Monitor,
  Radio,
  Eye,
  Download,
  Settings,
  Database,
  Bell,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  Play,
  Power,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

export default function NetworkControl() {
  const { language, t } = useLanguage();
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [vpnStatus, setVpnStatus] = useState("disconnected");
  const [vpnProfiles, setVpnProfiles] = useState<any[]>([]);
  const [connectionSpeed, setConnectionSpeed] = useState({
    download: 0,
    upload: 0,
    ping: 0,
  });
  const [networkDevices, setNetworkDevices] = useState<any[]>([]);
  const [selectedVpnServer, setSelectedVpnServer] = useState("auto");
  const [toolExecutionLogs, setToolExecutionLogs] = useState<any[]>([]);
  const [networkStats, setNetworkStats] = useState({
    totalPackets: 0,
    activePorts: 0,
    bandwidthUsage: 0,
    connectedDevices: 0,
  });

  const toggleTool = (toolId: string) => {
    setActiveTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const toggleVpn = () => {
    if (vpnStatus === "disconnected") {
      setVpnStatus("connecting");
      setTimeout(() => setVpnStatus("connected"), 2000);
    } else {
      setVpnStatus("disconnecting");
      setTimeout(() => setVpnStatus("disconnected"), 1500);
    }
  };

  const runSpeedTest = () => {
    setConnectionSpeed({ download: 0, upload: 0, ping: 999 });

    // Simulate speed test
    const interval = setInterval(() => {
      setConnectionSpeed((prev) => ({
        download: Math.min(100, prev.download + Math.random() * 10),
        upload: Math.min(50, prev.upload + Math.random() * 5),
        ping: Math.max(10, prev.ping - Math.random() * 50),
      }));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setConnectionSpeed({
        download: 95.4,
        upload: 45.2,
        ping: 12,
      });
    }, 5000);
  };

  // Initialize VPN profiles and network discovery
  useEffect(() => {
    const profiles = [
      {
        id: "corp-vpn",
        name: "Corporate VPN",
        serverAddress: "vpn.company.com",
        tunnelType: "IKEv2",
        status: "ready",
        encryption: "AES-256",
      },
      {
        id: "wireguard-home",
        name: "WireGuard Home",
        serverAddress: "192.168.100.1",
        tunnelType: "WireGuard",
        status: "ready",
        encryption: "ChaCha20",
      },
      {
        id: "openvpn-secure",
        name: "OpenVPN Secure",
        serverAddress: "secure.vpnprovider.com",
        tunnelType: "OpenVPN",
        status: "ready",
        encryption: "AES-256-CBC",
      },
    ];
    setVpnProfiles(profiles);

    const devices = [
      {
        ip: "192.168.1.1",
        name: "Router-Gateway",
        type: "gateway",
        status: "online",
        mac: "00:1B:44:11:3A:B7",
        openPorts: [80, 443, 22],
        os: "Linux",
      },
      {
        ip: "192.168.1.2",
        name: "Desktop-PC",
        type: "computer",
        status: "online",
        mac: "8C:16:45:2B:9F:43",
        openPorts: [445, 135, 3389],
        os: "Windows 11",
      },
      {
        ip: "192.168.1.15",
        name: "iPhone-12",
        type: "mobile",
        status: "online",
        mac: "F0:18:98:04:E2:1A",
        openPorts: [],
        os: "iOS 17",
      },
      {
        ip: "192.168.1.23",
        name: "Smart-TV",
        type: "iot",
        status: "online",
        mac: "AC:87:A3:1F:8B:2C",
        openPorts: [80, 8080],
        os: "Android TV",
      },
      {
        ip: "192.168.1.45",
        name: "Unknown-Device",
        type: "unknown",
        status: "suspicious",
        mac: "??:??:??:??:??:??",
        openPorts: [22, 8080, 9999],
        os: "Unknown",
      },
    ];
    setNetworkDevices(devices);

    // Initialize network stats
    setNetworkStats({
      totalPackets: 2500345,
      activePorts: 47,
      bandwidthUsage: 75.4,
      connectedDevices: devices.length,
    });
  }, []);

  const executeNetworkTool = async (toolId: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setToolExecutionLogs((prev) => [
      {
        id: Date.now(),
        tool: toolId,
        timestamp,
        status: "executing",
        output: `[${timestamp}] Executing ${toolId}...`,
      },
      ...prev.slice(0, 9),
    ]);

    // Simulate tool execution delay
    setTimeout(() => {
      const simulatedOutput = generateToolOutput(toolId);
      setToolExecutionLogs((prev) =>
        prev.map((log) =>
          log.id === Date.now() - 2000
            ? { ...log, status: "completed", output: simulatedOutput }
            : log,
        ),
      );
    }, 2000);
  };

  const generateToolOutput = (toolId: string) => {
    const outputs = {
      "dns-recon":
        "[SUCCESS] DNS records found: A: 93.184.216.34, MX: mail.example.com (Priority: 10)",
      "port-scanner":
        "[SUCCESS] Open ports detected: 22 (SSH), 80 (HTTP), 443 (HTTPS)",
      "network-mapper":
        "[SUCCESS] Network topology mapped: 5 devices discovered, 2 gateways identified",
      "wifi-scanner":
        "[SUCCESS] Wi-Fi networks found: 8 networks, 3 secured (WPA3), 2 open",
      "ping-scanner":
        "[SUCCESS] Live hosts: 192.168.1.1-5, Average latency: 12ms",
      "vpn-manager": `[SUCCESS] VPN profile loaded: ${selectedVpnServer}, Encryption: AES-256`,
      "bandwidth-test":
        "[SUCCESS] Speed test completed: ↓ 95.4 Mbps, ↑ 45.2 Mbps, Ping: 12ms",
      "firewall-tester":
        "[SUCCESS] Firewall rules verified: 24 active rules, 3 blocked connections",
      "proxy-checker":
        "[WARNING] Proxy detected on port 8080, investigating...",
      "latency-monitor":
        "[INFO] Network latency stable: Avg 15ms, Max 28ms, Min 8ms",
    };
    return (
      outputs[toolId] || "[SUCCESS] Tool execution completed successfully."
    );
  };

  const networkTools = [
    {
      id: "dns-recon",
      name: "DNS Reconnaissance",
      nameAr: "استطلاع DNS",
      icon: Search,
      description: "Query DNS records for domains (A, MX, NS, TXT)",
      status: "READY",
      emoji: "📡",
      category: "discovery",
      scriptFile: "dns-recon.ps1",
    },
    {
      id: "port-scanner",
      name: "Advanced Port Scanner",
      nameAr: "مسح المنافذ المتقدم",
      icon: Zap,
      description: "TCP/UDP port scanning with service detection",
      status: "READY",
      emoji: "🌐",
      category: "discovery",
      scriptFile: "port-scanner.ps1",
    },
    {
      id: "network-mapper",
      name: "Network Topology Mapper",
      nameAr: "رسم خريطة الشبكة",
      icon: Map,
      description: "Detailed network topology mapping and visualization",
      status: "READY",
      emoji: "🗺️",
      category: "discovery",
      scriptFile: "map-network-topology.ps1",
    },
    {
      id: "ping-scanner",
      name: "Ping Scanner",
      nameAr: "مسح Ping للشبكة",
      icon: Activity,
      description: "ICMP ping sweep for live host discovery",
      status: "READY",
      emoji: "📡",
      category: "discovery",
      scriptFile: "ping-scanner.ps1",
    },
    {
      id: "wifi-scanner",
      name: "Wireless Scanner",
      nameAr: "مسح الشبكات اللاسلكية",
      icon: Wifi,
      description: "Wi-Fi network discovery with security analysis",
      status: "SCANNING",
      emoji: "📶",
      category: "wireless",
      scriptFile: "scan-wifi.ps1",
    },
    {
      id: "vpn-manager",
      name: "VPN Profile Manager",
      nameAr: "إدارة ملفات VPN",
      icon: Shield,
      description: "VPN connection management and profile control",
      status: vpnStatus === "connected" ? "ACTIVE" : "READY",
      emoji: "🔄",
      category: "vpn",
      scriptFile: "manage-vpn.ps1",
    },
    {
      id: "firewall-tester",
      name: "Firewall Rule Tester",
      nameAr: "اختبار قواعد الجدار الناري",
      icon: Lock,
      description: "Test firewall rules and connectivity",
      status: "PROTECTING",
      emoji: "🛡️",
      category: "security",
      scriptFile: "test-firewall-rule.ps1",
    },
    {
      id: "proxy-checker",
      name: "Proxy Detector",
      nameAr: "كاشف البروكسي",
      icon: AlertTriangle,
      description: "Detect suspicious proxies and connections",
      status: "MONITORING",
      emoji: "🌐",
      category: "security",
      scriptFile: "test-proxy.ps1",
    },
    {
      id: "bandwidth-test",
      name: "Bandwidth Tester",
      nameAr: "اختبار عرض النطاق",
      icon: Gauge,
      description: "Internet speed and bandwidth analysis",
      status: "READY",
      emoji: "⚡",
      category: "diagnostic",
      scriptFile: "test-internet-speed.ps1",
    },
    {
      id: "latency-monitor",
      name: "Latency Monitor",
      nameAr: "مراقب زمن الاستجابة",
      icon: Clock,
      description: "Real-time network latency monitoring",
      status: "MONITORING",
      emoji: "🔗",
      category: "diagnostic",
      scriptFile: "monitor-latency.ps1",
    },
    {
      id: "ssh-client",
      name: "SSH Client",
      nameAr: "عميل SSH",
      icon: Terminal,
      description: "Secure shell connection management",
      status: "READY",
      emoji: "💻",
      category: "remote",
      scriptFile: "connect-ssh.ps1",
    },
    {
      id: "rdp-client",
      name: "Remote Desktop",
      nameAr: "سطح المكتب البعيد",
      icon: Monitor,
      description: "Windows Remote Desktop connection",
      status: "READY",
      emoji: "🖥️",
      category: "remote",
      scriptFile: "launch-rdp.ps1",
    },
  ];

  const vpnServers = [
    {
      id: "auto",
      name: "Auto Select",
      location: "Best Performance",
      flag: "🌍",
    },
    { id: "us", name: "United States", location: "New York", flag: "🇺🇸" },
    { id: "uk", name: "United Kingdom", location: "London", flag: "🇬🇧" },
    { id: "de", name: "Germany", location: "Frankfurt", flag: "🇩🇪" },
    { id: "jp", name: "Japan", location: "Tokyo", flag: "🇯🇵" },
    { id: "sg", name: "Singapore", location: "Singapore", flag: "🇸🇬" },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      {/* Header */}
      <header className="p-6">
        <div className="glass-cyber rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg glass-cyber flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-cyber-neon" />
            </Link>
            <div className="w-12 h-12 rounded-xl glass-cyber flex items-center justify-center bg-blue-400/10 border border-blue-400">
              <Network className="w-6 h-6 text-blue-400 animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-blue-400 neon-glow">
                Net & VPN Control
              </h1>
              <p className="text-cyber-purple-light">
                قسم إدارة الاتصال والشبكات - Module 4 of 7
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Module Overview */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-400">
                Network Operations Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${vpnStatus === "connected" ? "bg-green-400" : "bg-blue-400"}`}
                  ></div>
                  <span className="text-sm font-mono text-cyber-purple-light">
                    VPN: {vpnStatus.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={toggleVpn}
                  className={`btn-cyber px-4 py-2 text-sm ${
                    vpnStatus === "connected" ? "mode-defense" : ""
                  }`}
                  style={{
                    color: vpnStatus === "connected" ? "#10b981" : "#3b82f6",
                    borderColor:
                      vpnStatus === "connected" ? "#10b981" : "#3b82f6",
                  }}
                >
                  {vpnStatus === "connected" ? "Disconnect VPN" : "Connect VPN"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Network className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">
                  {vpnStatus === "connected" ? "SECURED" : "EXPOSED"}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Connection Status
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Activity className="w-8 h-8 text-cyber-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyber-neon">
                  {activeTools.length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Tools Active
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Server className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {networkDevices.filter((d) => d.status === "online").length}
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Devices Online
                </div>
              </div>
              <div className="glass-cyber rounded-lg p-4 text-center">
                <Gauge className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">
                  {connectionSpeed.ping > 0
                    ? connectionSpeed.ping.toFixed(0)
                    : "--"}
                  ms
                </div>
                <div className="text-xs text-cyber-purple-light">
                  Network Latency
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Tools Grid */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-blue-400 mb-4">
                Network Control Arsenal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {networkTools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = activeTools.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      className="glass-card rounded-xl p-4 group cursor-pointer hover:scale-105 transition-all duration-300"
                      onClick={() => {
                        toggleTool(tool.id);
                        executeNetworkTool(tool.id);
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg glass-cyber flex items-center justify-center group-hover:scale-110 transition-transform ${
                            isActive
                              ? "bg-blue-400/20 border-blue-400"
                              : "border-cyber-glass-border"
                          } border`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              isActive ? "text-blue-400" : "text-cyber-neon"
                            }`}
                          />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-lg">{tool.emoji}</div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              tool.status === "ACTIVE" ||
                              tool.status === "MONITORING" ||
                              tool.status === "SCANNING" ||
                              tool.status === "PROTECTING" ||
                              tool.status === "BLOCKING"
                                ? "bg-green-400 animate-pulse"
                                : "bg-blue-400"
                            }`}
                          ></div>
                        </div>
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          isActive ? "text-blue-400" : "text-cyber-neon"
                        } mb-1`}
                      >
                        {language === "ar" ? tool.nameAr : tool.name}
                      </h4>
                      <h5 className="text-xs text-cyber-purple-light mb-2 font-mono">
                        {tool.scriptFile}
                      </h5>
                      <p className="text-cyber-purple-light text-xs mb-3">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono ${
                              isActive
                                ? "text-blue-400"
                                : "text-cyber-purple-light"
                            }`}
                          >
                            {tool.status}
                          </span>
                          <span className="text-xs px-1 py-0.5 rounded bg-cyber-glass text-cyber-purple-light">
                            {tool.category}
                          </span>
                        </div>
                        <button
                          className={`text-xs px-2 py-1 rounded-full border transition-all ${
                            isActive
                              ? "bg-blue-400/10 text-blue-400 border-blue-400"
                              : "bg-cyber-neon/10 text-cyber-neon border-cyber-neon hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "ACTIVATE"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VPN & Network Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Enhanced VPN Control Panel */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-4">
                  {language === "ar" ? "لوحة تحكم VPN" : "VPN Control Panel"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-cyber-glass/30 rounded-lg">
                    <span className="text-sm text-cyber-purple-light">
                      {language === "ar" ? "الحالة" : "Status"}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        vpnStatus === "connected"
                          ? "text-green-400"
                          : vpnStatus === "connecting" ||
                              vpnStatus === "disconnecting"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {vpnStatus.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <label className="text-sm text-cyber-purple-light mb-2 block">
                      {language === "ar" ? "موقع الخادم" : "Server Location"}
                    </label>
                    <select
                      value={selectedVpnServer}
                      onChange={(e) => setSelectedVpnServer(e.target.value)}
                      className="w-full px-3 py-2 bg-cyber-glass/30 border border-cyber-glass-border rounded-lg text-cyber-neon focus:border-blue-400 focus:outline-none text-sm"
                    >
                      {vpnServers.map((server) => (
                        <option
                          key={server.id}
                          value={server.id}
                          className="bg-cyber-dark"
                        >
                          {server.flag} {server.name} - {server.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* VPN Profiles */}
                  <div>
                    <label className="text-sm text-cyber-purple-light mb-2 block">
                      {language === "ar"
                        ? "ملفات VPN المحفوظة"
                        : "Saved VPN Profiles"}
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {vpnProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="p-2 bg-cyber-glass/20 rounded-lg flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="text-cyber-neon font-mono">
                              {profile.name}
                            </div>
                            <div className="text-cyber-purple-light">
                              {profile.tunnelType} - {profile.encryption}
                            </div>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              profile.status === "connected"
                                ? "bg-green-400"
                                : "bg-blue-400"
                            }`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={toggleVpn}
                    className={`w-full px-4 py-3 rounded-lg font-bold transition-all ${
                      vpnStatus === "connected"
                        ? "bg-red-400/10 border border-red-400 text-red-400 hover:bg-red-400/20"
                        : "bg-blue-400/10 border border-blue-400 text-blue-400 hover:bg-blue-400/20"
                    }`}
                  >
                    {vpnStatus === "connected"
                      ? "🔌 Disconnect VPN"
                      : "🛡️ Connect VPN"}
                  </button>
                </div>
              </div>

              {/* Speed Test */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-4">
                  Connection Speed
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyber-purple-light">
                      Download
                    </span>
                    <span className="text-sm font-bold text-green-400">
                      {connectionSpeed.download.toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyber-purple-light">
                      Upload
                    </span>
                    <span className="text-sm font-bold text-yellow-400">
                      {connectionSpeed.upload.toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyber-purple-light">
                      Ping
                    </span>
                    <span className="text-sm font-bold text-blue-400">
                      {connectionSpeed.ping.toFixed(0)} ms
                    </span>
                  </div>
                  <button
                    onClick={runSpeedTest}
                    className="w-full px-4 py-2 bg-blue-400/10 border border-blue-400 rounded-lg text-blue-400 text-sm hover:bg-blue-400/20 transition-all"
                  >
                    Run Speed Test
                  </button>
                </div>
              </div>

              {/* Enhanced Network Devices */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-4">
                  {language === "ar" ? "أجهزة الشبكة" : "Network Devices"}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {networkDevices.map((device, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-cyber-glass/30 rounded-lg hover:bg-cyber-glass/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {device.type === "gateway" && (
                            <Router className="w-4 h-4 text-blue-400" />
                          )}
                          {device.type === "computer" && (
                            <Monitor className="w-4 h-4 text-green-400" />
                          )}
                          {device.type === "mobile" && (
                            <Smartphone className="w-4 h-4 text-yellow-400" />
                          )}
                          {device.type === "iot" && (
                            <Radio className="w-4 h-4 text-purple-400" />
                          )}
                          {device.type === "unknown" && (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                          <div>
                            <div className="text-xs font-mono text-cyber-neon">
                              {device.name}
                            </div>
                            <div className="text-xs text-cyber-purple-light">
                              {device.ip} • {device.mac}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-cyber-purple-light">
                            {device.openPorts.length} ports
                          </span>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              device.status === "online"
                                ? "bg-green-400"
                                : device.status === "suspicious"
                                  ? "bg-red-400 animate-pulse"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-cyber-purple-light">
                        OS: {device.os} • Ports:{" "}
                        {device.openPorts.join(", ") || "None"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Execution Logs */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-4">
                  {language === "ar"
                    ? "سجل تنفيذ الأدوات"
                    : "Tool Execution Logs"}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {toolExecutionLogs.length > 0 ? (
                    toolExecutionLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2 bg-cyber-glass/20 rounded text-xs font-mono"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {log.status === "executing" && (
                            <Clock className="w-3 h-3 text-yellow-400 animate-spin" />
                          )}
                          {log.status === "completed" && (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          )}
                          {log.status === "failed" && (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span className="text-cyber-purple-light">
                            {log.timestamp}
                          </span>
                        </div>
                        <div className="text-cyber-neon">{log.output}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-cyber-purple-light text-center py-4">
                      {language === "ar" ? "لا توجد سجلات بعد" : "No logs yet"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Network Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              className="btn-cyber p-4"
              style={{ color: "#3b82f6", borderColor: "#3b82f6" }}
            >
              <div className="text-center">
                <Map className="w-6 h-6 mx-auto mb-2" />
                <div>Network Scan</div>
                <div className="text-xs opacity-70">Discover devices</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#3b82f6", borderColor: "#3b82f6" }}
            >
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <div>Enable Firewall</div>
                <div className="text-xs opacity-70">Network protection</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#3b82f6", borderColor: "#3b82f6" }}
            >
              <div className="text-center">
                <Globe className="w-6 h-6 mx-auto mb-2" />
                <div>DNS Check</div>
                <div className="text-xs opacity-70">Verify DNS security</div>
              </div>
            </button>
            <button
              className="btn-cyber p-4"
              style={{ color: "#3b82f6", borderColor: "#3b82f6" }}
            >
              <div className="text-center">
                <Gauge className="w-6 h-6 mx-auto mb-2" />
                <div>Optimize Connection</div>
                <div className="text-xs opacity-70">Improve performance</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
