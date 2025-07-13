import React from "react";

interface ProgressBarProps {
  value: number;
  label: string;
  max?: number;
  color?: "blue" | "green" | "yellow" | "red" | "orange" | "purple";
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  max = 100,
  color = "blue",
  showPercentage = true,
  size = "md",
  animated = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const getColorClasses = () => {
    switch (color) {
      case "green":
        return "bg-green-400";
      case "yellow":
        return "bg-yellow-400";
      case "red":
        return "bg-red-400";
      case "orange":
        return "bg-orange-400";
      case "purple":
        return "bg-purple-400";
      default:
        return "bg-blue-400";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-1";
      case "lg":
        return "h-4";
      default:
        return "h-2";
    }
  };

  const getThresholdColor = () => {
    if (percentage >= 90) return "red";
    if (percentage >= 75) return "orange";
    if (percentage >= 50) return "yellow";
    return "green";
  };

  const thresholdColor = getThresholdColor();
  const colorClass = color === "blue" ? getColorClasses() : getColorClasses();

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        {showPercentage && (
          <span
            className={`text-sm font-mono ${
              thresholdColor === "red"
                ? "text-red-400"
                : thresholdColor === "orange"
                  ? "text-orange-400"
                  : thresholdColor === "yellow"
                    ? "text-yellow-400"
                    : "text-green-400"
            }`}
          >
            {value.toFixed(1)}%
          </span>
        )}
      </div>

      <div className={`w-full bg-slate-700 rounded-full ${getSizeClasses()}`}>
        <div
          className={`
            ${
              thresholdColor === "red"
                ? "bg-red-400"
                : thresholdColor === "orange"
                  ? "bg-orange-400"
                  : thresholdColor === "yellow"
                    ? "bg-yellow-400"
                    : "bg-green-400"
            }
            ${getSizeClasses()} 
            rounded-full 
            transition-all 
            duration-300 
            ease-out
            ${animated ? "animate-pulse" : ""}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* مؤشر العتبات */}
      {size !== "sm" && (
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>0%</span>
          <span className="text-yellow-400">50%</span>
          <span className="text-orange-400">75%</span>
          <span className="text-red-400">90%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
