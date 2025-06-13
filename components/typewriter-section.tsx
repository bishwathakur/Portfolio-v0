// Update components/typewriter-section.tsx to include an onComplete callback:

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TypewriterSectionProps {
  children: React.ReactNode
  startDelay?: number
  command?: string
  onComplete?: () => void // Add this prop
}

export function TypewriterSection({ 
  children, 
  startDelay = 500,
  command = "about_data.txt",
  onComplete // Add this
}: TypewriterSectionProps) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [showCommand, setShowCommand] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Step 1: Show initializing for 1 second
    const initTimer = setTimeout(() => {
      setIsInitializing(false)
      setShowCommand(true)
    }, startDelay)

    // Step 2: Show command after initializing
    const commandTimer = setTimeout(() => {
      setShowContent(true)
    }, startDelay + 800)

    // Step 3: Call onComplete after content is shown
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, startDelay + 1300) // Add extra 500ms for content fade-in

    return () => {
      clearTimeout(initTimer)
      clearTimeout(commandTimer)
      clearTimeout(completeTimer)
    }
  }, [startDelay, onComplete])

  return (
    <div className="font-mono">
      <AnimatePresence mode="wait">
        {/* Initializing phase */}
        {isInitializing && (
          <motion.div
            key="initializing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center text-[#00FF41] mb-3"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mr-2"
            >
              ▋
            </motion.span>
            <span className="text-sm">Initializing...</span>
          </motion.div>
        )}
        
        {/* Command phase */}
        {showCommand && !isInitializing && (
          <motion.div
            key="command"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#00FF41] text-sm mb-3 flex items-center"
          >
            <span className="mr-2">$</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="overflow-hidden whitespace-nowrap"
            >
              cat {command}
            </motion.span>
            {!showContent && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-1"
              >
                ▋
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content phase */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}