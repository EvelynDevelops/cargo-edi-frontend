"use client";

import React from "react";

interface ErrorPanelProps {
  error: string;
  className?: string;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({
  error,
  className = "",
}) => {
  if (!error) return null;

  // Parse error message, remove brackets and prefixes
  const formatError = (errorMsg: string): string => {
    // Remove EDI decoding failed: Invalid EDI format: prefix
    const withoutPrefix = errorMsg.replace(/^EDI decoding failed: Invalid EDI format:\s*/, '');
    
    // If error message is in array format
    if (withoutPrefix.startsWith('[') && withoutPrefix.endsWith(']')) {
      // Remove brackets
      const content = withoutPrefix.slice(1, -1);
      // If content contains multiple errors, separate with newlines
      return content.split(',').map(err => {
        // Remove quotes and Line prefix from each error message
        const trimmed = err.trim();
        const withoutQuotes = trimmed.replace(/^'|'$/g, '');
        const withoutLinePrefix = withoutQuotes.replace(/^Line \d+:\s*/, '');
        return withoutLinePrefix;
      }).join('\n');
    }
    return withoutPrefix;
  };

  const formattedError = formatError(error);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Error message panel */}
      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600 whitespace-pre-line">{formattedError}</p>
      </div>
    </div>
  );
};

export default ErrorPanel; 