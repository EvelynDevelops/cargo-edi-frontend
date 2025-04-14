"use client";

import React, { useState } from "react";
import SuccessIcon from "@/public/icons/SuccessIcon";

interface ICopyButtonProps {
  onCopy: () => void;
  className?: string;
}

const CopyButton: React.FC<ICopyButtonProps> = ({ onCopy, className = "" }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Handle the copy logic when the button is clicked
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Call the onCopy function provided by the parent component
      onCopy();
      
      // Show the success state
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);  // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 transition flex items-center justify-center w-8 h-6 ${className}`}
    >
      {isCopied ? (
        <SuccessIcon className="h-4 w-4 text-gray-600" width={16} height={16} />
      ) : (
        <span className="text-[10px]">Copy</span>
      )}
    </button>
  );
};

export default CopyButton;
