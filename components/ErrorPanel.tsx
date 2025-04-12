"use client";

import React from "react";

type Props = {
  error: string;
};

const ErrorPanel: React.FC<Props> = ({ error }) => {
  if (!error) return null;

  // Process error message
  const processErrorMessage = (message: string) => {
    // Remove quotes
    let cleanMessage = message.replace(/['"]/g, '');
    
    // If it's a line number error, remove "Line X:" prefix
    if (cleanMessage.match(/^Line \d+:/)) {
      cleanMessage = cleanMessage.replace(/^Line \d+:\s*/, '');
    }
    
    return cleanMessage;
  };

  // Check if it's an EDI format error
  if (error.startsWith('EDI decoding failed: Invalid EDI format:')) {
    // Remove prefix and extract error messages
    const cleanError = error
      .replace("EDI decoding failed: Invalid EDI format:", "")
      .trim();

    // Handle both array-style and single message formats
    let errorMessages: string[] = [];
    if (cleanError.startsWith('[') && cleanError.endsWith(']')) {
      // Remove brackets and split by commas if multiple messages
      errorMessages = cleanError
        .slice(1, -1)
        .split(',')
        .map(msg => msg.trim())
        .map(processErrorMessage);
    } else {
      errorMessages = [processErrorMessage(cleanError)];
    }

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