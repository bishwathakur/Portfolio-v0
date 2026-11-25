type TabKeyIconProps = { className?: string };

export function TabKeyIcon({ className }: TabKeyIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="M7 12h7m-3-3 3 3-3 3m5.5-6v6" />
    </svg>
  );
}
