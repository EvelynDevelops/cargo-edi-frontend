import React from 'react';

interface IErrorLineHighlighterProps {
  errorLines: number[];
  lineHeight: number;
  lines: string[];
}

/**
 * Error line highlighter component
 * Used to highlight error lines in the text editor
 */
const ErrorLineHighlighter: React.FC<IErrorLineHighlighterProps> = ({ 
  errorLines, 
  lineHeight, 
  lines 
}) => {
  // Calculate positions of error lines
  const getErrorLinePositions = () => {
    if (errorLines.length === 0 || !lines.length) return [];

    return errorLines.map(lineNum => {
      if (lineNum >= lines.length) return null;
      const lineHeight = 21;
      const topPadding = 12; 
      // Calculate position considering textarea padding
      const topPosition = lineNum * lineHeight + topPadding; 

      return {
        top: `${topPosition}px`,
        height: '21px' // Fixed line height
      };
    }).filter(Boolean);
  };

  const errorLinePositions = getErrorLinePositions();

  return (
    <div className="absolute left-0 top-0 w-full pointer-events-none">
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
  );
};

export default ErrorLineHighlighter; 