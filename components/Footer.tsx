import React from 'react';
import { TKCP_CONFIG } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 dark:bg-black text-white mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 text-center text-gray-400">
                <h4 className="font-display text-xl font-bold text-white">{TKCP_CONFIG.companyName}</h4>
                <p className="mt-2">Illuminating spaces for God's glory</p>
                <blockquote className="mt-4 italic text-sm text-gray-500 max-w-lg mx-auto">
                    'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.' — Matthew 5:16
                </blockquote>
                <p className="mt-6 text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} {TKCP_CONFIG.companyName} | <a href={TKCP_CONFIG.phoneLink} className="hover:text-church-accent transition-colors">{TKCP_CONFIG.phone}</a>
                </p>
            </div>
        </footer>
    );
};

export default React.memo(Footer);