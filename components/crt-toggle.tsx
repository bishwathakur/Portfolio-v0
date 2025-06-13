"use client";

import {useState, useEffect} from "react";
import {Toggle} from "@/components/ui/toggle";
import {Monitor} from "lucide-react";

export function CRTToggle() {
	const [crtEnabled, setCrtEnabled] = useState(false);

	useEffect(() => {
		const body = document.body;
		if (crtEnabled) {
			body.classList.add("crt");
		} else {
			body.classList.remove("crt");
		}

		localStorage.setItem("crt-effect", crtEnabled.toString());

		return () => {
			body.classList.remove("crt");
		};
	}, [crtEnabled]);

	useEffect(() => {
		const savedPreference = localStorage.getItem("crt-effect");
		if (savedPreference === "true") {
			setCrtEnabled(true);
		}
	}, []);

	return (
		<Toggle
			aria-label="Toggle CRT effect"
			pressed={crtEnabled}
			onPressedChange={setCrtEnabled}
			className="
        data-[state=on]:bg-[#00FF41]/20 data-[state=on]:border-[#00FF41]/50 data-[state=on]:text-[#00FF41]
        bg-black/80 border border-white/30 text-white
        hover:bg-[#00FF41]/10 hover:border-[#00FF41]/40
        transition-all duration-200
        shadow-lg backdrop-blur-sm
        px-2 py-2 md:px-3 md:py-2
        text-xs md:text-sm
        min-h-[44px] min-w-[44px] md:min-h-auto md:min-w-auto
        rounded-full md:rounded-lg
        flex items-center justify-center
        active:scale-95
      "
		>
			{/* Mobile: Icon only, Desktop: Icon + Text */}
			<Monitor className="h-4 w-4 md:mr-2 flex-shrink-0" />
			<span className="hidden md:inline font-mono">CRT</span>
		</Toggle>
	);
}
