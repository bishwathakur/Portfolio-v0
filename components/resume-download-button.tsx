"use client"

import { useState, type MouseEvent } from "react"
import { Check, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const resumeUrl = "https://drive.google.com/file/d/1jlkcbSHcLUYGJ_huUc0ge-GvyLs6MaLA/view?usp=sharing"

export function ResumeViewButton() {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "fallback">("idle")

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (state === "fallback") return
    if (state !== "idle") {
      event.preventDefault()
      return
    }

    event.preventDefault()
    setState("loading")

    window.setTimeout(() => {
      setState("ready")
      window.setTimeout(() => {
        // Open after the feedback is visible, without focusing a blank tab early.
        let tab: Window | null = null
        try {
          tab = window.open("", "_blank")
          if (!tab) {
            setState("fallback")
            return
          }
          tab.opener = null
          tab.location.replace(resumeUrl)
          setState("idle")
        } catch {
          tab?.close()
          setState("fallback")
        }
      }, 500)
    }, 180)
  }

  return (
    <div>
      <Button
        asChild
        variant="outline"
        className={state === "ready"
          ? "bg-green-900/20 text-green-400 border-green-500/30"
          : "bg-black/50 hover:bg-black/70 text-white border-white/30"}
      >
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
          ) : state === "ready" ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          )}
          <span aria-live="polite">{state === "loading" ? "Opening Resume…" : "View Resume"}</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Button>
      {state === "fallback" && (
        <p className="mt-2 text-sm" role="status">
          New tab not available? <a href={resumeUrl} className="underline">Open Resume in this tab</a>.
        </p>
      )}
    </div>
  )
}
