"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import ErrorPanel from "./ErrorPanel";

type Props = {
  onDecode: (input: string) => void;
  onInputChange?: () => void;
  loading?: boolean;
  error?: string;
  setError?: (error: string) => void;
};

const EdiDecoder = forwardRef(function EdiDecoder({ 
  onDecode, 
  onInputChange,
  loading = false,
  error = "",
  setError
}: Props, ref) {
  const [input, setInput] = useState("");
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [isEmptyLineError, setIsEmptyLineError] = useState(false);

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

    // Update lines
    setLines(input.split('\n'));
  }, [input]);

  // Extract error line number from error message
  useEffect(() => {
    if (error) {
      // Check for empty line error
      if (error.includes("Empty line is not allowed")) {
        setIsEmptyLineError(true);
        // Find the first empty line
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '') {
            setErrorLine(i);
            return;
          }
        }
      } else {
        setIsEmptyLineError(false);
        // Check for line number in error message
        const lineMatch = error.match(/Line (\d+):/);
        if (lineMatch && lineMatch[1]) {
          const lineNum = parseInt(lineMatch[1], 10) - 1; // Convert to 0-based index
          setErrorLine(lineNum);
        } else {
          setErrorLine(null);
        }
      }
    } else {
      setIsEmptyLineError(false);
      setErrorLine(null);
    }
  }, [error, lines]);

  useImperativeHandle(ref, () => ({
    handleDecode: () => {
      if (setError) setError("");
      onDecode(input);
    },
    handleClear: () => {
      setInput("");
      setErrorLine(null);
      if (setError) setError("");
    },
    getInput: () => input
  }));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (onInputChange) onInputChange();
  };

  // Calculate the position of the error line
  const getErrorLinePosition = () => {
    if (errorLine === null || lineHeight === 0) return null;

    let topPosition = 12; // Initial padding
    let totalHeight = 0;
    
    // Calculate position considering all previous lines
    for (let i = 0; i < lines.length; i++) {
      const lineContent = lines[i];
      const isEmptyLine = lineContent.trim() === '';
      
      // Current line height calculation
      const currentLineHeight = isEmptyLine 
        ? Math.max(lineHeight, 21) // Slightly increased minimum height for empty lines
        : lineHeight;
      
      // If this is the error line, store the position and height
      if (i === errorLine) {
        return {
          top: `${topPosition}px`,
          height: `${currentLineHeight}px`
        };
      }
      
      // Add this line's height to the running total
      topPosition += currentLineHeight;
    }

    return null;
  };

  const errorLineStyle = getErrorLinePosition();

  // 创建一个带有行号的文本显示
  const renderTextWithLineNumbers = () => {
    return lines.map((line, index) => {
      const isErrorLine = index === errorLine;
      const isEmptyLine = line.trim() === '';
      
      return (
        <div 
          key={index} 
          className={`font-mono text-sm ${isErrorLine ? 'bg-red-100' : ''} ${isEmptyLine ? 'min-h-[1.5em]' : ''}`}
        >
          {line}
        </div>
      );
    });
  };

  return (
    <div className="bg-transparent rounded-lg mb-1 space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full min-h-135 border border-gray-200 p-3 text-sm font-mono rounded-md resize-none overflow-auto"
          placeholder="Paste existing EDI here to parse it"
          value={input}
          onChange={handleChange}
        />
        {errorLine !== null && errorLineStyle && (
          <div 
            className="absolute pointer-events-none bg-red-100 opacity-70"
            style={{
              top: errorLineStyle.top,
              left: '12px',
              right: '12px',
              height: errorLineStyle.height,
              zIndex: 10,
            }}
          />
        )}
      </div>
      <ErrorPanel error={error} />
    </div>
  );
});

export default EdiDecoder;
