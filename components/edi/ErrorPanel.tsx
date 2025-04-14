"use client";

import React from "react";

interface IErrorPanelProps {
  error: string;
  logs?: string[];
}

/**
 * Process error message by removing redundant prefixes and formatting
 */
const processErrorMessage = (message: string): string => {
  // Remove quotes
  let cleanMessage = message.replace(/['"]/g, '');
  
  // Process line number errors
  const lineNumberMatch = cleanMessage.match(/^Line (\d+):/i);
  if (lineNumberMatch) {
    const lineNum = lineNumberMatch[1];
    const errorContent = cleanMessage.substring(cleanMessage.indexOf(':') + 1).trim();
    cleanMessage = `Line ${lineNum}: ${errorContent}`;
  }
  
  // Remove common error prefixes
  const prefixesToRemove = [
    'EDI decoding failed:',
    'Invalid EDI format:',
    'Validation error:',
    'Parse error:'
  ];
  
  prefixesToRemove.forEach(prefix => {
    cleanMessage = cleanMessage.replace(new RegExp(prefix, 'gi'), '').trim();
  });
  
  // Format specific error messages
  const errorMappings: { [key: string]: string } = {
    'Empty lines are not allowed': 'Empty lines are not allowed',
    'Invalid RFF format': 'Invalid RFF format',
    'Invalid cargo type': 'Invalid cargo type',
    'Invalid package count': 'Invalid package count',
    'Invalid MEA segment': 'Invalid MEA segment',
    'Invalid PCI segment': 'Invalid PCI segment',
    'Invalid GID segment': 'Invalid GID segment',
    'Invalid FTX segment': 'Invalid FTX segment'
  };

  Object.entries(errorMappings).forEach(([key, value]) => {
    cleanMessage = cleanMessage.replace(new RegExp(key, 'gi'), value);
  });
  
  return cleanMessage;
};

/**
 * Process log message by extracting the actual error content
 */
const processLogMessage = (log: string): string => {
  if (!log) return '';
  
  // 首先匹配日志后面的具体内容部分，例如: "RFF value contains invalid characters..."
  let match = log.match(/Line \d+: (.+)$/);
  if (match && match[1]) {
    // 移除可能的尾部括号和引号
    return match[1].trim().replace(/[\]']+\s*$/, '');
  }
  
  // 尝试匹配包含在方括号中的错误信息
  match = log.match(/\[\'(.+?)\'\]/);
  if (match && match[1]) {
    // 从括号内提取的内容中再尝试提取具体错误信息
    const innerMatch = match[1].match(/Line \d+: (.+)$/);
    if (innerMatch && innerMatch[1]) {
      return innerMatch[1].trim().replace(/[\]']+\s*$/, '');
    }
    return match[1].trim().replace(/[\]']+\s*$/, '');
  }
  
  // 尝试匹配通用的错误信息模式：去除时间戳、日志级别和文件信息
  match = log.match(/(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3} - \w+ - \[.+?\] - )(.+)$/);
  if (match && match[1]) {
    // 从匹配的错误消息中移除通用前缀
    let errorMsg = match[1].trim();
    const prefixes = ['EDI decoding failed:', 'Invalid EDI format:'];
    prefixes.forEach(prefix => {
      errorMsg = errorMsg.replace(new RegExp(prefix, 'gi'), '').trim();
    });
    
    // 如果是数组格式，提取数组内容
    const arrayMatch = errorMsg.match(/\[\'(.+?)\'\]/);
    if (arrayMatch && arrayMatch[1]) {
      const innerLineMatch = arrayMatch[1].match(/Line \d+: (.+)$/);
      if (innerLineMatch && innerLineMatch[1]) {
        return innerLineMatch[1].trim().replace(/[\]']+\s*$/, '');
      }
      return arrayMatch[1].trim().replace(/[\]']+\s*$/, '');
    }
    
    return errorMsg.replace(/[\]']+\s*$/, '');
  }
  
  // 处理特定格式的数组错误信息：例如 [Line 16: RFF value...]
  const arrayError = log.match(/\[\s*['"]?(Line \d+:.+?)['"]?\s*\]/i);
  if (arrayError && arrayError[1]) {
    const lineError = arrayError[1].match(/Line \d+:\s*(.+)$/i);
    if (lineError && lineError[1]) {
      return lineError[1].trim().replace(/[\]']+\s*$/, '');
    }
    return arrayError[1].trim().replace(/[\]']+\s*$/, '');
  }
  
  // 如果上述匹配都失败，返回处理后的原始日志
  let result = log;
  
  // 移除所有常见前缀
  const allPrefixes = [
    /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}\s*-\s*\w+\s*-\s*\[.*?\]\s*-\s*/,
    /EDI decoding failed:\s*/i,
    /Invalid EDI format:\s*/i,
    /Validation error:\s*/i,
    /Parse error:\s*/i
  ];
  
  allPrefixes.forEach(prefix => {
    result = result.replace(prefix, '');
  });
  
  // 处理方括号包裹的内容
  const bracketMatch = result.match(/\[\s*['"](.+?)['"]?\s*\]/);
  if (bracketMatch && bracketMatch[1]) {
    result = bracketMatch[1];
  }
  
  // 移除开头和结尾的引号、方括号和单引号
  result = result.replace(/^[\s\[\]'"]+|[\s\[\]'"]+$/g, '');
  
  return result;
};

/**
 * Parse EDI format error messages
 */
const parseEdiFormatError = (error: string): string[] => {
  // 移除所有错误前缀
  let cleanError = error
    .replace(/EDI decoding failed:\s*/g, '')
    .replace(/Invalid EDI format:\s*/g, '')
    .replace(/Validation error:\s*/g, '')
    .trim();

  // 处理数组风格的错误
  if (cleanError.startsWith('[') && cleanError.endsWith(']')) {
    return cleanError
      .slice(1, -1)
      .split(',')
      .map(msg => msg.trim())
      .map(processErrorMessage)
      .filter(Boolean);
  }
  
  // 处理分号分隔的错误
  if (cleanError.includes(';')) {
    return cleanError
      .split(';')
      .map(msg => msg.trim())
      .map(processErrorMessage)
      .filter(Boolean);
  }
  
  // 处理换行符分隔的错误
  if (cleanError.includes('\n')) {
    return cleanError
      .split('\n')
      .map(msg => msg.trim())
      .map(processErrorMessage)
      .filter(Boolean);
  }
  
  // 处理单一错误消息
  return [processErrorMessage(cleanError)];
};

/**
 * Error Panel Component
 */
const ErrorPanel: React.FC<IErrorPanelProps> = ({ error, logs = [] }) => {
  if (!error) return null;

  const errorMessages = parseEdiFormatError(error);
  const hasLogs = logs && logs.length > 0;
  
  // 获取日志的最后一行并处理
  let processedLogMessage = null;
  if (hasLogs) {
    const lastLogMessage = logs[logs.length - 1];
    processedLogMessage = processLogMessage(lastLogMessage);
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      {errorMessages.map((message, index) => (
        <div 
          key={index} 
          className="text-sm text-red-500 mb-1 last:mb-0 font-mono"
        >
          {message}
        </div>
      ))}
      
      {/* 显示处理后的日志信息 */}
      {processedLogMessage && (
        <div className="mt-3 border-t border-red-200 pt-2">
          <div className="text-xs bg-gray-100 p-2 rounded font-mono text-gray-800">
            {processedLogMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorPanel; 