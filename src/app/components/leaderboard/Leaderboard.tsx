import { useState } from 'react'
import Link from 'next/link'

interface LeaderboardProps {
  isOpen: boolean
  onClose: () => void
  currentTime?: number
  currentAttempts?: number
  sessionId?: string
}

export default function Leaderboard({ 
  isOpen, 
  onClose, 
  currentTime,
  currentAttempts,
  sessionId 
}: LeaderboardProps) {
  const [playerName, setPlayerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim() || !sessionId) return

    setIsSubmitting(true)
    try {
      await fetch('/api/game', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          sessionId,
          time: currentTime
        })
      })
      onClose()
    } catch (error) {
      console.error('Failed to submit score:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const formatTime = (seconds: number = 0) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 rounded-xl w-full max-w-[320px] p-5">
        <h2 className="text-2xl text-white font-duepuntozero-pro-bold mb-4">
          Congratulations!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm block mb-2">Enter your name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-white"
              placeholder="Your name"
              maxLength={20}
              required
            />
          </div>
          <div className="text-white/60 text-sm">
            Your time: {formatTime(currentTime)}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-lg py-2 text-sm transition-colors disabled:opacity-50"
            >
              Submit Score
            </button>
            <Link
              href="/leaderboard"
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm transition-colors text-center"
            >
              View Leaderboard
            </Link>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
} 