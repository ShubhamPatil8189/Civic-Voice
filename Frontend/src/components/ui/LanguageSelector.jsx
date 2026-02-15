import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const LanguageSelector = ({ className }) => {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "mr", label: "Marathi" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-secondary rounded-full",
        className
      )}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
            i18n.language === lang.code
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
