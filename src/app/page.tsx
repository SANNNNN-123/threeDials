"use client"

import { useState, useEffect } from "react"
import Rotation from "./components/dial/rotation"
import Graph from "./components/dial/graph"
import Navbar from "./components/nav/navbar"
import ValueBoxes from "./components/dial/ValueBoxes"
import HowToPlay from "./components/Instructions/Steps"

// Function to generate random unique numbers
const generateRandomTargets = () => {
  const numbers = new Set<number>()
  while (numbers.size < 3) {
    numbers.add(Math.floor(Math.random() * 91)) // 0-90
  }
  return Array.from(numbers)
}

export default function DialPage() {
  const [value, setValue] = useState(0)
  const [targets, setTargets] = useState<number[]>([])
  const [stoppedValues, setStoppedValues] = useState<(number | null)[]>([null, null, null])
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0)
  const [lastValue, setLastValue] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  // Initialize random targets
  useEffect(() => {
    setTargets(generateRandomTargets())
  }, [])

  // Reset function
  const resetGame = () => {
    setStoppedValues([null, null, null])
    setCurrentBoxIndex(0)
    setTargets(generateRandomTargets())
  }

  // Handle dial movement detection
  useEffect(() => {
    if (value !== lastValue) {
      setIsMoving(true)
      setLastValue(value)
    } else if (isMoving) {
      const timer = setTimeout(() => {
        setIsMoving(false)
        // Update the current box value when the dial stops
        if (currentBoxIndex < 3) {
          setStoppedValues(prev => {
            const newValues = [...prev]
            newValues[currentBoxIndex] = value
            return newValues
          })
          
          // Move to next box or reset if all boxes are filled
          const nextIndex = currentBoxIndex + 1
          if (nextIndex >= 3) {
            // Wait a bit before resetting to show the final state
            setTimeout(resetGame, 2000)
          } else {
            setCurrentBoxIndex(nextIndex)
          }
        }
      }, 1000) // Wait 1 second of no movement before considering it stopped

      return () => clearTimeout(timer)
    }
  }, [value, lastValue, isMoving, currentBoxIndex])

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
      <Navbar />
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
              <span className="text-2xl text-white">0:35:1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}