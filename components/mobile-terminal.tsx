import { X } from "lucide-react";
import { ImageAsciiLogo } from "./image-ascii-logo";

const portfolioItems = [
	"about", "education", "skills", "experience", "projects", "certifications", "contact",
];
const shortcuts = ["about", "experience", "projects", "resume"];
const commandGroups = [
	{label: "portfolio", items: [...portfolioItems, "resume"]},
	{label: "system", items: ["blog ls", "help", "clear"]},
];

function CommandLink({command, onRun, showPrompt = false}: {
	command: string;
	onRun: (command: string) => void;
	showPrompt?: boolean;
}) {
	return (
		<button
			type="button"
			data-command={command}
			onClick={() => onRun(command)}
			className="inline-flex min-h-11 min-w-0 items-center gap-2 whitespace-nowrap rounded-none px-1 text-left text-[#00FF41] underline-offset-4 hover:underline active:bg-[#00FF41]/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#00FF41]"
		>
			{showPrompt && <span aria-hidden="true" className="text-[#00FF41]/65">$</span>}
			<code>{command}</code>
		</button>
	);
}

export function MobileTerminalWelcome({onRun}: {onRun: (command: string) => void}) {
	return (
		<div data-mobile-welcome className="max-w-prose font-mono md:hidden">
			<div className="flex gap-2 text-green-50/75">
				<span aria-hidden="true" className="text-green-50">$</span>
				<code>whoami</code>
			</div>
			<h1 className="mt-1 text-base font-semibold text-[#00FF41]">Bishwa Thakur</h1>
			<p className="text-sm text-green-50/70">Software Developer</p>
			<div className="mt-3 flex gap-2 text-green-50/75">
				<span aria-hidden="true" className="text-green-50">$</span>
				<code>ls</code>
			</div>
			<div className="-ml-1 flex flex-wrap gap-x-3" role="group" aria-label="Quick commands">
				{shortcuts.map(command => <CommandLink key={command} command={command} onRun={onRun} />)}
			</div>
			<p className="text-xs leading-5 text-green-50/65">Tap a command or type one below.</p>
		</div>
	);
}

export function DesktopTerminalWelcome() {
	return (
		<div data-desktop-welcome className="hidden space-y-2 md:block">
			<ImageAsciiLogo />
			<div className="mt-4 rounded-lg border border-[#00FF41]/30 bg-[#00FF41]/10 p-4">
				<p className="text-center font-mono text-white">
					🌟 Welcome to <span className="font-bold text-[#00FF41]">Bishwa Thakur&apos;s</span> interactive portfolio! 🌟
				</p>
				<p className="mt-2 text-center font-mono text-sm text-white/80">
					Navigate using commands or click the buttons below. Start with{" "}
					<code className="rounded bg-black/50 px-1 text-[#00FF41]">blog ls</code> to explore my writings!
				</p>
				<div className="mt-4 border-t border-[#00FF41]/20 pt-3">
					<p className="text-center font-mono text-xs text-[#00FF41]/70">
						💡 Pro tip: Use <span className="rounded bg-black/50 px-1 text-[#00FF41]">↑↓</span> for command history •{" "}
						<span className="rounded bg-black/50 px-1 text-[#00FF41]">Tab</span> for autocomplete or available commands
					</p>
				</div>
			</div>
		</div>
	);
}

export function TerminalDirectory({onRun}: {onRun: (command: string) => void}) {
	return (
		<>
			<div data-mobile-directory className="-ml-1 flex flex-wrap gap-x-3 md:hidden" role="group" aria-label="Portfolio commands">
				{portfolioItems.map(command => <CommandLink key={command} command={command} onRun={onRun} />)}
			</div>
			<div data-desktop-directory className="hidden text-[#00FF41] md:block">
				{portfolioItems.map((command, index) => <span key={command}>{index > 0 ? "   " : ""}{command}</span>)}
			</div>
		</>
	);
}

export function MobileCommandsMenu({onRun, onClose}: {
	onRun: (command: string) => void;
	onClose: () => void;
}) {
	return (
		<div className="mx-auto max-w-md px-4 pt-2 font-mono text-sm [padding-bottom:max(1rem,env(safe-area-inset-bottom))]">
			<div aria-hidden="true" className="mx-auto mb-1 h-0.5 w-8 bg-[#00FF41]/35" />
			<div className="flex items-center gap-2 border-b border-[#00FF41]/25 pb-1">
				<span aria-hidden="true" className="text-[#00FF41]">$</span>
				<h2 id="mobile-commands-title" className="flex-1 text-sm text-white">Commands</h2>
				<button
					type="button"
					aria-label="Close Commands"
					onClick={onClose}
					className="grid size-11 shrink-0 place-items-center text-green-50/80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#00FF41]"
				>
					<X aria-hidden="true" className="size-4" />
				</button>
			</div>
			{commandGroups.map(group => (
				<section key={group.label} className="mt-3">
					<h3 className="text-xs font-normal text-green-50/65"># {group.label}</h3>
					<div className="grid grid-cols-2 gap-x-2 divide-transparent">
						{group.items.map(command => <CommandLink key={command} command={command} onRun={onRun} showPrompt />)}
					</div>
				</section>
			))}
		</div>
	);
}
