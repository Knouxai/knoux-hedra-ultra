import { useEffect, useRef, useState } from "react";

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

export interface ToolExecutionUpdate {
  executionId: string;
  toolId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  progress: number;
  logs: Array<{
    timestamp: Date;
    level: "info" | "warning" | "error" | "success";
    message: string;
    data?: any;
  }>;
  result?: any;
  duration?: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(private url: string = "ws://localhost:8080") {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("✅ WebSocket connected");
        this.reconnectAttempts = 0;
        this.emit("connection", { status: "connected" });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          message.timestamp = new Date(message.timestamp);
          this.handleMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("❌ WebSocket disconnected");
        this.emit("connection", { status: "disconnected" });
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emit("error", { error });
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `⏳ Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("❌ Max reconnection attempts reached");
      this.emit("connection", { status: "failed" });
    }
  }

  private handleMessage(message: WebSocketMessage) {
    this.emit(message.type, message.data);
  }

  private emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return cleanup function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  public send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Message not sent:", {
        type,
        data,
      });
    }
  }

  public executeTool(toolId: string, sectionId: number, options: any = {}) {
    this.send("execute_tool", {
      toolId,
      sectionId,
      options,
      timestamp: new Date().toISOString(),
    });
  }

  public stopTool(executionId: string) {
    this.send("stop_tool", {
      executionId,
      timestamp: new Date().toISOString(),
    });
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionState(): string {
    if (!this.ws) return "disconnected";
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "disconnected";
      default:
        return "unknown";
    }
  }
}

// Singleton instance
let wsService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    wsService = new WebSocketService();
  }
  return wsService;
};

// React Hook for WebSocket
export const useWebSocket = () => {
  const [connectionState, setConnectionState] =
    useState<string>("disconnected");
  const wsRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    wsRef.current = getWebSocketService();

    const cleanup = wsRef.current.on("connection", (data) => {
      setConnectionState(data.status);
    });

    setConnectionState(wsRef.current.getConnectionState());

    return cleanup;
  }, []);

  const sendMessage = (type: string, data: any) => {
    wsRef.current?.send(type, data);
  };

  const executeTool = (toolId: string, sectionId: number, options?: any) => {
    wsRef.current?.executeTool(toolId, sectionId, options);
  };

  const stopTool = (executionId: string) => {
    wsRef.current?.stopTool(executionId);
  };

  const subscribe = (event: string, callback: (data: any) => void) => {
    return wsRef.current?.on(event, callback) || (() => {});
  };

  return {
    connectionState,
    isConnected: connectionState === "connected",
    sendMessage,
    executeTool,
    stopTool,
    subscribe,
    service: wsRef.current,
  };
};

export default WebSocketService;
