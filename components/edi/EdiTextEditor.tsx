"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import ErrorPanel from "./ErrorPanel";
import EdiTextArea from "./EdiTextArea";
import { useEdiEditor } from "@/hooks/useEdiEditor";

// Define interfaces
interface IEdiTextEditorProps {
  onDecode: (input: string) => void;
  onInputChange?: () => void;
  loading?: boolean;
  error?: string;
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
  setError
}, ref) {
  const {
    input,
    errorLines,
    lines,
    textareaRef,
    handleChange,
    handleDecode,
    handleClear,
    getInput
  } = useEdiEditor({
    onDecode,
    onInputChange,
    error,
    setError
  });

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
      <ErrorPanel error={error} />
    </div>
  );
});

export default EdiTextEditor;
