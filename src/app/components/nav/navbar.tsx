import { Info, RefreshCw, Trophy } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface NavbarProps {
  onNewGame: () => void;
}

export default function Navbar({ onNewGame }: NavbarProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <nav className="fixed top-0 w-full max-w-md mx-auto left-0 right-0 h-18 flex items-center px-2">
      <div className="flex items-center justify-between w-full">
        <div className={`
          flex items-center 
          transition-all duration-300 ease-in-out
          ${showInfo 
            ? 'bg-neutral-800 backdrop-blur-xl border border-white/10 rounded-xl py-2 px-3 w-auto' 
            : 'bg-transparent border-none w-10 px-3 py-2'
          }
          overflow-hidden
        `}>
          <button
            className="p-1.5 rounded-full shrink-0 hover:bg-white/5 transition-colors"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="w-5 h-5 text-white/60 hover:text-white/100 transition-opacity" />
          </button>
          
          <div className={`
            whitespace-nowrap transition-opacity duration-300
            ${showInfo ? 'opacity-100' : 'opacity-0'}
          `}>
            <span className="text-white/60 text-sm font-duepuntozero-pro-light">
              Made by{' '}
              <a 
                href="https://github.com/SANNNNN-123" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-white hover:text-white/80 transition-colors"
              >
                Zuhair Aziz
              </a>
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link
            href="/leaderboard"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Trophy className="w-5 h-5 text-white/60 hover:text-white" />
          </Link>
          <button
            onClick={onNewGame}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-white/60 hover:text-white" />
          </button>
        </div>
      </div>
    </nav>
  )
}