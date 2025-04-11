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
    
    // If error message is in array format (handles both [' '] and [" "] formats)
    if (withoutPrefix.startsWith('[') && withoutPrefix.endsWith(']')) {
      // Extract the actual content inside brackets
      const contentWithQuotes = withoutPrefix.slice(1, -1);
      
      // Remove both single and double quotes at beginning and end
      let cleanContent = contentWithQuotes;
      if ((cleanContent.startsWith("'") && cleanContent.endsWith("'")) || 
          (cleanContent.startsWith('"') && cleanContent.endsWith('"'))) {
        cleanContent = cleanContent.slice(1, -1);
      }
      
      // Split by commas if there are multiple errors
      // But be careful not to split inside the error message itself
      let errors = [cleanContent]; // Default to single error
      if (cleanContent.includes('", "') || cleanContent.includes("', '")) {
        // This is a more complex case with multiple errors
        // Use regex to split properly
        const multipleErrors = cleanContent.match(/['"][^'"]*['"],\s*['"][^'"]*['"]|['"][^'"]*['"]/g);
        if (multipleErrors) {
          errors = multipleErrors.map(e => e.replace(/^['"]|['"]$/g, ''));
        }
      }
      
      // Process each error
      return errors.map(err => {
        // Remove line prefix
        return err.replace(/^Line \d+:\s*/, '');
      }).join('\n');
    }
    
    // For single error (not in array format), just remove line prefix
    return withoutPrefix.replace(/^Line \d+:\s*/, '');
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