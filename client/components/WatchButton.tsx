import React, { useState } from "react";
import { Play, Square, Loader2 } from "lucide-react";

interface WatchButtonProps {
  toolName: string;
  endpoint: string;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function WatchButton({
  toolName,
  endpoint,
  currentStatus,
  onStatusChange,
  disabled = false,
  className = "",
}: WatchButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");

  const isActive = ["WATCHING", "ACTIVE", "TRACKING", "SCANNING"].includes(
    currentStatus,
  );

  const handleClick = async () => {
    if (isLoading || disabled) return;

    const action = isActive ? "stop" : "start";
    setIsLoading(true);
    setLastAction(action);

    try {
      const response = await fetch(`/api${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        onStatusChange(
          data.status || (action === "start" ? "WATCHING" : "IDLE"),
        );
      } else {
        console.error(`Failed to ${action} ${toolName}`);
        // في حالة الفشل، أعد الحالة كما كانت
        onStatusChange(currentStatus);
      }
    } catch (error) {
      console.error(`Error ${action}ing ${toolName}:`, error);
      // في حالة الفشل، أعد الحالة كما كانت
      onStatusChange(currentStatus);
    } finally {
      setIsLoading(false);
      setLastAction("");
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return lastAction === "start" ? "STARTING..." : "STOPPING...";
    }

    if (disabled) {
      return "DISABLED";
    }

    return isActive ? "STOP" : "WATCH";
  };

  const getButtonColor = () => {
    if (disabled) {
      return "bg-gray-600 cursor-not-allowed";
    }

    if (isLoading) {
      return "bg-yellow-600";
    }

    return isActive
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700";
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-3 h-3 animate-spin" />;
    }

    return isActive ? (
      <Square className="w-3 h-3" />
    ) : (
      <Play className="w-3 h-3" />
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
        transition-all duration-200 text-sm font-medium text-white
        ${getButtonColor()}
        ${className}
      `}
      title={`${getButtonText()} ${toolName}`}
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
  );
}
