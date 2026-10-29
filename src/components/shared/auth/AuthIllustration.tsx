import { cn } from "@/lib/utils";

/**
 * Flat dashboard window for the auth shell's side panel. Colors come from the `--scene-*`
 * tokens, so it follows the theme and dark mode.
 */
export function AuthIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      aria-hidden
      focusable="false"
      className={ cn("h-auto w-full", className) }
    >
      <ellipse cx="200" cy="300" rx="150" ry="10" className="fill-scene-tone" opacity={ 0.12 } />

      <rect x="40" y="36" width="320" height="236" rx="16" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 2 } />
      <path d="M40 52a16 16 0 0 1 16-16h288a16 16 0 0 1 16 16v14H40z" className="fill-scene-soft" opacity={ 0.45 } />
      <circle cx="60" cy="51" r="4" className="fill-scene-blush" />
      <circle cx="74" cy="51" r="4" className="fill-scene-sun" />
      <circle cx="88" cy="51" r="4" className="fill-scene-leaf" />

      <rect x="56" y="82" width="56" height="174" rx="8" className="fill-scene-tone" opacity={ 0.12 } />
      <rect x="66" y="94" width="36" height="8" rx="4" className="fill-scene-tone" />
      <rect x="66" y="112" width="30" height="6" rx="3" className="fill-scene-soft" />
      <rect x="66" y="126" width="34" height="6" rx="3" className="fill-scene-soft" />
      <rect x="66" y="140" width="26" height="6" rx="3" className="fill-scene-soft" />

      <rect x="124" y="82" width="68" height="44" rx="8" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 1.5 } />
      <rect x="134" y="92" width="26" height="6" rx="3" className="fill-scene-soft" />
      <rect x="134" y="106" width="40" height="10" rx="3" className="fill-scene-tone" />
      <rect x="202" y="82" width="68" height="44" rx="8" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 1.5 } />
      <rect x="212" y="92" width="26" height="6" rx="3" className="fill-scene-soft" />
      <rect x="212" y="106" width="34" height="10" rx="3" className="fill-scene-blush" />
      <rect x="280" y="82" width="64" height="44" rx="8" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 1.5 } />
      <rect x="290" y="92" width="26" height="6" rx="3" className="fill-scene-soft" />
      <rect x="290" y="106" width="30" height="10" rx="3" className="fill-scene-leaf" />

      <rect x="124" y="138" width="146" height="118" rx="8" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 1.5 } />
      <rect x="140" y="204" width="14" height="36" rx="3" className="fill-scene-soft" />
      <rect x="162" y="186" width="14" height="54" rx="3" className="fill-scene-tone" />
      <rect x="184" y="196" width="14" height="44" rx="3" className="fill-scene-soft" />
      <rect x="206" y="172" width="14" height="68" rx="3" className="fill-scene-blush" />
      <rect x="228" y="182" width="14" height="58" rx="3" className="fill-scene-leaf" />
      <path d="M140 178l22-14 22 8 22-22 22 6 20-12" className="fill-none stroke-scene-sun" strokeWidth={ 3 } strokeLinecap="round" strokeLinejoin="round" />

      <rect x="280" y="138" width="64" height="118" rx="8" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 1.5 } />
      <circle cx="312" cy="180" r="20" className="fill-none stroke-scene-soft" strokeWidth={ 10 } />
      <circle
        cx="312"
        cy="180"
        r="20"
        className="fill-none stroke-scene-tone"
        strokeWidth={ 10 }
        strokeDasharray="78 126"
        transform="rotate(-90 312 180)"
      />
      <circle
        cx="312"
        cy="180"
        r="20"
        className="fill-none stroke-scene-blush"
        strokeWidth={ 10 }
        strokeDasharray="24 126"
        strokeDashoffset="-78"
        transform="rotate(-90 312 180)"
      />
      <rect x="292" y="216" width="40" height="6" rx="3" className="fill-scene-soft" />
      <rect x="292" y="230" width="28" height="6" rx="3" className="fill-scene-soft" />

      <g transform="translate(316 20)">
        <rect width="64" height="40" rx="10" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 1.5 } />
        <path d="M16 26l8-8 8 5 14-12" className="fill-none stroke-scene-leaf" strokeWidth={ 3 } strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(16 210)">
        <rect width="56" height="56" rx="14" className="fill-scene-tone" />
        <path d="M18 28l7 7 14-14" className="fill-none stroke-scene-paper" strokeWidth={ 4 } strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <path d="M24 92l3.5 6.5 6.5 3.5-6.5 3.5-3.5 6.5-3.5-6.5-6.5-3.5 6.5-3.5z" className="fill-scene-sun" />
      <path d="M376 210l2.5 4.5 4.5 2.5-4.5 2.5-2.5 4.5-2.5-4.5-4.5-2.5 4.5-2.5z" className="fill-scene-blush" />
    </svg>
  );
}
