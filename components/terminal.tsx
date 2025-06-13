"use client";

import type React from "react";
import {useState, useEffect, useRef, useCallback} from "react";
import {
	TerminalIcon,
	User,
	Briefcase,
	Code,
	Mail,
	GraduationCap,
	Award,
	Shield,
	FileDown,
	Trash2,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {AboutSection} from "@/components/about-section";
import {EducationSection} from "@/components/education-section";
import {SkillsSection} from "@/components/skills-section";
import {ExperienceSection} from "@/components/experience-section";
import {ProjectsSection} from "@/components/projects-section";
import {CertificationsSection} from "@/components/certifications-section";
import {ContactSection} from "@/components/contact-section";
import {ImageAsciiLogo} from "@/components/image-ascii-logo";
import {ResumeDownloadButton} from "@/components/resume-download-button";
import {motion, AnimatePresence} from "framer-motion";
import {PlayVideo} from "./play-video";
import {TypewriterSection} from "./typewriter-section";

type Command = {
	input: string;
	output: React.ReactNode;
	timestamp: Date;
};

type Props = {
	onClose: () => void;
};

export default function Terminal({onClose}: Props) {
	const [input, setInput] = useState("");
	const [commandHistory, setCommandHistory] = useState<Command[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [currentSection, setCurrentSection] = useState<string | null>(null);
	const [isVisible, setIsVisible] = useState(true);
	const [availableBlogSlugs, setAvailableBlogSlugs] = useState<string[]>([]);
	const [showMobileCommands, setShowMobileCommands] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);

	// Use useCallback to memoize the scrollToBottom function
	const scrollToBottom = useCallback(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, []);

	useEffect(() => {
		// Focus input on mount and when clicking anywhere in the terminal
		inputRef.current?.focus();

		const handleClick = (e: MouseEvent) => {
			const target = e.target as Element;
			const isMobile = window.innerWidth < 768;

			// Check if clicking on mobile command elements
			const isMobileCommandPanel =
				target.closest("[data-mobile-commands]") ||
				target.classList.contains("mobile-commands-backdrop") ||
				target.closest("[data-mobile-toggle]");

			// Don't focus input if:
			// 1. On mobile and commands panel is open, OR
			// 2. Clicking on mobile command related elements
			if ((isMobile && showMobileCommands) || isMobileCommandPanel) {
				return;
			}

			inputRef.current?.focus();
		};

		document.addEventListener("click", handleClick);

		// Add welcome message
		setCommandHistory([
			{
				input: "welcome",
				output: (
					<div className="space-y-2">
						<ImageAsciiLogo />
						<div className="bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg p-4 mt-4">
							<p className="font-mono text-white text-center">
								🌟 Welcome to{" "}
								<span className="text-[#00FF41] font-bold">
									Bishwa Thakur's
								</span>{" "}
								interactive portfolio! 🌟
							</p>
							<p className="font-mono text-white/80 text-center text-sm mt-2">
								Navigate using commands or click the buttons
								below. Start with{" "}
								<code className="bg-black/50 px-1 rounded text-[#00FF41]">
									blog ls
								</code>{" "}
								to explore my writings!
							</p>

							{/* Add keyboard shortcuts note */}
							<div className="border-t border-[#00FF41]/20 mt-4 pt-3">
								<p className="font-mono text-[#00FF41]/70 text-center text-xs">
									💡 Pro tip: Use{" "}
									<span className="bg-black/50 px-1 rounded text-[#00FF41]">
										↑↓
									</span>{" "}
									for command history •
									<span className="bg-black/50 px-1 rounded text-[#00FF41]">
										Tab
									</span>{" "}
									for autocomplete or available commands
								</p>
							</div>
						</div>
					</div>
				),
				timestamp: new Date(),
			},
		]);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [showMobileCommands]);

	useEffect(() => {
		scrollToBottom();
	}, [commandHistory, currentSection, scrollToBottom]);

	// Fetch blog slugs for autocomplete
	const fetchBlogSlugs = useCallback(async () => {
		try {
			const response = await fetch("/api/blogs");
			if (response.ok) {
				const slugs = await response.json();
				setAvailableBlogSlugs(slugs);
			}
		} catch (error) {
			console.error(
				"Failed to fetch blog slugs for autocomplete:",
				error
			);
		}
	}, []);

	// Fetch blog slugs on component mount
	useEffect(() => {
		fetchBlogSlugs();
	}, [fetchBlogSlugs]);

	const handleSubmit = (e: React.FormEvent, directCommand?: string) => {
		e.preventDefault();

		const command = directCommand || input.trim().toLowerCase();
		if (!command) return;

		let output: React.ReactNode;

		// Process command
		switch (true) {
			case command.startsWith("rev "):
				const text = command.substring(4).replace(/['"]/g, "");
				output = (
					<p className="text-[#00FF41]">
						{text.split("").reverse().join("")}
					</p>
				);
				setCurrentSection(null);
				break;

			case command === "welcome":
				output = (
					<div className="space-y-2">
						<ImageAsciiLogo />
						<div className="bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg p-4 mt-4">
							<p className="font-mono text-white text-center">
								🌟 Welcome to{" "}
								<span className="text-[#00FF41] font-bold">
									Bishwa Thakur's
								</span>{" "}
								interactive portfolio! 🌟
							</p>
							<p className="font-mono text-white/80 text-center text-sm mt-2">
								Navigate using commands or click the buttons
								below. Start with{" "}
								<code className="bg-black/50 px-1 rounded text-[#00FF41]">
									blog ls
								</code>{" "}
								to explore my writings!
							</p>
							{/* Add keyboard shortcuts note */}
							<div className="border-t border-[#00FF41]/20 mt-4 pt-3">
								<p className="font-mono text-[#00FF41]/70 text-center text-xs">
									💡 Pro tip: Use{" "}
									<span className="bg-black/50 px-1 rounded text-[#00FF41]">
										↑↓
									</span>{" "}
									for command history •
									<span className="bg-black/50 px-1 rounded text-[#00FF41]">
										Tab
									</span>{" "}
									for autocomplete and available commands
								</p>
							</div>
						</div>
					</div>
				);
				setCurrentSection(null);
				break;

			case command === 'echo "bishwa thakur"' ||
				command === "echo 'bishwa thakur'" ||
				command === "echo bishwa thakur":
				output = <p className="text-[#00FF41]">BISHWA THAKUR</p>;
				setCurrentSection(null);
				break;

			case command === "whoami":
				output = <p className="text-[#00FF41]">bishwathakur</p>;
				setCurrentSection(null);
				break;

			case command === "pwd":
				output = (
					<p className="text-[#00FF41]">
						/home/bishwathakur/portfolio
					</p>
				);
				setCurrentSection(null);
				break;

			case command === "ls":
				output = (
					<div className="text-[#00FF41]">
						<span>about</span>
						{"   "}
						<span>education</span>
						{"   "}
						<span>skills</span>
						{"   "}
						<span>experience</span>
						{"   "}
						<span>projects</span>
						{"   "}
						<span>certifications</span>
						{"   "}
						<span>contact</span>
					</div>
				);
				setCurrentSection(null);
				break;

			case command === "help":
				output = (
					<div className="space-y-4 text-white font-mono">
						<div className="border-b border-[#00FF41]/30 pb-2">
							<p className="text-[#00FF41] font-bold text-lg">
								AVAILABLE COMMANDS
							</p>
						</div>

						{/* Portfolio Commands */}
						<div className="space-y-3">
							<p className="text-[#00FF41] font-bold uppercase tracking-wide">
								Portfolio Navigation:
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
								<div className="flex">
									<span className="text-white font-bold w-20">
										about
									</span>
									<span className="text-white/70">
										- Personal information
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-20">
										education
									</span>
									<span className="text-white/70">
										- Academic background
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-20">
										skills
									</span>
									<span className="text-white/70">
										- Technical expertise
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-20">
										experience
									</span>
									<span className="text-white/70">
										- Work history
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-20">
										projects
									</span>
									<span className="text-white/70">
										- Portfolio showcase
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-20">
										certifications
									</span>
									<span className="text-white/70">
										- Awards & certificates
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-20">
										contact
									</span>
									<span className="text-white/70">
										- Get in touch
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-20">
										resume
									</span>
									<span className="text-white/70">
										- Download CV
									</span>
								</div>
							</div>
						</div>

						{/* Blog Commands - Now matches Portfolio Navigation style */}
						<div className="space-y-3">
							<p className="text-[#00FF41] font-bold uppercase tracking-wide">
								Blog System:
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
								<div className="flex">
									<span className="text-[#00FF41] font-bold w-20">
										blog ls
									</span>
									<span className="text-[#00FF41]/70">
										- List all blog posts
									</span>
								</div>
								<div className="flex">
									<span className="text-[#00FF41] font-bold w-20">
										blog&lt;name&gt;
									</span>
									<span className="text-[#00FF41]/70">
										{" "}
										- Read specific post
									</span>
								</div>
							</div>
							{/* <div className="ml-4 mt-2 p-2 bg-black/30 rounded border-l-2 border-[#00FF41]/50">
                <p className="text-[#00FF41]/90 text-sm">
                  <span className="font-bold">Quick Start:</span> Try 'blog ls' then 'blog test'
                </p>
              </div> */}
						</div>

						{/* System Commands */}
						<div className="space-y-3">
							<p className="text-white/70 font-bold uppercase tracking-wide">
								System Commands:
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4 text-sm">
								<div className="flex">
									<span className="text-white font-bold w-16">
										clear
									</span>
									<span className="text-white/60">
										- Clear terminal
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-16">
										help
									</span>
									<span className="text-white/60">
										- Show this menu
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-16">
										whoami
									</span>
									<span className="text-white/60">
										- Current user
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-16">
										pwd
									</span>
									<span className="text-white/60">
										- Working directory
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-16">
										ls
									</span>
									<span className="text-white/60">
										- List sections
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-16">
										echo
									</span>
									<span className="text-white/60">
										- Print text
									</span>
								</div>
								<div className="flex">
									<span className="text-white font-bold w-16">
										exit
									</span>
									<span className="text-white/60">
										- Close terminal
									</span>
								</div>
							</div>
						</div>

						<div className="border-t border-[#00FF41]/20 pt-3 text-center">
							<p className="text-[#00FF41]/70 text-sm">
								Use arrow keys (↑↓) to navigate command history
								• Press Tab for autocomplete
							</p>
						</div>
					</div>
				);
				setCurrentSection(null);
				break;

			case command === "about":
				output = (
					<TypewriterSection
						command="about_data.txt"
						onComplete={() => {
							// Scroll to bottom after animation completes
							setTimeout(() => scrollToBottom(), 100);
						}}
					>
						<AboutSection />
					</TypewriterSection>
				);
				setCurrentSection("about");
				break;

			case command === "education":
				output = (
					<TypewriterSection
						command="education_data.txt"
						onComplete={() => {
							setTimeout(() => scrollToBottom(), 100);
						}}
					>
						<EducationSection />
					</TypewriterSection>
				);
				setCurrentSection("education");
				break;

			case command === "skills":
				output = (
					<TypewriterSection
						command="skills_data.txt"
						onComplete={() => {
							setTimeout(() => scrollToBottom(), 100);
						}}
					>
						<SkillsSection />
					</TypewriterSection>
				);
				setCurrentSection("skills");
				break;

			case command === "experience":
				output = (
					<TypewriterSection
						command="experience_data.txt"
						onComplete={() => {
							setTimeout(() => scrollToBottom(), 100);
						}}
					>
						<ExperienceSection />
					</TypewriterSection>
				);
				setCurrentSection("experience");
				break;

			case command === "projects":
				output = (
					<TypewriterSection
						command="projects_data.txt"
						onComplete={() => {
							setTimeout(() => scrollToBottom(), 100);
						}}
					>
						<ProjectsSection />
					</TypewriterSection>
				);
				setCurrentSection("projects");
				break;

			case command === "certifications":
				output = (
					<TypewriterSection
						command="certifications_data.txt"
						onComplete={() => {
							setTimeout(() => scrollToBottom(), 100);
						}}
					>
						<CertificationsSection />
					</TypewriterSection>
				);
				setCurrentSection("certifications");
				break;

			case command === "contact":
				output = (
					<TypewriterSection
						command="contact_data.txt"
						onComplete={() => {
							setTimeout(() => scrollToBottom(), 100);
						}}
					>
						<ContactSection />
					</TypewriterSection>
				);
				setCurrentSection("contact");
				break;

			case command === "helloyou":
				// Special command to play a video
				output = <PlayVideo videoId={"eS6RKPSm304"} startTime={12} />;
				setCurrentSection(null);
				break;
			case command === "resume":
				output = (
					<div className="space-y-4 text-white">
						<p>Download my resume:</p>
						<div className="flex justify-start">
							<TypewriterSection
								command="resume_data.txt"
								onComplete={() => {
									setTimeout(() => scrollToBottom(), 100);
								}}
							>
								<ResumeDownloadButton />
							</TypewriterSection>
						</div>
					</div>
				);
				setCurrentSection(null);
				break;

			// Handle `blog ls`
			case command === "blog ls":
				setCurrentSection(null);

				if (!directCommand) {
					setInput(""); // Clear input field
				}
				setHistoryIndex(-1); // Reset history index

				// Show loading state immediately without blinking
				setCommandHistory(prev => [
					...prev,
					{
						input: command,
						output: (
							<div className="flex items-center text-[#00FF41]">
								<motion.span
									animate={{opacity: [1, 0.3, 1]}}
									transition={{
										repeat: Infinity,
										duration: 0.8,
									}}
									className="mr-2"
								>
									▋
								</motion.span>
								<span>Loading blog list...</span>
							</div>
						),
						timestamp: new Date(),
					},
				]);

				fetch("/api/blogs")
					.then(res => res.json())
					.then(slugs => {
						// Replace the loading message with actual results
						setCommandHistory(prev => [
							...prev.slice(0, -1), // Remove the loading message
							{
								input: command,
								output: (
									<div className="text-[#00FF41] grid grid-cols-3 gap-2">
										{slugs.length > 0 ? (
											slugs.map((slug: string) => (
												<span
													key={slug}
													className="hover:text-white cursor-pointer"
												>
													{slug}
												</span>
											))
										) : (
											<span className="text-white/60">
												No blogs found
											</span>
										)}
									</div>
								),
								timestamp: new Date(),
							},
						]);
					})
					.catch(error => {
						// Replace loading with error message
						setCommandHistory(prev => [
							...prev.slice(0, -1), // Remove the loading message
							{
								input: command,
								output: (
									<p className="text-red-400">
										Error loading blogs: {error.message}
									</p>
								),
								timestamp: new Date(),
							},
						]);
					});
				return; // ADD THIS RETURN STATEMENT

			// Handle `blog <slug>` - but NOT `blog ls`
			case command.startsWith("blog ") && command !== "blog ls":
				const slug = command.split(" ")[1];
				if (!slug) break;

				setCurrentSection(null);

				if (!directCommand) {
					setInput(""); // Clear input field
				}
				setHistoryIndex(-1); // Reset history index

				// Show loading state immediately with blinking effect
				setCommandHistory(prev => [
					...prev,
					{
						input: command,
						output: (
							<div className="flex items-center text-[#00FF41]">
								<motion.span
									animate={{opacity: [1, 0.3, 1]}}
									transition={{
										repeat: Infinity,
										duration: 0.8,
									}}
									className="mr-2"
								>
									▋
								</motion.span>
								<span>Loading blog "{slug}"...</span>
							</div>
						),
						timestamp: new Date(),
					},
				]);

				fetch(`/api/blogs/${slug}`)
					.then(res => {
						if (!res.ok) throw new Error("Blog not found");
						return res.json();
					})
					.then(({data, content}) => {
						// Replace loading message with blog content
						setCommandHistory(prev => [
							...prev.slice(0, -1), // Remove the loading message
							{
								input: command,
								output: (
									<div className="bg-black/90 border border-[#00FF41]/30 rounded-lg p-6 mt-4">
										{/* Header */}
										<div className="border-b border-[#00FF41]/20 pb-4 mb-6">
											<h1 className="text-2xl font-bold text-[#00FF41] mb-2">
												{data.title}
											</h1>
											<div className="flex items-center space-x-4 text-white/70 text-sm">
												<span>📅 {data.date}</span>
												<span>
													⏱️{" "}
													{data.readTime ||
														"5 min read"}
												</span>
												<span>
													🏷️{" "}
													{data.tags?.join(", ") ||
														"Blog"}
												</span>
											</div>
										</div>

										{/* Content */}
										<div className="prose prose-invert max-w-none">
											<div className="text-white/90 leading-relaxed space-y-4">
												{content
													.replace(/\r\n/g, "\n")
													.split("\n\n")
													.map(
														(
															paragraph: string,
															index: number
														) => {
															if (
																!paragraph.trim()
															)
																return null;

															// Headers
															if (
																paragraph.startsWith(
																	"#"
																)
															) {
																const level =
																	paragraph.match(
																		/^#+/
																	)?.[0]
																		?.length ||
																	1;
																const text =
																	paragraph.replace(
																		/^#+\s*/,
																		""
																	);
																const Tag =
																	level === 1
																		? "h1"
																		: level ===
																		  2
																		? "h2"
																		: "h3";
																const className =
																	level === 1
																		? "text-xl font-bold text-[#00FF41] mt-6 mb-3"
																		: level ===
																		  2
																		? "text-lg font-semibold text-[#00FF41] mt-5 mb-2"
																		: "text-md font-medium text-[#00FF41] mt-4 mb-2";
																return (
																	<Tag
																		key={
																			index
																		}
																		className={
																			className
																		}
																	>
																		{text}
																	</Tag>
																);
															}

															// Code blocks
															if (
																paragraph.includes(
																	"```"
																)
															) {
																const codeMatch =
																	paragraph.match(
																		/```(\w*)\n?([\s\S]*?)\n?```/
																	);
																if (codeMatch) {
																	const [
																		,
																		,
																		code,
																	] =
																		codeMatch;
																	return (
																		<pre
																			key={
																				index
																			}
																			className="bg-gray-900 border border-[#00FF41]/20 rounded p-4 overflow-x-auto text-[#00FF41] text-sm my-4"
																		>
																			<code>
																				{code.trim()}
																			</code>
																		</pre>
																	);
																}
															}

															// Lists
															if (
																paragraph.includes(
																	"- "
																)
															) {
																const items =
																	paragraph
																		.split(
																			"\n"
																		)
																		.filter(
																			line =>
																				line.startsWith(
																					"- "
																				)
																		);
																if (
																	items.length >
																	0
																) {
																	return (
																		<ul
																			key={
																				index
																			}
																			className="list-disc list-inside space-y-1 text-white/90 my-4"
																		>
																			{items.map(
																				(
																					item,
																					i
																				) => (
																					<li
																						key={
																							i
																						}
																						className="ml-2"
																					>
																						{item.replace(
																							/^- /,
																							""
																						)}
																					</li>
																				)
																			)}
																		</ul>
																	);
																}
															}

															// Regular paragraphs
															return (
																<p
																	key={index}
																	className="text-white/90 leading-relaxed my-3"
																>
																	{paragraph}
																</p>
															);
														}
													)}
											</div>
										</div>

										{/* Footer */}
										<div className="border-t border-[#00FF41]/20 pt-4 mt-8">
											<div className="flex justify-between items-center text-sm text-white/60">
												<span>
													Written by Bishwa Thakur
												</span>
												<span>
													Type 'blog ls' to see all
													posts
												</span>
											</div>
										</div>
									</div>
								),
								timestamp: new Date(),
							},
						]);
					})
					.catch(() => {
						// Replace loading with error message
						setCommandHistory(prev => [
							...prev.slice(0, -1), // Remove the loading message
							{
								input: command,
								output: (
									<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-4">
										<p className="text-red-400 flex items-center">
											<span className="mr-2">❌</span>
											Blog post "{slug}" not found
										</p>
										<p className="text-red-300/70 text-sm mt-2">
											Try 'blog ls' to see available posts
										</p>
									</div>
								),
								timestamp: new Date(),
							},
						]);
					});
				return; // ADD THIS RETURN STATEMENT

			case command === "fortune":
				output = (
					<p className="text-[#00FF41]">
						"The only way to do great work is to love what you do. -
						Steve Jobs"
					</p>
				);
				setCurrentSection(null);
				break;

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
				);
				setCurrentSection(null);
				break;

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
						{Array.from({length: 20}).map((_, i) => (
							<div
								key={i}
								className="matrix-column"
								style={{
									left: `${i * 5}%`,
									animationDelay: `${Math.random() * 2}s`,
								}}
							>
								{Array.from({length: 20}).map(() =>
									String.fromCharCode(
										0x30a0 + Math.random() * 96
									)
								)}
							</div>
						))}
					</div>
				);
				setCurrentSection(null);
				break;

			case command === "sudo":
				output = (
					<p className="text-[#00FF41]">"You have no power here!"</p>
				);
				setCurrentSection(null);
				break;

			case command === "yes":
				output = (
					<p className="text-[#00FF41]">yes yes yes yes yes...</p>
				);
				setCurrentSection(null);
				break;

			case command === "date":
				output = (
					<p className="text-[#00FF41]">
						"It's always coding o'clock!"
					</p>
				);
				setCurrentSection(null);
				break;

			case command === "rm -rf":
				output = (
					<p className="text-[#00FF41]">
						"Nice try, but I won't let you destroy the universe."
					</p>
				);
				setCurrentSection(null);
				break;

			case command === "weather":
				output = (
					<p className="text-[#00FF41]">
						"It's always night (like dark mode I like)."
					</p>
				);
				setCurrentSection(null);
				break;

			case command === "motd":
				output = (
					<p className="text-[#00FF41]">
						"Did you know? The first computer bug was an actual
						moth."
					</p>
				);
				setCurrentSection(null);
				break;

			case command === "clear":
				setCommandHistory([]);
				setCurrentSection(null);
				setInput("");
				// Run welcome command after clearing
				setTimeout(() => {
					handleSubmit(
						{preventDefault: () => {}} as React.FormEvent,
						"welcome"
					);
				}, 100);
				return;

			case command === "exit":
				onClose();
				return;

			default:
				if (command.startsWith("echo ")) {
					const text = command.substring(5).replace(/['"]/g, "");
					output = (
						<p className="text-[#00FF41]">{text.toUpperCase()}</p>
					);
					setCurrentSection(null);
				} else {
					output = (
						<p className="text-white">
							Command not found: {command}. Type{" "}
							<span className="text-white font-bold">help</span>{" "}
							to see available commands.
						</p>
					);
					setCurrentSection(null);
				}
		}

		// Add command to history
		setCommandHistory(prev => [
			...prev,
			{
				input: command,
				output,
				timestamp: new Date(),
			},
		]);

		// Reset input and history index only if not using direct command
		if (!directCommand) {
			setInput("");
		}
		setHistoryIndex(-1);
	};

	// Add autocomplete function
	const handleTabAutocomplete = (currentInput: string) => {
		const trimmedInput = currentInput.trim();

		// Check if it's a blog command
		if (trimmedInput.startsWith("blog ") && trimmedInput.length > 5) {
			const partialSlug = trimmedInput.substring(5).toLowerCase();

			// Find matching blog slugs
			const matches = availableBlogSlugs.filter(slug =>
				slug.toLowerCase().startsWith(partialSlug)
			);

			if (matches.length === 1) {
				// Complete with the single match
				setInput(`blog ${matches[0]}`);
				return true;
			} else if (matches.length > 1) {
				// Show available options in terminal
				const output = (
					<div className="text-[#00FF41]">
						<p className="mb-2">Available completions:</p>
						<div className="grid grid-cols-3 gap-2 ml-4">
							{matches.map(slug => (
								<span
									key={slug}
									className="text-white/80 hover:text-white cursor-pointer"
								>
									{slug}
								</span>
							))}
						</div>
					</div>
				);

				setCommandHistory(prev => [
					...prev,
					{
						input: trimmedInput,
						output,
						timestamp: new Date(),
					},
				]);
				return true;
			}
		}

		// Basic command autocomplete
		const commands = [
			"about",
			"education",
			"skills",
			"experience",
			"projects",
			"certifications",
			"contact",
			"resume",
			"help",
			"clear",
			"blog ls",
			"whoami",
			"pwd",
			"ls",
			"exit",
		];

		const matches = commands.filter(cmd =>
			cmd.toLowerCase().startsWith(trimmedInput.toLowerCase())
		);

		if (matches.length === 1) {
			setInput(matches[0]);
			return true;
		} else if (matches.length > 1) {
			// Show available command completions
			const output = (
				<div className="text-[#00FF41]">
					<p className="mb-2">Available commands:</p>
					<div className="grid grid-cols-4 gap-2 ml-4">
						{matches.map(cmd => (
							<span
								key={cmd}
								className="text-white/80 hover:text-white cursor-pointer"
							>
								{cmd}
							</span>
						))}
					</div>
				</div>
			);

			setCommandHistory(prev => [
				...prev,
				{
					input: trimmedInput,
					output,
					timestamp: new Date(),
				},
			]);
			return true;
		}

		return false;
	};

	// Update your existing handleKeyDown function to include Tab:
	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Handle Tab for autocomplete (ADD THIS FIRST)
		if (e.key === "Tab") {
			e.preventDefault();
			handleTabAutocomplete(input);
			return;
		}

		// Handle up/down arrows for command history navigation
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				const newIndex = historyIndex + 1;
				setHistoryIndex(newIndex);
				setInput(
					commandHistory[commandHistory.length - 1 - newIndex].input
				);
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIndex > 0) {
				const newIndex = historyIndex - 1;
				setHistoryIndex(newIndex);
				setInput(
					commandHistory[commandHistory.length - 1 - newIndex].input
				);
			} else if (historyIndex === 0) {
				setHistoryIndex(-1);
				setInput("");
			}
		}
	};

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
		);
	}

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="terminal"
				className="flex flex-col h-full"
				initial={{scale: 0.95, opacity: 0}}
				animate={{scale: 1, opacity: 1}}
				exit={{scale: 0.9, opacity: 0}}
				transition={{duration: 0.2}}
			>
				<div className="bg-black border border-gray-200 border-white/30 rounded-t-md p-2 flex items-center justify-between dark:border-gray-800">
					<div className="flex items-center">
						<TerminalIcon className="h-4 w-4 text-white mr-2" />
						<span className="text-sm font-mono text-white">
							bishwa@portfolio ~{" "}
							{currentSection ? `/${currentSection}` : ""}
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
				<div
					ref={terminalRef}
					className="flex-1 bg-black border-x border-white/30 p-4 overflow-y-auto font-mono text-sm"
				>
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
						<div className="flex-1 relative">
							<input
								ref={inputRef}
								type="text"
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								className="w-full bg-transparent border-none outline-none font-mono text-white caret-transparent"
								aria-label="Terminal input"
								autoComplete="off"
								spellCheck="false"
								style={{caretColor: "transparent"}}
							/>
							{/* Custom blinking cursor */}
							<motion.span
								animate={{opacity: [1, 0, 1]}}
								transition={{
									repeat: Infinity,
									duration: 1.2,
									ease: "easeInOut",
								}}
								className="absolute text-[#00FF41] pointer-events-none"
								style={{
									left: `${input.length * 0.6}em`,
									top: "50%",
									transform: "translateY(-50%)",
								}}
							>
								▋
							</motion.span>
						</div>
						<button
							type="button"
							onClick={() => handleTabAutocomplete(input)}
							className="text-[#00FF41] border border-[#00FF41]/40 px-2 py-1 rounded hover:bg-[#00FF41]/10 block md:hidden"
						>
							⭾
						</button>
					</form>
				</div>
				{/* Desktop Command Buttons - Only visible on desktop */}
				<nav className="hidden md:flex mt-4 flex-wrap justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"blog ls"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<Code className="h-3 w-3 mr-1" />
						Blogs
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"about"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<User className="h-3 w-3 mr-1" />
						About
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"education"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<GraduationCap className="h-3 w-3 mr-1" />
						Education
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"skills"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<Shield className="h-3 w-3 mr-1" />
						Skills
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"experience"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<Briefcase className="h-3 w-3 mr-1" />
						Experience
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"projects"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<Code className="h-3 w-3 mr-1" />
						Projects
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"certifications"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<Award className="h-3 w-3 mr-1" />
						Certifications
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"contact"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<Mail className="h-3 w-3 mr-1" />
						Contact
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"resume"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<FileDown className="h-3 w-3 mr-1" />
						Resume
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							handleSubmit(
								{preventDefault: () => {}} as React.FormEvent,
								"clear"
							);
						}}
						// className="text-xs bg-black/50 hover:bg-black/70 text-white border-white/30"
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<Trash2 className="h-3 w-3 mr-1" />
						Clear
					</Button>
				</nav>
				{/* Mobile Command Toggle Button - Only visible on mobile */}
				<div className="block md:hidden mt-4 flex justify-center">
					<button
						data-mobile-toggle="true"
						onClick={() =>
							setShowMobileCommands(!showMobileCommands)
						}
						className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
					>
						<div className="flex items-center space-x-2 relative z-10">
							{showMobileCommands ? (
								<>
									<span className="text-red-400 group-hover:text-red-300">
										×
									</span>
									<span>Hide Commands</span>
								</>
							) : (
								<>
									<span className="text-green-300/60 group-hover:text-[#00FF41] transition-colors duration-300">
										⌘
									</span>
									<span className="group-hover:text-[#00FF41] transition-colors duration-300">
										Commands
									</span>
								</>
							)}
						</div>

						{/* Soft green shimmer effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
					</button>
				</div>
				{/* Mobile Command Panel Overlay - Bottom Sheet Style */}
				<AnimatePresence>
					{showMobileCommands && (
						<>
							{/* Backdrop */}
							<motion.div
								initial={{opacity: 0}}
								animate={{opacity: 1}}
								exit={{opacity: 0}}
								transition={{duration: 0.2}}
								className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden mobile-commands-backdrop"
								onClick={() => setShowMobileCommands(false)}
							/>

							{/* Bottom Sheet Command Panel */}
							<motion.div
								data-mobile-commands="true"
								initial={{opacity: 0, y: "100%"}}
								animate={{opacity: 1, y: 0}}
								exit={{opacity: 0, y: "100%"}}
								transition={{
									duration: 0.3,
									type: "spring",
									damping: 25,
									stiffness: 300,
								}}
								className="fixed inset-x-0 bottom-0 bg-black/95 border-t border-[#00FF41]/30 rounded-t-3xl shadow-2xl shadow-[#00FF41]/20 z-50 md:hidden max-h-[70vh] overflow-y-auto"
							>
								{/* Panel Content */}
								<div className="p-6 space-y-6 pb-8">
									{/* Blog Commands */}
									<div className="mb-4">
										<h4 className="text-white font-mono text-sm mb-2 border-b border-[#00FF41]/20 pb-1">
											📝 BLOG SYSTEM
										</h4>
										<div className="grid grid-cols-1 gap-2">
											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"blog ls"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<div className="flex items-center">
													<Code className="h-3 w-3 mr-2 flex-shrink-0" />
													<span>blog ls</span>
												</div>
												<div className="text-[#00FF41]/60 text-xs ml-5">
													List all blog posts
												</div>
											</button>
										</div>
									</div>

									{/* Portfolio Commands */}
									<div className="mb-4">
										<h4 className="text-white font-mono text-sm mb-2 border-b border-white/20 pb-1">
											👤 PORTFOLIO
										</h4>
										<div className="grid grid-cols-2 gap-2">
											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"about"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<User className="h-3 w-3 mr-2 flex-shrink-0" />
												About
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"education"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<GraduationCap className="h-3 w-3 mr-2 flex-shrink-0" />
												Education
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"skills"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<Shield className="h-3 w-3 mr-2 flex-shrink-0" />
												Skills
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"experience"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<Briefcase className="h-3 w-3 mr-2 flex-shrink-0" />
												Experience
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"projects"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<Code className="h-3 w-3 mr-2 flex-shrink-0" />
												Projects
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"certifications"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<Award className="h-3 w-3 mr-2 flex-shrink-0" />
												Certifications
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"contact"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<Mail className="h-3 w-3 mr-2 flex-shrink-0" />
												Contact
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"resume"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<FileDown className="h-3 w-3 mr-2 flex-shrink-0" />
												Resume
											</button>
										</div>
									</div>

									{/* System Commands */}
									<div>
										<h4 className="text-white/70 font-mono text-sm mb-2 border-b border-white/10 pb-1">
											⚙️ SYSTEM
										</h4>
										<div className="grid grid-cols-2 gap-2">
											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"help"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<span className="mr-2 flex-shrink-0">
													?
												</span>
												Help
											</button>

											<button
												onClick={() => {
													handleSubmit(
														{
															preventDefault:
																() => {},
														} as React.FormEvent,
														"clear"
													);
													setShowMobileCommands(
														false
													);
												}}
												className="relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden"
											>
												<Trash2 className="h-3 w-3 mr-2 flex-shrink-0" />
												Clear
											</button>
										</div>
									</div>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</motion.div>
		</AnimatePresence>
	);
}
