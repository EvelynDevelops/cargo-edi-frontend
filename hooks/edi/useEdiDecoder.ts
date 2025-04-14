import { useState } from 'react';
import { ICargoFormData } from '@/types/cargo'; 
import { decodeEdi } from '@/services/api/edi';

interface EdiError extends Error {
  logs?: string[];
}

interface IUseEdiDecoderResult {  
  decoded: ICargoFormData[];
  loading: boolean;
  error: string;
  errorLogs: string[];
  handleDecode: (input: string) => Promise<void>;
  setError: (error: string) => void;
  clearDecoded: () => void;
}

/**
 * Check if EDI message is missing required lines
 */
const checkMissingLines = (edi: string): string | null => {
  const lines = edi.split('\n').filter(line => line.trim());
  
  // Check for minimum required lines
  if (lines.length < 3) {
    return "EDI message is missing required lines. Each cargo item needs at least 3 lines: LIN+, PAC+++, and PAC+ lines.";
  }

  // Check for required line patterns
  const hasLin = lines.some(line => line.trim().startsWith('LIN+'));
  const hasPacPlusPlus = lines.some(line => line.trim().startsWith('PAC+++'));
  const hasPacPlus = lines.some(line => line.trim().startsWith('PAC+'));

  if (!hasLin) return "EDI message is missing LIN+ line (cargo item identifier)";
  if (!hasPacPlusPlus) return "EDI message is missing PAC+++ line (cargo type)";
  if (!hasPacPlus) return "EDI message is missing PAC+ line (package count)";

  // Check for PCI+1' followed by RFF line
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].trim() === "PCI+1'") {
      const nextLine = lines[i + 1].trim();
      if (!nextLine.startsWith('RFF+')) {
        return "When PCI+1' is present, it must be followed by an RFF line (RFF+AAQ:, RFF+MB:, or RFF+BH:)";
      }
    }
  }

  return null;
};

/**
 * Hook for handling EDI decoding operations
 */
export function useEdiDecoder(): IUseEdiDecoderResult {
  const [decoded, setDecoded] = useState<ICargoFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  const clearDecoded = () => {
    setDecoded([]);
    setError("");
    setErrorLogs([]); 
  };

  const handleDecode = async (input: string) => {
    if (!input || input.trim() === '') {
      setError('Please enter EDI content before decoding');
      setErrorLogs([]); 
      return;
    }

    // Check for missing lines before making API call
    const missingLinesError = checkMissingLines(input);
    if (missingLinesError) {
      setError(missingLinesError);
      setErrorLogs([]);
      return;
    }

    setLoading(true);
    setError("");
    setErrorLogs([]); 
    try {
      const decodedItems = await decodeEdi(input);
      setDecoded(decodedItems);
    } catch (err: any) {
      setError(err.message);
      if (err.logs && Array.isArray(err.logs)) {
        setErrorLogs(err.logs);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    decoded,
    loading,
    error,
    errorLogs,
    handleDecode,
    setError,
    clearDecoded
  };
} 