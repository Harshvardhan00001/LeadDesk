import React from 'react';
import type { ThemeMode } from '../hooks/Usethememode';

export function ThemeToggle({ mode, setMode }: { mode: ThemeMode; setMode: (m: ThemeMode) => void }) {
    const options: { key: ThemeMode; label: string; icon: React.ReactNode }[] = [
        {
            key: 'light',
            label: 'Light',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ),
        },
        {
            key: 'dark',
            label: 'Dark',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            ),
        },
        {
            key: 'system',
            label: 'System',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="13" rx="1.5" />
                    <path d="M8 21h8M12 17v4" />
                </svg>
            ),
        },
    ];

    return (
        <div
            role="radiogroup"
            aria-label="Colour mode"
            className="flex gap-0.5 rounded-full border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-neutral-900"
        >
            {options.map(opt => (
                <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={mode === opt.key}
                    title={opt.label}
                    onClick={() => setMode(opt.key)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors ${mode === opt.key
                        ? 'bg-red-600 text-white'
                        : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                        }`}
                >
                    {opt.icon}
                    <span className="hidden sm:inline">{opt.label}</span>
                </button>
            ))}
        </div>
    );
}