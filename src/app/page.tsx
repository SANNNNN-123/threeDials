"use client"

import { useState } from "react"
import Rotation from "./components/dial/rotation"
import Graph from "./components/dial/graph"

export default function DialPage() {
  const [value, setValue] = useState(0)

  const handleRotation = (newValue: number) => {
    setValue(newValue)
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
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
      <div className="flex flex-col items-center space-y-16">
        <Rotation onChange={handleRotation} />

        {/* Added margin and increased height for the graph */}
        <div className="my-8">
          <Graph value={value} />
        </div>

        <div className="space-y-8">
          {/* Button Controls */}
          {/* <div className="flex gap-4 justify-center">
            <button className="w-16 h-16 bg-white rounded-lg shadow-md text-2xl text-gray-400 hover:bg-gray-50 transition-colors">
              —
            </button>
            <button className="w-16 h-16 bg-white rounded-lg shadow-md text-2xl text-gray-400 hover:bg-gray-50 transition-colors">
              —
            </button>
            <button className="w-16 h-16 bg-white rounded-lg shadow-md text-2xl text-gray-400 hover:bg-gray-50 transition-colors">
              —
            </button>
          </div> */}

          {/* Attempts and Timer */}
          <div className="text-center space-y-1">
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

