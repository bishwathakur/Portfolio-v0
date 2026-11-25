import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const desktopLook = "relative text-xs bg-gradient-to-br from-[#1a2e1a]/80 via-black/70 to-[#0f1f0f]/80 hover:from-[#16213e]/90 hover:via-black/80 hover:to-[#1a2e1a]/90 text-white/90 hover:text-white border border-green-400/20 hover:border-[#00FF41]/50 px-5 py-2.5 rounded-md font-mono transition-all duration-300 hover:text-[#00FF41] group shadow-lg hover:shadow-xl hover:shadow-[#00FF41]/15 backdrop-blur-sm overflow-hidden";

export function TerminalShortcutButton({ touch = false, className, ...props }: ButtonProps & { touch?: boolean }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        desktopLook,
        // Use the desktop's blue hover colors as the resting colors on touchscreens.
        touch && "min-h-11 h-auto min-w-0 justify-start gap-1.5 px-2.5 py-1.5 from-[#16213e]/90 via-black/80 to-[#1a2e1a]/90 active:border-[#00FF41]/50 active:text-[#00FF41] focus-visible:ring-[#00FF41] backdrop-blur-none touch-manipulation",
        className
      )}
      {...props}
    />
  );
}
