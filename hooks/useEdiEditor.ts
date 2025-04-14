import { useState, useEffect, useRef, useCallback } from 'react';

interface IUseEdiEditorProps {
  onDecode: (input: string) => void;
  onInputChange?: () => void;
  error?: string;
  setError?: (error: string) => void;
}

interface IUseEdiEditorResult {
  input: string;
  errorLines: number[];
  lines: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDecode: () => void;
  handleClear: () => void;
  getInput: () => string;
  setManualErrorLine: (lineNumber: number) => void;
}

/**
 * EDI Editor Hook
 * Manages state and logic for the EDI editor
 */
export const useEdiEditor = ({ 
  onDecode, 
  onInputChange,
  error = "",
  setError
}: IUseEdiEditorProps): IUseEdiEditorResult => {
  const [input, setInput] = useState("");
  const [errorLines, setErrorLines] = useState<number[]>([]);
  const [manualErrorLine, setManualErrorLine] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [lines, setLines] = useState<string[]>([]);

  // Calculate line height and update lines
  useEffect(() => {
    if (textareaRef.current) {
      // Create a temporary element to calculate line height
      const temp = document.createElement('div');
      temp.style.visibility = 'hidden';
      temp.style.position = 'absolute';
      temp.style.whiteSpace = 'pre-wrap';
      temp.style.font = window.getComputedStyle(textareaRef.current).font;
      temp.style.width = textareaRef.current.clientWidth + 'px';
      temp.textContent = 'A';
      document.body.appendChild(temp);
      
      const height = temp.offsetHeight;
      document.body.removeChild(temp);
      
      setLineHeight(height);
    }

    // Update lines array
    setLines(input.split('\n'));
  }, [input]);

  // Extract error line numbers from error message and consider manual error line
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
        lines.forEach((line, index) => {
          if (line.trim() === '') {
            newErrorLines.add(index);
          }
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
    } else {
      // Clear manual error line when error is cleared
      setManualErrorLine(null);
    }

    // Convert to array and sort
    setErrorLines(Array.from(newErrorLines).sort((a, b) => a - b));
  }, [error, lines, manualErrorLine]);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Only clear error message when input is not empty
    if (newValue.trim() !== '' && error === 'Please enter EDI content before decoding') {
      if (setError) setError("");
    }
    
    if (onInputChange) onInputChange();
    
    // Clear manual error line when input changes
    setManualErrorLine(null);
  };

  const handleDecode = () => {
    if (setError) setError("");
    onDecode(input);
  };

  const handleClear = () => {
    setInput("");
    setErrorLines([]);
    setManualErrorLine(null);
    if (setError) setError("");
  };

  const getInput = () => input;

  // Callback to set manual error line
  const setLineError = useCallback((lineNumber: number) => {
    setManualErrorLine(lineNumber);
  }, []);

  return {
    input,
    errorLines,
    lines,
    textareaRef,
    handleChange,
    handleDecode,
    handleClear,
    getInput,
    setManualErrorLine: setLineError
  };
}; 