"use client";

import React from "react";
import { processLogMessage, parseEdiFormatError } from "../../utils/errorProcessing";

interface IErrorPanelProps {
  error: string;
  logs?: string[];
}

/**
 * Error Panel Component
 * Displays either the processed log message or parsed error messages
 */
const ErrorPanel: React.FC<IErrorPanelProps> = ({ error, logs = [] }) => {
  if (!error) return null;

  const hasLogs = logs && logs.length > 0;
  
  // Process the last log message if available
  let processedLogMessage = null;
  if (hasLogs) {
    const lastLogMessage = logs[logs.length - 1];
    processedLogMessage = processLogMessage(lastLogMessage);
  }

  // If we have processed log message, show only that
  if (processedLogMessage) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 shadow-sm">
        <div className="text-sm text-red-600 font-mono font-medium">
          {processedLogMessage}
        </div>
      </div>
    );
  }

  // If no log messages, show the parsed error messages
  const errorMessages = parseEdiFormatError(error);
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 shadow-sm">
      {errorMessages.map((message, index) => (
        <div 
          key={index} 
          className="text-sm text-red-600 mb-1 last:mb-0 font-mono font-medium"
        >
          {message}
        </div>
      ))}
    </div>
  );
};

export default ErrorPanel; 