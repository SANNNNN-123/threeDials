import { useRef, useEffect } from "react"
import ECGPulse from "./ECGPulse"

interface GraphProps {
  width?: number
  height?: number
  value?: number
  targets?: number[]
}

export default function Graph({ 
  width = 300, 
  height = 200, 
  value = 0,
  targets = [] 
}: GraphProps) {
  const numbers = Array.from({ length: 11 }, (_, i) => i * 10) // [0, 10, 20, ..., 100]
  const smallNumbers = Array.from({ length: 50 }, (_, i) => i * 2) // [0, 2, 4, ..., 98]
  const horizontalLines = 11
  const verticalLines = numbers.length
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = (value / 10) * 100
      containerRef.current.scrollLeft = scrollAmount
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{
        width,
        height: height + 48 + 20, // Added extra height for small numbers
      }}
    >
      {/* Small numbers at top and bottom */}
      {['top', 'bottom'].map((position) => (
        <div
          key={`small-numbers-${position}`}
          className="absolute z-10"
          style={{
            left: "8px",
            ...(position === 'top' 
              ? { top: "30px" }
              : { bottom: "25px" }),
            width: `${(numbers.length - 1) * 100}px`,
            minWidth: "100px",
          }}
        >
          <div className="absolute left-0 right-0 flex text-white text-xs font-duepuntozero-pro-light">
            {smallNumbers.map((num) => (
              <div
                key={`small-${num}-${position}`}
                className="absolute"
                style={{
                  left: `${(num / 100) * 100}%`,
                  transform: 'translateX(-50%)',
                  color: numbers.includes(num) ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Main Grid Container */}
      <div
        className="absolute bg-black border-2 border-white"
        style={{
          top: "44px", // Adjusted to make room for small numbers
          bottom: "24px",
          left: "8px",
          width: `${(numbers.length - 1) * 100}px`,
          minWidth: "100px",
        }}
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: horizontalLines }).map((_, i) => (
          <div
            key={`h-${i}`}
            className={`absolute w-full ${i % 5 === 0 ? "border-t-2" : "border-t"} border-white`}
            style={{
              top: `${(i * 100) / (horizontalLines - 1)}%`,
              opacity: i % 5 === 0 ? 1 : 0.2,
            }}
          />
        ))}

        {/* Vertical grid lines */}
        {Array.from({ length: verticalLines * 5 - 4 }).map((_, i) => {
          const isMainLine = i % 5 === 0
          const isSecondaryLine = i % 5 === 1 || i % 5 === 3
          return (
            <div
              key={`v-${i}`}
              className={`absolute h-full ${
                isMainLine ? "border-l-2" : isSecondaryLine ? "border-l border-l-[1.5px]" : "border-l"
              } border-white`}
              style={{
                left: `${(i * 20) / (verticalLines - 1)}%`,
                opacity: isMainLine ? 1 : isSecondaryLine ? 0.4 : 0.2,
              }}
            />
          )
        })}

        {/* ECG Pulse */}
        <div className="absolute inset-0">
          <ECGPulse 
            width={(numbers.length - 1) * 100} 
            height={height - 48} 
            value={value} 
            targets={targets}
          />
        </div>
      </div>

      {/* Main numbers Container */}
      <div
        className="absolute inset-y-0"
        style={{
          left: "8px",
          width: `${(numbers.length - 1) * 100}px`,
          minWidth: "100px",
        }}
      >
        {/* Top numbers (tens) */}
        <div className="absolute top-[24px] left-0 right-0 flex justify-between text-white text-sm font-duepuntozero-pro-light font-bold">
          {numbers.map((num) => (
            <span key={`top-${num}`}>{num === 100 ? 0 : num}</span>
          ))}
        </div>

        {/* Bottom numbers */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-white text-sm font-duepuntozero-pro-light font-bold">
          {numbers.map((num) => (
            <span key={`bottom-${num}`}>{num === 100 ? 0 : num}</span>
          ))}
        </div>
      </div>
    </div>
  )
}