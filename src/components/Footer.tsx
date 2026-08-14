export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted sm:flex-row">
        <p className="font-display">
          Algo<span className="text-ink">Vista</span> — built to make algorithms click.
        </p>
        <p className="font-mono text-xs text-muted/80">
          React · TypeScript · Tailwind CSS · Framer Motion
        </p>
      </div>
    </footer>
  );
}
