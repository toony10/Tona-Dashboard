import { cn } from "@/lib/utils";

/**
 * Flat 360×72 illustration drawn at the end of the header band: a plant, a chart monitor,
 * a donut and a report card. Colors come from the `--scene-*` tokens, so dark mode applies.
 * The viewBox keeps its end side when the scene is narrower than 360px.
 */
export function HeaderScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 72"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden
      focusable="false"
      className={ cn("rtl:-scale-x-100", className) }
    >
      <path
        d="M44 66H356"
        className="stroke-scene-tone"
        strokeOpacity={ 0.35 }
        strokeWidth={ 2 }
        strokeLinecap="round"
      />

      <path d="M66 26a7 7 0 0 1 2-13 9 9 0 0 1 17 2 6 6 0 0 1 1 11z" className="fill-scene-soft" opacity={ 0.7 } />

      <path d="M102 52h16l-2 14h-12z" className="fill-scene-sun" />
      <path d="M110 52c-8-6-10-14-4-18 2 6 4 10 4 18zm0 0c6-8 12-10 16-6-4 4-10 6-16 6z" className="fill-scene-leaf" />

      <path d="M190 54h16l3 10h-22z" className="fill-scene-ink" />
      <rect x="182" y="63" width="32" height="3" rx="1.5" className="fill-scene-ink" />
      <rect x="146" y="8" width="104" height="46" rx="5" className="fill-scene-board stroke-scene-soft" strokeWidth={ 3 } />
      <rect x="158" y="34" width="9" height="12" rx="1.5" className="fill-scene-soft" />
      <rect x="171" y="28" width="9" height="18" rx="1.5" className="fill-scene-leaf" />
      <rect x="184" y="31" width="9" height="15" rx="1.5" className="fill-scene-soft" />
      <rect x="197" y="22" width="9" height="24" rx="1.5" className="fill-scene-blush" />
      <path d="M214 40l8-8 8 4 10-14" className="fill-none stroke-scene-sun" strokeWidth={ 2 } strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="240" cy="22" r="2" className="fill-scene-sun" />
      <path d="M158 17h18M158 22h10" className="stroke-scene-paper" strokeWidth={ 2 } strokeLinecap="round" opacity={ 0.85 } />

      <circle cx="282" cy="44" r="13" className="fill-none stroke-scene-soft" strokeWidth={ 7 } />
      <circle
        cx="282"
        cy="44"
        r="13"
        className="fill-none stroke-scene-tone"
        strokeWidth={ 7 }
        strokeDasharray="52 82"
        transform="rotate(-90 282 44)"
      />
      <circle
        cx="282"
        cy="44"
        r="13"
        className="fill-none stroke-scene-blush"
        strokeWidth={ 7 }
        strokeDasharray="16 82"
        strokeDashoffset="-52"
        transform="rotate(-90 282 44)"
      />

      <rect x="308" y="22" width="42" height="44" rx="5" className="fill-scene-paper stroke-scene-soft" strokeWidth={ 1.5 } />
      <rect x="314" y="28" width="14" height="6" rx="1.5" className="fill-scene-tone" />
      <path d="M314 42h30M314 48h22M314 54h26" className="stroke-scene-soft" strokeWidth={ 2 } strokeLinecap="round" />
      <path d="M334 34l5-5 5 5M339 29v8" className="fill-none stroke-scene-leaf" strokeWidth={ 2 } strokeLinecap="round" strokeLinejoin="round" />

      <Sparkle x={ 132 } y={ 14 } size={ 5 } className="fill-scene-sun" />
      <Sparkle x={ 266 } y={ 16 } size={ 4 } className="fill-scene-tone" />
      <Sparkle x={ 352 } y={ 12 } size={ 3 } className="fill-scene-blush" />
    </svg>
  );
}

function Sparkle({ x, y, size, className }: { x: number; y: number; size: number; className: string }) {
  const a = Math.round(size * 35) / 100;
  const b = Math.round(size * 65) / 100;

  return (
    <path
      d={ `M${ x } ${ y - size }l${ a } ${ b } ${ b } ${ a }-${ b } ${ a }-${ a } ${ b }-${ a }-${ b }-${ b }-${ a } ${ b }-${ a }z` }
      className={ className }
    />
  );
}
