import type { LucideIcon } from "lucide-react";
import {
	ArrowUpRight, Award, BookOpen, Briefcase, HelpCircle, Code2,
	FileText, GraduationCap, Mail, Shield, Terminal, Trash2, User, X,
} from "lucide-react";
import { ImageAsciiLogo } from "./image-ascii-logo";

type CommandItem = {
	command: string;
	label: string;
	icon: LucideIcon;
};

const portfolioItems: CommandItem[] = [
	{command: "about", label: "About", icon: User},
	{command: "education", label: "Education", icon: GraduationCap},
	{command: "skills", label: "Skills", icon: Shield},
	{command: "experience", label: "Experience", icon: Briefcase},
	{command: "projects", label: "Projects", icon: Code2},
	{command: "certifications", label: "Certificates", icon: Award},
	{command: "contact", label: "Contact", icon: Mail},
];

const resume = {command: "resume", label: "View Resume", icon: FileText};
const shortcuts = [portfolioItems[0], portfolioItems[3], portfolioItems[4], resume];
const commandGroups = [
	{label: "Portfolio", items: [...portfolioItems, resume]},
	{label: "Terminal", items: [
		{command: "blog ls", label: "Blogs", icon: BookOpen},
		{command: "help", label: "Help", icon: HelpCircle},
		{command: "clear", label: "Clear", icon: Trash2},
	]},
];

function CommandTile({item, onRun, showCommand = false}: {
	item: CommandItem;
	onRun: (command: string) => void;
	showCommand?: boolean;
}) {
	const Icon = item.icon;
	return (
		<button
			type="button"
			data-command={item.command}
			onClick={() => onRun(item.command)}
			className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-[#00FF41]/20 bg-[#0d190f] px-2.5 py-2 text-left text-xs text-green-50 transition-colors hover:border-[#00FF41]/60 active:bg-[#18341d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00FF41]"
		>
			<Icon aria-hidden="true" className="size-4 shrink-0 text-[#00FF41]" />
			<span className="min-w-0 leading-4">
				<span className="block font-medium">{item.label}</span>
				{showCommand && (
					<span aria-hidden="true" className="block text-[10px] text-green-100/60">{item.command}</span>
				)}
			</span>
			{!showCommand && <ArrowUpRight aria-hidden="true" className="ml-auto size-3 shrink-0 text-green-100/55" />}
		</button>
	);
}

export function MobileTerminalWelcome({onRun}: {onRun: (command: string) => void}) {
	return (
		<div data-mobile-welcome className="rounded-xl border border-[#00FF41]/25 bg-gradient-to-br from-[#102313] to-[#050c07] p-3.5 md:hidden">
			<p className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#00FF41]">
				<span aria-hidden="true" className="size-1.5 rounded-full bg-[#00FF41]" />
				Portfolio terminal
			</p>
			<h1 className="text-xl font-bold leading-tight tracking-tight text-white">Bishwa Thakur</h1>
			<p className="mt-1.5 text-xs leading-5 text-green-50/80">
				Pick a shortcut, type a command, or tap Commands for the full list.
			</p>
			<div className="mt-3 grid grid-cols-2 gap-2" aria-label="Quick commands">
				{shortcuts.map(item => <CommandTile key={item.command} item={item} onRun={onRun} />)}
			</div>
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
			<div data-mobile-directory className="grid grid-cols-2 gap-2 md:hidden">
				{portfolioItems.map(item => (
					<CommandTile key={item.command} item={item} onRun={onRun} showCommand />
				))}
			</div>
			<div data-desktop-directory className="hidden text-[#00FF41] md:block">
				{portfolioItems.map((item, index) => <span key={item.command}>{index > 0 ? "   " : ""}{item.command}</span>)}
			</div>
		</>
	);
}

export function MobileCommandsMenu({onRun, onClose}: {
	onRun: (command: string) => void;
	onClose: () => void;
}) {
	return (
		<div className="mx-auto max-w-md px-3.5 pt-2 font-mono [padding-bottom:max(1rem,env(safe-area-inset-bottom))]">
			<div aria-hidden="true" className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#00FF41]/25" />
			<div className="flex items-center gap-2.5 border-b border-[#00FF41]/15 pb-2.5">
				<span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#00FF41]/25 bg-[#00FF41]/10 text-[#00FF41]">
					<Terminal aria-hidden="true" className="size-4" />
				</span>
				<div className="min-w-0 flex-1">
					<h2 id="mobile-commands-title" className="text-sm font-bold text-white">Commands</h2>
					<p className="text-[11px] text-green-100/60">Tap a command to run it.</p>
				</div>
				<button
					type="button"
					aria-label="Close Commands"
					onClick={onClose}
					className="grid size-11 shrink-0 place-items-center rounded-lg border border-[#00FF41]/20 text-green-100/80 hover:bg-[#00FF41]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00FF41]"
				>
					<X aria-hidden="true" className="size-4" />
				</button>
			</div>
			{commandGroups.map(group => (
				<section key={group.label} className="mt-3">
					<h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00FF41]/85">{group.label}</h3>
					<div className="grid grid-cols-2 gap-2">
						{group.items.map(item => <CommandTile key={item.command} item={item} onRun={onRun} showCommand />)}
					</div>
				</section>
			))}
		</div>
	);
}

