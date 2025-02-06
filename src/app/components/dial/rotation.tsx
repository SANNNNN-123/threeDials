'use client';

import React, { useState, useRef, useEffect } from 'react';
import useSound from 'use-sound';
// const sound = '/sound/DialSFX.mp3';  // Path relative to public folder

const SNAP_THRESHOLD = 0.1; // Seconds before snapping
const SNAP_ANGLE = 360 / 99; // Angle between each marker
const TOTAL_NUMBERS = 99; // Total numbers on the dial
const VIBRATION_PATTERN = [5]; // Single short vibration



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
  const lastMoveTime = useRef(Date.now());
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalRotation = useRef(0); // Track total rotation including multiple turns
  const [isShaking, setIsShaking] = useState(false);
  const vibrateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Comment out sound related code
  /*
  const sound = '/sound/DialSFX.mp3';
  const [playDialSound] = useSound(sound, {
    volume: 0.5,
    sprite: {
      turning: [500, 550]
    },
    playbackRate: 1.5,
    interrupt: true,
    preload: true
  });
  const [hasInteracted, setHasInteracted] = useState(false);
  const prevNumber = useRef(currentNumber);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  */





  const getNumberFromRotation = (rot: number) => {
    // Normalize rotation to positive value
    const normalizedRotation = ((rot % 360) + 360) % 360;
    // Calculate number based on rotation (reversed direction)
    const number = Math.round((normalizedRotation / 360) * TOTAL_NUMBERS);
    return (TOTAL_NUMBERS - number) % TOTAL_NUMBERS;
  };

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

  const snapToNearestMarker = () => {
    const currentRotation = totalRotation.current;
    const currentPositiveRotation = ((currentRotation % 360) + 360) % 360;
    
    // Find the nearest marker
    const nearestMarkerIndex = Math.round(currentPositiveRotation / SNAP_ANGLE);
    const nearestMarkerAngle = nearestMarkerIndex * SNAP_ANGLE;
    
    // Calculate both clockwise and counterclockwise distances
    let deltaClockwise = nearestMarkerAngle - currentPositiveRotation;
    if (deltaClockwise > 180) deltaClockwise -= 360;
    if (deltaClockwise < -180) deltaClockwise += 360;
    
    // Apply the delta to the total rotation
    const newTotalRotation = currentRotation + deltaClockwise;
    
    totalRotation.current = newTotalRotation;
    setRotation(newTotalRotation);

    // Calculate and set the new number
    const newNumber = getNumberFromRotation(newTotalRotation);
    if (newNumber !== currentNumber) {
      setCurrentNumber(newNumber);
      onChange(newNumber);
    }
  };

  const handleFirstInteraction = () => {
    // Comment out sound related code
    /*
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    */
  };

  const startSound = () => {
    // Comment out sound related code
    /*
    playDialSound({ id: 'turning' });
    soundIntervalRef.current = setInterval(() => {
      playDialSound({ id: 'turning' });
    }, 0);
    */
  };

  const stopSound = () => {
    // Comment out sound related code
    /*
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
    */
  };

  const vibrate = () => {
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(VIBRATION_PATTERN);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    lastAngle.current = getAngleFromMouse(e.nativeEvent);
    lastMoveTime.current = Date.now();
    
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
    }

    handleFirstInteraction();
    // startSound();  // Comment this out
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    
    e.preventDefault();
    lastMoveTime.current = Date.now();
    
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
    }
    
    const currentAngle = getAngleFromMouse(e);
    let delta = currentAngle - lastAngle.current;
    
    // Handle angle wrapping
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    totalRotation.current += delta;
    setRotation(totalRotation.current);
    
    // Update number based on new rotation
    const newNumber = getNumberFromRotation(totalRotation.current);
    if (newNumber !== currentNumber) {
      setCurrentNumber(newNumber);
      onChange(newNumber);
    }

    // Vibrate on movement
    vibrate();
    
    lastAngle.current = currentAngle;

    snapTimeoutRef.current = setTimeout(() => {
      if (Date.now() - lastMoveTime.current >= SNAP_THRESHOLD * 1000) {
        snapToNearestMarker();
      }
    }, SNAP_THRESHOLD * 1000);
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      snapToNearestMarker();
      // stopSound();  // Comment this out
    }
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

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []);

  // Remove or comment out sound cleanup effect
  /*
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);
  */

  // Clean up timeout
  useEffect(() => {
    return () => {
      if (vibrateTimeoutRef.current) {
        clearTimeout(vibrateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative touch-none" style={{ width: size, height: size }}>
      

      {/* Rotating group containing middle circle and numbers */}
      <div 
        ref={dialRef}
        className={`absolute inset-0 cursor-pointer rounded-full ${isShaking ? 'animate-shake' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: isDragging.current ? 'none' : 'transform 0.2s ease-out',
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
                  translateY(-${size * 0.39}px) 
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
            transform: 'translateY(-5px)',  
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
  const [value, setValue] = useState(0);

  const handleRotation = (newValue: number) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div>
      <RotaryDial value={value} onChange={handleRotation} />
    </div>
  );
}