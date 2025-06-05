// components/play-video.tsx
import React, { useState } from "react"
import { Loader2 } from "lucide-react" // Import a loading spinner icon

type PlayVideoProps = {
  videoId: string
  startTime?: number
}

export function PlayVideo({ videoId, startTime }: PlayVideoProps) {
  const [isLoading, setIsLoading] = useState(true) // State to manage loading status

  if (!videoId) {
    return (
      <p className="text-red-500">
        Error: No video ID provided. Please provide a YouTube video ID.
      </p>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${
    startTime ? `&start=${startTime}` : ""
  }`

  const handleIframeLoad = () => {
    setIsLoading(false) // Set loading to false when iframe content has loaded
  }

  return (
    <div className="flex flex-col items-center justify-center my-4">
      {isLoading && (
        <div className="flex items-center justify-center h-[315px] w-[560px] md:h-[500px] md:w-[900px] bg-gray-900 rounded-lg text-white">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading video...</p>
        </div>
      )}

      {/* The iframe is always in the DOM, but its visibility is controlled */}
      <iframe
        
        width="900"
        height="500"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className={`rounded-lg shadow-lg ${isLoading ? "hidden" : "block"}`} // Hide if loading
        onLoad={handleIframeLoad} // Call handler when iframe loads
      ></iframe>
    </div>
  )
}