import { RequestHandler } from "express";

// Get system statistics
export const handleSystemStats: RequestHandler = (req, res) => {
  try {
    // Generate mock system statistics
    const stats = {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(Math.random() * 86400), // Random uptime in seconds
      processes: Math.floor(Math.random() * 200) + 50, // 50-250 processes
      connections: Math.floor(Math.random() * 100) + 10, // 10-110 connections
    };

    res.json(stats);
  } catch (error) {
    console.error("Error generating system stats:", error);
    res.status(500).json({ error: "Failed to get system statistics" });
  }
};

// Get surveillance logs
export const handleSurveillanceLogs: RequestHandler = (req, res) => {
  try {
    // Generate mock surveillance logs
    const logs = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 60000).toISOString(), // Every minute
      tool: [
        "SystemWatchdog",
        "NetworkMonitor",
        "FileTracker",
        "ProcessMonitor",
      ][Math.floor(Math.random() * 4)],
      message: [
        "System scan completed successfully",
        "Network activity detected",
        "File access logged",
        "Process monitoring active",
        "Security check passed",
        "Threat assessment completed",
      ][Math.floor(Math.random() * 6)],
      level: ["info", "warning", "error", "success"][
        Math.floor(Math.random() * 4)
      ] as "info" | "warning" | "error" | "success",
    }));

    res.json(logs);
  } catch (error) {
    console.error("Error generating surveillance logs:", error);
    res.status(500).json({ error: "Failed to get surveillance logs" });
  }
};

// Start all surveillance tools
export const handleSurveillanceStartAll: RequestHandler = (req, res) => {
  try {
    // Mock response for starting all surveillance tools
    const result = {
      success: true,
      message: "All surveillance tools started successfully",
      activated_tools: [
        "SystemWatchdog",
        "NetworkMonitor",
        "FileTracker",
        "ProcessMonitor",
        "LoginDetector",
        "CameraMicMonitor",
      ],
      timestamp: new Date().toISOString(),
    };

    res.json(result);
  } catch (error) {
    console.error("Error starting surveillance tools:", error);
    res.status(500).json({ error: "Failed to start surveillance tools" });
  }
};
