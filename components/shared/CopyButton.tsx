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
      // Locate the textarea element to copy text from
      const textToCopy = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
      if (textToCopy) {
        // Create a temporary textarea element to use the execCommand API
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';  // Ensure it won't be visible on screen
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);

        // Select and copy the text
        textArea.focus();
        textArea.select();
        try {
          await navigator.clipboard.writeText(textToCopy);
          setIsCopied(true);             // Show "copied" status
          setTimeout(() => setIsCopied(false), 2000);  // Reset after 2 seconds
          onCopy();                      // Trigger any callback passed by parent
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }

        // Clean up the temporary textarea
        document.body.removeChild(textArea);
      }
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
