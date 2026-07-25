import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'theme-mode';

function getSystemPrefersDark() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyThemeMode(mode: ThemeMode) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const isDark = mode === 'dark' || (mode === 'system' && getSystemPrefersDark());

    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';

    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, mode);
    }
}

function readStoredThemeMode(): ThemeMode {
    if (typeof window === 'undefined') return 'system';

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function useThemeMode() {
    const [mode, setMode] = useState<ThemeMode>(() => readStoredThemeMode());

    useEffect(() => {
        applyThemeMode(mode);

        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (mode === 'system') {
                applyThemeMode('system');
            }
        };

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, [mode]);

    return { mode, setMode };
}