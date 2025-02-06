import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const HowToPlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-xl max-w-[280px] w-full border border-white/10 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-duepuntozero-pro-bold text-white">How to Play</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-white/60 hover:text-white" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-white/80 font-duepuntozero-pro-light">
            Spin the dial to find three number combinations
          </p>

          <div className="flex justify-center gap-1">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-1">
                <span className="text-xl font-duepuntozero-pro-bold text-white">3</span>
              </div>
              <span className="text-xs text-white/80 text-center">Correct</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mb-1">
                <span className="text-xl font-duepuntozero-pro-bold text-white">6</span>
              </div>
              <span className="text-xs text-white/80 text-center">Wrong</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center mb-1">
                <span className="text-xl font-duepuntozero-pro-bold text-white">8</span>
              </div>
              <span className="text-xs text-white/80 text-center">No code</span>
            </div>
          </div>

          <p className="text-white/60 text-sm font-duepuntozero-pro-light italic">
            Hint: Watch the ECG pulse spikes
          </p>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setIsVisible(false)}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-duepuntozero-pro-bold py-3 px-4 rounded-lg transition-colors"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;