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

  // Check required lines for each cargo item
  let currentCargoIndex = 1;
  let i = 0;
  
  while (i < lines.length) {
    // Check LIN+ line
    const expectedLin = `LIN+${currentCargoIndex}+I'`;
    if (!lines[i] || !lines[i].startsWith(`LIN+${currentCargoIndex}+I`)) {
      return `Line ${i + 1}: Invalid line format. Expected Line Identifier (${expectedLin}).`;
    }
    i++;

    // Check PAC+++ line
    if (i >= lines.length || !lines[i].startsWith('PAC+++')) {
      return `Line ${i + 1}: Expected PAC+++<cargo_type>:67:95'`;
    }
    i++;

    // Check PAC+ line
    if (i >= lines.length || !lines[i].startsWith('PAC+')) {
      return `Line ${i + 1}: Expected PAC+<number>+1'`;
    }
    i++;

    // Check optional PCI+1' and RFF+ combinations
    while (i < lines.length && lines[i].startsWith('PCI+1')) {
      i++;
      if (i >= lines.length || !lines[i].startsWith('RFF+')) {
        return `Line ${i}: When PCI+1' is present, it must be followed by an RFF line (RFF+AAQ:, RFF+MB:, or RFF+BH:)`;
      }
      i++;
    }

    // If there are more lines, check if it's a new cargo item
    if (i < lines.length && lines[i].startsWith('LIN+')) {
      currentCargoIndex++;
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