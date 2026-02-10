import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const StepItem = ({
  number,
  icon: Icon,
  title,
  description,
  estimatedTime,
  isCompleted = false,
  isActive = false,
}) => {
  return (
    <div className="flex gap-4 relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border -z-10" />

      {/* Step number */}
      <div
        className={cn(
          "step-number flex-shrink-0",
          isCompleted && "bg-success",
          isActive && "ring-4 ring-primary/20"
        )}
      >
        {number}
      </div>

      {/* Content */}
      <div className="pb-8 flex-1">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex items-center gap-1 text-xs text-warning font-medium">
          <Clock className="h-3 w-3" />
          Estimated time: {estimatedTime}
        </div>
      </div>
    </div>
  );
};

export default StepItem;
