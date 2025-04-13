import React from 'react';
import ErrorLineHighlighter from './ErrorLineHighlighter';

interface IEdiTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  errorLines: number[];
  lines: string[];
}

/**
 * EDI text area component
 * Used for editing and displaying EDI content with error highlighting
 */
const EdiTextArea: React.FC<IEdiTextAreaProps> = ({ 
  value, 
  onChange, 
  textareaRef,
  errorLines,
  lines
}) => {
  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        className="w-full min-h-135 border border-gray-200 p-3 text-sm font-mono rounded-md resize-none overflow-auto leading-[21px]"
        placeholder="Paste existing EDI here to parse it"
        onChange={onChange}
        style={{ lineHeight: '21px' }}
      />
      <ErrorLineHighlighter 
        errorLines={errorLines} 
        lineHeight={21} 
        lines={lines} 
      />
    </div>
  );
};

export default EdiTextArea; 