/**
 * Interface for processed error log message
 */
export interface IProcessedLogMessage {
  message: string;       // The processed error message
  lineNumber?: number;   // The line number where the error occurred, if available
  isEmptyLine?: boolean; // Flag indicating if the error is related to an empty line
}

/**
 * Common error message prefixes to be removed during processing
 */
const ERROR_PREFIXES = [
  /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}\s*-\s*\w+\s*-\s*\[.*?\]\s*-\s*/,
  /EDI decoding failed:\s*/i,
  /Invalid EDI format:\s*/i,
  /Validation error:\s*/i,
  /Parse error:\s*/i
];

/**
 * Line number extraction patterns
 */
const LINE_NUMBER_PATTERNS = [
  /Line (\d+):/i,
  /line (\d+) is empty/i,
  /empty line (\d+)/i,
  /blank line (\d+)/i,
  /line (\d+) is blank/i
];

/**
 * Extract line number from a message
 */
const extractLineNumber = (message: string): number | undefined => {
  for (const pattern of LINE_NUMBER_PATTERNS) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  return undefined;
};

/**
 * Clean message content by removing prefixes, brackets, and quotes
 */
const cleanMessageContent = (message: string): string => {
  // Remove standard prefixes
  let cleaned = message;
  
  ERROR_PREFIXES.forEach(prefix => {
    cleaned = cleaned.replace(prefix, '');
  });
  
  // Extract content from brackets if present
  const bracketMatch = cleaned.match(/\[\s*['"](.+?)['"]?\s*\]/);
  if (bracketMatch && bracketMatch[1]) {
    cleaned = bracketMatch[1];
  }
  
  // Remove leading and trailing quotes, brackets and whitespace
  return cleaned.replace(/^[\s\[\]'"]+|[\s\[\]'"]+$/g, '');
};

/**
 * Process log message by extracting the actual error content
 * Removes timestamps, prefixes, and unnecessary formatting
 * Returns both the processed message and line number
 */
export const processLogMessage = (log: string): IProcessedLogMessage => {
  if (!log) return { message: '' };
  
  // Check if error is related to empty line
  const isEmptyLine = log.toLowerCase().includes('empty line') || 
                     log.toLowerCase().includes('blank line') ||
                     log.toLowerCase().includes('no content in line');
  
  // Clean message and extract content
  let message = cleanMessageContent(log);
  
  // Extract line number from original message or cleaned message
  let lineNumber = extractLineNumber(log) || extractLineNumber(message);
  
  // Handle specific line error format (Line X: Error message)
  const lineContentMatch = message.match(/Line \d+:\s*(.+)$/i);
  if (lineContentMatch && lineContentMatch[1]) {
    message = lineContentMatch[1].trim();
  }
  
  return { 
    message,
    lineNumber,
    isEmptyLine
  };
};

/**
 * Process error message by removing redundant prefixes and formatting
 */
export const processErrorMessage = (message: string): string => {
  if (!message) return '';
  
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
  
  return cleanMessage;
};

/**
 * Parse EDI format error messages
 * Handles different error message formats (array, semicolon-separated, newline-separated)
 */
export const parseEdiFormatError = (error: string): string[] => {
  if (!error) return [];
  
  // Remove all error prefixes
  let cleanError = error
    .replace(/EDI decoding failed:\s*/g, '')
    .replace(/Invalid EDI format:\s*/g, '')
    .replace(/Validation error:\s*/g, '')
    .trim();

  // Handle different separator types
  let errors: string[] = [];
  
  // Array-style errors [msg1, msg2, ...]
  if (cleanError.startsWith('[') && cleanError.endsWith(']')) {
    errors = cleanError
      .slice(1, -1)
      .split(',');
  }
  // Semicolon-separated errors
  else if (cleanError.includes(';')) {
    errors = cleanError.split(';');
  }
  // Newline-separated errors
  else if (cleanError.includes('\n')) {
    errors = cleanError.split('\n');
  }
  // Single error message
  else {
    errors = [cleanError];
  }
  
  // Process each error message and filter out empty ones
  return errors
    .map(msg => msg.trim())
    .map(processErrorMessage)
    .filter(Boolean);
}; 