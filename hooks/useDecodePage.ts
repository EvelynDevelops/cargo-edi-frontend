import { useRef } from "react";
import { useEdiDecoder } from "@/hooks/edi/useEdiDecoder";
import { useClipboard } from "@/hooks/utils/useClipboard";
import { useFileDownload } from "@/hooks/utils/useFileDownload";

/**
 * Custom hook for handling Decode page business logic
 */
export function useDecodePage() {
  const decoderRef = useRef<{ 
    handleDecode: () => void; 
    handleClear: () => void; 
    getInput: () => string 
  }>(null);
  
  const { 
    decoded, 
    loading, 
    error, 
    errorLogs, 
    handleDecode, 
    setError, 
    clearDecoded 
  } = useEdiDecoder();
  
  const { copyToClipboard } = useClipboard(setError);
  const { downloadJson } = useFileDownload();

  const handleDownloadJson = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const itemCount = decoded.length;
    
    const filename = `decoded_${date}_${time}_${itemCount}items.json`;
    
    downloadJson(decoded, filename);
  };

  const handleClearAll = () => {
    if (decoderRef.current) {
      decoderRef.current.handleClear();
    }
    clearDecoded();
  };

  const handleInputChange = () => {
    clearDecoded();
  };

  const handleCopy = async () => {
    const text = JSON.stringify(decoded, null, 2);
    const success = await copyToClipboard(text);
    if (success) {
      setError("");
    }
  };

  const handleDecodeClick = () => {
    if (decoderRef.current) {
      decoderRef.current.handleDecode();
    }
  };

  return {
    // References
    decoderRef,
    
    // State
    decoded,
    loading,
    error,
    errorLogs,
    
    // API functions
    handleDecode,
    setError,
    
    // Action handlers
    handleDownloadJson,
    handleClearAll,
    handleInputChange,
    handleCopy,
    handleDecodeClick
  };
} 