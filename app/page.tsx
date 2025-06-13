"use client"

import { useEffect, useState } from "react"
import Terminal from "@/components/terminal"
import BootSequence from "@/components/boot-sequence"
import { CRTToggle } from "@/components/crt-toggle"
import { TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [booting, setBooting] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
		<main className="min-h-screen bg-white relative overflow-hidden dark:bg-gray-950">
			{/* Background Image */}
			<div
				className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
				style={{
					backgroundImage:
						"url(https://res.cloudinary.com/dmgwucocs/image/upload/v1744863466/wallpaper_twn0qt.webp)",
					backgroundPosition: "center 40%",
				}}
				aria-hidden="true"
			>
				<div className="absolute inset-0 bg-black/40" />
			</div>

			<div className="fixed top-4 left-4 md:top-4 md:right-4 md:left-auto z-50">
				<CRTToggle />
			</div>

			<div className="container mx-auto px-4 py-8 h-screen flex flex-col relative z-10">
				<AnimatePresence mode="wait">
					{booting ? (
						<BootSequence key="boot" />
					) : (
						<AnimatePresence mode="wait" initial={false}>
							{showTerminal ? (
								<motion.div
									key="terminal"
									initial={{scale: 0.95, opacity: 0}}
									animate={{scale: 1, opacity: 1}}
									exit={{scale: 0.9, opacity: 0}}
									transition={{duration: 0.2}}
									className="h-full"
								>
									<Terminal
										onClose={() => setShowTerminal(false)}
									/>
								</motion.div>
							) : (
								<motion.div
									key="button"
									className="flex items-center justify-center h-full"
									initial={{scale: 0.9, opacity: 0}}
									animate={{scale: 1, opacity: 1}}
									exit={{scale: 0.95, opacity: 0}}
									transition={{duration: 0.2}}
								>
									<Button
										variant="outline"
										size="lg"
										onClick={() => {
											setShowTerminal(true);
										}}
										// className="group bg-[#300A24] hover:bg-[#3F0C2C] text-white border-[#4C0C35] relative overflow-hidden transition-all duration-300 transform hover:scale-105"
										className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
									>
										<div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
										<div className="relative z-10 flex items-center space-x-3">
											<TerminalIcon className="h-6 w-6" />
											<span className="text-lg font-medium">
												Terminal
											</span>
										</div>
									</Button>
								</motion.div>
							)}
						</AnimatePresence>
					)}
				</AnimatePresence>
			</div>
		</main>
  );
}
