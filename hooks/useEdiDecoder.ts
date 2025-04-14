import { useState } from 'react';
import { ICargoFormData } from '@/types/cargo'; 
import { decodeEdi } from '@/services/api/edi';

// 添加自定义错误类型
interface EdiError extends Error {
  logs?: string[];
}

interface IUseEdiDecoderResult {  
  decoded: ICargoFormData[];
  loading: boolean;
  error: string;
  errorLogs: string[]; // 添加日志字段
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
  const [errorLogs, setErrorLogs] = useState<string[]>([]); // 添加日志状态

  const clearDecoded = () => {
    setDecoded([]);
    setError("");
    setErrorLogs([]); // 清除日志
  };

  const handleDecode = async (input: string) => {
    if (!input || input.trim() === '') {
      setError('Please enter EDI content before decoding');
      setErrorLogs([]); // 清除日志
      return;
    }

    setLoading(true);
    setError("");
    setErrorLogs([]); // 清除之前的日志
    try {
      const decodedItems = await decodeEdi(input);
      setDecoded(decodedItems);
    } catch (err: any) {
      setError(err.message);
      // 处理错误日志，如果存在
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
    errorLogs, // 返回日志
    handleDecode,
    setError,
    clearDecoded
  };
} 