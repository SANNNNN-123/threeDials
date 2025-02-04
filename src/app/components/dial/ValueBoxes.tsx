import React from 'react';

interface ValueBoxProps {
  value: number | null;
  isCorrect: boolean;
  isWrongPosition: boolean;
}

const ValueBox = ({ value, isCorrect, isWrongPosition }: ValueBoxProps) => (
  <div 
    className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
      isCorrect 
        ? 'bg-green-600 border-green-500'
        : isWrongPosition
          ? 'bg-gray-700 border-gray-600'
          : 'border-gray-700'
    }`}
    style={{
      background: isCorrect 
        ? 'linear-gradient(145deg, #22c55e, #16a34a)'
        : isWrongPosition
          ? 'linear-gradient(145deg, #374151, #1f2937)'
          : 'linear-gradient(145deg, #1a1a1a, #222)',
      boxShadow: `
        inset 0 2px 4px ${isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)'},
        inset 0 -2px 4px rgba(0,0,0,0.3)
      `
    }}
  >
    <span className="text-3xl font-duepuntozero-pro-bold text-white">
      {value ?? '-'}
    </span>
  </div>
);

interface ValueBoxesProps {
  values: (number | null)[];
  targets: number[];
}

const ValueBoxes = ({ values, targets }: ValueBoxesProps) => {
  return (
    <div className="flex gap-4 justify-center">
      {values.map((value, index) => (
        <ValueBox 
          key={index} 
          value={value} 
          isCorrect={value !== null && value === targets[index]}
          isWrongPosition={value !== null && targets.includes(value) && value !== targets[index]}
        />
      ))}
    </div>
  );
};

export default ValueBoxes;