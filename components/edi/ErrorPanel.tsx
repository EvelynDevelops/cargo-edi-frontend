"use client";

import React, { useState } from "react";

interface IErrorPanelProps {
  error: string;
  logs?: string[];
}

/**
 * Process error message by removing redundant prefixes and formatting
 */
const processErrorMessage = (message: string): string => {
  // Remove quotes
  let cleanMessage = message.replace(/['"]/g, '');
  
  // Process line number errors
  const lineNumberMatch = cleanMessage.match(/^Line (\d+):/i);
  if (lineNumberMatch) {
    const lineNum = lineNumberMatch[1];
    const errorContent = cleanMessage.substring(cleanMessage.indexOf(':') + 1).trim();
    cleanMessage = `Line ${lineNum}: ${errorContent}`;
  }
  
  // Remove common error prefixes
  const prefixesToRemove = [
    'EDI decoding failed:',
    'Invalid EDI format:',
    'Validation error:',
    'Parse error:'
  ];
  
  prefixesToRemove.forEach(prefix => {
    cleanMessage = cleanMessage.replace(new RegExp(prefix, 'gi'), '').trim();
  });
  
  // Format specific error messages
  const errorMappings: { [key: string]: string } = {
    'Empty lines are not allowed': 'Empty lines are not allowed',
    'Invalid RFF format': 'Invalid RFF format',
    'Invalid cargo type': 'Invalid cargo type',
    'Invalid package count': 'Invalid package count',
    'Invalid MEA segment': 'Invalid MEA segment',
    'Invalid PCI segment': 'Invalid PCI segment',
    'Invalid GID segment': 'Invalid GID segment',
    'Invalid FTX segment': 'Invalid FTX segment'
  };

  Object.entries(errorMappings).forEach(([key, value]) => {
    cleanMessage = cleanMessage.replace(new RegExp(key, 'gi'), value);
  });
  
  return cleanMessage;
};

/**
 * Parse EDI format error messages
 */
const parseEdiFormatError = (error: string): string[] => {
  // Remove all error prefixes
  let cleanError = error
    .replace(/EDI decoding failed:\s*/g, '')
    .replace(/Invalid EDI format:\s*/g, '')
    .replace(/Validation error:\s*/g, '')
    .trim();

  // Handle array-style errors
  if (cleanError.startsWith('[') && cleanError.endsWith(']')) {
    return cleanError
      .slice(1, -1)
      .split(',')
      .map(msg => msg.trim())
      .map(processErrorMessage)
      .filter(Boolean);
  }
  
  // Handle semicolon-separated errors
  if (cleanError.includes(';')) {
    return cleanError
      .split(';')
      .map(msg => msg.trim())
      .map(processErrorMessage)
      .filter(Boolean);
  }
  
  // Handle newline-separated errors
  if (cleanError.includes('\n')) {
    return cleanError
      .split('\n')
      .map(msg => msg.trim())
      .map(processErrorMessage)
      .filter(Boolean);
  }
  
  // Handle single error message
  return [processErrorMessage(cleanError)];
};

/**
 * Error Panel Component
 */
const ErrorPanel: React.FC<IErrorPanelProps> = ({ error, logs = [] }) => {
  const [showLogs, setShowLogs] = useState(false);
  
  if (!error) return null;

  const errorMessages = parseEdiFormatError(error);
  const hasLogs = logs && logs.length > 0;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      {errorMessages.map((message, index) => (
        <div 
          key={index} 
          className="text-sm text-red-500 mb-1 last:mb-0 font-mono"
        >
          {message}
        </div>
      ))}
      
      {/* 显示日志部分 */}
      {hasLogs && (
        <div className="mt-3 border-t border-red-200 pt-2">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-red-600 hover:text-red-800 flex items-center"
          >
            {showLogs ? '隐藏后端日志' : '显示后端日志'}
            <svg 
              className={`ml-1 w-4 h-4 transition-transform ${showLogs ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showLogs && (
            <div className="mt-2 text-xs bg-gray-100 p-2 rounded max-h-48 overflow-y-auto font-mono">
              {logs.map((log, index) => (
                <div key={index} className="text-gray-800 mb-1 last:mb-0">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorPanel; 