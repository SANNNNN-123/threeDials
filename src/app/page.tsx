"use client"

import { useState, useEffect } from "react"
import Rotation from "./components/dial/rotation"
import Graph from "./components/dial/graph"
import Navbar from "./components/nav/navbar"
import ValueBoxes from "./components/dial/ValueBoxes"
import HowToPlay from "./components/Instructions/Steps"
import Leaderboard from './components/leaderboard/Leaderboard'

export default function DialPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [value, setValue] = useState(0)
  const [targets, setTargets] = useState<number[]>([])
  const [stoppedValues, setStoppedValues] = useState<(number | null)[]>([null, null, null])
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0)
  const [lastValue, setLastValue] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<string>("0:00:0")
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [finalTime, setFinalTime] = useState<number>(0)
  const [finalAttempts, setFinalAttempts] = useState<number>(0)

  // Initialize game session
  useEffect(() => {
    startNewGame()
  }, [])

  // Update the timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (startTime && !gameCompleted && currentBoxIndex < 3) {  // Add gameCompleted check
      intervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const deciseconds = Math.floor((now - startTime) / 100) % 10;
        setElapsedTime(`${minutes}:${seconds.toString().padStart(2, '0')}:${deciseconds}`);
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [startTime, currentBoxIndex, gameCompleted]); // Add gameCompleted to dependencies

  const startNewGame = async () => {
    try {
      const res = await fetch('/api/game', { method: 'POST' })
      const { sessionId, targets } = await res.json()
      setSessionId(sessionId)
      setTargets(targets)
      setStartTime(Date.now())
      setStoppedValues([null, null, null])
      setCurrentBoxIndex(0)
      setElapsedTime("0:00:0")
      setGameCompleted(false)
      setShowLeaderboard(false)
    } catch (error) {
      console.error('Failed to start new game:', error)
    }
  }

  
  // Handle dial movement detection
  useEffect(() => {
    if (value !== lastValue) {
      setIsMoving(true)
      setLastValue(value)
    } else if (isMoving) {
      const timer = setTimeout(async () => {
        setIsMoving(false)
        if (currentBoxIndex < 3 && sessionId) {
          // Record attempt in Redis
          const game = await fetch('/api/game', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              sessionId, 
              value,
              timeElapsed: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
            })
          }).then(res => res.json())

          // First update the stopped values
          const newValues = [...stoppedValues]
          newValues[currentBoxIndex] = value
          setStoppedValues(newValues)
          
          // Then check if all numbers are correct with the updated values
          const allCorrect = newValues.every((val, idx) => val === targets[idx])
          
          if (currentBoxIndex === 2 && allCorrect) {
            // Game completed - all three numbers are correct
            const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
            setFinalTime(timeElapsed)
            setFinalAttempts(game.attempts.length)
            setGameCompleted(true)
            setShowLeaderboard(true)
          } else if (currentBoxIndex < 2) {
            // Move to next number if not on last digit
            setCurrentBoxIndex(prev => prev + 1)
          }
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [value, lastValue, isMoving, currentBoxIndex, sessionId, startTime, targets, stoppedValues])

  const handleRotation = (newValue: number) => {
    setValue(newValue)
  }

  return (
    <div 
      className="min-h-screen w-full max-w-md mx-auto relative pt-16"
      style={{
        background: '#181818',
        backgroundImage: `
          linear-gradient(to top, #1d1d1d, #131313)
        `,
        boxShadow: `
          0 0.2em 0.1em 0.05em rgba(255, 255, 255, 0.1) inset,
          0 -0.2em 0.1em 0.05em rgba(0, 0, 0, 0.5) inset,
          0 0.5em 0.65em 0 rgba(0, 0, 0, 0.3)
        `
      }}
    >
      <Navbar onNewGame={startNewGame} />
      {showInstructions && <HowToPlay />}
      <div className="flex flex-col items-center space-y-1 mt-4">
        <Rotation onChange={handleRotation} />

        <div className="w-full flex justify-center px-4">
          <Graph value={value} targets={targets} />
        </div>

        <div className="mb-6">
          <ValueBoxes values={stoppedValues} targets={targets} />
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-1">
            <div className="text-gray-400">
                Generated Numbers: {targets.join(', ')}
            </div>
            <div className="font-mono">
              <span className="text-2xl text-white">{elapsedTime}</span>
            </div>
          </div>
        </div>
      </div>

      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        currentTime={gameCompleted ? finalTime : undefined}
        currentAttempts={gameCompleted ? finalAttempts : undefined}
        sessionId={sessionId ?? undefined}
      />
    </div>
  )
}