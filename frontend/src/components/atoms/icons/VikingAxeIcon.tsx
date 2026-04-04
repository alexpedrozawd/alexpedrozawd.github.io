export function VikingAxeIcon({ size = "1em" }: { size?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Wooden handle */}
      <rect x="13" y="2" width="2.5" height="20" rx="1.2" fill="#7B4F2E" />
      <rect
        x="13"
        y="2"
        width="2.5"
        height="20"
        rx="1.2"
        fill="none"
        stroke="#c9aa71"
        strokeWidth="0.5"
      />

      {/* Grip wrap lines */}
      <line x1="13" y1="15.5" x2="15.5" y2="15.5" stroke="#c9aa71" strokeWidth="0.9" opacity="0.65" />
      <line x1="13" y1="17"   x2="15.5" y2="17"   stroke="#c9aa71" strokeWidth="0.9" opacity="0.65" />
      <line x1="13" y1="18.5" x2="15.5" y2="18.5" stroke="#c9aa71" strokeWidth="0.9" opacity="0.65" />

      {/* Upper blade body */}
      <path d="M13.5 5 L8 3 C6 3 4.5 5 5.5 7.5 L13.5 9 Z" fill="#8B9BB4" />

      {/* Lower beard (the wide downward extension — hallmark of Viking bearded axe) */}
      <path d="M13.5 9 L5.5 7.5 C4 9 4 12.5 6 14.5 L9.5 16.5 L13.5 14 Z" fill="#7A8EA8" />

      {/* Blade outline */}
      <path
        d="M13.5 5 L8 3 C6 3 4.5 5 5.5 7.5 C4 9 4 12.5 6 14.5 L9.5 16.5 L13.5 14"
        fill="none"
        stroke="#c9aa71"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />

      {/* Cutting edge highlight (the sharp crescent) */}
      <path
        d="M8 3 C6 3 4.5 5 5.5 7.5 C4 9 4 12.5 6 14.5"
        fill="none"
        stroke="#ccd8e8"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
