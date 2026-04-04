export function BackpackIcon({ size = "1em" }: { size?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Bag body — medium leather brown */}
      <rect x="3" y="8" width="18" height="14" rx="2.5" fill="#7B4F2E" />

      {/* Flap — darker leather, rounded top corners only */}
      <path
        d="M5.5 8 L18.5 8 Q21 8 21 10.5 L21 13 L3 13 L3 10.5 Q3 8 5.5 8 Z"
        fill="#4D2B17"
      />

      {/* Shoulder strap loop at the top */}
      <path
        d="M9 8 C9 5 10.5 3 12 3 C13.5 3 15 5 15 8"
        fill="none"
        stroke="#c9aa71"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Bag outer outline */}
      <rect
        x="3"
        y="8"
        width="18"
        height="14"
        rx="2.5"
        fill="none"
        stroke="#c9aa71"
        strokeWidth="1"
      />

      {/* Flap divider line */}
      <line x1="3" y1="13" x2="21" y2="13" stroke="#c9aa71" strokeWidth="0.7" />

      {/* Buckle frame */}
      <rect
        x="10"
        y="14.5"
        width="4"
        height="3"
        rx="0.5"
        fill="none"
        stroke="#c9aa71"
        strokeWidth="1.1"
      />

      {/* Buckle center pin */}
      <line x1="12" y1="14.5" x2="12" y2="17.5" stroke="#c9aa71" strokeWidth="0.8" />

      {/* Subtle pocket stitch at bottom */}
      <path
        d="M6 19 Q6 21 9 21 L15 21 Q18 21 18 19"
        fill="none"
        stroke="#c9aa71"
        strokeWidth="0.6"
        opacity="0.5"
      />
    </svg>
  );
}
