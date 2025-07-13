# 🚀 KNOUX7 KOTS™ Microservices

**KNOX Offensive Tool Standard (KOTS™)** - Complete microservices architecture for all 49 cybersecurity tools.

## 📋 Overview

This microservices system provides API-driven access to all KNOX Sentinel cybersecurity tools, organized into 7 specialized modules with 49 individual tools.

### 🏗️ Architecture

```
📁 microservices/
├── server.js                    # Central API server (Node.js Express)
├── package.json                 # Dependencies and scripts
├── 📁 defensive-ops/            # Module 1: Defense (7 tools)
├── 📁 offensive-tools/          # Module 2: Offense (7 tools)
├── 📁 surveillance/             # Module 3: Monitoring (7 tools)
├── 📁 network-control/          # Module 4: Network (7 tools)
├── 📁 ai-assistant/             # Module 5: AI (7 tools)
├── 📁 reporting/                # Module 6: Reports (7 tools)
├── 📁 cosmic-settings/          # Module 7: Settings (7 tools)
└── 📁 scripts/                  # Automation scripts
```

### 🛠️ Tool Structure (KOTS™ Standard)

Each tool follows the standardized structure:

```
📁 ToolName/
├── run.ps1          # Windows PowerShell execution script
├── run.sh           # Linux Bash execution script
├── update.ps1       # Windows update script
├── update.sh        # Linux update script
├── settings.json    # Tool configuration
└── status.json      # Tool status and metadata
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **PowerShell** (Windows) or **Bash** (Linux)
- **Administrator/Root privileges** (for some tools)

### Installation

1. **Install dependencies:**

```bash
cd microservices
npm install
```

2. **Start the KOTS server:**

```bash
npm start
# or for development
npm run dev
```

3. **Access the API:**

```
🌐 API Server: http://localhost:7070
🔗 WebSocket: ws://localhost:7071
```

## 📚 API Documentation

### 🔗 Core Endpoints

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| `GET`  | `/api/tools`         | List all 49 tools    |
| `GET`  | `/api/tools/:module` | List tools by module |
| `GET`  | `/api/health`        | Health check         |
| `GET`  | `/api/system`        | System information   |

### 🔧 Tool-Specific Endpoints

For each tool (replace `:tool` with tool name):

| Method   | Endpoint              | Description          |
| -------- | --------------------- | -------------------- |
| `POST`   | `/api/:tool/run`      | Execute tool         |
| `POST`   | `/api/:tool/update`   | Update tool          |
| `GET`    | `/api/:tool/settings` | Get settings         |
| `PUT`    | `/api/:tool/settings` | Update settings      |
| `GET`    | `/api/:tool/status`   | Get tool status      |
| `DELETE` | `/api/:tool/kill`     | Kill running process |

### 📊 Example API Calls

**Execute AutoRecon tool:**

```bash
curl -X POST http://localhost:7070/api/AutoRecon/run \
  -H "Content-Type: application/json" \
  -d '{
    "args": ["-t", "192.168.1.1", "-s", "quick"],
    "async": true,
    "timeout": 300
  }'
```

**Get tool status:**

```bash
curl http://localhost:7070/api/AutoRecon/status
```

**List all tools:**

```bash
curl http://localhost:7070/api/tools
```

## 📁 Modules & Tools

### 🛡️ Module 1: Defensive Ops (7 tools)

- **ActiveServicesScanner** - Scan active system services
- **PortsShield** - Port protection and monitoring
- **ProcessMonitor** - Real-time process analysis
- **RealTimeBlocker** - Malware detection and blocking
- **VaultPass** - Password management system
- **AESEncryption** - File/folder encryption (AES-512)
- **SentinelAlerts** - Threat detection alerts

### ⚔️ Module 2: Offensive Tools (7 tools)

- **AutoRecon** - Automated reconnaissance scanner
- **PacketInterceptor** - Network packet capture and analysis
- **AttackScriptGenerator** - Custom attack script generation
- **WiFiPenTest** - WiFi penetration testing
- **OSINTDeepSearch** - Open source intelligence gathering
- **MACARPSpoofing** - MAC/ARP address spoofing
- **CVEExploiter** - Known vulnerability exploitation

### 👁️ Module 3: Surveillance (7 tools)

- **SystemWatchdog** - Comprehensive system monitoring
- **LiveNetworkMonitor** - Real-time network traffic monitoring
- **FileAccessTracker** - File and log access tracking
- **ThirdPartyMonitor** - Third-party application monitoring
- **UnauthorizedLoginDetector** - Unauthorized login detection
- **CameraMicMonitor** - Camera/microphone usage monitoring
- **SilentUserLogger** - Silent user activity logging

### 🌐 Module 4: Network Control (7 tools)

- **NetworkMapper** - Network topology mapping
- **VPNControl** - VPN connection management
- **DNSLeakChecker** - DNS leak detection
- **ProxyDetector** - Suspicious connection/proxy detection
- **SpeedTest** - Internet speed testing
- **LANDefender** - Local network protection
- **WebRTCBlocker** - WebRTC leak prevention

### 🧠 Module 5: AI Assistant (7 tools)

- **KnouxScriptGen** - AI script generation
- **ToolRecommender** - Scenario-based tool recommendations
- **FileVulnerabilityAnalyzer** - AI file vulnerability analysis
- **ChatKnoxAI** - Interactive security assistant
- **SystemOptimizer** - AI system optimization
- **YOLOWhisperIntegration** - Image/audio analysis
- **VoiceCommands** - Voice-activated tool execution

### 📊 Module 6: Reporting (7 tools)

- **EncryptedPDFGenerator** - Password-protected PDF reports
- **DetailedOperationReport** - Detailed operation documentation
- **KnouxDigitalSignature** - Digital signature for reports
- **PerformanceAnalytics** - Performance analysis and statistics
- **MasterPasswordProtection** - Master password protection
- **CloudSync** - Cloud storage synchronization
- **ArchiveManager** - Report archive management

### ⚙️ Module 7: Cosmic Settings (7 tools)

- **UICustomizer** - Interface customization
- **ThemeSwitcher** - Dark/light mode switching
- **AlertManager** - Alert and notification management
- **ConditionalToolActivator** - Conditional tool activation
- **AdvancedFirewallSettings** - Advanced firewall configuration
- **AccessControlManager** - Access permission management
- **AIModelSelector** - AI model selection and configuration

## 🔒 Security Features

### 🛡️ Built-in Security

- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Sanitizes all inputs
- **Process Isolation** - Isolated tool execution
- **Audit Logging** - Complete activity logs
- **Access Control** - Permission-based tool access
- **Secure Communication** - HTTPS/WSS support

### 🔐 Authentication (Optional)

```javascript
// Add to server.js for authentication
app.use("/api", authenticateToken);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  // Verify token logic here
  next();
}
```

## 🎯 Platform Support

### ✅ Windows Support

- **PowerShell Core** 5.1+ or 7+
- **Dependencies**: Automatically installed
- **Privileges**: Administrator for some tools
- **Execution**: PowerShell scripts (`.ps1`)

### ✅ Linux Support

- **Bash** 4.0+
- **Dependencies**: Auto-installed via package manager
- **Privileges**: Root for some tools
- **Execution**: Bash scripts (`.sh`)

### 🐳 Docker Support (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7070 7071
CMD ["npm", "start"]
```

