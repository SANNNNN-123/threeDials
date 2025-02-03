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
      {/* New outer background circle */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.1, // Slightly larger than the main dial
          height: size * 1.1,
          backgroundColor: '#1a1a1a',
          zIndex: -1, // Place it behind everything
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
      />

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
            width: size * 1.04,
            height: size * 1.04,
            background: 'linear-gradient(to bottom, #4a4a4a, #2a2a2a)'
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
                isMainMarker ? 'h-3' : isFiveMarker ? 'h-3' : 'h-2'
              }`}
              style={{
                left: '50%',
                top: size * 0.005,
                width: isMainMarker ? '2px' : '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: `translateX(-50%) rotate(${angle}deg)`,
                transformOrigin: `50% ${(size * 0.55) - (size * 0.06)}px`,
              }}
            />
          );
        })}

        {/* Numbers */}
        {Array.from({ length: 10 }, (_, i) => {
          const number = (i * 10) % 100;
          const angle = i * (360 / 10) + (number === 0 ? 0 : 2); // Only add offset for non-zero numbers
          const textRotation = (number / 10) * 36; // Each number rotates 36 degrees (360° / 10 numbers)
          
          return (
            <div
              key={`number-${i}`}
              className="absolute font-medium"
              style={{
                left: '50%',
                top: '50%',
                color: 'white',
                fontSize: `${size * 0.072}px`,
                transform: `
                  translate(-50%, -50%) 
                  rotate(${angle}deg) 
                  translateY(-${size * 0.41}px) 
                  rotate(${-angle + textRotation}deg)
                `,
                transformOrigin: 'center center'
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
          border: '2px solid #333',
          zIndex: 2
        }}
      >
        <div className="text-5xl text-white">
          {currentNumber}
        </div>
      </div>

      {/* Red marker overlay */}
      <div 
        className="absolute w-1 h-5"
        style={{
          left: '50%',
          top: size * (-0.01),
          backgroundColor: '#ff3333',
          transform: 'translateX(-50%)',
          zIndex: 50
        }}
      />
    </div>
  );
};

export default RotaryDial;