'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeaderboardEntry {
  name: string
  time: number
  completedAt: number
  country?: string
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/game')
      const data = await res.json()
      setEntries(data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div 
      className="min-h-screen w-full max-w-md mx-auto relative pt-16 text-white"
      style={{
        background: '#181818',
        backgroundImage: `linear-gradient(to top, #1d1d1d, #131313)`
      }}
    >
      <nav className="fixed top-0 w-full max-w-md mx-auto left-0 right-0 h-10 flex items-center px-2">
        <Link 
          href="/"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="text-white/60 hover:text-white">← Back</span>
        </Link>
      </nav>

      <div className="px-4 py-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-duepuntozero-pro-bold text-center mb-8">Leaderboard</h1>

          <div className="space-y-[2px]">
            {entries.length === 0 ? (
              <div className="text-white/60 text-center py-8">
                No scores yet. Be the first!
              </div>
            ) : (
              entries.map((entry, index) => (
                <div 
                  key={entry.completedAt}
                  className="flex items-center justify-between bg-neutral-800/80 px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono text-white/40 w-8">{index + 1}</span>
                    <div>
                      <div className="font-bold text-lg">{entry.name}</div>
                      <div className="text-sm text-white/40">
                        {entry.country || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xl">
                    {formatTime(entry.time)}p
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 