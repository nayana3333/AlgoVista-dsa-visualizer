import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-10 pt-16 text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-muted uppercase">
        {eyebrow}
      </div>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx('rounded-2xl border border-border bg-surface shadow-[0_2px_10px_-4px_rgba(54,42,38,0.08)]', className)}>
      {children}
    </div>
  );
}

export function Button({
  className,
  variant = 'secondary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' &&
          'bg-primary text-white shadow-[0_4px_14px_-4px_rgba(176,79,111,0.55)] hover:bg-[#9c4462] active:scale-[0.98]',
        variant === 'secondary' &&
          'border border-border bg-surface text-ink hover:bg-surface-2 active:scale-[0.98]',
        variant === 'ghost' && 'text-muted hover:text-ink',
        className,
      )}
      {...props}
    />
  );
}

export function Slider({
  label,
  valueLabel,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; valueLabel: string }) {
  return (
    <label className={clsx('flex flex-col gap-2', className)}>
      <span className="flex items-center justify-between text-xs font-medium text-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">{valueLabel}</span>
      </span>
      <input
        type="range"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
        {...props}
      />
    </label>
  );
}

export function Select({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={clsx('flex flex-col gap-2', className)}>
      <span className="text-xs font-medium text-muted">{label}</span>
      <select
        className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-primary"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function StatPill({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'primary' | 'accent' }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div
        className={clsx(
          'mt-0.5 font-mono text-lg font-semibold',
          tone === 'default' && 'text-ink',
          tone === 'primary' && 'text-primary',
          tone === 'accent' && 'text-primary-2',
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function ComplexityPanel({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <Panel className="p-5">
      <h3 className="mb-3 font-display text-sm font-semibold text-ink">Complexity</h3>
      <dl className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <dt className="text-muted">{r.label}</dt>
            <dd className="font-mono font-medium text-primary-2">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export function PseudocodePanel({ title, lines, activeLine }: { title: string; lines: string[]; activeLine?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-ink text-[#f3ece7]">
      <h3 className="border-b border-white/10 px-5 pb-3 pt-4 text-sm font-semibold text-[#f3ece7]/90">{title}</h3>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[13px] leading-relaxed text-[#e4d9d2]/80">
        {lines.map((line, i) => (
          <div
            key={i}
            className={clsx(
              'rounded px-2 py-0.5',
              activeLine === i && 'bg-white/10 text-white',
            )}
          >
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
