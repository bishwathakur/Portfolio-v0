"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { TerminalIcon, User, Briefcase, Code, Mail, GraduationCap, Award, Shield, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AboutSection } from "@/components/about-section"
import { EducationSection } from "@/components/education-section"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { CertificationsSection } from "@/components/certifications-section"
import { ContactSection } from "@/components/contact-section"
import { ImageAsciiLogo } from "@/components/image-ascii-logo"
import { ResumeDownloadButton } from "@/components/resume-download-button"
import { motion, AnimatePresence } from "framer-motion"

type Command = {
  input: string
  output: React.ReactNode
  timestamp: Date
}

type Props = {
  onClose: () => void
}

export default function Terminal({ onClose }: Props) {
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<Command[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Use useCallback to memoize the scrollToBottom function
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    // Focus input on mount and when clicking anywhere in the terminal
    inputRef.current?.focus()

    const handleClick = () => {
      inputRef.current?.focus()
    }

    document.addEventListener("click", handleClick)

    // Add welcome message
    setCommandHistory([
      {
        input: "welcome",
        output: (
          <div className="space-y-2">
            <ImageAsciiLogo />
            <p className="font-mono text-white">
              Welcome to Bishwa Thakur's portfolio! Type help to see available commands.
            </p>
          </div>
        ),
        timestamp: new Date(),
      },
    ])

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [commandHistory, currentSection, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const command = input.trim()
    let output: React.ReactNode

    // Process command
    switch (true) {
      case command.startsWith("rev "):
        const text = command.substring(4).replace(/['"]/g, "")
        output = <p className="text-[#00FF41]">{text.split('').reverse().join('')}</p>
        setCurrentSection(null)
        break

      case command === "welcome":
        output = (
          ImageAsciiLogo()
        )
        setCurrentSection(null)
        break

      case command === "echo \"bishwa thakur\"" ||
           command === "echo 'bishwa thakur'" ||
           command === "echo bishwa thakur":
        output = <p className="text-[#00FF41]">BISHWA THAKUR</p>
        setCurrentSection(null)
        break

      case command === "whoami":
        output = <p className="text-[#00FF41]">bishwathakur</p>
        setCurrentSection(null)
        break

      case command === "pwd":
        output = <p className="text-[#00FF41]">/home/bishwathakur/portfolio</p>
        setCurrentSection(null)
        break

      case command === "ls":
        output = (
          <div className="text-[#00FF41]">
            <span>about</span>{"   "}
            <span>education</span>{"   "}
            <span>skills</span>{"   "}
            <span>experience</span>{"   "}
            <span>projects</span>{"   "}
            <span>certifications</span>{"   "}
            <span>contact</span>
          </div>
        )
        setCurrentSection(null)
        break

      case command === "help":
        output = (
          <div className="space-y-2 text-white">
            <p className="font-bold">Available commands:</p>
            <ul className="space-y-1">
              <li>
                <span className="text-white font-bold">welcome</span> - Show welcome message with Unix commands
              </li>
              <li>
                <span className="text-white font-bold">about</span> - Learn about Bishwa
              </li>
              <li>
                <span className="text-white font-bold">education</span> - View educational background
              </li>
              <li>
                <span className="text-white font-bold">skills</span> - See technical skills
              </li>
              <li>
                <span className="text-white font-bold">experience</span> - View work experience
              </li>
              <li>
                <span className="text-white font-bold">projects</span> - View projects
              </li>
              <li>
                <span className="text-white font-bold">certifications</span> - View certifications and competitions
              </li>
              <li>
                <span className="text-white font-bold">contact</span> - Get contact information
              </li>
              <li>
                <span className="text-white font-bold">resume</span> - Download my resume
              </li>
              <li>
                <span className="text-white font-bold">clear</span> - Clear the terminal
              </li>
              <li>
                <span className="text-white font-bold">help</span> - Show this help message
              </li>
              <li>
                <span className="text-white font-bold">echo</span> - Print text to the terminal
              </li>
              <li>
                <span className="text-white font-bold">whoami</span> - Display the current user
              </li>
              <li>
                <span className="text-white font-bold">pwd</span> - Print the current working directory
              </li>
              <li>
                <span className="text-white font-bold">ls</span> - List available sections
              </li>
              <li>
                <span className="text-white font-bold">exit</span> - Close the terminal
              </li>
              {/* <li>
                <span className="text-white font-bold">fortune</span> - Display a random fortune
              </li>
              <li>
                <span className="text-white font-bold">cowsay</span> - Display a cow saying hello
              </li>
              <li>
                <span className="text-white font-bold">matrix</span> - Simulate the Matrix effect
              </li>
              <li>
                <span className="text-white font-bold">sudo</span> - Display a humorous message
              </li>
              <li>
                <span className="text-white font-bold">yes</span> - Display repeated yes
              </li>
              <li>
                <span className="text-white font-bold">rev</span> - Reverse the input text
              </li>
              <li>
                <span className="text-white font-bold">date</span> - Display a humorous date message
              </li>
              <li>
                <span className="text-white font-bold">rm -rf /</span> - Display a humorous message
              </li>
              <li>
                <span className="text-white font-bold">weather</span> - Display a humorous weather message
              </li>
              <li>
                <span className="text-white font-bold">motd</span> - Display a message of the day
              </li> */}
            </ul>
          </div>
        )
        setCurrentSection(null)
        break

      case command === "about":
        output = <AboutSection />
        setCurrentSection("about")
        break

      case command === "education":
        output = <EducationSection />
        setCurrentSection("education")
        break

      case command === "skills":
        output = <SkillsSection />
        setCurrentSection("skills")
        break

      case command === "experience":
        output = <ExperienceSection />
        setCurrentSection("experience")
        break

      case command === "projects":
        output = <ProjectsSection />
        setCurrentSection("projects")
        break

      case command === "certifications":
        output = <CertificationsSection />
        setCurrentSection("certifications")
        break

      case command === "contact":
        output = <ContactSection />
        setCurrentSection("contact")
        break

      case command === "resume":
        output = (
          <div className="space-y-4 text-white">
            <p>Download my resume:</p>
            <div className="flex justify-start">
              <ResumeDownloadButton />
            </div>
          </div>
        )
        setCurrentSection(null)
        break

      case command === "fortune":
        output = <p className="text-[#00FF41]">"The only way to do great work is to love what you do. - Steve Jobs"</p>
        setCurrentSection(null)
        break

      case command === "cowsay":
        output = (
          <pre className="text-[#00FF41]">
            {`
  _______
 < Hello! >
  -------
         \   ^__^
          \  (oo)\_______
             (__)
                 ||----w |
                 ||     ||
            `}
          </pre>
        )
        setCurrentSection(null)
        break

      case command === "matrix":
        output = (
          <div className="matrix-effect">
            <style jsx>{`
              .matrix-effect {
                position: relative;
                height: 100%;
                overflow: hidden;
                background: black;
              }
              .matrix-column {
                position: absolute;
                top: 0;
                animation: fall 3s linear infinite;
                color: #00ff41;
                font-family: monospace;
                font-size: 14px;
              }
              @keyframes fall {
                0% {
                  transform: translateY(-100%);
                }
                100% {
                  transform: translateY(100%);
                }
              }
            `}</style>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="matrix-column"
                style={{ left: `${i * 5}%`, animationDelay: `${Math.random() * 2}s` }}
              >
                {Array.from({ length: 20 }).map(() =>
                  String.fromCharCode(0x30a0 + Math.random() * 96)
                )}
              </div>
            ))}
          </div>
        )
        setCurrentSection(null)
        break

      case command === "sudo":
        output = <p className="text-[#00FF41]">"You have no power here!"</p>
        setCurrentSection(null)
        break

      case command === "yes":
        output = <p className="text-[#00FF41]">yes yes yes yes yes...</p>
        setCurrentSection(null)
        break

      case command === "date":
        output = <p className="text-[#00FF41]">"It's always coding o'clock!"</p>
        setCurrentSection(null)
        break

      case command === "rm -rf":
        output = <p className="text-[#00FF41]">"Nice try, but I won't let you destroy the universe."</p>
        setCurrentSection(null)
        break

      case command === "weather":
        output = <p className="text-[#00FF41]">"It's always night (like dark mode I like)."</p>
        setCurrentSection(null)
        break

      case command === "motd":
        output = <p className="text-[#00FF41]">"Did you know? The first computer bug was an actual moth."</p>
        setCurrentSection(null)
        break

      case command === "clear":
        setCommandHistory([])
        setCurrentSection(null)
        setInput("")
        return

      case command === "exit":
        onClose()
        return

      default:
        if (command.startsWith("echo ")) {
          const text = command.substring(5).replace(/['"]/g, "")
          output = <p className="text-[#00FF41]">{text.toUpperCase()}</p>
          setCurrentSection(null)
        } else {
          output = (
            <p className="text-white">
              Command not found: {command}. Type <span className="text-white font-bold">help</span> to see available commands.
            </p>
          )
          setCurrentSection(null)
        }
    }

    // Add command to history
    setCommandHistory((prev) => [
      ...prev,
      {
        input: command,
        output,
        timestamp: new Date(),
      },
    ])

    // Reset input and history index
    setInput("")
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle up/down arrows for command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex].input)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex].input)
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  if (!isVisible) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsVisible(true)}
          className="bg-black/50 hover:bg-black/70 text-white border-white/30 rounded-md p-2"
        >
          <TerminalIcon className="h-6 w-6" />
          <span className="ml-2">Terminal</span>
        </Button>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="terminal"
        className="flex flex-col h-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-black border border-gray-200 border-white/30 rounded-t-md p-2 flex items-center justify-between dark:border-gray-800">
          <div className="flex items-center">
            <TerminalIcon className="h-4 w-4 text-white mr-2" />
            <span className="text-sm font-mono text-white">
              bishwa@portfolio ~ {currentSection ? `/${currentSection}` : ""}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 hover:bg-white/10"
          >
            <span className="text-white text-lg">&times;</span>
          </Button>
        </div>

        <div ref={terminalRef} className="flex-1 bg-black border-x border-white/30 p-4 overflow-y-auto font-mono text-sm">
          {commandHistory.map((cmd, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center text-white/70">
                <span className="text-white mr-2">$</span>
                <span>{cmd.input}</span>
              </div>
              <div className="mt-1 ml-4">{cmd.output}</div>
            </div>
          ))}
        </div>

        <div className="bg-black border border-gray-200 border-white/30 rounded-b-md p-2 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-white mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none font-mono text-white"
              aria-label="Terminal input"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>

        <nav className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("about")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <User className="h-3 w-3 mr-1" />
            About
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("education")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <GraduationCap className="h-3 w-3 mr-1" />
            Education
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("skills")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <Shield className="h-3 w-3 mr-1" />
            Skills
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("experience")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Experience
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("projects")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <Code className="h-3 w-3 mr-1" />
            Projects
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("certifications")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <Award className="h-3 w-3 mr-1" />
            Certifications
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("contact")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <Mail className="h-3 w-3 mr-1" />
            Contact
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setInput("resume")
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
          >
            <FileDown className="h-3 w-3 mr-1" />
            Resume
          </Button>
        </nav>
      </motion.div>
    </AnimatePresence>
  )
}
