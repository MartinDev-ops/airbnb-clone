/**
 * Hand-built illustration standing in for Airbnb's gift-card artwork
 * (three fanned cards), since that artwork is Airbnb's own proprietary
 * asset and isn't available as free stock photography.
 */
export default function GiftCardsArt(props) {
  return (
    <svg viewBox="0 0 700 480" role="img" aria-label="Airbnb gift cards" {...props}>
      <defs>
        <linearGradient id="gc-lavender" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9a7e8" />
          <stop offset="100%" stopColor="#8f6bc9" />
        </linearGradient>
        <linearGradient id="gc-sunset" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7b155" />
          <stop offset="55%" stopColor="#e8735f" />
          <stop offset="100%" stopColor="#3d3a7a" />
        </linearGradient>
        <filter id="gc-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Left card: lavender field */}
      <g transform="translate(150,230) rotate(-13)" filter="url(#gc-shadow)">
        <rect x="-115" y="-75" width="230" height="150" rx="14" fill="url(#gc-lavender)" />
        <path d="M-115,10 C-70,-25 -20,-25 20,10 C55,38 90,25 115,-5 L115,75 L-115,75 Z" fill="#a97fd6" opacity="0.55" />
        <rect x="-45" y="-5" width="60" height="45" rx="4" fill="#5fb8c9" opacity="0.8" />
        <rect x="55" y="-40" width="10" height="60" rx="2" fill="#5b3f8a" opacity="0.7" />
        <rect x="70" y="-30" width="10" height="50" rx="2" fill="#5b3f8a" opacity="0.7" />
        <circle cx="-70" cy="-40" r="16" fill="#fff" opacity="0.85" />
        <rect x="-73" y="-40" width="6" height="24" fill="#fff" opacity="0.85" />
        <g fill="#fff">
          <path d="M0,-22 -17,-8 v27 h10 v-16 h14 v16 h10 v-27 z" />
        </g>
      </g>

      {/* Center card: brand red */}
      <g transform="translate(350,240)" filter="url(#gc-shadow)">
        <rect x="-120" y="-78" width="240" height="156" rx="16" fill="var(--brand, #ff385c)" />
        <g fill="#fff">
          <path d="M0,-24 -19,-8 v30 h11 v-18 h16 v18 h11 v-30 z" />
        </g>
      </g>

      {/* Right card: sunset beach */}
      <g transform="translate(545,225) rotate(12)" filter="url(#gc-shadow)">
        <rect x="-115" y="-75" width="230" height="150" rx="14" fill="url(#gc-sunset)" />
        <circle cx="60" cy="-30" r="18" fill="#ffe1a8" opacity="0.9" />
        <path d="M-115,35 C-70,15 -20,15 30,35 C60,48 90,42 115,25 L115,75 L-115,75 Z" fill="#2a2760" opacity="0.65" />
        <path d="M-115,-10 L-60,-45 L-20,-10 Z" fill="#231f4a" opacity="0.8" />
        <rect x="-70" y="-15" width="10" height="18" fill="#f7b155" opacity="0.9" />
        <g fill="#fff">
          <path d="M0,-22 -17,-8 v27 h10 v-16 h14 v16 h10 v-27 z" />
        </g>
      </g>
    </svg>
  );
}
