import { useState } from 'react';
import { CargoFormData } from '@/types/cargo'; 
import { decodeEdi } from '@/services/edi';

interface UseEdiDecoderResult {
  decoded: CargoFormData[];
  loading: boolean;
  error: string;
  handleDecode: (input: string) => Promise<void>;
  setError: (error: string) => void;
  clearDecoded: () => void;
}

/**
 * Hook for handling EDI decoding operations
 */
export function useEdiDecoder(): UseEdiDecoderResult {
  const [decoded, setDecoded] = useState<CargoFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearDecoded = () => {
    setDecoded([]);
    setError("");
  };

  const handleDecode = async (input: string) => {
    if (!input || input.trim() === '') {
      setError('Please enter EDI content before decoding');
      return;
    }

    setLoading(true);
    setError("");
    try {
      const decodedItems = await decodeEdi(input);
      setDecoded(decodedItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    decoded,
    loading,
    error,
    handleDecode,
    setError,
    clearDecoded
  };
} 