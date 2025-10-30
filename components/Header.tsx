import React, { useState, useEffect } from 'react';
import { TKCP_CONFIG } from '../constants';
import { Theme } from '../types';
import { IconSun, IconMoon } from './common/Icon';

interface HeaderProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true) }, []);

    if (!isMounted) return <div className="w-10 h-10" />;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-church-primary"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <IconMoon className="w-6 h-6" /> : <IconSun className="w-6 h-6" />}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href={TKCP_CONFIG.website} target="_blank" rel="noopener noreferrer" className="text-2xl md:text-3xl font-display font-bold text-church-primary dark:text-gray-100">
                    {TKCP_CONFIG.companyName}
                </a>
                <div className="flex items-center gap-4">
                    <a href={TKCP_CONFIG.phoneLink} className="hidden sm:inline-block text-sm font-bold text-church-primary dark:text-gray-300 hover:text-church-accent dark:hover:text-church-accent transition-colors">
                        {TKCP_CONFIG.phone}
                    </a>
                    <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
                </div>
            </div>
        </header>
    );
};

export default Header;