## 📊 Monitoring & WebSocket

### 🔗 Real-time Updates

Connect to WebSocket for live tool execution updates:

```javascript
const ws = new WebSocket("ws://localhost:7071");

ws.on("message", (data) => {
  const event = JSON.parse(data);
  console.log("Tool Event:", event);
});
```

### 📈 Event Types

- `tool_status_update` - Tool status changed
- `tool_execution_complete` - Tool finished successfully
- `tool_execution_failed` - Tool execution failed
- `tool_settings_updated` - Tool settings changed

## 🚀 Deployment Options

### 🖥️ Standalone Server

```bash
npm run build
npm start
```

### ☁️ Cloud Deployment

```bash
# Deploy to cloud platform
# Supports: AWS, Azure, GCP, DigitalOcean
```

### 🐛 Development Mode

```bash
npm run dev
# Enables hot reload and detailed logging
```

## 🔧 Configuration

### ⚙️ Environment Variables

```bash
# Port configuration
KOTS_PORT=7070
KOTS_WS_PORT=7071

# Security settings
KOTS_AUTH_ENABLED=false
KOTS_RATE_LIMIT=100

# Logging
KOTS_LOG_LEVEL=info
KOTS_LOG_FILE=./logs/kots.log
```

### 📝 Tool Configuration

Each tool can be configured via its `settings.json`:

```json
{
  "configuration": {
    "execution": {
      "timeout": 300,
      "maxConcurrentExecutions": 5
    },
    "security": {
      "enableRateLimiting": true,
      "requiredPermissions": ["network_scan"]
    }
  }
}
```

## 🔄 Tool Management

### 📦 Update All Tools

```bash
# Update all tool dependencies
node scripts/update-all-tools.js
```

### 🛠️ Create New Tool

```bash
# Generate new tool structure
node scripts/create-tool.js --module offensive-tools --name NewTool
```

### 📊 Health Monitoring

```bash
# Check all tool health status
curl http://localhost:7070/api/health
```

## 🎯 Integration Examples

### 🖥️ Frontend Integration

```javascript
// React/Vue/Angular integration
const executeTools = async (toolName, params) => {
  const response = await fetch(`/api/${toolName}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return response.json();
};
```

### 🐍 Python Integration

```python
import requests

# Execute tool via Python
def execute_tool(tool_name, params):
    response = requests.post(
        f'http://localhost:7070/api/{tool_name}/run',
        json=params
    )
    return response.json()
```

### 📱 CLI Integration

```bash
#!/bin/bash
# KOTS CLI wrapper
kots_run() {
    curl -X POST "http://localhost:7070/api/$1/run" \
         -H "Content-Type: application/json" \
         -d "$2"
}

# Usage: kots_run AutoRecon '{"args":["target.com"]}'
```

## 🐛 Troubleshooting

### ❌ Common Issues

**Tool execution fails:**

```bash
# Check tool status
curl http://localhost:7070/api/ToolName/status

# Check server logs
tail -f logs/kots.log
```

**Permission denied:**

```bash
# Run with elevated privileges
sudo npm start  # Linux
# Run PowerShell as Administrator (Windows)
```

**Port already in use:**

```bash
# Change port in environment
export KOTS_PORT=8080
npm start
```

### 📞 Support

- **Documentation**: [KNOUX7 Docs](https://knoux7.com/docs)
- **Issues**: Create GitHub issue
- **Email**: support@knoux7.com

## 📜 License

**KNOUX7 Commercial License** - All rights reserved.

## 🎉 Credits

Developed by **KNOUX7 Cyber Team** - Advanced cybersecurity microservices architecture.

---

🔥 **KNOUX7 KOTS™** - _The future of cybersecurity tooling_
