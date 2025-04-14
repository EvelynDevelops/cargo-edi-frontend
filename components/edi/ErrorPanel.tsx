"use client";

import React, { useEffect } from "react";
import { processLogMessage, parseEdiFormatError } from "../../utils/errorProcessing";

interface IErrorPanelProps {
  error: string;
  logs?: string[];
  onErrorLineDetected?: (lineNumber: number, isEmptyLine?: boolean) => void;
}

/**
 * Error Panel Component
 * Displays either the processed log message or parsed error messages
 * Also extracts and passes line number information
 */
const ErrorPanel: React.FC<IErrorPanelProps> = ({ 
  error, 
  logs = [],
  onErrorLineDetected
}) => {
  if (!error) return null;

  const hasLogs = logs && logs.length > 0;
  
  // Process the last log message if available
  let processedLogData = null;
  if (hasLogs) {
    const lastLogMessage = logs[logs.length - 1];
    processedLogData = processLogMessage(lastLogMessage);
  }

  // Notify parent component about error line if available
  useEffect(() => {
    if (processedLogData?.lineNumber && onErrorLineDetected) {
      onErrorLineDetected(
        processedLogData.lineNumber, 
        processedLogData.isEmptyLine
      );
    } else if (processedLogData?.isEmptyLine && !processedLogData.lineNumber && onErrorLineDetected) {
      // If we know it's an empty line error but don't know which line,
      // let the parent component try to find empty lines
      onErrorLineDetected(-1, true);
    }
  }, [processedLogData, onErrorLineDetected]);

  // If we have processed log message, show only that
  if (processedLogData && processedLogData.message) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 shadow-sm">
        <div className="text-sm text-red-600 font-mono font-medium">
          {processedLogData.message}
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