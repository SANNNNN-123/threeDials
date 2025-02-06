import React, { useEffect, useState } from 'react';

interface ValueBoxProps {
  value: number | null;
  isCorrect: boolean;
  isWrongPosition: boolean;
  isResetting: boolean;
}

const ValueBox = ({ value, isCorrect, isWrongPosition, isResetting }: ValueBoxProps) => (
  <div 
    className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 ${
      isCorrect 
        ? 'bg-green-600 border-green-500'
        : isWrongPosition
          ? 'bg-gray-700 border-gray-600'
          : 'border-gray-700'
    } ${isResetting ? 'animate-wrong-combo' : ''}`}
    style={{
      background: isCorrect 
        ? 'linear-gradient(145deg, #22c55e, #16a34a)'
        : isWrongPosition
          ? 'linear-gradient(145deg, #374151, #1f2937)'
          : 'linear-gradient(145deg, #1a1a1a, #222)',
      boxShadow: `
        inset 0 2px 4px ${isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)'},
        inset 0 -2px 4px rgba(0,0,0,0.3)
      `,
    }}
  >
    <style jsx>{`
      @keyframes wrongCombo {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-4px); }
        40%, 80% { transform: translateX(4px); }
      }
      
      .animate-wrong-combo {
        animation: wrongCombo 0.5s ease-in-out;
      }
    `}</style>
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
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Check if all boxes are filled
    const allFilled = values.every(value => value !== null);
    const allCorrect = values.every((value, index) => value === targets[index]);
    
    if (allFilled && !allCorrect) {
      setIsResetting(true);
      
      // Reset the animation state after it completes
      setTimeout(() => {
        setIsResetting(false);
      }, 500); // Match animation duration
    }
  }, [values, targets]);

  return (
    <div className="flex gap-4 justify-center">
      {values.map((value, index) => (
        <ValueBox 
          key={index} 
          value={value} 
          isCorrect={value !== null && value === targets[index]}
          isWrongPosition={value !== null && targets.includes(value) && value !== targets[index]}
          isResetting={isResetting}
        />
      ))}
    </div>
  );
};

export default ValueBoxes;