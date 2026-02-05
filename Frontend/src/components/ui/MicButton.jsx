import React from "react";
import { Mic } from "lucide-react";

const MicButton = ({ label, isListening, size, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
        size === "lg" ? "text-lg" : "text-sm"
      }`}
    >
      <Mic className={`${isListening ? "animate-pulse" : ""}`} />
      {label}
    </button>
  );
};

export default MicButton;
