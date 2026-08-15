import type { SVGProps } from 'react';

export function SortGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="14" width="4" height="8" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="8" y="9" width="4" height="13" rx="1" fill="currentColor" opacity="0.75" />
      <rect x="14" y="4" width="4" height="18" rx="1" fill="currentColor" />
      <rect x="20" y="11" width="2" height="11" rx="1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function GraphGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="5" cy="6" r="2.5" fill="currentColor" />
      <circle cx="19" cy="6" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="18" r="2.5" fill="currentColor" opacity="0.6" />
      <path d="M7 7l10 0M6.5 8.5L11 16M17.5 8.5L13 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function GridGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="2" width="8" height="8" rx="1.5" fill="currentColor" />
      <rect x="14" y="2" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="2" y="14" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="14" y="14" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function QueenGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 20h16M5 20l-1-9 4 3 4-8 4 8 4-3-1 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
    </svg>
  );
}
