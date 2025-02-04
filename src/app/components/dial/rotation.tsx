'use client';

import React, { useState, useRef, useEffect } from 'react';


interface RotaryDialProps {
  size?: number;
  value?: number;
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
    // Prevent default touch behavior
    e.preventDefault();
    isDragging.current = true;
    lastAngle.current = getAngleFromMouse(e.nativeEvent);
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    
    // Prevent default touch behavior
    e.preventDefault();
    
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

  // Also add touchmove prevention at component level
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    // Add the event listener with passive: false to allow preventDefault()
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div className="relative touch-none" style={{ width: size, height: size }}>
      

      {/* Rotating group containing middle circle and numbers */}
      <div 
        ref={dialRef}
        className="absolute inset-0 cursor-pointer rounded-full"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.08) 100%),
            linear-gradient(to bottom, #4a4a4a, #2a2a2a),
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%)
          `,
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.15),
            inset 0 -2px 4px rgba(0,0,0,0.3)
          `,
          border: '1px solid rgba(0,0,0,0.3)'
        }}
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
                zIndex: 2,
                width: isMainMarker ? '4px' : '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: `translateX(-50%) rotate(${angle}deg)`,
                transformOrigin: `50% ${(size * 0.55) - (size * 0.06)}px`,
                borderRadius: '0 0 2px 2px',  // Changed to bottom corners
                clipPath: 'inset(0 0 -5px 0)'  // Ensure the rounded bottom is visible
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
            background: `
              linear-gradient(170deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%),
              linear-gradient(to bottom, #3a3a3a, #1a1a1a),
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)
            `,
            zIndex: 1,
            boxShadow: `
              inset 0 1px 1px rgba(255,255,255,0.1),
              inset 0 -2px 3px rgba(0,0,0,0.2),
              0 0 10px rgba(0,0,0,0.5)
            `
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
          background: 'linear-gradient(to bottom, #666666, #424645)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          fontFamily: 'DuePuntoZero Pro Bold, sans-serif',
          border: '2px solid #333',
          zIndex: 2
        }}
      >
        <div 
          className="text-6xl text-white flex items-center justify-center"
          style={{
            transform: 'translateY(-10px)',  
            height: '100%',                
            width: '100%',                 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          {currentNumber}
        </div>
        
        {/* Smaller circle below number */}
        <div 
          className="absolute rounded-full"
          style={{
            width: size * 0.53,
            height: size * 0.53,
            backgroundColor: '#262726',
            //background: 'linear-gradient(to bottom, #262726, #131313)',
            // boxShadow: `
            //   -2px 0 2px rgba(0,0,0,0.3),
            //   2px 0 2px rgba(0,0,0,0.3),
            //   0 -2px 2px rgba(0,0,0,0.3),  
            //   0 2px 2px rgba(0,0,0,0.3) 
            
            // `,
            zIndex: 2
          }}
        />

        {/* Gear teeth circle */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: size * 0.53,
            height: size * 0.53,
            zIndex: 1
          }}
        >
          {/* Gear teeth */}
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={`gear-${i}`}
              className="absolute w-[9px] bg-[#2a2a2a]"
              style={{
                height: '40px',
                top: '37.5%',
                left: '50%',
                transformOrigin: '0 50%',
                transform: `rotate(${i * 8}deg) translateX(${size * 0.268}px)`,
                boxShadow: '0 1px 1px rgba(0,0,0,0.5)',
                borderRadius: '1px',
                backgroundColor: '#262726'
                
              }}
            />
          ))}



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

interface RotationProps {
  onChange?: (value: number) => void;
}

export default function Rotation({ onChange }: RotationProps) {
  const [value, setValue] = useState(0)

  const handleRotation = (newValue: number) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div>
      <RotaryDial value={value} onChange={handleRotation} />
    </div>
  )
}