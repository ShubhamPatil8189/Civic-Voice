import React, { forwardRef } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const MicButton = forwardRef(
  ({ size = "md", label, isListening = false, onClick, className }, ref) => {
    const sizeClasses = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const iconSizes = {
      sm: "h-5 w-5",
      md: "h-7 w-7",
      lg: "h-10 w-10",
    };

    return (
      <div className="flex flex-col items-center gap-3">
        {isListening && (
          <div className="listening-indicator">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        <button
          ref={ref}
          onClick={onClick}
          className={cn(
            "mic-button",
            sizeClasses[size],
            isListening && "animate-pulse-soft",
            className
          )}
        >
          <Mic className={iconSizes[size]} />
        </button>
        {label && (
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    );
  }
);

MicButton.displayName = "MicButton";

export default MicButton;
