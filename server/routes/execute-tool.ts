import { RequestHandler } from "express";
import { ToolExecutionRequest, ToolExecutionResponse } from "@shared/types";

// KNOUX7 KOTS™ Integration
const KOTS_API_URL = process.env.KOTS_API_URL || "http://localhost:7070/api";

export const handleExecuteTool: RequestHandler = async (req, res) => {
  try {
    const { toolId, sectionId, parameters, async } =
      req.body as ToolExecutionRequest;

    if (!toolId || !sectionId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: toolId and sectionId",
        timestamp: new Date(),
        signature: "knoux7-core",
      });
    }

    // Generate execution ID
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Try to execute via KOTS™ microservices first
      const kotsResponse = await fetch(`${KOTS_API_URL}/${toolId}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          args: parameters?.args || [],
          async: async || false,
          timeout: parameters?.timeout || 300,
        }),
      });

      if (kotsResponse.ok) {
        const kotsData = await kotsResponse.json();

        // Convert KOTS response to our format
        const response: ToolExecutionResponse = {
          executionId: kotsData.data?.executionId || executionId,
          status: kotsData.success ? "started" : "failed",
          estimatedTime: kotsData.data?.estimatedTime || "10-30 seconds",
          output: {
            message: `Tool ${toolId} execution via KOTS™ microservices`,
            timestamp: new Date(),
            kotsResult: kotsData,
            logs: [
              "🔗 Connected to KOTS™ microservices",
              "🚀 Tool execution started via microservice",
              "📊 Real-time monitoring enabled",
            ],
          },
        };

        return res.json({
          success: true,
          data: response,
          timestamp: new Date(),
          signature: "knoux7-core-kots",
          microservice: true,
        });
      }
    } catch (kotsError) {
      console.log(
        "KOTS microservice not available, falling back to simulation",
      );
    }

    // Fallback to simulation if KOTS is not available
    const response: ToolExecutionResponse = {
      executionId,
      status: "started",
      estimatedTime: "10-30 seconds",
      output: {
        message: `Tool ${toolId} execution started (simulation mode)`,
        timestamp: new Date(),
        logs: [
          "⚠️  KOTS™ microservices not available",
          "🔄 Falling back to simulation mode",
          "🛠️  Tool execution in progress...",
        ],
      },
    };

    // If async execution, just return started status
    if (async) {
      setTimeout(
        () => {
          console.log(`Tool ${toolId} completed execution (simulation)`);
        },
        10000 + Math.random() * 20000,
      );

      return res.json({
        success: true,
        data: response,
        timestamp: new Date(),
        signature: "knoux7-core",
        microservice: false,
      });
    }

    // Synchronous execution (simulate)
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 3000),
    );

    const syncResponse: ToolExecutionResponse = {
      ...response,
      status: "started",
      output: {
        ...response.output,
        result: "Tool execution completed successfully (simulation)",
        duration: "3.2 seconds",
        status: "success",
      },
    };

    res.json({
      success: true,
      data: syncResponse,
      timestamp: new Date(),
      signature: "knoux7-core",
      microservice: false,
    });
  } catch (error) {
    console.error("Error executing tool:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
      timestamp: new Date(),
      signature: "knoux7-core",
    });
  }
};
