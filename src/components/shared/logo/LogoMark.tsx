import { useId, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type LogoPartProps = ComponentProps<"svg">;

/**
 * Tona mark ("Orbit"): a blue → violet sphere ringed by a mint orbit with a satellite.
 * The back of the orbit passes behind the sphere and the front crosses over it.
 * Brand colors are the fixed `-lg` tokens, so the mark looks the same in light and dark mode.
 * Renders a nestable <svg>, so it can sit inside the logo lockup (`x`, `width`, `height`).
 * Keep in sync with `src/app/icon.svg` and `public/assets/images/logo/*.svg`.
 */
export function LogoMark({ className, ...props }: LogoPartProps) {
    const gradientId = useId();

    return (
        <svg viewBox="0 0 64 64" aria-hidden focusable="false" className={ cn("shrink-0", className) } { ...props }>
            <defs>
                <linearGradient id={ gradientId } x1="11" y1="11" x2="53" y2="53" gradientUnits="userSpaceOnUse">
                    <stop offset="0" style={ { stopColor: "var(--brand-primary-lg)" } } />
                    <stop offset="1" style={ { stopColor: "var(--brand-secondary-lg)" } } />
                </linearGradient>
            </defs>
            <g fill="none" strokeWidth={ 3.5 } strokeLinecap="round" transform="rotate(-28 32 32)" style={ { stroke: "var(--brand-accent-lg)" } }>
                <path d="M2 32a30 10 0 0 1 60 0" />
            </g>
            <circle cx="32" cy="32" r="21" fill={ `url(#${ gradientId })` } />
            <circle cx="25" cy="25" r="6" className="fill-white" opacity={ 0.25 } />
            <g fill="none" strokeWidth={ 3.5 } strokeLinecap="round" transform="rotate(-28 32 32)" style={ { stroke: "var(--brand-accent-lg)" } }>
                <path d="M2 32a30 10 0 0 0 60 0" />
            </g>
            <circle cx="53" cy="9" r="4.5" style={ { fill: "var(--brand-accent-lg)" } } />
        </svg>
    );
}

/** Thin lowercase "tona" wordmark drawn with strokes in `currentColor`, so it follows the text color. */
export function LogoWordmark({ className, ...props }: LogoPartProps) {
    return (
        <svg viewBox="0 0 100 40" aria-hidden focusable="false" className={ cn("shrink-0", className) } { ...props }>
            <g fill="none" stroke="currentColor" strokeWidth={ 3.6 } strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 5v19a8 8 0 0 0 8 8h2" />
                <path d="M2 14h12" />
                <circle cx="33" cy="23" r="9" />
                <path d="M51 32V23a8 8 0 0 1 16 0v9" />
                <circle cx="85" cy="23" r="9" />
                <path d="M94 14v18" />
            </g>
        </svg>
    );
}
