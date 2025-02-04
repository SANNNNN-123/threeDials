"use client"

import { useState, useEffect } from "react"
import Rotation from "./components/dial/rotation"
import Graph from "./components/dial/graph"
import Navbar from "./components/nav/navbar"

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

  // Initialize random targets
  useEffect(() => {
    setTargets(generateRandomTargets())
  }, [])

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
      <div className="flex flex-col items-center space-y-8 mt-8">
        <Rotation onChange={handleRotation} />

        <div className="w-full flex justify-center px-4">
          <Graph value={value} targets={targets} />
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-1">
            <div className="text-gray-500">Target Numbers: {targets.join(', ')}</div>
            <div className="text-gray-500">Attempts: 2</div>
            <div className="font-mono">
              <span className="text-2xl text-white">0:35.1</span>
              <span className="text-gray-400 ml-2">Best: 2:30.6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}