import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const StatusCard = forwardRef(
  ({ label, value, sublabel, variant = "default", className }, ref) => {
    const valueColors = {
      default: "text-foreground",
      warning: "text-warning",
      success: "text-success",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "card-elevated p-5 border-l-4",
          variant === "warning" && "border-l-warning",
          variant === "success" && "border-l-success",
          variant === "default" && "border-l-primary",
          className
        )}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {variant === "warning" && <span className="h-2 w-2 rounded-full bg-warning" />}
          {variant === "success" && <span className="h-2 w-2 rounded-full bg-success" />}
          {label}
        </div>
        <p className={cn("font-semibold text-lg", valueColors[variant])}>{value}</p>
        {sublabel && <p className={cn("text-sm mt-1", valueColors[variant])}>{sublabel}</p>}
      </div>
    );
  }
);

StatusCard.displayName = "StatusCard";

export default StatusCard;
