import { useState, useRef, useCallback } from 'react';

interface IUseEdiEditorStateProps {
  onDecode: (input: string) => void;
  onInputChange?: () => void;
  error?: string;
  setError?: (error: string) => void;
}

/**
 * Hook for managing basic state of an EDI editor
 */
export function useEdiEditorState({
  onDecode,
  onInputChange,
  error = "",
  setError
}: IUseEdiEditorStateProps) {
  // Core state
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update lines when input changes
  const updateLines = useCallback(() => {
    setLines(input.split('\n'));
  }, [input]);
  
  // Input change handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Only clear error message when input is not empty
    if (newValue.trim() !== '' && error === 'Please enter EDI content before decoding') {
      if (setError) setError("");
    }
    
    if (onInputChange) onInputChange();
  }, [error, onInputChange, setError]);

  // Decode handler
  const handleDecode = useCallback(() => {
    if (setError) setError("");
    onDecode(input);
  }, [input, onDecode, setError]);

  // Clear handler
  const handleClear = useCallback(() => {
    setInput("");
    if (setError) setError("");
  }, [setError]);

  // Get input value (used by parent components)
  const getInput = useCallback(() => input, [input]);

  // Find all empty lines in the input
  const findEmptyLines = useCallback((): number[] => {
    const emptyLineIndices: number[] = [];
    lines.forEach((line, index) => {
      // Consider both completely empty lines and lines with only whitespace
      if (line.trim() === '') {
        emptyLineIndices.push(index);
      }
    });
    return emptyLineIndices;
  }, [lines]);

  return {
    // State
    input,
    lines,
    textareaRef,
    
    // Actions
    setInput,
    updateLines,
    handleChange,
    handleDecode,
    handleClear,
    getInput,
    findEmptyLines
  };
} 