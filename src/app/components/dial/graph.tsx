import React from 'react'

interface GraphProps {
    width?: number
    height?: number
    value?: number  // Current dial value
  }
  
  export default function Graph({ width = 300, height = 200, value = 0 }: GraphProps) {
    const numbers = Array.from({ length: 11 }, (_, i) => i * 10); // [0, 10, 20, ..., 100]
    const horizontalLines = 11
    const verticalLines = numbers.length
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Handle scroll when value changes
    React.useEffect(() => {
      if (containerRef.current) {
        const scrollAmount = (value / 10) * 100 // Each section is 100px wide
        containerRef.current.scrollLeft = scrollAmount
      }
    }, [value])
  
    return (
        <div
        ref={containerRef}
        className="relative overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          width,
          height: height + 48,
        }}
      >
        {/* Grid Container */}
        <div 
          className="absolute bg-black border-2 border-white"
          style={{
            top: '24px',
            bottom: '24px',
            left: '8px',
            width: `${(numbers.length - 1) * 100}px`, // Full scrollable width
            minWidth: '100px', // Width for one section (0-10)
          }}
        >
          {/* Horizontal grid lines */}
          {Array.from({ length: horizontalLines }).map((_, i) => (
            <div
              key={`h-${i}`}
              className={`absolute w-full ${i % 5 === 0 ? 'border-t-2' : 'border-t'} border-white`}
              style={{
                top: `${(i * 100) / (horizontalLines - 1)}%`,
                opacity: i % 5 === 0 ? 1 : 0.2,
              }}
            />
          ))}
  
          {/* Vertical grid lines */}
          {Array.from({ length: verticalLines * 5 - 4 }).map((_, i) => {
            const isMainLine = i % 5 === 0;  // Lines at 0, 10, 20, etc
            const isSecondaryLine = i % 5 === 1 || i % 5 === 3;  // Lines at 2, 4, 6, 8, etc
            return (
              <div
                key={`v-${i}`}
                className={`absolute h-full ${
                  isMainLine ? 'border-l-2' : isSecondaryLine ? 'border-l border-l-[1.5px]' : 'border-l'
                } border-white`}
                style={{
                  left: `${(i * 20) / (verticalLines - 1)}%`,
                  opacity: isMainLine ? 1 : isSecondaryLine ? 0.4 : 0.2,
                }}
              />
            );
          })}
        </div>
  
        {/* Numbers Container - Update to match grid container width */}
        <div 
          className="absolute inset-y-0" 
          style={{ 
            left: '8px',
            width: `${(numbers.length - 1) * 100}px`,
            minWidth: '100px',
          }}
        >
          {/* Top numbers */}
          <div className="absolute top-0 left-0 right-0 flex justify-between text-white text-sm font-duepuntozero-pro-light font-bold">
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
  
  