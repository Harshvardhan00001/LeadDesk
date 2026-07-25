import React from 'react';
import { useThemeMode } from '../hooks/Usethememode';
import { ThemeToggle } from './Themetoggle';

export function Navbar({
    brand = 'Studio',
    rightSlot,
}: {
    brand?: string;
    rightSlot?: React.ReactNode;
}) {
    const { mode, setMode } = useThemeMode();

    return (
        <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur transition-colors dark:border-white/10 dark:bg-black/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                    </span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
                        {brand}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {rightSlot}
                    <ThemeToggle mode={mode} setMode={setMode} />
                </div>
            </div>
        </header>
    );
}