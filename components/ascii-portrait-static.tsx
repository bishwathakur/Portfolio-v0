"use client"

import { useEffect, useRef } from "react"

export function AsciiPortraitStatic() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add a subtle animation effect
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Calculate rotation based on mouse position
      const rotateX = (y / rect.height - 0.5) * 5
      const rotateY = (x / rect.width - 0.5) * -5

      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      container.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="ascii-portrait-static-container flex justify-center my-4">
      <div
        ref={containerRef}
        className="border border-gray-900/30 rounded p-2 bg-black/80 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 max-w-[300px] dark:border-gray-50/30"
        style={{ transition: "transform 0.1s ease" }}
        aria-label="Static ASCII portrait with 3D effect"
      >
        <div className="relative overflow-hidden">
          <pre
            className="text-[4px] sm:text-[5px] md:text-[6px] font-mono"
            style={{ lineHeight: 0.8, letterSpacing: "-0.1em" }}
          >
            {/* Pre-processed ASCII art with color spans would go here */}
          </pre>
        </div>
      </div>
    </div>
  )
}
