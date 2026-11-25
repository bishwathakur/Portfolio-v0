"use client"

import { AsciiPortraitCanvas } from "./ascii-portrait-canvas"

export function AsciiPortraitComparison({compact = false}: {compact?: boolean}) {
  // Using fixed values as requested
  const contrast = 1.4
  const brightness = 0.7

  return (
    <div className="space-y-4">
      <AsciiPortraitCanvas width={compact ? 52 : 100} height={compact ? 62 : 120} contrast={contrast} brightness={brightness} />
      <div className="text-center text-xs text-gray-500 mt-2 dark:text-gray-400">ASCII Art Portrait</div>
    </div>
  )
}
