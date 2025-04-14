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