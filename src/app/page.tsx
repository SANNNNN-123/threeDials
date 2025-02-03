'use client';

import React, { useState } from 'react';
import RotaryDial from './components/dial/rotation';

export default function DialPage() {
  const [dialValue, setDialValue] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-16">
        <RotaryDial 
          size={300} 
          onChange={(value) => setDialValue(value)}
        />
        
        <div className="space-y-8">
          {/* Button Controls */}
          <div className="flex gap-4 justify-center">
            <button className="w-16 h-16 bg-white rounded-lg shadow-md text-2xl text-gray-400 hover:bg-gray-50 transition-colors">
              —
            </button>
            <button className="w-16 h-16 bg-white rounded-lg shadow-md text-2xl text-gray-400 hover:bg-gray-50 transition-colors">
              —
            </button>
            <button className="w-16 h-16 bg-white rounded-lg shadow-md text-2xl text-gray-400 hover:bg-gray-50 transition-colors">
              —
            </button>
          </div>

          {/* Attempts and Timer */}
          <div className="text-center space-y-1">
            <div className="text-gray-500">Attempts: 2</div>
            <div className="font-mono">
              <span className="text-2xl">0:35.1</span>
              <span className="text-gray-400 ml-2">Best: 2:30.6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}