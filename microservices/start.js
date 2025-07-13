#!/usr/bin/env node

// KNOUX7 KOTS™ - Startup Script
// Initializes and starts the microservices server

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

console.log(`
🚀 KNOUX7 KOTS™ - Microservices Startup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 Initializing KNOX Offensive Tool Standard
`);

// Check if server.js exists
if (!fs.existsSync("./server.js")) {
  console.log("❌ server.js not found!");
  console.log("📁 Make sure you are in the microservices directory");
  process.exit(1);
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split(".")[0].substring(1));
if (majorVersion < 18) {
  console.log(
    `⚠️  Warning: Node.js ${nodeVersion} detected. Recommended: v18+`,
  );
}

// Create basic tool structure if missing
const modules = [
  "defensive-ops",
  "offensive-tools",
  "surveillance",
  "network-control",
  "ai-assistant",
  "reporting",
  "cosmic-settings",
];

console.log("📦 Checking tool structure...");
let missingTools = 0;

modules.forEach((module) => {
  const moduleDir = path.join(__dirname, module);
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
    console.log(`📁 Created module directory: ${module}`);
    missingTools++;
  }
});

if (missingTools > 0) {
  console.log(
    `⚠️  ${missingTools} module directories were missing and have been created`,
  );
  console.log(
    "🔧 You may need to run the tool generator to create all 49 tools",
  );
}

// Check for package.json and node_modules
if (!fs.existsSync("./node_modules")) {
  console.log("📦 Installing dependencies...");
  const npmInstall = spawn("npm", ["install"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  npmInstall.on("close", (code) => {
    if (code === 0) {
      console.log("✅ Dependencies installed successfully");
      startServer();
    } else {
      console.log("❌ Failed to install dependencies");
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log(`
🎯 Starting KOTS™ Microservices Server...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  const server = spawn("node", ["server.js"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      KOTS_PORT: process.env.KOTS_PORT || "7070",
      NODE_ENV: process.env.NODE_ENV || "production",
    },
  });

  server.on("close", (code) => {
    console.log(`\n🛑 Server stopped with code: ${code}`);
  });

  server.on("error", (err) => {
    console.log(`❌ Server error: ${err.message}`);
  });

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down KOTS™ server...");
    server.kill("SIGTERM");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n🛑 Received SIGTERM, shutting down...");
    server.kill("SIGTERM");
    process.exit(0);
  });
}
