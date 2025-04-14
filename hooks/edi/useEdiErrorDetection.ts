import { useState, useEffect, useCallback, RefObject } from 'react';

interface IUseEdiErrorDetectionProps {
  lines: string[];
  findEmptyLines: () => number[];
  textareaRef?: RefObject<HTMLTextAreaElement>;
}

/**
 * Hook for managing error detection in EDI input
 */
export function useEdiErrorDetection({
  lines,
  findEmptyLines,
  textareaRef,
}: IUseEdiErrorDetectionProps) {
  // State to track error lines
  const [errorLines, setErrorLines] = useState<number[]>([]);
  // State to track manually added error lines (from logs)
  const [manualErrorLine, setManualErrorLine] = useState<number | null>(null);

  // Effect to detect empty lines
  useEffect(() => {
    if (lines && lines.length > 0) {
      const emptyLineIndexes = findEmptyLines();
      setErrorLines(emptyLineIndexes);
    } else {
      setErrorLines([]);
    }
  }, [lines, findEmptyLines]);

  // Process log messages to extract error line information
  const processLogMessage = useCallback((message: string) => {
    // Regex to match error messages
    const errorRegex = /Error at line (\d+)/i;
    const emptyLineRegex = /Empty line detected at line (\d+)/i;
    
    let match = message.match(errorRegex) || message.match(emptyLineRegex);
    
    if (match && match[1]) {
      const lineNumber = parseInt(match[1], 10) - 1; // Convert to 0-based index
      setManualErrorLine(lineNumber);
      
      // Scroll to the error line if textareaRef is provided
      scrollToErrorLine(lineNumber);
      
      return true;
    }
    
    return false;
  }, []);
  
  // Function to scroll to error line
  const scrollToErrorLine = useCallback((lineIndex: number) => {
    if (!textareaRef?.current) return;
    
    const textarea = textareaRef.current;
    const lineHeight = 21; // Approximate line height in pixels
    
    // Calculate position to scroll to
    const scrollPosition = lineHeight * lineIndex;
    
    // Add highlight class to textarea
    textarea.classList.add('highlight-error');
    
    // Scroll to the position with smooth behavior
    try {
      textarea.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    } catch (e) {
      // Fallback for browsers that don't support smooth scrolling
      textarea.scrollTop = scrollPosition;
    }
    
    // Remove highlight class after animation completes
    setTimeout(() => {
      textarea.classList.remove('highlight-error');
    }, 2000);
  }, [textareaRef]);

  // Get all error lines including manual ones
  const getAllErrorLines = useCallback(() => {
    if (manualErrorLine !== null && !errorLines.includes(manualErrorLine)) {
      return [...errorLines, manualErrorLine];
    }
    return errorLines;
  }, [errorLines, manualErrorLine]);

  // Clear manual error line
  const clearManualErrorLine = useCallback(() => {
    setManualErrorLine(null);
  }, []);

  return {
    errorLines,
    manualErrorLine,
    processLogMessage,
    getAllErrorLines,
    clearManualErrorLine,
    scrollToErrorLine
  };
} 