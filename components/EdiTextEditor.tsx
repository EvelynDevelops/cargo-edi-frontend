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
  const [errorLines, setErrorLines] = useState<number[]>([]);
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

  // Extract error line numbers from error message
  useEffect(() => {
    if (error) {
      const newErrorLines: number[] = [];
      const errorMatches = error.matchAll(/Line (\d+):/g);
      for (const match of errorMatches) {
        if (match[1]) {
          newErrorLines.push(parseInt(match[1], 10) - 1); // Convert to 0-based index
        }
      }
      setErrorLines(newErrorLines);
    } else {
      setErrorLines([]);
    }
  }, [error, lines]);

  useImperativeHandle(ref, () => ({
    handleDecode: () => {
      if (setError) setError("");
      onDecode(input);
    },
    handleClear: () => {
      setInput("");
      setErrorLines([]);
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
    const newValue = e.target.value;
    setInput(newValue);
    
    // 只有当输入不为空时，才清除错误提示
    if (newValue.trim() !== '' && error === 'Please enter EDI content before decoding') {
      if (setError) setError("");
    }
    
    if (onInputChange) onInputChange();
  };

  // Calculate the positions of error lines
  const getErrorLinePositions = () => {
    if (errorLines.length === 0 || lineHeight === 0 || !lines.length) return [];

    return errorLines.map(lineNum => {
      if (lineNum >= lines.length) return null;
      
      let topPosition = 12; // Initial padding
      
      // Calculate position considering all previous lines
      for (let i = 0; i < lineNum && i < lines.length; i++) {
        const lineContent = lines[i] || '';
        const isEmptyLine = lineContent.trim() === '';
        
        // Current line height calculation
        const currentLineHeight = isEmptyLine 
          ? Math.max(lineHeight, 21) // Slightly increased minimum height for empty lines
          : lineHeight;
        
        topPosition += currentLineHeight;
      }

      // Calculate current line height
      const currentLineContent = lines[lineNum] || '';
      const isEmptyLine = currentLineContent.trim() === '';
      const currentLineHeight = isEmptyLine 
        ? Math.max(lineHeight, 21)
        : lineHeight;

      return {
        top: `${topPosition}px`,
        height: `${currentLineHeight}px`
      };
    }).filter(Boolean); // Remove any null values
  };

  const errorLinePositions = getErrorLinePositions();

  // 创建一个带有行号的文本显示
  const renderTextWithLineNumbers = () => {
    return lines.map((line, index) => {
      const isErrorLine = errorLines.includes(index);
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
        {errorLinePositions.map((position, index) => (
          <div 
            key={index}
            className="absolute pointer-events-none bg-red-100 opacity-70"
            style={{
              top: position.top,
              left: '12px',
              right: '12px',
              height: position.height,
              zIndex: 10,
            }}
          />
        ))}
      </div>
      <ErrorPanel error={error} />
    </div>
  );
});

export default EdiDecoder;
