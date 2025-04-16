"use client"

import { useEffect, useState } from "react"

const bootMessages = [
  "Initializing system...",
  "Loading kernel...",
  "Mounting file systems...",
  "Starting security services...",
  "Scanning for threats...",
  "Loading portfolio data...",
  "Initializing secure terminal interface...",
]

export default function BootSequence() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    if (currentMessageIndex < bootMessages.length) {
      const timer = setTimeout(() => {
        setCurrentMessageIndex((prev) => prev + 1)
      }, 400)

      return () => clearTimeout(timer)
    }
  }, [currentMessageIndex])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-2xl bg-black/70 p-8 rounded-md border border-gray-200 border-gray-900/30 font-mono text-gray-900 dark:border-gray-800 dark:border-gray-50/30 dark:text-gray-50">
        <div className="mb-6 text-center">
          <pre className="text-xs sm:text-sm md:text-base whitespace-pre overflow-x-auto">
            {`
██████╗ ██╗███████╗██╗  ██╗██╗    ██╗ █████╗
██╔══██╗██║██╔════╝██║  ██║██║    ██║██╔══██╗
██████╔╝██║███████╗███████║██║ █╗ ██║███████║
██╔══██╗██║╚════██║██╔══██║██║███╗██║██╔══██║
██████╔╝██║███████║██║  ██║╚███╔███╔╝██║  ██║
╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝
                                                                    
`}
          </pre>
        </div>

        <div className="space-y-2">
          {bootMessages.slice(0, currentMessageIndex).map((message, index) => (
            <div key={index} className="flex">
              <span className="text-gray-900 mr-2 dark:text-gray-50">&gt;</span>
              <span className="text-gray-950/90 dark:text-gray-50/90">{message}</span>
              {index === currentMessageIndex - 1 && index !== bootMessages.length - 1 && (
                <span className="ml-1 cursor-blink">_</span>
              )}
            </div>
          ))}

          {currentMessageIndex === bootMessages.length && (
            <div className="flex mt-4">
              <span className="text-gray-900 mr-2 dark:text-gray-50">&gt;</span>
              <span className="typing-animation text-gray-950/90 dark:text-gray-50/90">
                Boot sequence complete. Welcome to Bishwa's secure terminal.
              </span>
              <span className="cursor-blink">_</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
