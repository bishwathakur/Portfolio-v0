"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Check } from "lucide-react"

export function ResumeDownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)

    // Create a link element
    const link = document.createElement("a")
    link.href = "/resume/bishwa-thakur-resume.pdf"
    link.download = "Bishwa-Thakur-Resume.pdf"

    // Append to the document
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)

    // Show success state
    setTimeout(() => {
      setIsDownloading(false)
      setIsDownloaded(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsDownloaded(false)
      }, 3000)
    }, 1000)
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      className={`relative transition-all duration-300 ${
        isDownloaded
          ? "bg-green-900/20 text-green-400 border-green-500/30"
          : "bg-black/50 hover:bg-black/70 text-white border-white/30"
      }`}
    >
      {isDownloading ? (
        <>
          <span className="animate-pulse">Downloading...</span>
        </>
      ) : isDownloaded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Downloaded
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 mr-2" />
          Download Resume (PDF)
        </>
      )}
    </Button>
  )
}
