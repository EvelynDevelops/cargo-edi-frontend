import { useEdiEditorState } from './useEdiEditorState';
import { useEdiErrorDetection } from './useEdiErrorDetection';
import { useTextareaLayout } from './useTextareaLayout';
import { useState, useEffect, useCallback } from 'react';

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
  findEmptyLines: () => number[];
}

/**
 * EDI Editor Hook
 * Manages state and logic for the EDI editor
 */
export function useEdiEditor({
  onDecode,
  onInputChange,
  error = "",
  setError
}: IUseEdiEditorProps): IUseEdiEditorResult {
  // Editor state management
  const {
    input,
    lines,
    textareaRef,
    updateLines,
    handleChange,
    handleDecode,
    handleClear,
    getInput,
    findEmptyLines
  } = useEdiEditorState({
    onDecode,
    onInputChange,
    error,
    setError
  });

  // Track manual error line
  const [manualErrorLine, setManualErrorLine] = useState<number | null>(null);

  // Clear manual error line when error is cleared
  useEffect(() => {
    if (!error) {
      setManualErrorLine(null);
    }
  }, [error]);

  // Update lines when input changes
  useEffect(() => {
    updateLines();
  }, [input, updateLines]);

  // Error detection
  const { errorLines } = useEdiErrorDetection({
    lines,
    error,
    manualErrorLine,
    findEmptyLines
  });

  // Layout management
  useTextareaLayout({
    input,
    textareaRef
  });

  // Callback to set manual error line
  const setLineError = useCallback((lineNumber: number) => {
    setManualErrorLine(lineNumber);
  }, []);

  // Clear handler with additional error line clearing
  const handleClearWithReset = useCallback(() => {
    handleClear();
    setManualErrorLine(null);
  }, [handleClear]);

  return {
    input,
    errorLines,
    lines,
    textareaRef,
    handleChange,
    handleDecode,
    handleClear: handleClearWithReset,
    getInput,
    setManualErrorLine: setLineError,
    findEmptyLines
  };
} 