import type React from "react"
import { useRef, useEffect, useState } from "react"

interface ECGPulseProps {
  width: number
  height: number
  value: number
  targets?: number[]
}

interface SpikeEffect {
  position: number
  startTime: number
}

const ECGPulse: React.FC<ECGPulseProps> = ({ width, height, value, targets = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeSpikes, setActiveSpikes] = useState<SpikeEffect[]>([])
  const previousValue = useRef(value)

  useEffect(() => {
    // Check if current value matches any target
    targets.forEach(target => {
      // Check if we've just crossed this target value
      const previousDiff = Math.abs(previousValue.current - target)
      const currentDiff = Math.abs(value - target)
      
      if (currentDiff <= 1 && previousDiff > 1) {
        setActiveSpikes(prev => [
          ...prev.filter(spike => Math.abs(spike.position - target) > 1), // Remove any existing spike for this target
          { position: target, startTime: Date.now() }
        ])
      }
    })
    
    previousValue.current = value
  }, [value, targets])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    function generateSmoothPattern(length: number) {
      const pattern = []
      const baselineHeight = 50
      const segmentLength = 50
      
      for (let i = 0; i < length; i++) {
        const position = i % segmentLength
        
        if (position < 20) {
          pattern.push(baselineHeight + (Math.random() * 0.5 - 0.25))
        } else if (position < 23) {
          pattern.push(baselineHeight - 2)
        } else if (position < 25) {
          pattern.push(baselineHeight + 4)
        } else if (position < 27) {
          pattern.push(baselineHeight - 6)
        } else if (position < 35) {
          const tPosition = position - 27
          const tWave = Math.sin((tPosition / 8) * Math.PI) * 3
          pattern.push(baselineHeight + tWave)
        } else {
          pattern.push(baselineHeight + (Math.random() * 0.5 - 0.25))
        }
      }
      return pattern
    }

    const patternLength = Math.ceil(width / 1.5)
    let data = generateSmoothPattern(patternLength)

    function drawLine() {
      ctx!.clearRect(0, 0, width, height)
      
      // Draw the main ECG line with reduced opacity
      ctx!.beginPath()
      ctx!.strokeStyle = "rgba(0, 255, 0, 0.2)"
      ctx!.lineWidth = 2

      const step = width / (data.length - 1)
      const currentTime = Date.now()

      // Clean up expired spikes
      setActiveSpikes(prev => prev.filter(spike => currentTime - spike.startTime <= 500))

      for (let i = 0; i < data.length; i++) {
        const x = i * step
        let y = height - (data[i] - 15) * (height / 80)

        // Check each active spike
        for (const spike of activeSpikes) {
          const spikeIndex = Math.floor((spike.position / 100) * (data.length - 1))
          const spikeWidth = 5
          
          if (Math.abs(i - spikeIndex) <= spikeWidth) {
            const distanceFromSpike = Math.abs(i - spikeIndex)
            const timeFactor = Math.max(0, 1 - (currentTime - spike.startTime) / 500)
            const spikeIntensity = (1 - (distanceFromSpike / spikeWidth)) * timeFactor
            
            if (i === spikeIndex) {
              // Central spike
              y = height - (data[i] + 40 * timeFactor) * (height / 80)
            } else if (i === spikeIndex - 1) {
              // Q wave
              y = height - (data[i] - 20 * timeFactor) * (height / 80)
            } else if (i === spikeIndex + 1) {
              // S wave
              y = height - (data[i] - 30 * timeFactor) * (height / 80)
            } else {
              // Transitional points
              const baseY = height - (data[i] - 15) * (height / 80)
              y = baseY - (spikeIntensity * 20)
            }
          }
        }

        if (i === 0) {
          ctx!.moveTo(x, y)
        } else {
          ctx!.lineTo(x, y)
        }
      }
      ctx!.stroke()

      // Draw the moving dot with increased opacity
      const dotPosition = Math.floor((value / 100) * (data.length - 1))
      if (dotPosition >= 0 && dotPosition < data.length) {
        const dotX = dotPosition * step
        const dotY = height - (data[dotPosition] - 15) * (height / 80)
        
        // Check if there's an active spike at the current position
        const isAtSpike = activeSpikes.some(spike => 
          Math.abs(spike.position - value) <= 1 &&
          Date.now() - spike.startTime <= 500
        )
        
        // Determine dot size and glow based on spike effect
        const glowSize = isAtSpike ? 12 : 6
        const dotSize = isAtSpike ? 4 : 2
        
        // Draw dot glow with increased opacity
        const gradient = ctx!.createRadialGradient(dotX, dotY, 0, dotX, dotY, glowSize)
        gradient.addColorStop(0, isAtSpike ? "rgba(0, 255, 0, 1)" : "rgba(0, 255, 0, 0.8)")
        gradient.addColorStop(1, "rgba(0, 255, 0, 0)")
        
        ctx!.beginPath()
        ctx!.fillStyle = gradient
        ctx!.arc(dotX, dotY, glowSize, 0, Math.PI * 2)
        ctx!.fill()
        
        // Draw dot center with increased opacity
        ctx!.beginPath()
        ctx!.fillStyle = "#00ff00"
        ctx!.arc(dotX, dotY, dotSize, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    let lastTime = 0
    const FRAME_RATE = 60
    const FRAME_DURATION = 1000 / FRAME_RATE
    let accumulator = 0

    function animate(currentTime: number) {
      if (lastTime === 0) {
        lastTime = currentTime
      }

      const deltaTime = currentTime - lastTime
      accumulator += deltaTime

      while (accumulator >= FRAME_DURATION) {
        data = [...data.slice(1), data[0]]
        accumulator -= FRAME_DURATION
      }

      drawLine()
      lastTime = currentTime
      requestAnimationFrame(animate)
    }

    requestAnimationFrame((time) => animate(time))

    return () => {}
  }, [width, height, value, activeSpikes])

  return <canvas ref={canvasRef} />
}

export default ECGPulse