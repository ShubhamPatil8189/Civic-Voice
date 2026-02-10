import React from "react";
import { cn } from "@/lib/utils";

const LanguageSelector = ({ languages, selected, onSelect, className }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-secondary rounded-full",
        className
      )}
    >
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selected === lang
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
