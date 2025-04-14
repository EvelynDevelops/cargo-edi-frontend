"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
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
    setManualErrorLine
  } = useEdiEditor({
    onDecode,
    onInputChange,
    error,
    setError
  });

  // Handler for when an error line is detected from log message
  const handleErrorLineDetected = (lineNumber: number) => {
    // Convert from 1-based to 0-based index
    setDetectedErrorLine(lineNumber - 1);
    // Set the error line in the editor
    setManualErrorLine(lineNumber - 1);
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
