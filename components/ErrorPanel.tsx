"use client";

import React from "react";

type Props = {
  error: string;
};

const ErrorPanel: React.FC<Props> = ({ error }) => {
  if (!error) return null;

  // Check if it's an EDI format error
  if (error.startsWith('EDI decoding failed: Invalid EDI format:')) {
    // Remove prefix and brackets
    const cleanError = error
      .replace("EDI decoding failed: Invalid EDI format: [", "")
      .replace(/[\[\],]/g, "")
      .trim();

    // Split error messages into lines and process them
    const errorLines = cleanError
      .split("'")
      .filter(Boolean)
      .map(line => line.trim())
      .filter(line => line.startsWith("Line")) // Keep only lines starting with "Line"
      .map(line => line.replace(/^Line \d+: /, '')); // Remove "Line X:" prefix

    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        {errorLines.map((line, index) => (
          <div key={index} className="text-sm text-red-500 mb-1 last:mb-0">
            {line}
          </div>
        ))}
      </div>
    );
  }

  // Display regular error message
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <div className="text-sm text-red-500">
        {error}
      </div>
    </div>
  );
};

export default ErrorPanel; 