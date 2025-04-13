import { useState, useEffect, useRef } from 'react';

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

  // Extract error line numbers from error message
  useEffect(() => {
    if (error) {
      const newErrorLines: number[] = [];
      
      // Check for empty line errors
      if (error.includes("Empty lines are not allowed")) {
        // Find all empty lines
        lines.forEach((line, index) => {
          if (line.trim() === '') {
            newErrorLines.push(index);
          }
        });
      }

      // Check for errors with line numbers
      const errorMatches = error.matchAll(/Line (\d+):/g);
      for (const match of errorMatches) {
        if (match[1]) {
          newErrorLines.push(parseInt(match[1], 10) - 1); // Convert to 0-based index
        }
      }

      // Check for specific error types
      if (error.includes("Invalid RFF format")) {
        // Find all RFF lines
        lines.forEach((line, index) => {
          if (line.startsWith('RFF+')) {
            newErrorLines.push(index);
          }
        });
      }

      if (error.includes("Invalid cargo type")) {
        // Find all PAC+++ lines
        lines.forEach((line, index) => {
          if (line.startsWith('PAC+++')) {
            newErrorLines.push(index);
          }
        });
      }

      if (error.includes("package count")) {
        // Find all PAC+number+1' lines
        lines.forEach((line, index) => {
          if (line.match(/^PAC\+\d+\+1'/)) {
            newErrorLines.push(index);
          }
        });
      }

      // Remove duplicates and sort error line numbers
      setErrorLines([...new Set(newErrorLines)].sort((a, b) => a - b));
    } else {
      setErrorLines([]);
    }
  }, [error, lines]);

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
  };

  const handleDecode = () => {
    if (setError) setError("");
    onDecode(input);
  };

  const handleClear = () => {
    setInput("");
    setErrorLines([]);
    if (setError) setError("");
  };

  const getInput = () => input;

  return {
    input,
    errorLines,
    lines,
    textareaRef,
    handleChange,
    handleDecode,
    handleClear,
    getInput
  };
}; 