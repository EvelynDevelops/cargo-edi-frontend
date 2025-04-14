/**
 * Interface for processed error log message
 */
export interface IProcessedLogMessage {
  message: string;   // The processed error message
  lineNumber?: number; // The line number where the error occurred, if available
}

/**
 * Process log message by extracting the actual error content
 * Removes timestamps, prefixes, and unnecessary formatting
 * Returns both the processed message and line number
 */
export const processLogMessage = (log: string): IProcessedLogMessage => {
  if (!log) return { message: '' };
  
  // Extract line number if available
  let lineNumber: number | undefined = undefined;
  const lineMatch = log.match(/Line (\d+):/i);
  if (lineMatch && lineMatch[1]) {
    lineNumber = parseInt(lineMatch[1], 10);
  }
  
  // First try to match line-specific error content
  let match = log.match(/Line \d+: (.+)$/);
  if (match && match[1]) {
    // Remove trailing brackets and quotes
    return { 
      message: match[1].trim().replace(/[\]']+\s*$/, ''),
      lineNumber
    };
  }
  
  // Try to match error content in brackets
  match = log.match(/\[\'(.+?)\'\]/);
  if (match && match[1]) {
    // Try to extract more specific error from bracket content
    const innerMatch = match[1].match(/Line \d+: (.+)$/);
    if (innerMatch && innerMatch[1]) {
      // Check if we have a line number in the inner match
      const innerLineMatch = match[1].match(/Line (\d+):/i);
      if (innerLineMatch && innerLineMatch[1]) {
        lineNumber = parseInt(innerLineMatch[1], 10);
      }
      return { 
        message: innerMatch[1].trim().replace(/[\]']+\s*$/, ''),
        lineNumber
      };
    }
    return { 
      message: match[1].trim().replace(/[\]']+\s*$/, ''),
      lineNumber
    };
  }
  
  // Try to match generic error pattern: remove timestamp, log level and file info
  match = log.match(/(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3} - \w+ - \[.+?\] - )(.+)$/);
  if (match && match[1]) {
    // Remove common prefixes from the error message
    let errorMsg = match[1].trim();
    const prefixes = ['EDI decoding failed:', 'Invalid EDI format:'];
    prefixes.forEach(prefix => {
      errorMsg = errorMsg.replace(new RegExp(prefix, 'gi'), '').trim();
    });
    
    // If content is in array format, extract the content
    const arrayMatch = errorMsg.match(/\[\'(.+?)\'\]/);
    if (arrayMatch && arrayMatch[1]) {
      // Try to extract line number from the array content
      const innerLineMatch = arrayMatch[1].match(/Line (\d+):/i);
      if (innerLineMatch && innerLineMatch[1]) {
        lineNumber = parseInt(innerLineMatch[1], 10);
      }
      
      const innerContentMatch = arrayMatch[1].match(/Line \d+: (.+)$/);
      if (innerContentMatch && innerContentMatch[1]) {
        return { 
          message: innerContentMatch[1].trim().replace(/[\]']+\s*$/, ''),
          lineNumber
        };
      }
      return { 
        message: arrayMatch[1].trim().replace(/[\]']+\s*$/, ''),
        lineNumber
      };
    }
    
    return { 
      message: errorMsg.replace(/[\]']+\s*$/, ''),
      lineNumber
    };
  }
  
  // Handle specific array error formats: e.g. [Line 16: RFF value...]
  const arrayError = log.match(/\[\s*['"]?(Line \d+:.+?)['"]?\s*\]/i);
  if (arrayError && arrayError[1]) {
    // Extract line number from array content
    const arrayLineMatch = arrayError[1].match(/Line (\d+):/i);
    if (arrayLineMatch && arrayLineMatch[1]) {
      lineNumber = parseInt(arrayLineMatch[1], 10);
    }
    
    const lineError = arrayError[1].match(/Line \d+:\s*(.+)$/i);
    if (lineError && lineError[1]) {
      return { 
        message: lineError[1].trim(),
        lineNumber
      };
    }
    return { 
      message: arrayError[1].trim(),
      lineNumber
    };
  }
  
  // If all previous matches fail, process the original log
  let result = log;
  
  // Look for line number in original log
  const finalLineMatch = result.match(/Line (\d+):/i);
  if (finalLineMatch && finalLineMatch[1]) {
    lineNumber = parseInt(finalLineMatch[1], 10);
  }
  
  // Remove all common prefixes
  const allPrefixes = [
    /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}\s*-\s*\w+\s*-\s*\[.*?\]\s*-\s*/,
    /EDI decoding failed:\s*/i,
    /Invalid EDI format:\s*/i,
    /Validation error:\s*/i,
    /Parse error:\s*/i
  ];
  
  allPrefixes.forEach(prefix => {
    result = result.replace(prefix, '');
  });
  
  // Process content in brackets
  const bracketMatch = result.match(/\[\s*['"](.+?)['"]?\s*\]/);
  if (bracketMatch && bracketMatch[1]) {
    result = bracketMatch[1];
    
    // Check for line number in bracket content
    const bracketLineMatch = bracketMatch[1].match(/Line (\d+):/i);
    if (bracketLineMatch && bracketLineMatch[1]) {
      lineNumber = parseInt(bracketLineMatch[1], 10);
    }
  }
  
  // Remove leading and trailing quotes and brackets
  result = result.replace(/^[\s\[\]'"]+|[\s\[\]'"]+$/g, '');
  
  return { 
    message: result,
    lineNumber
  };
};

/**
 * Process error message by removing redundant prefixes and formatting
 */
export const processErrorMessage = (message: string): string => {
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
export const parseEdiFormatError = (error: string): string[] => {
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