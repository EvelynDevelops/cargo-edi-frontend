"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import ErrorPanel from "./ErrorPanel";
import EdiTextArea from "./EdiTextArea";
import { useEdiEditor } from "@/hooks/useEdiEditor";

// Define interfaces
interface IEdiTextEditorProps {
  onDecode: (input: string) => void;
  onInputChange?: () => void;
  loading?: boolean;
  error?: string;
  errorLogs?: string[];
  setError?: (error: string) => void;
}

interface IEdiTextEditorRef {
  handleDecode: () => void;
  handleClear: () => void;
  getInput: () => string;
}

/**
 * EDI Text Editor Component
 * Used for editing and parsing EDI content
 */
const EdiTextEditor = forwardRef<IEdiTextEditorRef, IEdiTextEditorProps>(function EdiTextEditor({ 
  onDecode, 
  onInputChange,
  loading = false,
  error = "",
  errorLogs = [],
  setError
}, ref) {
  // Manually track error lines for messages processed from logs
  const [detectedErrorLine, setDetectedErrorLine] = useState<number | null>(null);
  
  const {
    input,
    errorLines,
    lines,
    textareaRef,
    handleChange,
    handleDecode,
    handleClear,
    getInput,
    setManualErrorLine,
    findEmptyLines
  } = useEdiEditor({
    onDecode,
    onInputChange,
    error,
    setError
  });

  // Handler for when an error line is detected from log message
  const handleErrorLineDetected = (lineNumber: number, isEmptyLine?: boolean) => {
    if (lineNumber > 0) {
      // Convert from 1-based to 0-based index
      const zeroBasedLineNumber = lineNumber - 1;
      setDetectedErrorLine(zeroBasedLineNumber);
      // Set the error line in the editor
      setManualErrorLine(zeroBasedLineNumber);
    } else if (isEmptyLine) {
      // If we know it's an empty line error but don't know the line number,
      // find all empty lines in the input
      const emptyLines = findEmptyLines();
      if (emptyLines.length > 0) {
        // Highlight all empty lines
        emptyLines.forEach(lineNum => {
          setManualErrorLine(lineNum);
        });
        // For status tracking, set the first empty line as the detected error line
        if (emptyLines.length > 0) {
          setDetectedErrorLine(emptyLines[0]);
        }
      }
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleDecode,
    handleClear,
    getInput
  }));

  return (
    <div className="bg-transparent rounded-lg mb-1 space-y-2">
      <EdiTextArea 
        value={input}
        onChange={handleChange}
        textareaRef={textareaRef}
        errorLines={errorLines}
        lines={lines}
      />
      <ErrorPanel 
        error={error} 
        logs={errorLogs} 
        onErrorLineDetected={handleErrorLineDetected}
      />
    </div>
  );
});

export default EdiTextEditor;
