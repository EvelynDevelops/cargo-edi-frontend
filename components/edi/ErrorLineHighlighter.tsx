import React from 'react';

interface ErrorLineHighlighterProps {
  errorLines: number[];
  lineHeight: number;
  lines: string[];
}

/**
 * Error line highlighter component
 * Used to highlight error lines in the text editor
 */
const ErrorLineHighlighter: React.FC<ErrorLineHighlighterProps> = ({ 
  errorLines, 
  lineHeight, 
  lines 
}) => {
  // Calculate positions of error lines
  const getErrorLinePositions = () => {
    if (errorLines.length === 0 || !lines.length) return [];

    return errorLines.map(lineNum => {
      if (lineNum >= lines.length) return null;
      
      // Calculate position considering textarea padding
      const topPosition = lineNum * 21 + 12; // Line height 21px, top padding 12px

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