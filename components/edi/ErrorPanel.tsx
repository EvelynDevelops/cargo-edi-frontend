"use client";

import React from "react";

interface IErrorPanelProps {
  error: string;
}

/**
 * Process error message by removing quotes and line number prefixes
 */
const processErrorMessage = (message: string): string => {
  // Remove quotes
  let cleanMessage = message.replace(/['"]/g, '');
  
  // If it's a line number error, remove "Line X:" prefix
  if (cleanMessage.match(/^Line \d+:/)) {
    cleanMessage = cleanMessage.replace(/^Line \d+:\s*/, '');
  }
  
  return cleanMessage;
};

/**
 * Parse EDI format error messages from the error string
 */
const parseEdiFormatError = (error: string): string[] => {
  // Remove prefix and extract error messages
  const cleanError = error
    .replace("EDI decoding failed: Invalid EDI format:", "")
    .trim();

  // Handle both array-style and single message formats
  if (cleanError.startsWith('[') && cleanError.endsWith(']')) {
    // Remove brackets and split by commas if multiple messages
    return cleanError
      .slice(1, -1)
      .split(',')
      .map(msg => msg.trim())
      .map(processErrorMessage);
  }
  
  return [processErrorMessage(cleanError)];
};

/**
 * Error Panel Component
 * Displays error messages with appropriate formatting
 * Handles both EDI format errors and regular errors
 */
const ErrorPanel: React.FC<IErrorPanelProps> = ({ error }) => {
  if (!error) return null;

  // Check if it's an EDI format error
  if (error.startsWith('EDI decoding failed: Invalid EDI format:')) {
    const errorMessages = parseEdiFormatError(error);

    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        {errorMessages.map((message, index) => (
          <div key={index} className="text-sm text-red-500 mb-1 last:mb-0">
            {message}
          </div>
        ))}
      </div>
    );
  }

  // Display regular error message
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <div className="text-sm text-red-500">
        {processErrorMessage(error)}
      </div>
    </div>
  );
};

export default ErrorPanel; 