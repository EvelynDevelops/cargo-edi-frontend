import { useState, useEffect, useCallback } from 'react';

interface IUseEdiErrorDetectionProps {
  lines: string[];
  error: string;
  manualErrorLine: number | null;
  findEmptyLines: () => number[];
}

/**
 * Hook for detecting error lines in EDI content
 */
export function useEdiErrorDetection({
  lines,
  error,
  manualErrorLine,
  findEmptyLines
}: IUseEdiErrorDetectionProps) {
  const [errorLines, setErrorLines] = useState<number[]>([]);

  // Detect error lines based on error message and manual error line
  useEffect(() => {
    const newErrorLines = new Set<number>();
    
    // Add manual error line if set
    if (manualErrorLine !== null) {
      newErrorLines.add(manualErrorLine);
    }
    
    if (error) {
      // 1. Check for line number errors (multiple formats)
      const linePatterns = [
        /Line (\d+):/g,
        /line (\d+)/gi,
        /at line (\d+)/gi,
        /in line (\d+)/gi
      ];

      linePatterns.forEach(pattern => {
        const matches = error.matchAll(pattern);
        for (const match of matches) {
          if (match[1]) {
            newErrorLines.add(parseInt(match[1], 10) - 1);
          }
        }
      });

      // 2. Check for specific segment errors
      const segmentErrors = [
        { error: "Invalid RFF format", segment: "RFF+" },
        { error: "Invalid cargo type", segment: "PAC+++" },
        { error: "package count", segment: "PAC+" },
        { error: "Invalid MEA segment", segment: "MEA+" },
        { error: "Invalid PCI segment", segment: "PCI+" },
        { error: "Invalid GID segment", segment: "GID+" },
        { error: "Invalid FTX segment", segment: "FTX+" }
      ];

      segmentErrors.forEach(({ error: errorType, segment }) => {
        if (error.toLowerCase().includes(errorType.toLowerCase())) {
          lines.forEach((line, index) => {
            if (line.startsWith(segment)) {
              newErrorLines.add(index);
            }
          });
        }
      });

      // 3. Check for empty line errors
      if (error.toLowerCase().includes("empty line")) {
        const emptyLines = findEmptyLines();
        emptyLines.forEach(index => {
          newErrorLines.add(index);
        });
      }

      // 4. Check for format errors
      if (error.toLowerCase().includes("format")) {
        const lastLineWithContent = lines
          .map((line, index) => ({ line, index }))
          .filter(({ line }) => line.trim() !== '')
          .pop();

        if (lastLineWithContent) {
          newErrorLines.add(lastLineWithContent.index);
        }
      }

      // 5. If no error lines found but there is an error message
      if (newErrorLines.size === 0 && lines.length > 0) {
        const lastNonEmptyIndex = lines
          .map((line, index) => ({ line, index }))
          .filter(({ line }) => line.trim() !== '')
          .pop();

        if (lastNonEmptyIndex) {
          newErrorLines.add(lastNonEmptyIndex.index);
        }
      }
    }

    // Convert to array and sort
    setErrorLines(Array.from(newErrorLines).sort((a, b) => a - b));
  }, [error, lines, manualErrorLine, findEmptyLines]);

  return {
    errorLines
  };
} 