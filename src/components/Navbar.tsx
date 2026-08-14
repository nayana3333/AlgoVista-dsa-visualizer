import { NavLink } from 'react-router-dom';
import { CATALOG } from '../data/catalog';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-white transition-transform group-hover:scale-105">
            {'</>'}
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Algo<span className="text-primary">Vista</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {CATALOG.map((entry) => (
            <NavLink
              key={entry.id}
              to={entry.path}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-soft text-[#8a3455]'
                    : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`
              }
            >
              {entry.title.replace(' Algorithms', '')}
            </NavLink>
          ))}
        </nav>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2 sm:flex"
        >
          View Source
        </a>
      </div>
    </header>
  );
}
