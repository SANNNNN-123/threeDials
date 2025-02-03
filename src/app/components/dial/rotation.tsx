'use client';

import React, { useState, useRef, useEffect } from 'react';

interface RotaryDialProps {
  size?: number;
  onChange?: (value: number) => void;
}

const RotaryDial: React.FC<RotaryDialProps> = ({
  size = 300,
  onChange = () => {}
}) => {
  const [rotation, setRotation] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(0);
  const dialRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);

  useEffect(() => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const number = Math.round((normalizedRotation / 360) * 99);
    const finalNumber = (99 - number) % 99;
    setCurrentNumber(finalNumber);
    onChange(finalNumber);
  }, [rotation, onChange]);

  const getAngleFromMouse = (e: MouseEvent | TouchEvent) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    lastAngle.current = getAngleFromMouse(e.nativeEvent);
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;

    const currentAngle = getAngleFromMouse(e);
    const delta = currentAngle - lastAngle.current;
    
    setRotation(prev => prev + delta);
    lastAngle.current = currentAngle;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      

      {/* Rotating group containing middle circle and numbers */}
      <div 
        ref={dialRef}
        className="absolute inset-0 cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        
        {/* Middle rotating circle */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ 
            width: size * 1.0,
            height: size * 1.0,
            background: 'linear-gradient(to bottom, #4a4a4a, #2a2a2a)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />

        {/* Line markers on rotating circle */}
        {Array.from({ length: 99 }, (_, i) => {
          const angle = i * (360 / 99);
          const isMainMarker = i % 10 === 0;
          const isFiveMarker = i % 5 === 0;
          return (
            <div
              key={`marker-${i}`}
              className={`absolute origin-bottom ${
                isMainMarker ? 'h-4' : isFiveMarker ? 'h-3' : 'h-2'
              }`}
              style={{
                left: '50%',
                top: size * 0.005,
                width: isMainMarker ? '4px' : '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: `translateX(-50%) rotate(${angle}deg)`,
                transformOrigin: `50% ${(size * 0.55) - (size * 0.06)}px`,
              }}
            />
          );
        })}

        {/* Background circle around numbers */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: size * 0.90,
            height: size * 0.90,
            background: 'linear-gradient(to bottom, #3a3a3a, #1a1a1a)',
            zIndex: 1,  // Changed from 0 to -1 to place it behind
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}
        />

        {/* Numbers */}
        {Array.from({ length: 10 }, (_, i) => {
          const number = (i * 10) % 100;
          const angle = i * (360 / 10) + (number === 0 ? 0 : 2);
          const textRotation = (number / 10) * 36;
          
          return (
            <div
              key={`number-${i}`}
              className="absolute font-semibold"
              style={{
                left: '50%',
                top: '50%',
                color: 'white',
                fontSize: `${size * 0.088}px`,
                fontFamily: 'DuePuntoZero Pro Bold, sans-serif',
                transform: `
                  translate(-50%, -50%) 
                  rotate(${angle}deg) 
                  translateY(-${size * 0.41}px) 
                  rotate(${-angle + textRotation}deg)
                `,
                transformOrigin: 'center center',
                zIndex: 1
              }}
            >
              {number}
            </div>
          );
        })}
      </div>

      

      {/* Dark grey background circle */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          backgroundColor: '#1a1a1a',
          zIndex: 1,
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}
      />

      {/* Fixed inner circle with number */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          background: 'linear-gradient(to bottom, #666666, #444444)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          fontFamily: 'DuePuntoZero Pro Bold, sans-serif',
          border: '2px solid #333',
          zIndex: 2
        }}
      >
        <div 
          className="text-6xl text-white flex items-center justify-center"
          style={{
            transform: 'translateY(-10px)',  // Fine-tune vertical alignment
            height: '100%',                 // Ensure full height for centering
            width: '100%',                  // Ensure full width for centering
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {currentNumber}
        </div>
      </div>

      {/* Red marker overlay */}
      <div 
        className="absolute w-1 h-5"
        style={{
          left: '50%',
          top: size * (-0.00),
          backgroundColor: '#ff3333',
          transform: 'translateX(-50%)',
          zIndex: 50
        }}
      />
    </div>
  );
};

export default RotaryDial;