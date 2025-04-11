"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

type Props = {
  onDecode: (result: any[]) => void;
  onInputChange?: () => void;
};

// Define response types
interface ApiResponse {
  cargo_items?: any[];
  logs?: string[];
  error?: string;
  message?: string;
  detail?: {
    message?: string;
    logs?: string[];
  };
}

const EdiDecoder = forwardRef(function EdiDecoder({ onDecode, onInputChange }: Props, ref) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  // 计算行高
  useEffect(() => {
    if (textareaRef.current) {
      // 创建一个临时元素来计算行高
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
  }, []);

  /**
   * Formats error messages to be more user-friendly and extracts error line number
   * @param errorMsg The original error message
   * @returns A formatted, user-friendly error message
   */
  const formatErrorMessage = (errorMsg: string): string => {
    // Reset error line
    setErrorLine(null);
    
    // Handle "Failed to parse line" errors
    if (errorMsg.includes("Failed to parse line:")) {
      const lineMatch = errorMsg.match(/Failed to parse line: (.*)/);
      if (lineMatch && lineMatch[1]) {
        const line = lineMatch[1];
        
        // Try to find the line number in the input
        const lines = input.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(line)) {
            setErrorLine(i);
            break;
          }
        }
        
        return `Error in EDI format:\nThe line "${line}" contains invalid characters or format. Please check for special characters or incorrect formatting.`;
      }
    }
    
    // Handle "Invalid EDI format" errors with line numbers
    if (errorMsg.includes("Invalid EDI format")) {
      const lineMatch = errorMsg.match(/Line (\d+):/);
      if (lineMatch && lineMatch[1]) {
        const lineNum = parseInt(lineMatch[1], 10) - 1; // Convert to 0-based index
        setErrorLine(lineNum);
      }
      return "Error in EDI format:\nThe EDI message format is invalid. Please ensure it follows the correct structure.";
    }
    
    // Handle "EDI decoding failed" errors
    if (errorMsg.includes("EDI decoding failed")) {
      return "Error in EDI format:\nUnable to process the EDI message. Please check the format and try again.";
    }
    
    // Default case - return the original message
    return `Error in EDI format:\n${errorMsg}`;
  };

  /**
   * Handles the EDI message decoding process
   * Makes an API call to validate and decode the EDI message
   * Handles various error cases and formats error messages appropriately
   */
  const handleDecode = async () => {
    setLoading(true);
    setError("");
    setErrorLine(null);
    try {
      // Make API request to decode EDI message
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decode-edi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ edi: input }),
      });
      
      let responseText = await res.text();
      let responseData: ApiResponse;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        if (!res.ok) {
          // Handle validation errors with specific format
          if (responseText.includes("Invalid EDI format")) {
            const errorDetails = responseText.match(/\[(.*?)\]/g);
            if (errorDetails) {
              throw new Error(`EDI Format Error:\n${errorDetails.join('\n')}`);
            }
          }
          throw new Error(`Failed to parse EDI: ${responseText}`);
        }
      }
      
      if (!res.ok) {
        const errorMessage = responseData?.error || responseData?.message || responseData?.detail?.message || "Failed to decode EDI";
        // Check if the error detail contains logs and extract the last error message
        if (responseData?.detail?.logs && Array.isArray(responseData.detail.logs)) {
          const logs = responseData.detail.logs;
          const lastErrorLog = logs.filter(log => log.includes("ERROR")).pop();
          if (lastErrorLog) {
            // Extract the actual error message without timestamp and file info
            const errorMatch = lastErrorLog.match(/ERROR - .*? - (.*)/);
            if (errorMatch && errorMatch[1]) {
              throw new Error(errorMatch[1]);
            } else {
              throw new Error(lastErrorLog);
            }
          }
        }
        throw new Error(errorMessage);
      }
      
      if (responseData.cargo_items) {
        onDecode(responseData.cargo_items);
      }
    } catch (err: any) {
      console.error("Error decoding EDI:", err);
      setError(formatErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleDecode,
    handleClear: () => {
      setInput("");
      setErrorLine(null);
    }
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

  // 使用更可靠的方法来高亮显示错误行
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
        {errorLine !== null && lineHeight > 0 && (
          <div 
            className="absolute pointer-events-none bg-red-100 opacity-50"
            style={{
              top: `${errorLine * lineHeight + 12}px`, // 12px 是内边距
              left: '12px',
              right: '12px',
              height: `${lineHeight}px`,
            }}
          />
        )}
      </div>
      {/* Error message display with improved styling */}
      {error && (
        <div className="mt-2">
          <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
        </div>
      )}
    </div>
  );
});

export default EdiDecoder;
