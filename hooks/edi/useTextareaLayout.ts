import { useEffect, useCallback } from 'react';

interface IUseTextareaLayoutProps {
  input: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

/**
 * Hook for handling textarea layout adjustments
 */
export function useTextareaLayout({
  input,
  textareaRef
}: IUseTextareaLayoutProps) {
  // Calculate line height and adjust textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Auto-adjust height to fit content
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [input, textareaRef]);

  // Manually trigger height adjustment (for external use)
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [textareaRef]);

  return {
    adjustHeight
  };
} 