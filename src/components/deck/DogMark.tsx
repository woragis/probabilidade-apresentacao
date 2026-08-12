type Pose = "side" | "sit";

type Props = {
  pose?: Pose;
  className?: string;
  title?: string;
};

/** Neutral geometric dog — no breed, no teeth. currentColor for teal/cream/amber. */
export function DogMark({ pose = "side", className = "h-16 w-16", title }: Props) {
  return (
    <svg
      viewBox="0 0 80 64"
      className={className}
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {pose === "sit" ? <SitPath /> : <SidePath />}
    </svg>
  );
}

function SidePath() {
  return (
    <g>
      <ellipse cx="36" cy="36" rx="22" ry="13" />
      <path d="M16 32C8 22 10 12 18 10c2 8 4 16 0 22z" />
      <circle cx="58" cy="22" r="10" />
      <ellipse cx="68" cy="24" rx="8" ry="5" />
      <path d="M50 16 48 4l10 10z" />
      <circle cx="61" cy="20" r="1.6" fill="#05070b" />
      <rect x="22" y="46" width="5" height="16" rx="2.5" />
      <rect x="32" y="48" width="5" height="14" rx="2.5" />
      <rect x="42" y="48" width="5" height="14" rx="2.5" />
      <rect x="50" y="46" width="5" height="16" rx="2.5" />
    </g>
  );
}

function SitPath() {
  return (
    <g>
      <ellipse cx="38" cy="44" rx="14" ry="14" />
      <ellipse cx="42" cy="32" rx="12" ry="13" />
      <circle cx="48" cy="16" r="9" />
      <ellipse cx="57" cy="18" rx="6" ry="4" />
      <path d="M42 10 40 0l10 8z" />
      <path d="M26 40C14 36 12 24 18 20c4 8 8 14 10 20z" />
      <circle cx="51" cy="14.5" r="1.6" fill="#05070b" />
      <rect x="32" y="52" width="5.5" height="12" rx="2.5" />
      <rect x="46" y="52" width="5.5" height="12" rx="2.5" />
    </g>
  );
}

export function DogPack({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-56 w-full max-w-sm ${className}`} aria-hidden>
      <DogMark pose="side" className="absolute top-8 left-2 h-36 w-44 text-teal/80" />
      <DogMark pose="sit" className="absolute right-4 bottom-2 h-28 w-32 text-amber/75" />
      <DogMark pose="side" className="absolute top-0 right-10 h-20 w-24 text-cream/35" />
      <DogMark pose="sit" className="absolute bottom-6 left-28 h-16 w-20 text-teal-muted" />
    </div>
  );
}
